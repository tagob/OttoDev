import passport from 'passport'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { User, GitHubUser } from '../models/User.js'

// GitHub App Configuration
const GITHUB_APP_ID = 1980174
const GITHUB_CLIENT_ID = "Iv23liIBltXpvlTZx59D"
const GITHUB_CLIENT_SECRET = "3fdecc304abe4274c73b79149a29ffc487a25bb4"
const GITHUB_PRIVATE_KEY_PATH = "./config/otto-dev-private-key.pem"

// In-memory user store (replace with database in production)
const users: Map<number, User> = new Map()

export class AuthService {
  static initialize() {
    // Configure GitHub OAuth Strategy
    passport.use(new GitHubStrategy({
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
      scope: ['user:email', 'repo']
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        const githubProfile: GitHubUser = {
          id: profile.id,
          login: profile.username,
          name: profile.displayName || profile.username,
          email: profile.emails?.[0]?.value || '',
          avatar_url: profile.photos?.[0]?.value || '',
          bio: profile._json.bio,
          company: profile._json.company,
          location: profile._json.location,
          blog: profile._json.blog,
          public_repos: profile._json.public_repos,
          followers: profile._json.followers,
          following: profile._json.following,
          created_at: profile._json.created_at,
          updated_at: profile._json.updated_at
        }

        // Check if user exists
        let user = Array.from(users.values()).find(u => u.githubId === profile.id)
        
        if (user) {
          // Update existing user
          user.accessToken = accessToken
          user.refreshToken = refreshToken
          user.profile = githubProfile
          user.updatedAt = new Date()
        } else {
          // Create new user
          user = {
            id: users.size + 1,
            githubId: profile.id,
            username: profile.username,
            name: githubProfile.name,
            email: githubProfile.email,
            avatarUrl: githubProfile.avatar_url,
            accessToken,
            refreshToken,
            profile: githubProfile,
            createdAt: new Date(),
            updatedAt: new Date()
          }
          users.set(user.id, user)
        }

        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    }))

    // Serialize user for session
    passport.serializeUser((user: any, done) => {
      done(null, user.id)
    })

    // Deserialize user from session
    passport.deserializeUser((id: number, done) => {
      const user = users.get(id)
      done(null, user || null)
    })
  }

  static getUser(id: number): User | undefined {
    return users.get(id)
  }

  static getUserByGitHubId(githubId: number): User | undefined {
    return Array.from(users.values()).find(u => u.githubId === githubId)
  }

  static getAllUsers(): User[] {
    return Array.from(users.values())
  }
}