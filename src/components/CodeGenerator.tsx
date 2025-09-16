import React, { useState } from 'react'
import { Play, Save, Eye, Copy, Check } from 'lucide-react'
import { codeService } from '../services/codeService'

interface CodeGeneratorProps {
  onCodeGenerated: (code: string, language: string) => void
}

const CodeGenerator: React.FC<CodeGeneratorProps> = ({ onCodeGenerated }) => {
  const [prompt, setPrompt] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [generatedCode, setGeneratedCode] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const languages = [
    'javascript', 'typescript', 'html', 'css', 'python', 'java', 
    'cpp', 'go', 'rust', 'php', 'ruby', 'sql', 'json'
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const result = await codeService.generateCode(prompt, language)
      setGeneratedCode(result.code)
      onCodeGenerated(result.code, language)
    } catch (error) {
      console.error('Code generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (generatedCode) {
      await navigator.clipboard.writeText(generatedCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handlePreview = async () => {
    if (generatedCode) {
      try {
        const result = await codeService.previewCode(generatedCode, language)
        if (result.success && result.previewUrl) {
          window.open(result.previewUrl, '_blank')
        }
      } catch (error) {
        console.error('Preview failed:', error)
      }
    }
  }

  const handleSave = async () => {
    if (generatedCode) {
      const filename = prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')
      try {
        await codeService.saveCode(generatedCode, filename, language)
        alert('Code saved successfully!')
      } catch (error) {
        console.error('Save failed:', error)
      }
    }
  }

  return (
    <div className="code-generator">
      <div className="generator-header">
        <h3>Code Generator</h3>
      </div>
      
      <div className="generator-form">
        <div className="form-row">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to build..."
            className="code-prompt"
          />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
          >
            {languages.map(lang => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="generate-btn"
        >
          <Play size={16} />
          {isGenerating ? 'Generating...' : 'Generate Code'}
        </button>
      </div>

      {generatedCode && (
        <div className="code-output">
          <div className="output-header">
            <span>Generated {language} code:</span>
            <div className="output-actions">
              <button onClick={handleCopy} className="action-btn">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              {['html', 'css', 'javascript'].includes(language) && (
                <button onClick={handlePreview} className="action-btn">
                  <Eye size={16} />
                  Preview
                </button>
              )}
              <button onClick={handleSave} className="action-btn">
                <Save size={16} />
                Save
              </button>
            </div>
          </div>
          <pre className="code-block">
            <code>{generatedCode}</code>
          </pre>
        </div>
      )}
    </div>
  )
}

export default CodeGenerator