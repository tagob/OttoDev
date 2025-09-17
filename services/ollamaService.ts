import axios from 'axios'
import { Response } from 'express'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export class OllamaService {
  private readonly host: string
  private readonly model: string

  constructor() {
    this.host = process.env.OLLAMA_HOST || 'http://localhost:11434'
    this.model = process.env.MODEL || 'deepseek-coder'
  }

  async chat(messages: Message[], stream: boolean = false) {
    try {
      const response = await axios.post(`${this.host}/api/chat`, {
        model: this.model,
        messages,
        stream
      }, {
        timeout: 30000 // 30 second timeout
      })
      
      return response.data
    } catch (error) {
      console.error('Ollama chat error:', error)
      throw new Error('Failed to connect to Ollama. Make sure Ollama is running and the model is available.')
    }
  }

  async streamChat(messages: Message[], res: Response) {
    try {
      const response = await axios.post(`${this.host}/api/chat`, {
        model: this.model,
        messages,
        stream: true
      }, {
        responseType: 'stream',
        timeout: 60000 // 60 second timeout for streaming
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
      console.error('Ollama stream error:', error)
      res.write(`data: ${JSON.stringify({ error: 'Failed to connect to Ollama. Make sure Ollama is running.' })}\n\n`)
      res.end()
    }
  }
}