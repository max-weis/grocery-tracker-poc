'use server'

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { readFile } from 'fs/promises'

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get('file') as File
    if (!file) {
      throw new Error('No file uploaded')
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create the uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    const path = join(uploadsDir, file.name)
    await writeFile(path, buffer)

    // Call the API to process the receipt
    const apiFormData = new FormData()
    apiFormData.append('image', new Blob([buffer]), file.name)

    const response = await fetch('http://localhost:8000/api/gpt/process-receipt', {
      method: 'POST',
      body: apiFormData,
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const products = await response.json()

    return { success: true, path: `/uploads/${file.name}`, products }
  } catch (error) {
    console.error('Error processing image:', error)
    return { success: false, error: 'Failed to process image' }
  }
}