import { Octokit } from '@octokit/rest'
import { Repository } from '../models/User.js'

export class GitHubService {
  private octokit: Octokit

  constructor(accessToken: string) {
    this.octokit = new Octokit({
      auth: accessToken
    })
  }

  async getUserRepositories(username?: string): Promise<Repository[]> {
    try {
      const response = await this.octokit.rest.repos.listForAuthenticatedUser({
        sort: 'updated',
        per_page: 100
      })

      return response.data.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        private: repo.private,
        html_url: repo.html_url,
        clone_url: repo.clone_url,
        ssh_url: repo.ssh_url,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        size: repo.size,
        default_branch: repo.default_branch,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
        owner: {
          login: repo.owner.login,
          avatar_url: repo.owner.avatar_url
        }
      }))
    } catch (error) {
      console.error('Error fetching repositories:', error)
      throw new Error('Failed to fetch repositories')
    }
  }

  async getRepository(owner: string, repo: string): Promise<Repository> {
    try {
      const response = await this.octokit.rest.repos.get({
        owner,
        repo
      })

      const repoData = response.data
      return {
        id: repoData.id,
        name: repoData.name,
        full_name: repoData.full_name,
        description: repoData.description,
        private: repoData.private,
        html_url: repoData.html_url,
        clone_url: repoData.clone_url,
        ssh_url: repoData.ssh_url,
        language: repoData.language,
        stargazers_count: repoData.stargazers_count,
        forks_count: repoData.forks_count,
        size: repoData.size,
        default_branch: repoData.default_branch,
        created_at: repoData.created_at,
        updated_at: repoData.updated_at,
        pushed_at: repoData.pushed_at,
        owner: {
          login: repoData.owner.login,
          avatar_url: repoData.owner.avatar_url
        }
      }
    } catch (error) {
      console.error('Error fetching repository:', error)
      throw new Error('Failed to fetch repository')
    }
  }

  async getRepositoryContents(owner: string, repo: string, path: string = ''): Promise<any[]> {
    try {
      const response = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path
      })

      return Array.isArray(response.data) ? response.data : [response.data]
    } catch (error) {
      console.error('Error fetching repository contents:', error)
      throw new Error('Failed to fetch repository contents')
    }
  }

  async downloadRepository(owner: string, repo: string, ref: string = 'main'): Promise<Buffer> {
    try {
      const response = await this.octokit.rest.repos.downloadZipballArchive({
        owner,
        repo,
        ref
      })

      return Buffer.from(response.data as ArrayBuffer)
    } catch (error) {
      console.error('Error downloading repository:', error)
      throw new Error('Failed to download repository')
    }
  }
}