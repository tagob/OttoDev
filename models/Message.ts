export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

export interface ChatRequest {
  messages: Message[]
}

export interface ChatResponse {
  message: Message
  done: boolean
}