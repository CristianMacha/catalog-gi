import { Suspense } from 'react'
import { getCatalogProducts, getCatalogFilters } from '@/lib/actions/catalog'
import { ProductGrid } from '@/components/catalog/ProductGrid'
import { FilterBar } from '@/components/catalog/FilterBar'
import { ProductGridSkeleton } from '@/components/catalog/ProductGridSkeleton'

interface PageProps {
  searchParams: Promise<{
    categoryId?: string
    levelId?: string
    finishId?: string
    brandId?: string
    search?: string
    page?: string
  }>
}

export const metadata = {
  title: 'Catalog',
  description: 'Browse our stone and marble catalog',
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const params = await searchParams
  const filters = await getCatalogFilters()

  return (
    <main className="min-h-screen">
      <div className="border-b border-neutral-200 dark:border-neutral-800 px-6 py-10 md:px-12">
        <p className="text-xs font-mono tracking-widest text-neutral-400 dark:text-neutral-500 uppercase mb-2">
          Collection
        </p>
        <h1 className="text-3xl font-light tracking-tight">Stone Catalog</h1>
      </div>

      <div className="px-6 md:px-12 py-8 flex flex-col gap-8">
        <FilterBar filters={filters} current={params} />
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductsSection params={params} />
        </Suspense>
      </div>
    </main>
  )
}

async function ProductsSection({
  params,
}: {
  params: {
    categoryId?: string
    levelId?: string
    finishId?: string
    brandId?: string
    search?: string
    page?: string
  }
}) {
  const products = await getCatalogProducts({
    ...params,
    page: params.page ? Number(params.page) : 1,
    limit: 24,
  })

  return <ProductGrid products={products} />
}
