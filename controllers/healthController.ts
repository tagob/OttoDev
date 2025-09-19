import { Request, Response } from 'express'
import { OllamaService } from '../services/ollamaService.js'

const MODEL = process.env.MODEL || 'deepseek-coder'
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434'
const ollamaService = new OllamaService()

export const healthCheck = async (req: Request, res: Response) => {
  try {
    // Check if Ollama is running and get available models
    const models = await ollamaService.getModels()
    res.json({ 
      status: 'OK', 
      model: MODEL, 
      ollama_host: OLLAMA_HOST,
      ollama_connected: true,
      available_models: models,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.json({ 
      status: 'OK', 
      model: MODEL, 
      ollama_host: OLLAMA_HOST,
      ollama_connected: false,
      available_models: [],
      error: 'Ollama not connected',
      timestamp: new Date().toISOString()
    })
  }
}