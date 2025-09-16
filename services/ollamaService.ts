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
    const response = await axios.post(`${this.host}/api/chat`, {
      model: this.model,
      messages,
      stream
    })
    
    return response.data
  }

  async streamChat(messages: Message[], res: Response) {
    const response = await axios.post(`${this.host}/api/chat`, {
      model: this.model,
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
  }
}