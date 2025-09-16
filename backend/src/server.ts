import express from 'express'
import cors from 'cors'
import multer from 'multer'
import axios from 'axios'
import path from 'path'

const app = express()
const PORT = process.env.PORT || 3001
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434'
const MODEL = process.env.MODEL || 'deepseek-coder'

// Middleware
app.use(cors())
app.use(express.json())

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.txt', '.md', '.pdf', '.zip']
    const fileExtension = path.extname(file.originalname).toLowerCase()
    
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only .txt, .md, .pdf, and .zip files are allowed.'))
    }
  }
})

// Create uploads directory if it doesn't exist
import fs from 'fs'
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads')
}

// Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body
    
    const response = await axios.post(`${OLLAMA_HOST}/api/chat`, {
      model: MODEL,
      messages,
      stream: false
    })
    
    res.json(response.data)
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: 'Failed to get response from Ollama' })
  }
})

app.post('/api/chat/stream', async (req, res) => {
  try {
    const { messages } = req.body
    
    // Set headers for Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    })
    
    const response = await axios.post(`${OLLAMA_HOST}/api/chat`, {
      model: MODEL,
      messages,
      stream: true
    }, {
      responseType: 'stream'
    })
    
    response.data.on('data', (chunk: Buffer) => {
      const lines = chunk.toString().split('\n').filter(line => line.trim())
      
      for (const line of lines) {
        try {
          const data = JSON.parse(line)
          if (data.message && data.message.content) {
            res.write(`data: ${JSON.stringify({ content: data.message.content })}\n\n`)
          }
          
          if (data.done) {
            res.write('data: [DONE]\n\n')
            res.end()
            return
          }
        } catch (e) {
          // Ignore parsing errors for partial chunks
        }
      }
    })
    
    response.data.on('end', () => {
      res.write('data: [DONE]\n\n')
      res.end()
    })
    
    response.data.on('error', (error: any) => {
      console.error('Stream error:', error)
      res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`)
      res.end()
    })
    
  } catch (error) {
    console.error('Stream chat error:', error)
    res.write(`data: ${JSON.stringify({ error: 'Failed to connect to Ollama' })}\n\n`)
    res.end()
  }
})

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }
    
    console.log(`File uploaded: ${req.file.originalname}`)
    res.json({ filename: req.file.originalname })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'File upload failed' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', model: MODEL, ollama_host: OLLAMA_HOST })
})

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`)
  console.log(`Ollama host: ${OLLAMA_HOST}`)
  console.log(`Model: ${MODEL}`)
})