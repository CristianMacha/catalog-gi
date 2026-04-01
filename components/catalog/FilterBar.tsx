'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import type { CatalogFilters, CatalogRelation } from '@/lib/types/catalog'

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
  const [openGroup, setOpenGroup] = useState<string | null>(null)

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams()
      const next = { ...current, [key]: value }
      Object.entries(next).forEach(([k, v]) => { if (v) params.set(k, v) })
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
      setOpenGroup(null)
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

  const clearAll = useCallback(() => {
    router.push(pathname)
    setOpenGroup(null)
  }, [pathname, router])

  const activeCount = [
    current.categoryId,
    current.levelId,
    current.finishId,
    current.brandId,
    current.search,
  ].filter(Boolean).length

  const filterGroups = [
    { key: 'categoryId', label: 'Category', options: filters.categories },
    { key: 'brandId', label: 'Brand', options: filters.brands },
    { key: 'levelId', label: 'Level', options: filters.levels },
    { key: 'finishId', label: 'Finish', options: filters.finishes },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Search */}
      <div className="relative group/search">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 group-focus-within/search:text-neutral-700 dark:group-focus-within/search:text-neutral-300 transition-colors"
          width="16" height="16" viewBox="0 0 16 16" fill="none"
        >
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, category, finish…"
          defaultValue={current.search ?? ''}
          onChange={(e) => { if (e.target.value.length === 0) clearFilter('search') }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const val = (e.target as HTMLInputElement).value.trim()
              if (val) updateFilter('search', val)
              else clearFilter('search')
            }
          }}
          className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-11 pr-4 py-3.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 focus:bg-white dark:focus:bg-neutral-900 transition-all"
        />
        {current.search && (
          <button
            onClick={() => clearFilter('search')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter groups */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Filters
            </span>
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-mono font-medium">
                {activeCount}
              </span>
            )}
          </div>
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="text-xs font-mono text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300 transition-colors flex items-center gap-1"
            >
              Clear all
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {filterGroups.map(({ key, label, options }) => {
            const activeId = (current as Record<string, string | undefined>)[key]
            const activeName = options.find((o) => o.id === activeId)?.name
            const isOpen = openGroup === key

            return (
              <FilterDropdown
                key={key}
                filterKey={key}
                label={label}
                options={options}
                activeId={activeId}
                activeName={activeName}
                isOpen={isOpen}
                onToggle={() => setOpenGroup(isOpen ? null : key)}
                onSelect={(id) => updateFilter(key, id)}
                onClear={() => clearFilter(key)}
              />
            )
          })}
        </div>
      </div>

      {/* Active filter tags */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800/60">
          {filterGroups.map(({ key, label, options }) => {
            const activeId = (current as Record<string, string | undefined>)[key]
            if (!activeId) return null
            const name = options.find((o) => o.id === activeId)?.name ?? activeId
            return (
              <ActiveTag
                key={key}
                label={label}
                value={name}
                onRemove={() => clearFilter(key)}
              />
            )
          })}
          {current.search && (
            <ActiveTag
              label="Search"
              value={current.search}
              onRemove={() => clearFilter('search')}
            />
          )}
        </div>
      )}
    </div>
  )
}

function FilterDropdown({
  filterKey,
  label,
  options,
  activeId,
  activeName,
  isOpen,
  onToggle,
  onSelect,
  onClear,
}: {
  filterKey: string
  label: string
  options: CatalogRelation[]
  activeId?: string
  activeName?: string
  isOpen: boolean
  onToggle: () => void
  onSelect: (id: string) => void
  onClear: () => void
}) {
  const isActive = !!activeId

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium border transition-all ${
          isActive
            ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white'
            : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-200'
        }`}
      >
        {isActive ? activeName : label}
        {isActive ? (
          <span
            role="button"
            onClick={(e) => { e.stopPropagation(); onClear() }}
            className="text-white/60 dark:text-neutral-900/60 hover:text-white dark:hover:text-neutral-900 transition-colors"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
        ) : (
          <svg
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            width="10" height="10" viewBox="0 0 10 10" fill="none"
          >
            <path d="M1.5 3.5L5 7l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-20 min-w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl shadow-black/5 dark:shadow-black/30 overflow-hidden">
          <div className="py-1 max-h-60 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onSelect(opt.id)}
                className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between gap-3 transition-colors ${
                  opt.id === activeId
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                {opt.name}
                {opt.id === activeId && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ActiveTag({ label, value, onRemove }: { label: string; value: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 text-xs font-mono px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700">
      <span className="text-neutral-400 dark:text-neutral-500">{label}:</span>
      <span>{value}</span>
      <button
        onClick={onRemove}
        className="text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-200 transition-colors ml-0.5"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </span>
  )
}
