import { Request, Response } from 'express'
import { OllamaService } from '../services/ollamaService.js'
import fs from 'fs'
import path from 'path'

const ollamaService = new OllamaService()

// Create generated directory if it doesn't exist
if (!fs.existsSync('generated')) {
  fs.mkdirSync('generated')
}

export const generateCode = async (req: Request, res: Response) => {
  try {
    const { prompt, language = 'javascript' } = req.body
    
    const codePrompt = `Generate ${language} code for: ${prompt}. 
    Please provide clean, well-commented code. 
    Only return the code without explanations or markdown formatting.`
    
    const messages = [{ role: 'user' as const, content: codePrompt }]
    const response = await ollamaService.chat(messages, false)
    
    res.json({ 
      code: response.message.content,
      language,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Code generation error:', error)
    res.status(500).json({ error: 'Failed to generate code' })
  }
}

export const previewCode = async (req: Request, res: Response) => {
  try {
    const { code, language } = req.body
    
    // For HTML/CSS/JS, create a preview
    if (language === 'html' || language === 'css' || language === 'javascript') {
      const previewId = Date.now().toString()
      const previewPath = path.join('generated', `preview-${previewId}.html`)
      
      let htmlContent = ''
      
      if (language === 'html') {
        htmlContent = code
      } else if (language === 'css') {
        htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>${code}</style>
</head>
<body>
  <div class="preview-container">
    <h1>CSS Preview</h1>
    <p>Your CSS styles are applied to this page.</p>
  </div>
</body>
</html>`
      } else if (language === 'javascript') {
        htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>JavaScript Preview</title>
</head>
<body>
  <div id="output"></div>
  <script>${code}</script>
</body>
</html>`
      }
      
      fs.writeFileSync(previewPath, htmlContent)
      
      res.json({ 
        previewId,
        previewUrl: `/generated/preview-${previewId}.html`,
        success: true
      })
    } else {
      res.json({ 
        message: 'Preview not available for this language',
        success: false
      })
    }
  } catch (error) {
    console.error('Preview error:', error)
    res.status(500).json({ error: 'Failed to create preview' })
  }
}

export const saveCode = async (req: Request, res: Response) => {
  try {
    const { code, filename, language } = req.body
    
    const extension = getFileExtension(language)
    const fullFilename = filename.endsWith(extension) ? filename : `${filename}${extension}`
    const filePath = path.join('generated', fullFilename)
    
    fs.writeFileSync(filePath, code)
    
    res.json({ 
      filename: fullFilename,
      path: filePath,
      success: true
    })
  } catch (error) {
    console.error('Save error:', error)
    res.status(500).json({ error: 'Failed to save code' })
  }
}

function getFileExtension(language: string): string {
  const extensions: { [key: string]: string } = {
    'javascript': '.js',
    'typescript': '.ts',
    'html': '.html',
    'css': '.css',
    'python': '.py',
    'java': '.java',
    'cpp': '.cpp',
    'c': '.c',
    'go': '.go',
    'rust': '.rs',
    'php': '.php',
    'ruby': '.rb',
    'swift': '.swift',
    'kotlin': '.kt',
    'dart': '.dart',
    'sql': '.sql',
    'json': '.json',
    'yaml': '.yml',
    'xml': '.xml',
    'markdown': '.md'
  }
  
  return extensions[language.toLowerCase()] || '.txt'
}