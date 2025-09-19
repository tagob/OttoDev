import { Request, Response } from 'express'
import { GitHubService } from '../services/githubService.js'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export const getUserRepositories = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const user = req.user as any
    const githubService = new GitHubService(user.accessToken)
    const repositories = await githubService.getUserRepositories()

    res.json({ repositories })
  } catch (error) {
    console.error('Error fetching repositories:', error)
    res.status(500).json({ error: 'Failed to fetch repositories' })
  }
}

export const getRepository = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const { owner, repo } = req.params
    const user = req.user as any
    const githubService = new GitHubService(user.accessToken)
    const repository = await githubService.getRepository(owner, repo)

    res.json({ repository })
  } catch (error) {
    console.error('Error fetching repository:', error)
    res.status(500).json({ error: 'Failed to fetch repository' })
  }
}

export const importRepository = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const { owner, repo, branch = 'main' } = req.body
    const user = req.user as any
    const githubService = new GitHubService(user.accessToken)

    // Create projects directory if it doesn't exist
    const projectsDir = path.join(process.cwd(), 'projects')
    if (!fs.existsSync(projectsDir)) {
      fs.mkdirSync(projectsDir, { recursive: true })
    }

    const projectPath = path.join(projectsDir, `${owner}-${repo}`)

    // Remove existing project if it exists
    if (fs.existsSync(projectPath)) {
      fs.rmSync(projectPath, { recursive: true, force: true })
    }

    // Clone the repository
    const cloneUrl = `https://github.com/${owner}/${repo}.git`
    await execAsync(`git clone ${cloneUrl} "${projectPath}"`)

    // Get repository info
    const repository = await githubService.getRepository(owner, repo)

    res.json({ 
      success: true,
      repository,
      projectPath: projectPath.replace(process.cwd(), ''),
      message: `Repository ${owner}/${repo} imported successfully`
    })
  } catch (error) {
    console.error('Error importing repository:', error)
    res.status(500).json({ 
      error: 'Failed to import repository',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const getImportedProjects = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' })
    }

    const projectsDir = path.join(process.cwd(), 'projects')
    
    if (!fs.existsSync(projectsDir)) {
      return res.json({ projects: [] })
    }

    const projects = fs.readdirSync(projectsDir)
      .filter(name => {
        const projectPath = path.join(projectsDir, name)
        return fs.statSync(projectPath).isDirectory()
      })
      .map(name => {
        const projectPath = path.join(projectsDir, name)
        const stats = fs.statSync(projectPath)
        
        // Try to read package.json if it exists
        let packageInfo = null
        const packageJsonPath = path.join(projectPath, 'package.json')
        if (fs.existsSync(packageJsonPath)) {
          try {
            packageInfo = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
          } catch (e) {
            // Ignore package.json parsing errors
          }
        }

        return {
          name,
          path: projectPath.replace(process.cwd(), ''),
          createdAt: stats.birthtime,
          updatedAt: stats.mtime,
          packageInfo
        }
      })
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())

    res.json({ projects })
  } catch (error) {
    console.error('Error fetching imported projects:', error)
    res.status(500).json({ error: 'Failed to fetch imported projects' })
  }
}