import express from 'express'
import { uploadFile } from '../controllers/uploadController.js'
import { upload } from '../utils/multerConfig.js'

const router = express.Router()

router.post('/', upload.single('file'), uploadFile)

export default router