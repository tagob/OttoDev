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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const allowedTypes = ['.txt', '.md', '.pdf', '.zip']
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      
      if (allowedTypes.includes(fileExtension)) {
        setSelectedFile(file)
      } else {
        alert('Please select a .txt, .md, .pdf, or .zip file')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    }
  }

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Uploaded file: ${response.data.filename}`
      }])
    } catch (error) {
      console.error('File upload error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Error uploading file'
      }])
    }
  }

  const sendMessage = async () => {
    if (!input.trim() && !selectedFile) return

    setIsLoading(true)
    
    // Handle file upload first
    if (selectedFile) {
      await uploadFile(selectedFile)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }

    // Handle text message
    if (input.trim()) {
      const userMessage: Message = { role: 'user', content: input }
      setMessages(prev => [...prev, userMessage])
      setInput('')

      try {
        // Use Server-Sent Events for streaming
        const response = await fetch('/api/chat/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: [...messages, userMessage]
          })
        })

        if (!response.body) {
          throw new Error('No response body')
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        
        // Add assistant message placeholder
        setMessages(prev => [...prev, { role: 'assistant', content: '' }])
        
        let assistantContent = ''
        
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                break
              }
              
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) {
                  assistantContent += parsed.content
                  setMessages(prev => {
                    const newMessages = [...prev]
                    newMessages[newMessages.length - 1].content = assistantContent
                    return newMessages
                  })
                }
              } catch (e) {
                // Ignore parsing errors for partial chunks
              }
            }
          }
        }
      } catch (error) {
        console.error('Chat error:', error)
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Error: Could not connect to the chat service'
        }])
      }
    }

    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
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

        <div className="input-area">
          <div className="file-upload">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.pdf,.zip"
              onChange={handleFileSelect}
              className="file-input"
            />
            {selectedFile && (
              <span className="selected-file">Selected: {selectedFile.name}</span>
            )}
          </div>
          
          <div className="message-input">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              rows={3}
            />
            <button 
              onClick={sendMessage} 
              disabled={isLoading || (!input.trim() && !selectedFile)}
              className="send-button"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App