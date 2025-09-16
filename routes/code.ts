import express from 'express'
import { generateCode, previewCode, saveCode } from '../controllers/codeController.js'

const router = express.Router()

router.post('/generate', generateCode)
router.post('/preview', previewCode)
router.post('/save', saveCode)

export default router