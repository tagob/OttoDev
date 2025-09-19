import express from 'express'
import { githubLogin, githubCallback, logout, getProfile, checkAuth } from '../controllers/authController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router()

// GitHub OAuth routes
router.get('/github/login', githubLogin)
router.get('/github/callback', githubCallback)

// Auth management
router.post('/logout', logout)
router.get('/profile', authenticateToken, getProfile)
router.get('/check', authenticateToken, checkAuth)

export default router