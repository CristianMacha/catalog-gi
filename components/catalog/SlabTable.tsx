import type { CatalogSlab } from '@/lib/types/catalog'

interface SlabTableProps {
  slabs: CatalogSlab[]
}

export function SlabTable({ slabs }: SlabTableProps) {
  if (slabs.length === 0) {
    return (
      <p className="px-6 py-8 text-center text-xs font-mono text-neutral-400 dark:text-neutral-600">
        No slabs in this lot
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800">
            {['Code', 'Width', 'Height', 'Area', 'Status'].map((h) => (
              <th key={h} className="px-6 py-3 text-left text-xs font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slabs.map((slab, i) => {
            const areaSqm = ((slab.widthCm * slab.heightCm) / 10000).toFixed(2)
            return (
              <tr
                key={slab.id}
                className={`border-b border-neutral-100 dark:border-neutral-900 ${
                  i % 2 === 0 ? 'bg-white dark:bg-neutral-950' : 'bg-neutral-50 dark:bg-neutral-900/30'
                }`}
              >
                <td className="px-6 py-3 font-mono text-xs text-neutral-600 dark:text-neutral-300">{slab.code}</td>
                <td className="px-6 py-3 text-xs text-neutral-500 dark:text-neutral-400">{slab.widthCm} cm</td>
                <td className="px-6 py-3 text-xs text-neutral-500 dark:text-neutral-400">{slab.heightCm} cm</td>
                <td className="px-6 py-3 text-xs text-neutral-500 dark:text-neutral-400">{areaSqm} m²</td>
                <td className="px-6 py-3">
                  <SlabStatus status={slab.status} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function SlabStatus({ status }: { status: string }) {
  const styles: Record<string, string> = {
    available: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400',
    reserved: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
    sold: 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500',
  }

  return (
    <span className={`inline-block text-xs font-mono px-2 py-0.5 rounded-sm capitalize ${styles[status] ?? 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-400'}`}>
      {status}
    </span>
  )
}
