import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Loader } from 'lucide-react'
import { codeService } from '../services/codeService'

interface CodeGeneratorProps {
  onCodeGenerated: (code: string, language: string) => void
}

const CodeGenerator: React.FC<CodeGeneratorProps> = ({ onCodeGenerated }) => {
  const [prompt, setPrompt] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [isGenerating, setIsGenerating] = useState(false)

  const languages = [
    'javascript', 'typescript', 'html', 'css', 'python', 'java', 
    'cpp', 'go', 'rust', 'php', 'ruby', 'sql', 'json'
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const result = await codeService.generateCode(prompt, language)
      onCodeGenerated(result.code, language)
      setPrompt('')
    } catch (error) {
      console.error('Code generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="h-full p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Code Generator</h3>
        <p className="text-white/60 text-sm">Describe what you want to build and I'll generate the code for you.</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            What do you want to build?
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A responsive navigation bar with dropdown menus..."
            rows={4}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200 resize-none"
          />
        </div>
        
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all duration-200"
          >
            {languages.map(lang => (
              <option key={lang} value={lang} className="bg-gray-800">
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <motion.button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-6 py-3 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isGenerating ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              <span>Generate Code</span>
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}

export default CodeGenerator