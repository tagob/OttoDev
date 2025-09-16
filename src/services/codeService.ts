class CodeService {
  async generateCode(prompt: string, language: string) {
    const response = await fetch('/api/code/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, language }),
    })

    if (!response.ok) {
      throw new Error('Code generation failed')
    }

    return response.json()
  }

  async previewCode(code: string, language: string) {
    const response = await fetch('/api/code/preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, language }),
    })

    if (!response.ok) {
      throw new Error('Preview failed')
    }

    return response.json()
  }

  async saveCode(code: string, filename: string, language: string) {
    const response = await fetch('/api/code/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, filename, language }),
    })

    if (!response.ok) {
      throw new Error('Save failed')
    }

    return response.json()
  }
}

export const codeService = new CodeService()