'use client'

import { useEffect, useState } from 'react'
import { formatINR } from '@/lib/utils'
import Link from 'next/link'

interface SalaryRow {
  id: number
  role: string
  level: string
  location: string
  base: number
  bonus: number
  stock: number
  yoe: number
  verified: boolean
  company: { id: number; name: string; industry: string }
}

type SortKey = 'base' | 'bonus' | 'stock' | 'yoe' | 'company'

export default function SalariesPage() {
  const [salaries, setSalaries] = useState<SalaryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ company: '', role: '', location: '', level: '' })
  const [sort, setSort] = useState<{ key: SortKey; order: 'asc' | 'desc' }>({ key: 'base', order: 'desc' })
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchSalaries()
  }, [filters, sort, page])

  async function fetchSalaries() {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.company) params.set('company', filters.company)
    if (filters.role) params.set('role', filters.role)
    if (filters.location) params.set('location', filters.location)
    if (filters.level) params.set('level', filters.level)
    params.set('sort', sort.key)
    params.set('order', sort.order)
    params.set('page', page.toString())
    params.set('limit', '20')

    const res = await fetch(`/api/salaries?${params}`)
    const data = await res.json()
    setSalaries(data.data)
    setTotal(data.total)
    setTotalPages(data.totalPages)
    setLoading(false)
  }

  function handleSort(key: SortKey) {
    setSort((prev) => ({
      key,
      order: prev.key === key && prev.order === 'desc' ? 'asc' : 'desc',
    }))
    setPage(1)
  }

  function handleFilter(field: string, value: string) {
    setFilters((prev) => ({ ...prev, [field]: value }))
    setPage(1)
  }

  const arrow = (key: SortKey) => {
    if (sort.key !== key) return ''
    return sort.order === 'desc' ? ' ↓' : ' ↑'
  }

  return (
    <div className="page-container py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Salary Explorer</h1>
        <p className="text-sm text-dim">{total} entries · Filter and sort to find what you need</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <input className="filter-input" placeholder="Company" value={filters.company} onChange={(e) => handleFilter('company', e.target.value)} />
        <input className="filter-input" placeholder="Role" value={filters.role} onChange={(e) => handleFilter('role', e.target.value)} />
        <input className="filter-input" placeholder="Location" value={filters.location} onChange={(e) => handleFilter('location', e.target.value)} />
        <input className="filter-input" placeholder="Level" value={filters.level} onChange={(e) => handleFilter('level', e.target.value)} />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto" style={{ maxHeight: '620px', overflowY: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('company')} className={sort.key === 'company' ? 'sorted' : ''}>Company{arrow('company')}</th>
                <th>Role</th>
                <th>Level</th>
                <th>Location</th>
                <th onClick={() => handleSort('base')} className={sort.key === 'base' ? 'sorted' : ''}>Base{arrow('base')}</th>
                <th onClick={() => handleSort('bonus')} className={sort.key === 'bonus' ? 'sorted' : ''}>Bonus{arrow('bonus')}</th>
                <th onClick={() => handleSort('stock')} className={sort.key === 'stock' ? 'sorted' : ''}>Stock{arrow('stock')}</th>
                <th>Total</th>
                <th onClick={() => handleSort('yoe')} className={sort.key === 'yoe' ? 'sorted' : ''}>YoE{arrow('yoe')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 10 }).map((_, j) => (
                      <td key={j}><div className="skeleton" style={{ height: 14, width: '80%' }}></div></td>
                    ))}
                  </tr>
                ))
              ) : salaries.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center" style={{ padding: '48px 16px', color: 'var(--text-tertiary)' }}>
                    No entries found. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                salaries.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <Link href={`/companies/${s.company.id}`} className="text-accent hover:underline no-underline font-medium">
                        {s.company.name}
                      </Link>
                    </td>
                    <td className="text-foreground font-medium">{s.role}</td>
                    <td><span className="tag tag-neutral">{s.level}</span></td>
                    <td>{s.location}</td>
                    <td className="mono">{formatINR(s.base)}</td>
                    <td className="mono">{formatINR(s.bonus)}</td>
                    <td className="mono">{formatINR(s.stock)}</td>
                    <td className="mono font-semibold text-foreground">{formatINR(s.base + s.bonus + s.stock)}</td>
                    <td className="text-center">{s.yoe}</td>
                    <td>
                      {s.verified
                        ? <span className="tag tag-green">Verified</span>
                        : <span className="tag tag-amber">Pending</span>
                      }
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5">
          <span className="text-xs text-dim">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-outline">Prev</button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn btn-outline">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
