'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'

interface DragDropUploadProps {
  onUploadSuccess: (imageUrl: string, fileData: { [key: string]: string }) => void
}

export default function DragDropUpload({ onUploadSuccess }: DragDropUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsUploading(true)
    const file = acceptedFiles[0]
    const formData = new FormData()
    formData.append('file', file)

    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setIsUploading(false)
        onUploadSuccess(data.url, {
          'File Name': file.name,
          'File Size': `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          'File Type': file.type,
          'Last Modified': new Date(file.lastModified).toLocaleString(),
        })
      })
      .catch((error) => {
        console.error('Error:', error)
        setIsUploading(false)
      })
  }, [onUploadSuccess])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div
      {...getRootProps()}
      className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer transition-colors hover:border-gray-400"
    >
      <div>
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        {isDragActive ? (
          <p className="mt-2 text-sm text-gray-600">Drop the image here ...</p>
        ) : isUploading ? (
          <p className="mt-2 text-sm text-gray-600">Uploading...</p>
        ) : (
          <p className="mt-2 text-sm text-gray-600">Drag & drop an image here, or click to select one</p>
        )}
      </div>
    </div>
  )
}