'use client'

import { useContext } from 'react'
import DragDropUpload from './drag-drop-upload'
import ImageDisplay from './image-display'
import DataTable from './data-table'
import { AppContext } from './app-context'

export default function ClientSideContent() {
  const { showUpload, selectedFile, setUploadedFiles, setShowUpload } = useContext(AppContext)

  const handleUploadSuccess = (imageUrl: string, fileData: { [key: string]: string }) => {
    setUploadedFiles(prev => [...prev, fileData['File Name']])
    setShowUpload(false)
  }

  return (
    <div className="h-full flex items-center justify-center">
      {showUpload ? (
        <div className="w-full h-full flex items-center justify-center">
          <DragDropUpload onUploadSuccess={handleUploadSuccess} />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col md:flex-row gap-4 p-4">
          <div className="w-full md:w-1/2 h-full">
            <ImageDisplay imageUrl={selectedFile ? `/${selectedFile}` : '/placeholder.svg'} />
          </div>
          <div className="w-full md:w-1/2 h-full">
            <DataTable data={{
              'File Name': selectedFile || 'N/A',
              'File Size': 'Unknown',
              'File Type': 'Unknown',
              'Last Modified': 'Unknown',
            }} />
          </div>
        </div>
      )}
    </div>
  )
}