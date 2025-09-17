import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import chatRoutes from './routes/chat.js'
import uploadRoutes from './routes/upload.js'
import healthRoutes from './routes/health.js'
import codeRoutes from './routes/code.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 4000

// Middleware
app.use(cors())
app.use(express.json())

// Create necessary directories
import fs from 'fs'
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads')
}
if (!fs.existsSync('generated')) {
  fs.mkdirSync('generated')
}

// Serve static files from dist in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')))
}

// Serve generated files
app.use('/generated', express.static('generated'))
// Serve uploaded files
app.use('/uploads', express.static('uploads'))

// API Routes
app.use('/api/chat', chatRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/health', healthRoutes)
app.use('/api/code', codeRoutes)

// Default route for development
app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  } else {
    res.json({ 
      message: 'OttoDev API Server is running!',
      frontend: 'http://localhost:5173',
      api: `http://localhost:${PORT}/api`,
      health: `http://localhost:${PORT}/api/health`,
      timestamp: new Date().toISOString()
    })
  }
})

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`API Health: http://localhost:${PORT}/api/health`)
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Frontend: http://localhost:5173`)
  }
})