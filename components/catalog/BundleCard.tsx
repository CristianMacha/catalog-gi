'use client'

import { useState } from 'react'
import type { CatalogBundle } from '@/lib/types/catalog'
import { SlabTable } from './SlabTable'

interface BundleCardProps {
  bundle: CatalogBundle
}

export function BundleCard({ bundle }: BundleCardProps) {
  const [open, setOpen] = useState(false)

  const available = bundle.slabs.filter((s) => s.status === 'available').length
  const total = bundle.slabs.length

  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors text-left"
      >
        <div className="flex items-center gap-6">
          <div>
            <p className="text-sm font-medium">{bundle.lotNumber}</p>
            <p className="text-xs font-mono text-neutral-400 dark:text-neutral-500 mt-0.5">
              {bundle.thicknessCm} cm thick
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
            <span className="text-neutral-900 dark:text-white">{available}</span>
            <span className="text-neutral-300 dark:text-neutral-600"> / {total}</span>
            {' '}available
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className={`text-xs font-mono px-2 py-0.5 rounded-sm ${
            available > 0
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
              : 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500'
          }`}>
            {available > 0 ? 'In stock' : 'Out of stock'}
          </div>
          <svg
            className={`text-neutral-400 dark:text-neutral-500 transition-transform ${open ? 'rotate-180' : ''}`}
            width="14" height="14" viewBox="0 0 14 14" fill="none"
          >
            <path d="M2.5 5L7 9.5L11.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="border-t border-neutral-200 dark:border-neutral-800">
          <SlabTable slabs={bundle.slabs} />
        </div>
      )}
    </div>
  )
}
