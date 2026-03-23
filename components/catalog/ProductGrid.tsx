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
        <p className="text-neutral-400 dark:text-neutral-600 text-sm font-mono">No products found</p>
        <p className="text-neutral-300 dark:text-neutral-700 text-xs mt-1">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <Link
      href={`/catalog/${product.slug}`}
      className="group flex flex-col gap-4"
    >
      <div className="aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-sm overflow-hidden">
        {product.primaryImagePublicId ? (
          <Image
            src={cloudinaryUrl(product.primaryImagePublicId, { width: 400 })}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-neutral-400 dark:text-neutral-700 text-xs font-mono">{product.category.name}</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
          {product.category.name}
        </p>
        <h3 className="text-sm font-medium group-hover:text-neutral-600 dark:group-hover:text-white transition-colors leading-snug">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-neutral-400 dark:text-neutral-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
        <Badge>{product.level.name}</Badge>
        <Badge>{product.finish.name}</Badge>
        {product.brand && <Badge>{product.brand.name}</Badge>}
      </div>
    </Link>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-xs font-mono px-2 py-0.5 rounded-sm">
      {children}
    </span>
  )
}
