import express from 'express'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import { AuthService } from './services/authService.js'
import chatRoutes from './routes/chat.js'
import uploadRoutes from './routes/upload.js'
import healthRoutes from './routes/health.js'
import codeRoutes from './routes/code.js'
import authRoutes from './routes/auth.js'
import repositoryRoutes from './routes/repository.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 4000

// GitHub App Configuration
const GITHUB_APP_ID = 1980174
const GITHUB_CLIENT_ID = "Iv23liIBltXpvlTZx59D"
const GITHUB_CLIENT_SECRET = "3fdecc304abe4274c73b79149a29ffc487a25bb4"
const GITHUB_PRIVATE_KEY_PATH = "./config/otto-dev-private-key.pem"

// Middleware
app.use(cors())
app.use(cookieParser())
app.use(express.json())

// Session configuration
app.use(session({
  secret: 'ottodev-session-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))

// Initialize Passport
app.use(passport.initialize())
app.use(passport.session())

// Initialize Auth Service
AuthService.initialize()

// Create necessary directories
import fs from 'fs'
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads')
}
if (!fs.existsSync('generated')) {
  fs.mkdirSync('generated')
}
if (!fs.existsSync('projects')) {
  fs.mkdirSync('projects')
}

// Serve static files from dist in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')))
}

// Serve generated files
app.use('/generated', express.static('generated'))
// Serve uploaded files
app.use('/uploads', express.static('uploads'))
// Serve project files
app.use('/projects', express.static('projects'))

// API Routes
app.use('/api/chat', chatRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/health', healthRoutes)
app.use('/api/code', codeRoutes)
app.use('/auth', authRoutes)
app.use('/api/repositories', repositoryRoutes)

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
      auth: `http://localhost:${PORT}/auth`,
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
  console.log(`GitHub OAuth: http://localhost:${PORT}/auth/github/login`)
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Frontend: http://localhost:5173`)
  }
})