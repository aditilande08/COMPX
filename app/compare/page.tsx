'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { formatINR } from '@/lib/utils'

interface CompanyOption { id: number; name: string }
interface ComparisonData {
  id: number; name: string; industry: string; hq: string; size: string
  totalEntries: number; avgBase: number; avgBonus: number; avgStock: number
  avgTotal: number; maxTotal: number; minTotal: number
  byRole: { role: string; avg: number; count: number }[]
}

const COLORS = ['bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-rose-500']

function CompareContent() {
  const searchParams = useSearchParams()
  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [comparison, setComparison] = useState<ComparisonData[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/companies').then((r) => r.json()).then((data) => {
      setCompanies(data)
      const ids = searchParams.get('ids')
      if (ids) setSelected(ids.split(',').map(Number).filter(Boolean))
    })
  }, [])

  useEffect(() => {
    if (selected.length >= 2) {
      setLoading(true)
      fetch(`/api/compare?ids=${selected.join(',')}`).then((r) => r.json()).then((d) => { setComparison(d); setLoading(false) })
    } else {
      setComparison([])
    }
  }, [selected])

  function toggle(id: number) {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev)
  }

  const maxTotal = comparison.length > 0 ? Math.max(...comparison.map((c) => c.avgTotal)) : 1

  return (
    <div className="page-container py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Compare Companies</h1>
        <p className="text-sm text-dim">Select 2–4 companies for side-by-side analysis</p>
      </div>

      <div className="card card-padded mb-8">
        <div className="section-title">Select Companies <span className="text-dim font-normal">({selected.length}/4)</span></div>
        <div className="flex flex-wrap gap-2">
          {companies.map((c) => (
            <button key={c.id} onClick={() => toggle(c.id)} className={`chip-select ${selected.includes(c.id) ? 'active' : ''}`}>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {selected.length < 2 && (
        <div className="text-center py-20 text-dim text-sm">Pick at least 2 companies above to begin.</div>
      )}

      {loading && <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 80 }} />)}</div>}

      {!loading && comparison.length >= 2 && (
        <div className="space-y-6">
          {/* Overview cards */}
          <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${comparison.length}, 1fr)` }}>
            {comparison.map((c, i) => (
              <div key={c.id} className="card card-padded">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${COLORS[i]}`} />
                  <span className="text-sm font-semibold">{c.name}</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-dim">Avg CTC</span><span className="mono font-semibold text-accent">{formatINR(c.avgTotal)}</span></div>
                  <div className="flex justify-between"><span className="text-dim">Avg Base</span><span className="mono text-mid">{formatINR(c.avgBase)}</span></div>
                  <div className="flex justify-between"><span className="text-dim">Max</span><span className="mono text-green">{formatINR(c.maxTotal)}</span></div>
                  <div className="flex justify-between"><span className="text-dim">Entries</span><span className="text-mid">{c.totalEntries}</span></div>
                </div>
              </div>
            ))}
          </div>

          {/* Avg Total bars */}
          <div className="card card-padded">
            <div className="section-title">Average Total Compensation</div>
            <div className="space-y-1">
              {comparison.map((c, i) => (
                <div key={c.id} className="cbar">
                  <div className="cbar-label">{c.name}</div>
                  <div className="cbar-track">
                    <div className={`cbar-fill ${COLORS[i]}`} style={{ width: `${(c.avgTotal / maxTotal) * 100}%` }}>
                      {formatINR(c.avgTotal)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comp split table */}
          <div className="card overflow-hidden">
            <div className="px-6 py-3" style={{ borderBottom: '1px solid var(--border-default)' }}>
              <div className="section-title mb-0">Compensation Split</div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Component</th>
                  {comparison.map((c) => <th key={c.id}>{c.name}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr><td className="text-foreground font-medium">Base</td>{comparison.map((c) => <td key={c.id} className="mono">{formatINR(c.avgBase)}</td>)}</tr>
                <tr><td className="text-foreground font-medium">Bonus</td>{comparison.map((c) => <td key={c.id} className="mono">{formatINR(c.avgBonus)}</td>)}</tr>
                <tr><td className="text-foreground font-medium">Stock</td>{comparison.map((c) => <td key={c.id} className="mono">{formatINR(c.avgStock)}</td>)}</tr>
                <tr><td className="text-foreground font-semibold">Total</td>{comparison.map((c) => <td key={c.id} className="mono font-semibold text-accent">{formatINR(c.avgTotal)}</td>)}</tr>
              </tbody>
            </table>
          </div>

          {/* Role comparison */}
          <div className="card overflow-hidden">
            <div className="px-6 py-3" style={{ borderBottom: '1px solid var(--border-default)' }}>
              <div className="section-title mb-0">By Role</div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Role</th>
                  {comparison.map((c) => <th key={c.id}>{c.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const allRoles = new Set<string>()
                  comparison.forEach((c) => c.byRole.forEach((r) => allRoles.add(r.role)))
                  return Array.from(allRoles).map((role) => (
                    <tr key={role}>
                      <td className="text-foreground font-medium">{role}</td>
                      {comparison.map((c) => {
                        const r = c.byRole.find((x) => x.role === role)
                        return <td key={c.id} className="mono">{r ? formatINR(r.avg) : <span className="text-dim">—</span>}</td>
                      })}
                    </tr>
                  ))
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="page-container py-10"><div className="skeleton" style={{ height: 400 }} /></div>}>
      <CompareContent />
    </Suspense>
  )
}
