class HealthService {
  async getHealth() {
    const response = await fetch('/api/health')
    if (!response.ok) {
      throw new Error('Health check failed')
    }
    return response.json()
  }

  async getModels() {
    const response = await fetch('/api/health/models')
    if (!response.ok) {
      throw new Error('Failed to fetch models')
    }
    return response.json()
  }

  async setModel(model: string) {
    const response = await fetch('/api/health/model', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model }),
    })

    if (!response.ok) {
      throw new Error('Failed to set model')
    }

    return response.json()
  }

  async getCurrentModel() {
    const response = await fetch('/api/health/model')
    if (!response.ok) {
      throw new Error('Failed to get current model')
    }
    return response.json()
  }
}

export const healthService = new HealthService()