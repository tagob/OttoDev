class RepositoryService {
  async getUserRepositories() {
    const response = await fetch('/api/repositories', {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch repositories')
    }

    return response.json()
  }

  async getRepository(owner: string, repo: string) {
    const response = await fetch(`/api/repositories/${owner}/${repo}`, {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch repository')
    }

    return response.json()
  }

  async importRepository(owner: string, repo: string, branch: string = 'main') {
    const response = await fetch('/api/repositories/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ owner, repo, branch }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to import repository')
    }

    return response.json()
  }

  async getImportedProjects() {
    const response = await fetch('/api/repositories/imported', {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch imported projects')
    }

    return response.json()
  }
}

export const repositoryService = new RepositoryService()