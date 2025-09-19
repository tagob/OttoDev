import express from 'express'
import { healthCheck } from '../controllers/healthController.js'
import { OllamaService } from '../services/ollamaService.js'

const ollamaService = new OllamaService()

const router = express.Router()

router.get('/', healthCheck)

// Get available models
router.get('/models', async (req, res) => {
  try {
    const models = await ollamaService.getModels()
    res.json({ models })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch models', models: [] })
  }
})

// Set current model
router.post('/model', (req, res) => {
  const { model } = req.body
  if (!model) {
    return res.status(400).json({ error: 'Model name is required' })
  }
  
  ollamaService.setModel(model)
  res.json({ success: true, model })
})

// Get current model
router.get('/model', (req, res) => {
  res.json({ model: ollamaService.getModel() })
})

export default router