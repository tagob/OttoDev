import express from 'express'
import { streamChat, regularChat } from '../controllers/chatController.js'

const router = express.Router()

router.post('/', regularChat)
router.post('/stream', streamChat)

export default router