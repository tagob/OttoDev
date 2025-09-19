import express from 'express'
import { getUserRepositories, getRepository, importRepository, getImportedProjects } from '../controllers/repositoryController.js'
import { authenticateToken, requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

// All repository routes require authentication
router.use(authenticateToken)
router.use(requireAuth)

// Repository management
router.get('/', getUserRepositories)
router.get('/imported', getImportedProjects)
router.get('/:owner/:repo', getRepository)
router.post('/import', importRepository)

export default router