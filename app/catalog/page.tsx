import { Suspense } from "react";
import { getCatalogProducts, getCatalogFilters } from "@/lib/actions/catalog";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { ProductGridSkeleton } from "@/components/catalog/ProductGridSkeleton";
import { Pagination } from "@/components/catalog/Pagination";
import { CatalogSidebar } from "@/components/catalog/CatalogSidebar";
import { MobileFilters } from "@/components/catalog/MobileFilters";

interface SearchParams {
  categoryId?: string;
  levelId?: string;
  finishId?: string;
  brandId?: string;
  search?: string;
  page?: string;
}

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export const metadata = {
  title: "Catalog",
  description: "Browse our stone and marble catalog",
};

const LIMIT = 20;

export default async function CatalogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = await getCatalogFilters();

  const activeCount = [
    params.categoryId,
    params.levelId,
    params.finishId,
    params.brandId,
    params.search,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#f5f0eb] dark:bg-neutral-950">
      {/* Header */}
      <header className="px-6 md:px-12 py-5 md:py-7 border-b border-neutral-300/60 dark:border-neutral-800 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Explore Our Collection
        </h1>
        <div className="flex items-center gap-3">
          {/* Mobile filter trigger — rendered client side */}
          <MobileFilters
            filters={filters}
            current={params}
            activeCount={activeCount}
          />
          <Suspense
            fallback={<span className="text-sm text-neutral-400">—</span>}
          >
            <ProductCount params={params} />
          </Suspense>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar — desktop only */}
        <aside className="hidden md:block w-64 shrink-0 px-8 py-8 border-r border-neutral-300/60 dark:border-neutral-800 min-h-screen">
          <CatalogSidebar filters={filters} current={params} />
        </aside>

        {/* Main */}
        <main className="flex-1 px-6 md:px-10 py-8">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductsSection params={params} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

async function ProductCount({ params }: { params: SearchParams }) {
  const result = await getCatalogProducts({ ...params, page: 1, limit: 1 });
  return (
    <span className="text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
      {result.total} products
    </span>
  );
}

async function ProductsSection({ params }: { params: SearchParams }) {
  const page = params.page ? Number(params.page) : 1;
  const result = await getCatalogProducts({ ...params, page, limit: LIMIT });

  return (
    <div className="flex flex-col gap-8">
      <ProductGrid products={result.data} />
      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        total={result.total}
        limit={result.limit}
      />
    </div>
  );
}
