'use server'

import type {
  CatalogProduct,
  CatalogProductDetail,
  CatalogFilters,
  CatalogProductsParams,
} from '@/lib/types/catalog'

const API_BASE = process.env.API_URL ?? 'http://localhost:3001'

export async function getCatalogProducts(
  params: CatalogProductsParams = {}
): Promise<CatalogProduct[]> {
  const query = new URLSearchParams()

  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.categoryId) query.set('categoryId', params.categoryId)
  if (params.levelId) query.set('levelId', params.levelId)
  if (params.finishId) query.set('finishId', params.finishId)
  if (params.brandId) query.set('brandId', params.brandId)
  if (params.search) query.set('search', params.search)

  const url = `${API_BASE}/api/v1/catalog/products?${query.toString()}`

  const res = await fetch(url, { cache: 'no-store' })

  if (!res.ok) {
    throw new Error(`Failed to fetch catalog products: ${res.status}`)
  }

  const json = await res.json()
  // Handle both array and paginated object responses { data: [], total, ... }
  return Array.isArray(json) ? json : (json.data ?? json.items ?? [])
}

export async function getCatalogProductDetail(
  slug: string
): Promise<CatalogProductDetail> {
  const res = await fetch(`${API_BASE}/api/v1/catalog/products/${slug}`, {
    cache: 'no-store',
  })

  if (res.status === 404) {
    throw new Error('Product not found')
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch product detail: ${res.status}`)
  }

  return res.json()
}

export async function getCatalogFilters(): Promise<CatalogFilters> {
  const res = await fetch(`${API_BASE}/api/v1/catalog/filters`, {
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch catalog filters: ${res.status}`)
  }

  return res.json()
}
