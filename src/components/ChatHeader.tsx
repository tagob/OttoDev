import React from 'react'
import { Code, MessageSquare, Zap } from 'lucide-react'

const ChatHeader: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Zap className="logo-icon" />
          <h1>OttoDev</h1>
        </div>
        <p>Your Local Development Assistant</p>
        <div className="features">
          <div className="feature">
            <MessageSquare size={16} />
            <span>AI Chat</span>
          </div>
          <div className="feature">
            <Code size={16} />
            <span>Code Generation</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default ChatHeader