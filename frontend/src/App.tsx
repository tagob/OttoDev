import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import './App.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: input }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      // Add assistant message placeholder
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!response.body) {
        throw new Error('No response body')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              setIsLoading(false)
              return
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                setMessages(prev => {
                  const updated = [...prev]
                  const lastMessage = updated[updated.length - 1]
                  if (lastMessage.role === 'assistant') {
                    lastMessage.content += parsed.content
                  }
                  return updated
                })
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setUploadedFile(response.data.filename)
      
      // Add system message about uploaded file
      const uploadMessage: Message = {
        role: 'assistant',
        content: `Uploaded file: ${response.data.filename}`
      }
      setMessages(prev => [...prev, uploadMessage])
    } catch (error) {
      console.error('Upload error:', error)
      alert('File upload failed')
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Ollama Chatbot</h1>
        <p>Chat with DeepSeek Coder</p>
      </header>

      <div className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-content">
                <strong>{message.role === 'user' ? 'You' : 'Assistant'}:</strong>
                <div className="content">{message.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <div className="message-content">
                <strong>Assistant:</strong>
                <div className="loading-spinner">Thinking...</div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="message-input"
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              Send
            </button>
          </div>
          
          <div className="file-upload">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              accept=".txt,.md,.pdf,.zip"
              className="file-input"
            />
            <label>Upload file (.txt, .md, .pdf, .zip)</label>
          </div>
        </form>
      </div>
    </div>
  )
}

export default App