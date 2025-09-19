import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Check, AlertCircle, Wifi, WifiOff } from 'lucide-react'

interface ModelSelectorProps {
  onModelChange?: (model: string) => void
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ onModelChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [models, setModels] = useState<string[]>([])
  const [currentModel, setCurrentModel] = useState<string>('')
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    checkConnection()
    fetchModels()
    fetchCurrentModel()
  }, [])

  const checkConnection = async () => {
    try {
      const response = await fetch('/api/health')
      const data = await response.json()
      setIsConnected(data.ollama_connected)
    } catch (error) {
      setIsConnected(false)
    }
  }

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/health/models')
      const data = await response.json()
      setModels(data.models || [])
    } catch (error) {
      console.error('Failed to fetch models:', error)
      setModels([])
    }
  }

  const fetchCurrentModel = async () => {
    try {
      const response = await fetch('/api/health/model')
      const data = await response.json()
      setCurrentModel(data.model || 'deepseek-coder')
    } catch (error) {
      setCurrentModel('deepseek-coder')
    }
  }

  const handleModelSelect = async (model: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/health/model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model }),
      })

      if (response.ok) {
        setCurrentModel(model)
        onModelChange?.(model)
        setIsOpen(false)
      }
    } catch (error) {
      console.error('Failed to set model:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshConnection = async () => {
    setIsLoading(true)
    await checkConnection()
    await fetchModels()
    await fetchCurrentModel()
    setIsLoading(false)
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition-all duration-200"
      >
        {isConnected ? (
          <Wifi className="w-4 h-4 text-green-400" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-400" />
        )}
        <Settings className="w-4 h-4" />
        <span className="hidden sm:inline">
          {currentModel || 'No Model'}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-80 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl z-50"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Ollama Models</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={refreshConnection}
                  disabled={isLoading}
                  className="p-1 text-white/60 hover:text-white transition-colors"
                >
                  <motion.div
                    animate={isLoading ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                  >
                    <Settings className="w-4 h-4" />
                  </motion.div>
                </motion.button>
              </div>

              <div className="flex items-center space-x-2 mb-4 p-3 bg-white/5 rounded-lg">
                {isConnected ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm">Connected to Ollama</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm">Ollama not connected</span>
                  </>
                )}
              </div>

              {isConnected ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {models.length > 0 ? (
                    models.map((model) => (
                      <motion.button
                        key={model}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleModelSelect(model)}
                        disabled={isLoading}
                        className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 ${
                          currentModel === model
                            ? 'bg-white/20 text-white'
                            : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="font-mono text-sm">{model}</span>
                        {currentModel === model && (
                          <Check className="w-4 h-4 text-green-400" />
                        )}
                      </motion.button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-white/60">
                      <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No models found</p>
                      <p className="text-xs mt-1">
                        Install models with: <code className="bg-white/10 px-1 rounded">ollama pull model-name</code>
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-white/60">
                  <WifiOff className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm mb-2">Ollama not running</p>
                  <p className="text-xs">
                    Start Ollama with: <code className="bg-white/10 px-1 rounded">ollama serve</code>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ModelSelector