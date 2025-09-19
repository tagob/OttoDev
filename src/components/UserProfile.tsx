import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Github, MapPin, Building, Link as LinkIcon, Calendar, Star, GitFork, Download, ExternalLink, Folder, Clock } from 'lucide-react'
import { authService } from '../services/authService'
import { repositoryService } from '../services/repositoryService'

interface GitHubUser {
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

interface Repository {
  id: number
  name: string
  full_name: string
  description?: string
  private: boolean
  html_url: string
  language?: string
  stargazers_count: number
  forks_count: number
  size: number
  updated_at: string
}

interface ImportedProject {
  name: string
  path: string
  createdAt: string
  updatedAt: string
  packageInfo?: {
    name: string
    version: string
    description: string
  }
}

interface UserProfileProps {
  onClose: () => void
}

const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const [user, setUser] = useState<any>(null)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [importedProjects, setImportedProjects] = useState<ImportedProject[]>([])
  const [activeTab, setActiveTab] = useState<'repos' | 'imported'>('repos')
  const [isLoading, setIsLoading] = useState(true)
  const [isImporting, setIsImporting] = useState<string | null>(null)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setIsLoading(true)
      const [userResponse, reposResponse, projectsResponse] = await Promise.all([
        authService.getProfile(),
        repositoryService.getUserRepositories(),
        repositoryService.getImportedProjects()
      ])
      
      setUser(userResponse)
      setRepositories(reposResponse.repositories)
      setImportedProjects(projectsResponse.projects)
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportRepository = async (repo: Repository) => {
    try {
      setIsImporting(repo.full_name)
      const [owner, repoName] = repo.full_name.split('/')
      
      await repositoryService.importRepository(owner, repoName)
      
      // Refresh imported projects
      const projectsResponse = await repositoryService.getImportedProjects()
      setImportedProjects(projectsResponse.projects)
      
      // Switch to imported tab to show the new project
      setActiveTab('imported')
    } catch (error) {
      console.error('Error importing repository:', error)
      alert('Failed to import repository. Please try again.')
    } finally {
      setIsImporting(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div className="glass rounded-2xl p-8">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
            />
            <span className="text-white">Loading profile...</span>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start space-x-4">
            <img
              src={user?.avatarUrl}
              alt={user?.name}
              className="w-20 h-20 rounded-full border-2 border-white/20"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                <a
                  href={`https://github.com/${user?.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Github className="w-4 h-4 text-white" />
                </a>
              </div>
              <p className="text-white/80 mb-2">@{user?.username}</p>
              {user?.profile?.bio && (
                <p className="text-white/70 mb-3">{user.profile.bio}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-white/60">
                {user?.profile?.company && (
                  <div className="flex items-center space-x-1">
                    <Building className="w-4 h-4" />
                    <span>{user.profile.company}</span>
                  </div>
                )}
                {user?.profile?.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.profile.location}</span>
                  </div>
                )}
                {user?.profile?.blog && (
                  <div className="flex items-center space-x-1">
                    <LinkIcon className="w-4 h-4" />
                    <a
                      href={user.profile.blog}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      {user.profile.blog}
                    </a>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(user?.profile?.created_at)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center space-x-6 mt-4 text-sm">
            <div className="text-white/80">
              <span className="font-semibold text-white">{user?.profile?.public_repos}</span> repositories
            </div>
            <div className="text-white/80">
              <span className="font-semibold text-white">{user?.profile?.followers}</span> followers
            </div>
            <div className="text-white/80">
              <span className="font-semibold text-white">{user?.profile?.following}</span> following
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('repos')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'repos'
                ? 'text-white border-b-2 border-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            GitHub Repositories ({repositories.length})
          </button>
          <button
            onClick={() => setActiveTab('imported')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'imported'
                ? 'text-white border-b-2 border-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Imported Projects ({importedProjects.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-96">
          <AnimatePresence mode="wait">
            {activeTab === 'repos' ? (
              <motion.div
                key="repos"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 space-y-4"
              >
                {repositories.map((repo) => (
                  <div
                    key={repo.id}
                    className="glass-dark rounded-lg p-4 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-white">{repo.name}</h3>
                          {repo.private && (
                            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-200 text-xs rounded">
                              Private
                            </span>
                          )}
                          {repo.language && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-200 text-xs rounded">
                              {repo.language}
                            </span>
                          )}
                        </div>
                        {repo.description && (
                          <p className="text-white/70 text-sm mb-3">{repo.description}</p>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-white/60">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3" />
                            <span>{repo.stargazers_count}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <GitFork className="w-3 h-3" />
                            <span>{repo.forks_count}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Updated {formatDate(repo.updated_at)}</span>
                          </div>
                          <span>{formatFileSize(repo.size * 1024)}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <motion.button
                          onClick={() => handleImportRepository(repo)}
                          disabled={isImporting === repo.full_name}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-all flex items-center space-x-2"
                        >
                          {isImporting === repo.full_name ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                              />
                              <span>Importing...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              <span>Import</span>
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ))}
                {repositories.length === 0 && (
                  <div className="text-center py-12 text-white/60">
                    <Github className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No repositories found</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="imported"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 space-y-4"
              >
                {importedProjects.map((project) => (
                  <div
                    key={project.name}
                    className="glass-dark rounded-lg p-4 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Folder className="w-5 h-5 text-blue-400" />
                          <h3 className="font-semibold text-white">{project.name}</h3>
                        </div>
                        {project.packageInfo && (
                          <div className="mb-3">
                            <p className="text-white/70 text-sm mb-1">{project.packageInfo.description}</p>
                            <span className="px-2 py-1 bg-green-500/20 text-green-200 text-xs rounded">
                              v{project.packageInfo.version}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-white/60">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>Imported {formatDate(project.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Updated {formatDate(project.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-all"
                        >
                          Open Project
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ))}
                {importedProjects.length === 0 && (
                  <div className="text-center py-12 text-white/60">
                    <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No imported projects</p>
                    <p className="text-sm mt-2">Import repositories from the GitHub tab to get started</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default UserProfile