import { Request, Response } from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { AuthService } from '../services/authService.js'

const JWT_SECRET = 'ottodev-jwt-secret-key-2024'

export const githubLogin = passport.authenticate('github', { 
  scope: ['user:email', 'repo'] 
})

export const githubCallback = (req: Request, res: Response, next: any) => {
  passport.authenticate('github', { failureRedirect: '/login' }, (err: any, user: any) => {
    if (err) {
      console.error('GitHub auth error:', err)
      return res.redirect('/login?error=auth_failed')
    }
    
    if (!user) {
      return res.redirect('/login?error=no_user')
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error('Login error:', err)
        return res.redirect('/login?error=login_failed')
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id, 
          githubId: user.githubId,
          username: user.username 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      // Set token as cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })

      // Redirect to main app
      res.redirect('http://localhost:5173')
    })
  })(req, res, next)
}

export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err)
    }
    res.clearCookie('auth_token')
    res.redirect('/login')
  })
}

export const getProfile = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' })
  }

  const user = req.user as any
  res.json({
    id: user.id,
    githubId: user.githubId,
    username: user.username,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    profile: user.profile
  })
}

export const checkAuth = (req: Request, res: Response) => {
  res.json({ 
    authenticated: !!req.user,
    user: req.user ? {
      id: (req.user as any).id,
      username: (req.user as any).username,
      name: (req.user as any).name,
      avatarUrl: (req.user as any).avatarUrl
    } : null
  })
}