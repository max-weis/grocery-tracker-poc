'use client'

import { useCallback, useState } from 'react'
import { Button } from "@/components/ui/button"
import { RefreshCw, Upload } from "lucide-react"
import { DragDropZone } from './drag-drop-zone'
import { ImageDisplay } from './image-display'
import { ProductTable } from './product-table'
import { uploadImage } from '../actions/upload-image'
import { useToast } from "@/hooks/use-toast"

interface Product {
  name: string
  price: number
  pricePerUnit: number
  quantity: number
}

export default function ImageUpload() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const { toast } = useToast()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      try {
        const result = await uploadImage(formData)
        if (result.success) {
          setUploadedImage(result.path!)
          setProducts(result.products)
          toast({
            title: "Success",
            description: "Image uploaded and processed successfully",
          })
        } else {
          throw new Error(result.error)
        }
      } catch (error) {
        console.error('Upload failed:', error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to upload and process image",
          variant: "destructive",
        })
      } finally {
        setIsUploading(false)
      }
    }
  }, [toast])

  const resetView = () => {
    setUploadedImage(null)
    setProducts([])
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {!uploadedImage ? (
        <div className="text-center">
          <DragDropZone onDrop={onDrop} />
          {isUploading && (
            <div className="mt-4 flex items-center justify-center">
              <Upload className="animate-bounce mr-2" />
              <span>Uploading and processing...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-6xl">
          <div className="flex justify-end mb-4">
            <Button onClick={resetView} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <ImageDisplay src={uploadedImage} />
            </div>
            <div className="flex-1">
              <ProductTable products={products} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}