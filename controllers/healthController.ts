import { Request, Response } from 'express'

const MODEL = process.env.MODEL || 'deepseek-coder'
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434'

export const healthCheck = (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    model: MODEL, 
    ollama_host: OLLAMA_HOST,
    timestamp: new Date().toISOString()
  })
}