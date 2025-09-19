export interface GitHubUser {
  id: number
  login: string
  name: string
  email: string
  avatar_url: string
  bio?: string
  company?: string
  location?: string
  blog?: string
  public_repos: number
  followers: number
  following: number
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  githubId: number
  username: string
  name: string
  email: string
  avatarUrl: string
  accessToken: string
  refreshToken?: string
  profile: GitHubUser
  createdAt: Date
  updatedAt: Date
}

export interface Repository {
  id: number
  name: string
  full_name: string
  description?: string
  private: boolean
  html_url: string
  clone_url: string
  ssh_url: string
  language?: string
  stargazers_count: number
  forks_count: number
  size: number
  default_branch: string
  created_at: string
  updated_at: string
  pushed_at: string
  owner: {
    login: string
    avatar_url: string
  }
}