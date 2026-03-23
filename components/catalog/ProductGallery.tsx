'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { CatalogProductImage } from '@/lib/types/catalog'
import { cloudinaryUrl } from '@/lib/cloudinary'

interface ProductGalleryProps {
  images: CatalogProductImage[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder)
  const [active, setActive] = useState(0)

  if (sorted.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden">
        <Image
          src={cloudinaryUrl(sorted[active].publicId, { width: 900 })}
          alt={`${productName} — image ${active + 1}`}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((img, i) => (
            <button
              key={img.publicId}
              onClick={() => setActive(i)}
              className={`relative shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                i === active ? 'border-white' : 'border-transparent opacity-50 hover:opacity-75'
              }`}
            >
              <Image
                src={cloudinaryUrl(img.publicId, { width: 128 })}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
