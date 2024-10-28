import { useDropzone } from 'react-dropzone'

interface DragDropZoneProps {
  onDrop: (acceptedFiles: File[]) => void
}

export function DragDropZone({ onDrop }: DragDropZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': []},
    multiple: false
  })

  return (
    <div
      {...getRootProps()}
      className={`w-64 h-64 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
        isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-center text-gray-500">
        {isDragActive
          ? "Drop the image here"
          : "Drag 'n' drop an image here, or click to select one"}
      </p>
    </div>
  )
}