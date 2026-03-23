import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCatalogProductDetail } from '@/lib/actions/catalog'
import { BundleCard } from '@/components/catalog/BundleCard'
import { ProductGallery } from '@/components/catalog/ProductGallery'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  try {
    const product = await getCatalogProductDetail(slug)
    return { title: product.name, description: product.description }
  } catch {
    return { title: 'Product not found' }
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params

  let product
  try {
    product = await getCatalogProductDetail(slug)
  } catch {
    notFound()
  }

  const totalSlabs = product.bundles.reduce((acc, b) => acc + b.slabs.length, 0)
  const availableSlabs = product.bundles.reduce(
    (acc, b) => acc + b.slabs.filter((s) => s.status === 'available').length,
    0
  )

  return (
    <main className="min-h-screen">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 px-6 py-6 md:px-12">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors mb-6"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M8.5 2.5L4 7l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to catalog
        </Link>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase mb-2">
              {product.category.name}
            </p>
            <h1 className="text-4xl font-light tracking-tight">{product.name}</h1>
          </div>

          <div className="flex gap-6 text-right">
            <div>
              <p className="text-2xl font-light">{product.bundles.length}</p>
              <p className="text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Lots</p>
            </div>
            <div>
              <p className="text-2xl font-light">{availableSlabs}</p>
              <p className="text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Available slabs</p>
            </div>
            <div>
              <p className="text-2xl font-light text-neutral-400 dark:text-neutral-500">{totalSlabs}</p>
              <p className="text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Total slabs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: gallery */}
          <ProductGallery images={product.images ?? []} productName={product.name} />

          {/* Right: info */}
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-2 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
              {[
                { label: 'Category', value: product.category.name },
                { label: 'Level', value: product.level.name },
                { label: 'Finish', value: product.finish.name },
                { label: 'Brand', value: product.brand?.name ?? '—' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white dark:bg-neutral-950 px-5 py-4">
                  <p className="text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">
                    {label}
                  </p>
                  <p className="text-sm">{value}</p>
                </div>
              ))}
            </div>

            {product.description && (
              <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed">
                {product.description}
              </p>
            )}
          </div>
        </div>

        {/* Bundles */}
        <section className="mt-16">
          <h2 className="text-xs font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase mb-6">
            Available lots
          </h2>
          {product.bundles.length > 0 ? (
            <div className="flex flex-col gap-4">
              {product.bundles.map((bundle) => (
                <BundleCard key={bundle.id} bundle={bundle} />
              ))}
            </div>
          ) : (
            <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg px-8 py-16 text-center">
              <p className="text-neutral-400 dark:text-neutral-500 text-sm">No lots available for this product.</p>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
