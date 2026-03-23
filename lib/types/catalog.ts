export interface CatalogRelation {
  id: string
  name: string
}

export interface CatalogProduct {
  id: string
  name: string
  slug: string
  description: string
  primaryImagePublicId?: string | null
  category: CatalogRelation
  level: CatalogRelation
  finish: CatalogRelation
  brand?: CatalogRelation
}

export interface CatalogSlab {
  id: string
  code: string
  widthCm: number
  heightCm: number
  status: string
}

export interface CatalogBundle {
  id: string
  lotNumber: string
  thicknessCm: number
  imagePublicId?: string | null
  slabs: CatalogSlab[]
}

export interface CatalogProductImage {
  publicId: string
  isPrimary: boolean
  sortOrder: number
}

export interface CatalogProductDetail extends CatalogProduct {
  images: CatalogProductImage[]
  bundles: CatalogBundle[]
}

export interface CatalogFilters {
  categories: CatalogRelation[]
  brands: CatalogRelation[]
  levels: CatalogRelation[]
  finishes: CatalogRelation[]
}

export interface CatalogProductsParams {
  page?: number
  limit?: number
  categoryId?: string
  levelId?: string
  finishId?: string
  brandId?: string
  search?: string
}
