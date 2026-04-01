'use client'

import { useState, useEffect } from 'react'
import { CatalogSidebar } from './CatalogSidebar'
import type { CatalogFilters } from '@/lib/types/catalog'

interface MobileFiltersProps {
  filters: CatalogFilters
  current: {
    categoryId?: string
    levelId?: string
    finishId?: string
    brandId?: string
    search?: string
  }
  activeCount: number
}

export function MobileFilters({ filters, current, activeCount }: MobileFiltersProps) {
  const [open, setOpen] = useState(false)

  // Lock body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on route change (filter applied)
  useEffect(() => { setOpen(false) }, [current])

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300 hover:border-neutral-500 dark:hover:border-neutral-500 transition-colors"
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M2 4h11M4 7.5h7M6.5 11h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Filters
        {activeCount > 0 && (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[10px] font-medium">
            {activeCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 dark:bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#f5f0eb] dark:bg-neutral-950 rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '85dvh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <span className="font-medium text-neutral-900 dark:text-neutral-100">Filters</span>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-6" style={{ maxHeight: 'calc(85dvh - 80px)' }}>
          <CatalogSidebar filters={filters} current={current} />
        </div>
      </div>
    </>
  )
}
