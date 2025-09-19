import axios from 'axios'
import { Response } from 'express'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface OllamaModel {
  name: string
  model: string
  size: number
  digest: string
  details: {
    format: string
    family: string
    families: string[]
    parameter_size: string
    quantization_level: string
  }
  modified_at: string
}

export class OllamaService {
  private readonly host: string
  private model: string

  constructor() {
    this.host = process.env.OLLAMA_HOST || 'http://localhost:11434'
    this.model = process.env.MODEL || 'deepseek-coder'
  }

  setModel(model: string) {
    this.model = model
  }

  getModel() {
    return this.model
  }

  async getModels(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.host}/api/tags`, {
        timeout: 5000
      })
      
      if (response.data && response.data.models) {
        return response.data.models.map((model: OllamaModel) => model.name)
      }
      return []
    } catch (error) {
      console.error('Failed to fetch Ollama models:', error)
      throw new Error('Failed to connect to Ollama')
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      await axios.get(`${this.host}/api/tags`, {
        timeout: 3000
      })
      return true
    } catch (error) {
      return false
    }
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