import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Code, MessageSquare, Sparkles, ArrowRight, Bot, User, LogOut, Github } from 'lucide-react'
import { authService } from '../services/authService'

interface WelcomeScreenProps {
  onStart: (message: string) => void
  user?: any
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, user }) => {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onStart(input.trim())
    }
  }

  const handleLogout = () => {
    authService.logout()
  }
  const features = [
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "AI Chat",
      description: "Powered by local Ollama models"
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "Code Generation",
      description: "Generate and preview code instantly"
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Live Preview",
      description: "See your projects come to life"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      {/* User Profile Header */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-6 right-6 flex items-center space-x-3"
        >
          <div className="flex items-center space-x-2 glass rounded-lg px-3 py-2">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-white text-sm font-medium">{user.name}</span>
          </div>
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 glass rounded-lg text-white/70 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}

      <div className="max-w-2xl w-full">
        {/* Logo and Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-4 glass rounded-2xl"
            >
              <Zap className="w-12 h-12 text-white" />
            </motion.div>
          </div>
          
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-6xl font-bold text-white mb-4 tracking-tight"
          >
            OttoDev
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-white/80 mb-8"
          >
            Welcome back, {user?.name || 'Developer'}!
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="glass rounded-xl p-4 text-center"
              >
                <div className="flex justify-center mb-2 text-white/90">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-white/70">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Chat Input */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="glass rounded-2xl p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What would you like to build today?"
                className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
                autoFocus
              />
              <motion.button
                type="submit"
                disabled={!input.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </motion.button>
            </div>
            
            {/* GitHub Import Button */}
            <motion.button
              onClick={() => window.location.href = '/auth/github/login'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-all duration-200 border border-gray-700"
            >
              <Github className="w-5 h-5" />
              <span>Import Repository from GitHub</span>
            </motion.button>
            
            <div className="flex items-center justify-center space-x-4 text-sm text-white/60">
              <span>Press Enter to start</span>
              <span>•</span>
              <span>Connected to GitHub</span>
            </div>
          </form>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 right-20 w-16 h-16 bg-white/10 rounded-full blur-lg"
        />
      </div>
    </motion.div>
  )
}

export default WelcomeScreen