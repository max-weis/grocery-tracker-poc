import Image from 'next/image'

interface ImageDisplayProps {
  imageUrl: string
}

export default function ImageDisplay({ imageUrl }: ImageDisplayProps) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
      <Image 
        src={imageUrl} 
        alt="Uploaded image" 
        layout="fill"
        objectFit="contain"
      />
    </div>
  )
}