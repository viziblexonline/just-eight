/** Max edge length after resize (keeps quality, shrinks phone photos). */
const MAX_EDGE = 1800
/** Target JPEG quality */
const JPEG_QUALITY = 0.82
/** Soft client cap before compress (bytes) — still compresses larger files */
const WARN_BYTES = 12 * 1024 * 1024

function extensionForMime(mime: string) {
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  if (mime === 'image/gif') return 'gif'
  return 'jpg'
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not read this image. Try another file.'))
    }
    img.src = url
  })
}

/**
 * Resize + compress an image in the browser so uploads stay under storage limits
 * and feel faster when adding many photos.
 */
export async function prepareImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file (JPG, PNG, WebP, or GIF).')
  }

  // GIFs: keep as-is (canvas would flatten animation)
  if (file.type === 'image/gif') {
    if (file.size > 8 * 1024 * 1024) {
      throw new Error('GIF is too large. Use JPG/PNG under 8MB, or convert to JPG.')
    }
    return file
  }

  const img = await loadImage(file)
  const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height))
  const width = Math.max(1, Math.round(img.width * scale))
  const height = Math.max(1, Math.round(img.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Image compression failed in this browser.')

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, width, height)
  ctx.drawImage(img, 0, 0, width, height)

  const outputType =
    file.type === 'image/png' && file.size < 1.5 * 1024 * 1024
      ? 'image/png'
      : 'image/jpeg'

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) reject(new Error('Image compression failed.'))
        else resolve(result)
      },
      outputType,
      outputType === 'image/jpeg' ? JPEG_QUALITY : undefined,
    )
  })

  // If somehow still huge, try harder JPEG pass
  let finalBlob = blob
  if (blob.size > 4.5 * 1024 * 1024 && outputType === 'image/jpeg') {
    const tighter = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((result) => resolve(result), 'image/jpeg', 0.7)
    })
    if (tighter && tighter.size < blob.size) finalBlob = tighter
  }

  if (finalBlob.size > 8 * 1024 * 1024) {
    throw new Error(
      'Image is still too large after compression. Try a smaller photo.',
    )
  }

  if (file.size > WARN_BYTES) {
    console.info(
      `[upload] Compressed ${file.name}: ${(file.size / 1024 / 1024).toFixed(1)}MB → ${(finalBlob.size / 1024 / 1024).toFixed(1)}MB`,
    )
  }

  const base = file.name.replace(/\.[^.]+$/, '') || 'image'
  const ext = extensionForMime(finalBlob.type)
  return new File([finalBlob], `${base}.${ext}`, {
    type: finalBlob.type,
    lastModified: Date.now(),
  })
}

/** Upload many files one-by-one (more reliable than flooding storage). */
export async function mapUploadsSequentially<T>(
  files: File[],
  uploadOne: (file: File) => Promise<T>,
  onProgress?: (done: number, total: number) => void,
): Promise<T[]> {
  const results: T[] = []
  for (let i = 0; i < files.length; i++) {
    results.push(await uploadOne(files[i]!))
    onProgress?.(i + 1, files.length)
  }
  return results
}
