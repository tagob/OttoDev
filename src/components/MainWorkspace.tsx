import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import ChatPanel from './ChatPanel'
import WorkspacePanel from './WorkspacePanel'
import { useChat } from '../hooks/useChat'
import { useFileUpload } from '../hooks/useFileUpload'

const MainWorkspace: React.FC = () => {
  const { messages, isLoading, sendMessage } = useChat()
  const { uploadFile } = useFileUpload()
  const [generatedCode, setGeneratedCode] = useState<{code: string, language: string} | null>(null)

  const handleSendMessage = (content: string) => {
    sendMessage(content)
  }

  const handleFileUpload = async (file: File) => {
    const result = await uploadFile(file)
    if (result) {
      sendMessage(`File uploaded: ${result.filename}`, 'system')
    }
  }

  const handleCodeGenerated = (code: string, language: string) => {
    setGeneratedCode({ code, language })
    sendMessage(`Generated ${language} code`, 'system')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex overflow-hidden"
    >
      {/* Chat Panel - Left Side */}
      <motion.div
        initial={{ x: '50vw', y: '-50vh', scale: 0.8 }}
        animate={{ x: 0, y: 0, scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 20,
          duration: 0.8 
        }}
        className="w-1/2 h-full border-r border-white/10"
      >
        <ChatPanel
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
          onCodeGenerated={handleCodeGenerated}
        />
      </motion.div>

      {/* Workspace Panel - Right Side */}
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ 
          delay: 0.3,
          type: "spring", 
          stiffness: 100, 
          damping: 20 
        }}
        className="w-1/2 h-full"
      >
        <WorkspacePanel generatedCode={generatedCode} />
      </motion.div>
    </motion.div>
  )
}

export default MainWorkspace