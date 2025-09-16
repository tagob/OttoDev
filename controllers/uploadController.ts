import { Request, Response } from 'express'

export const uploadFile = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }
    
    console.log(`File uploaded: ${req.file.originalname}`)
    res.json({ filename: req.file.originalname })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'File upload failed' })
  }
}