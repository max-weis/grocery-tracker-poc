import Image from 'next/image'

interface ImageDisplayProps {
  src: string
}

export function ImageDisplay({ src }: ImageDisplayProps) {
  return (
    <Image
      src={src}
      alt="Uploaded image"
      width={500}
      height={500}
      className="w-full h-auto object-contain rounded-lg shadow-md"
    />
  )
}