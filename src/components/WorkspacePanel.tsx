import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Monitor, Code, Eye, Play, Download, Copy, Check } from 'lucide-react'

interface WorkspacePanelProps {
  generatedCode: { code: string; language: string } | null
}

const WorkspacePanel: React.FC<WorkspacePanelProps> = ({ generatedCode }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (generatedCode?.code) {
      await navigator.clipboard.writeText(generatedCode.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (generatedCode) {
      const element = document.createElement('a')
      const file = new Blob([generatedCode.code], { type: 'text/plain' })
      element.href = URL.createObjectURL(file)
      element.download = `generated.${getFileExtension(generatedCode.language)}`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  const getFileExtension = (language: string): string => {
    const extensions: { [key: string]: string } = {
      'javascript': 'js',
      'typescript': 'ts',
      'html': 'html',
      'css': 'css',
      'python': 'py',
      'java': 'java',
      'cpp': 'cpp',
      'go': 'go',
      'rust': 'rs',
    }
    return extensions[language.toLowerCase()] || 'txt'
  }

  const renderPreview = () => {
    if (!generatedCode) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-white/60">
            <Monitor className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Preview Available</h3>
            <p className="text-sm">Generate some code to see a preview here</p>
          </div>
        </div>
      )
    }

    if (['html', 'css', 'javascript'].includes(generatedCode.language)) {
      let htmlContent = ''
      
      if (generatedCode.language === 'html') {
        htmlContent = generatedCode.code
      } else if (generatedCode.language === 'css') {
        htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>${generatedCode.code}</style>
</head>
<body>
  <div style="padding: 20px;">
    <h1>CSS Preview</h1>
    <p>Your CSS styles are applied to this page.</p>
    <div class="demo-content">
      <button>Sample Button</button>
      <div class="card">Sample Card</div>
    </div>
  </div>
</body>
</html>`
      } else if (generatedCode.language === 'javascript') {
        htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>JavaScript Preview</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5; }
    #output { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
  </style>
</head>
<body>
  <h1>JavaScript Preview</h1>
  <div id="output"></div>
  <script>${generatedCode.code}</script>
</body>
</html>`
      }

      return (
        <iframe
          srcDoc={htmlContent}
          className="w-full h-full border-0 bg-white rounded-lg"
          title="Code Preview"
        />
      )
    }

    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-white/60">
          <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Preview Not Available</h3>
          <p className="text-sm">Preview is only available for HTML, CSS, and JavaScript</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col glass-dark">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Workspace</h2>
              <p className="text-white/60 text-sm">Build and preview your projects</p>
            </div>
          </div>
          
          {generatedCode && (
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </motion.button>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
              activeTab === 'preview'
                ? 'bg-white/20 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
              activeTab === 'code'
                ? 'bg-white/20 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Code</span>
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'preview' ? (
          <div className="h-full p-6">
            {renderPreview()}
          </div>
        ) : (
          <div className="h-full p-6">
            {generatedCode ? (
              <div className="h-full">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-white/80 text-sm font-medium">
                    {generatedCode.language.toUpperCase()} Code
                  </span>
                </div>
                <div className="h-full bg-black/50 rounded-lg overflow-hidden">
                  <pre className="h-full overflow-auto p-4 text-sm">
                    <code className="text-gray-300 font-mono leading-relaxed">
                      {generatedCode.code}
                    </code>
                  </pre>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-white/60">
                  <Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Code Generated</h3>
                  <p className="text-sm">Use the chat or code generator to create some code</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default WorkspacePanel