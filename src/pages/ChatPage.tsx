import React, { useState, useRef, useEffect } from 'react'
import ChatHeader from '../components/ChatHeader'
import MessageList from '../components/MessageList'
import ChatInput from '../components/ChatInput'
import CodeGenerator from '../components/CodeGenerator'
import { useChat } from '../hooks/useChat'
import { useFileUpload } from '../hooks/useFileUpload'

const ChatPage: React.FC = () => {
  const { messages, isLoading, sendMessage } = useChat()
  const { uploadFile, uploadedFile } = useFileUpload()
  const [activeTab, setActiveTab] = useState<'chat' | 'code'>('chat')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (content: string) => {
    sendMessage(content)
  }

  const handleFileUpload = async (file: File) => {
    const result = await uploadFile(file)
    if (result) {
      // Add system message about uploaded file
      sendMessage(`File uploaded: ${result.filename}`, 'system')
    }
  }

  const handleCodeGenerated = (code: string, language: string) => {
    // Add generated code to chat
    sendMessage(`Generated ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``, 'system')
  }
  return (
    <div className="chat-page">
      <ChatHeader />
      
      <div className="tab-navigation">
        <button 
          className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button 
          className={`tab ${activeTab === 'code' ? 'active' : ''}`}
          onClick={() => setActiveTab('code')}
        >
          Code Generator
        </button>
      </div>

      <div className="chat-container">
        {activeTab === 'chat' ? (
          <>
            <MessageList 
              messages={messages} 
              isLoading={isLoading}
              messagesEndRef={messagesEndRef}
            />
            <ChatInput 
              onSendMessage={handleSendMessage}
              onFileUpload={handleFileUpload}
              disabled={isLoading}
            />
          </>
        ) : (
          <CodeGenerator onCodeGenerated={handleCodeGenerated} />
        )}
      </div>
    </div>
  )
}

export default ChatPage