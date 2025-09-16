import React, { useState, useRef } from 'react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onFileUpload: (file: File) => void
  disabled: boolean
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onFileUpload, 
  disabled 
}) => {
  const [input, setInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || disabled) return

    onSendMessage(input)
    setInput('')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileUpload(file)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="input-form">
      <div className="input-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={disabled}
          className="message-input"
        />
        <button type="submit" disabled={disabled || !input.trim()}>
          Send
        </button>
      </div>
      
      <div className="file-upload">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept=".txt,.md,.pdf,.zip"
          className="file-input"
        />
        <label>Upload file (.txt, .md, .pdf, .zip)</label>
      </div>
    </form>
  )
}

export default ChatInput