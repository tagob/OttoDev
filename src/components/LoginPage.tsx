import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Zap, Code, Users, GitBranch, Star } from 'lucide-react'

interface LoginPageProps {
  onLogin: () => void
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check for error in URL params
    const urlParams = new URLSearchParams(window.location.search)
    const errorParam = urlParams.get('error')
    
    if (errorParam) {
      switch (errorParam) {
        case 'auth_failed':
          setError('GitHub authentication failed. Please try again.')
          break
        case 'no_user':
          setError('No user information received from GitHub.')
          break
        case 'login_failed':
          setError('Login failed. Please try again.')
          break
        default:
          setError('An error occurred during login.')
      }
      
      // Clear error from URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleGitHubLogin = () => {
    setIsLoading(true)
    setError(null)
    window.location.href = '/auth/github/login'
  }

  const features = [
    {
      icon: <Code className="w-6 h-6" />,
      title: "AI-Powered Development",
      description: "Generate code with local Ollama models"
    },
    {
      icon: <GitBranch className="w-6 h-6" />,
      title: "Repository Import",
      description: "Import and work with your GitHub repositories"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Collaborative Workflows",
      description: "Built for modern development teams"
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="flex items-center justify-center lg:justify-start mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="p-4 glass rounded-2xl mr-4"
              >
                <Zap className="w-12 h-12 text-white" />
              </motion.div>
              <div>
                <h1 className="text-5xl font-bold text-white mb-2">OttoDev</h1>
                <p className="text-white/80 text-lg">Your Local Development Assistant</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="p-2 bg-white/10 rounded-lg text-white/90">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                    <p className="text-white/70 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-6 text-white/60">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span className="text-sm">Open Source</span>
              </div>
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4" />
                <span className="text-sm">Local First</span>
              </div>
              <div className="flex items-center space-x-2">
                <Github className="w-4 h-4" />
                <span className="text-sm">GitHub Integration</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass rounded-2xl p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-white/70">Sign in with your GitHub account to continue</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
              >
                <p className="text-red-200 text-sm">{error}</p>
              </motion.div>
            )}

            <motion.button
              onClick={handleGitHubLogin}
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200 border border-gray-700"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>Connecting to GitHub...</span>
                </>
              ) : (
                <>
                  <Github className="w-5 h-5" />
                  <span>Continue with GitHub</span>
                </>
              )}
            </motion.button>

            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                By signing in, you agree to our terms of service and privacy policy.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-white/60 text-sm mb-4">Why GitHub OAuth?</p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="text-white/70">
                    <GitBranch className="w-4 h-4 mx-auto mb-1" />
                    <span>Repository Access</span>
                  </div>
                  <div className="text-white/70">
                    <Users className="w-4 h-4 mx-auto mb-1" />
                    <span>Team Collaboration</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

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
    </div>
  )
}

export default LoginPage