import Link from 'next/link'
import Image from 'next/image'
import type { CatalogProduct } from '@/lib/types/catalog'
import { cloudinaryUrl } from '@/lib/cloudinary'

interface ProductGridProps {
  products: CatalogProduct[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-sm text-neutral-400 dark:text-neutral-600">No products found</p>
        <p className="text-xs text-neutral-300 dark:text-neutral-700 mt-1">
          Try adjusting your filters
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <Link href={`/catalog/${product.slug}`} className="group flex flex-col gap-3">
      {/* Image */}
      <div className="aspect-4/5 bg-[#e8ddd4] dark:bg-neutral-800 rounded overflow-hidden">
        {product.primaryImagePublicId ? (
          <Image
            src={cloudinaryUrl(product.primaryImagePublicId, { width: 600 })}
            alt={product.name}
            width={600}
            height={750}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xs text-neutral-400 dark:text-neutral-600 font-mono">
              {product.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
          {product.category.name}
        </p>
        <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
          {product.name}
        </h3>
        <div className="flex flex-wrap gap-1 mt-1">
          <Tag>{product.level.name}</Tag>
          <Tag>{product.finish.name}</Tag>
          {product.brand && <Tag>{product.brand.name}</Tag>}
        </div>
      </div>
    </Link>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">
      {children}
    </span>
  )
}
