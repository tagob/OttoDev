import { useState } from 'react'
import { uploadService } from '../services/uploadService'

export const useFileUpload = () => {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    try {
      const result = await uploadService.uploadFile(file)
      setUploadedFile(result.filename)
      return result
    } catch (error) {
      console.error('Upload error:', error)
      alert('File upload failed')
      return null
    } finally {
      setIsUploading(false)
    }
  }

  return { uploadFile, uploadedFile, isUploading }
}