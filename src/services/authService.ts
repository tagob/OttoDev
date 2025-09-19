class AuthService {
  async checkAuth() {
    const response = await fetch('/auth/check', {
      credentials: 'include'
    })
    
    if (response.ok) {
      return response.json()
    }
    
    return { authenticated: false, user: null }
  }

  async getProfile() {
    const response = await fetch('/auth/profile', {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to get profile')
    }

    return response.json()
  }

  async logout() {
    const response = await fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })

    if (response.ok) {
      window.location.href = '/login'
    }
  }

  loginWithGitHub() {
    window.location.href = '/auth/github/login'
  }
}

export const authService = new AuthService()