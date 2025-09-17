import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import WelcomeScreen from './components/WelcomeScreen'
import MainWorkspace from './components/MainWorkspace'

function App() {
  const [hasStarted, setHasStarted] = useState(false)
  const [initialMessage, setInitialMessage] = useState('')

  const handleStart = (message: string) => {
    setInitialMessage(message)
    setHasStarted(true)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <WelcomeScreen key="welcome" onStart={handleStart} />
        ) : (
          <MainWorkspace key="workspace" initialMessage={initialMessage} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App