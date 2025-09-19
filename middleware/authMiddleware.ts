import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AuthService } from '../services/authService.js'

const JWT_SECRET = 'ottodev-jwt-secret-key-2024'

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.auth_token

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    const user = AuthService.getUser(decoded.userId)
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' })
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' })
  }
  next()
}