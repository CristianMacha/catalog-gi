import type { MetadataRoute } from 'next'
import { getCatalogProducts } from '@/lib/actions/catalog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/catalog`,
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  try {
    const { data: products } = await getCatalogProducts({ page: 1, limit: 1000 })

    const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
      url: `${siteUrl}/catalog/${product.slug}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    return [...staticRoutes, ...productRoutes]
  } catch {
    return staticRoutes
  }
}
