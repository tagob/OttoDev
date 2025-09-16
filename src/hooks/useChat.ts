import { useState } from 'react'
import { chatService } from '../services/chatService'
import { Message } from '../../models/Message'

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (content: string, role: 'user' | 'system' = 'user') => {
    if (role === 'system') {
      const systemMessage: Message = { role: 'assistant', content }
      setMessages(prev => [...prev, systemMessage])
      return
    }

    const userMessage: Message = { role: 'user', content }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      // Add assistant message placeholder
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      await chatService.streamChat(newMessages, (chunk) => {
        setMessages(prev => {
          const updated = [...prev]
          const lastMessage = updated[updated.length - 1]
          if (lastMessage.role === 'assistant') {
            lastMessage.content += chunk
          }
          return updated
        })
      })
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Sorry, there was an error connecting to the chat service.'
        }
        return updated
      })
    } finally {
      setIsLoading(false)
    }
  }

  return { messages, isLoading, sendMessage }
}