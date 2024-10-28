import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // With the file data in the buffer, you can do whatever you want with it.
  // For this example, we'll just save it to the public directory
  const path = join(process.cwd(), 'public', file.name)
  await writeFile(path, buffer)

  return NextResponse.json({ success: true, url: `/${file.name}` })
}