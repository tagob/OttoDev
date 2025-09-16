import { Request, Response } from 'express'
import { OllamaService } from '../services/ollamaService.js'

const ollamaService = new OllamaService()

export const regularChat = async (req: Request, res: Response) => {
  try {
    const { messages } = req.body
    const response = await ollamaService.chat(messages, false)
    res.json(response)
  } catch (error) {
    console.error('Chat error:', error)
    res.status(500).json({ error: 'Failed to get response from Ollama' })
  }
}

export const streamChat = async (req: Request, res: Response) => {
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
    
    await ollamaService.streamChat(messages, res)
  } catch (error) {
    console.error('Stream chat error:', error)
    res.write(`data: ${JSON.stringify({ error: 'Failed to connect to Ollama' })}\n\n`)
    res.end()
  }
}