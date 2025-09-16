import React from 'react'
import MessageItem from './MessageItem'
import { Message } from '../../models/Message'

interface MessageListProps {
  messages: Message[]
  isLoading: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isLoading, 
  messagesEndRef 
}) => {
  return (
    <div className="messages">
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
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
  )
}

export default MessageList