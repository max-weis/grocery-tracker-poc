'use client'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { FileIcon, UploadIcon } from 'lucide-react'
import { useContext } from 'react'
import { AppContext } from './app-context'

export default function AppSidebar() {
  const { uploadedFiles, setShowUpload, setSelectedFile } = useContext(AppContext)

  const handleShowUpload = () => {
    setShowUpload(true)
    setSelectedFile(null)
  }

  const handleSelectFile = (file: string) => {
    setSelectedFile(file)
    setShowUpload(false)
  }

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">Files</h2>
      </SidebarHeader>
      <SidebarContent>
        <div className="p-4 space-y-4">
          <Button onClick={handleShowUpload} className="w-full">
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
          <ScrollArea className="h-[calc(100vh-150px)]">
            {uploadedFiles.map((file, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleSelectFile(file)}
              >
                <FileIcon className="mr-2 h-4 w-4" />
                {file}
              </Button>
            ))}
          </ScrollArea>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}