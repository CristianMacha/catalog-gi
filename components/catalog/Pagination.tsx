'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  limit: number
}

export function Pagination({ page, totalPages, total, limit }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const goTo = useCallback(
    (p: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', String(p))
      router.push(`${pathname}?${params.toString()}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [pathname, router, searchParams]
  )

  if (totalPages <= 1) return null

  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  const pages = buildPages(page, totalPages)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-neutral-100 dark:border-neutral-800">
      <p className="text-xs font-mono text-neutral-400 dark:text-neutral-500">
        Showing <span className="text-neutral-700 dark:text-neutral-300">{from}–{to}</span> of{' '}
        <span className="text-neutral-700 dark:text-neutral-300">{total}</span> products
      </p>

      <div className="flex items-center gap-1">
        {/* Prev */}
        <NavButton onClick={() => goTo(page - 1)} disabled={page <= 1} aria-label="Previous page">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M8.5 2.5L4 7l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </NavButton>

        {/* Pages */}
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="w-8 text-center text-xs text-neutral-400 dark:text-neutral-600">
              …
            </span>
          ) : (
            <PageButton
              key={p}
              page={p as number}
              active={p === page}
              onClick={() => goTo(p as number)}
            />
          )
        )}

        {/* Next */}
        <NavButton onClick={() => goTo(page + 1)} disabled={page >= totalPages} aria-label="Next page">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5.5 2.5L10 7l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </NavButton>
      </div>
    </div>
  )
}

function PageButton({ page, active, onClick }: { page: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded-lg text-xs font-mono transition-colors ${
        active
          ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-medium'
          : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-200'
      }`}
    >
      {page}
    </button>
  )
}

function NavButton({
  onClick,
  disabled,
  children,
  'aria-label': ariaLabel,
}: {
  onClick: () => void
  disabled: boolean
  children: React.ReactNode
  'aria-label': string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 dark:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  )
}

function buildPages(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  if (current <= 4) return [1, 2, 3, 4, 5, '...', total]
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
}
