'use client'

import React, { createContext, useState, ReactNode } from 'react'

interface AppContextType {
  uploadedFiles: string[]
  setUploadedFiles: React.Dispatch<React.SetStateAction<string[]>>
  showUpload: boolean
  setShowUpload: React.Dispatch<React.SetStateAction<boolean>>
  selectedFile: string | null
  setSelectedFile: React.Dispatch<React.SetStateAction<string | null>>
}

export const AppContext = createContext<AppContextType>({
  uploadedFiles: [],
  setUploadedFiles: () => {},
  showUpload: true,
  setShowUpload: () => {},
  selectedFile: null,
  setSelectedFile: () => {},
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [showUpload, setShowUpload] = useState(true)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  return (
    <AppContext.Provider
      value={{
        uploadedFiles,
        setUploadedFiles,
        showUpload,
        setShowUpload,
        selectedFile,
        setSelectedFile,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}