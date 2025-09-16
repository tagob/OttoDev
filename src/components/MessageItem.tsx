import React from 'react'
import { Message } from '../../models/Message'

interface MessageItemProps {
  message: Message
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <div className={`message ${message.role}`}>
      <div className="message-content">
        <strong>{message.role === 'user' ? 'You' : 'Assistant'}:</strong>
        <div className="content">{message.content}</div>
      </div>
    </div>
  )
}

export default MessageItem