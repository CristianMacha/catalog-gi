const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

export function cloudinaryUrl(publicId: string, options?: { width?: number; quality?: number }) {
  const transforms = [
    options?.width ? `w_${options.width}` : 'w_800',
    options?.quality ? `q_${options.quality}` : 'q_auto',
    'f_auto',
  ].join(',')

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`
}
