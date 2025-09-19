import React, { useState } from 'react'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import WelcomeScreen from './components/WelcomeScreen'
import MainWorkspace from './components/MainWorkspace'
import LoginPage from './components/LoginPage'
import { authService } from './services/authService'

function App() {
  const [hasStarted, setHasStarted] = useState(false)
  const [initialMessage, setInitialMessage] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      const authStatus = await authService.checkAuth()
      setIsAuthenticated(authStatus.authenticated)
      setUser(authStatus.user)
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
    }
  }

  const handleStart = (message: string) => {
    setInitialMessage(message)
    setHasStarted(true)
  }

  const handleLogin = () => {
    checkAuthentication()
  }

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }
  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatePresence mode="wait">
        {!hasStarted ? (
          <WelcomeScreen key="welcome" onStart={handleStart} user={user} />
        ) : (
          <MainWorkspace key="workspace" initialMessage={initialMessage} user={user} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App