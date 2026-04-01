'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import type { CatalogFilters, CatalogRelation } from '@/lib/types/catalog'

interface CatalogSidebarProps {
  filters: CatalogFilters
  current: {
    categoryId?: string
    levelId?: string
    finishId?: string
    brandId?: string
    search?: string
  }
}

export function CatalogSidebar({ filters, current }: CatalogSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const toggle = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams()
      const isActive = (current as Record<string, string | undefined>)[key] === value
      const next = { ...current, [key]: isActive ? undefined : value }
      Object.entries(next).forEach(([k, v]) => { if (v) params.set(k, v) })
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [current, pathname, router]
  )

  const clearAll = useCallback(() => router.push(pathname), [pathname, router])

  const hasFilters = Object.entries(current).some(([k, v]) => k !== 'page' && v)

  const filterGroups = [
    { key: 'categoryId', label: 'Categories', options: filters.categories },
    { key: 'brandId', label: 'Brand', options: filters.brands },
    { key: 'levelId', label: 'Level', options: filters.levels },
    { key: 'finishId', label: 'Finish', options: filters.finishes },
  ]

  return (
    <div className="flex flex-col gap-8">
      {filterGroups.map(({ key, label, options }) => (
        <FilterGroup
          key={key}
          filterKey={key}
          label={label}
          options={options}
          activeId={(current as Record<string, string | undefined>)[key]}
          onToggle={(id) => toggle(key, id)}
        />
      ))}

      {/* Search */}
      <div className="flex flex-col gap-3">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
          Search
        </p>
        <input
          type="text"
          placeholder="Search product…"
          defaultValue={current.search ?? ''}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return
            const val = (e.target as HTMLInputElement).value.trim()
            const params = new URLSearchParams()
            const next = { ...current, search: val || undefined }
            Object.entries(next).forEach(([k, v]) => { if (v) params.set(k, v) })
            params.delete('page')
            router.push(`${pathname}?${params.toString()}`)
          }}
          className="w-full bg-transparent border-b border-neutral-300 dark:border-neutral-700 py-1.5 text-sm text-neutral-700 dark:text-neutral-300 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-600 dark:focus:border-neutral-400 transition-colors"
        />
      </div>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors text-left underline underline-offset-2"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}

function FilterGroup({
  label,
  options,
  activeId,
  onToggle,
}: {
  filterKey: string
  label: string
  options: CatalogRelation[]
  activeId?: string
  onToggle: (id: string) => void
}) {
  if (options.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
        {label}
      </p>
      <div className="flex flex-col gap-2.5">
        {options.map((opt) => {
          const checked = opt.id === activeId
          return (
            <label
              key={opt.id}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <span
                onClick={() => onToggle(opt.id)}
                className={`w-4 h-4 shrink-0 rounded-sm border flex items-center justify-center transition-colors ${
                  checked
                    ? 'bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white'
                    : 'bg-transparent border-neutral-400 dark:border-neutral-600 group-hover:border-neutral-600 dark:group-hover:border-neutral-400'
                }`}
              >
                {checked && (
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path
                      d="M1.5 4.5l2 2 4-4"
                      stroke="white"
                      className="dark:stroke-neutral-900"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span
                onClick={() => onToggle(opt.id)}
                className={`text-sm transition-colors ${
                  checked
                    ? 'text-neutral-900 dark:text-neutral-100 font-medium'
                    : 'text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200'
                }`}
              >
                {opt.name}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
