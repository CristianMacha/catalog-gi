'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import type { CatalogFilters } from '@/lib/types/catalog'

interface FilterBarProps {
  filters: CatalogFilters
  current: {
    categoryId?: string
    levelId?: string
    finishId?: string
    brandId?: string
    search?: string
  }
}

export function FilterBar({ filters, current }: FilterBarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams()
      const next = { ...current, [key]: value }
      Object.entries(next).forEach(([k, v]) => { if (v) params.set(k, v) })
      if (key !== 'page') params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [current, pathname, router]
  )

  const clearFilter = useCallback(
    (key: string) => {
      const params = new URLSearchParams()
      const next = { ...current, [key]: undefined }
      Object.entries(next).forEach(([k, v]) => { if (v) params.set(k, v) })
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [current, pathname, router]
  )

  const clearAll = useCallback(() => router.push(pathname), [pathname, router])

  const hasFilters =
    current.categoryId || current.levelId || current.finishId || current.brandId || current.search

  const filterGroups = [
    { key: 'categoryId', label: 'Category', options: filters.categories },
    { key: 'brandId', label: 'Brand', options: filters.brands },
    { key: 'levelId', label: 'Level', options: filters.levels },
    { key: 'finishId', label: 'Finish', options: filters.finishes },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
          width="14" height="14" viewBox="0 0 14 14" fill="none"
        >
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9.5 9.5L12.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search products..."
          defaultValue={current.search ?? ''}
          onChange={(e) => { if (e.target.value.length === 0) clearFilter('search') }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') updateFilter('search', (e.target as HTMLInputElement).value)
          }}
          className="w-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md pl-9 pr-4 py-2.5 text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors"
        />
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        {filterGroups.map(({ key, label, options }) => (
          <select
            key={key}
            value={(current as Record<string, string | undefined>)[key] ?? ''}
            onChange={(e) => {
              const val = e.target.value
              if (val) updateFilter(key, val)
              else clearFilter(key)
            }}
            className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-700 dark:text-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors cursor-pointer"
          >
            <option value="">{label}</option>
            {options.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.name}</option>
            ))}
          </select>
        ))}

        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-mono text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors ml-1"
          >
            Clear all
          </button>
        )}
      </div>

      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {filterGroups.map(({ key, label, options }) => {
            const activeId = (current as Record<string, string | undefined>)[key]
            if (!activeId) return null
            const name = options.find((o) => o.id === activeId)?.name ?? activeId
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-mono px-2.5 py-1 rounded-full"
              >
                <span className="text-neutral-400 dark:text-neutral-500">{label}:</span> {name}
                <button
                  onClick={() => clearFilter(key)}
                  className="text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200 transition-colors"
                >×</button>
              </span>
            )
          })}
          {current.search && (
            <span className="inline-flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-mono px-2.5 py-1 rounded-full">
              <span className="text-neutral-400 dark:text-neutral-500">Search:</span> {current.search}
              <button
                onClick={() => clearFilter('search')}
                className="text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200 transition-colors"
              >×</button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
