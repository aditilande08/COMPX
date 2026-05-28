import { prisma } from '@/lib/prisma'
import { formatINR } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company = await prisma.company.findUnique({
    where: { id: parseInt(id) },
    include: { salaries: { orderBy: { base: 'desc' } } },
  })
  if (!company) notFound()

  const sals = company.salaries
  const avgBase = sals.length > 0 ? Math.round(sals.reduce((s, x) => s + x.base, 0) / sals.length) : 0
  const avgTotal = sals.length > 0 ? Math.round(sals.reduce((s, x) => s + x.base + x.bonus + x.stock, 0) / sals.length) : 0
  const maxTotal = sals.length > 0 ? Math.max(...sals.map((x) => x.base + x.bonus + x.stock)) : 0
  const minTotal = sals.length > 0 ? Math.min(...sals.map((x) => x.base + x.bonus + x.stock)) : 0

  // Level breakdown
  const levelMap = new Map<string, number[]>()
  for (const s of sals) {
    const arr = levelMap.get(s.level) || []
    arr.push(s.base + s.bonus + s.stock)
    levelMap.set(s.level, arr)
  }
  const levels = Array.from(levelMap.entries())
    .map(([level, totals]) => ({ level, avg: Math.round(totals.reduce((a, b) => a + b, 0) / totals.length), count: totals.length }))
    .sort((a, b) => a.avg - b.avg)
  const maxLvl = levels[levels.length - 1]?.avg || 1

  // Role breakdown
  const roleMap = new Map<string, { totals: number[] }>()
  for (const s of sals) {
    const entry = roleMap.get(s.role) || { totals: [] }
    entry.totals.push(s.base + s.bonus + s.stock)
    roleMap.set(s.role, entry)
  }
  const roles = Array.from(roleMap.entries())
    .map(([role, d]) => ({ role, avg: Math.round(d.totals.reduce((a, b) => a + b, 0) / d.totals.length), count: d.totals.length }))
    .sort((a, b) => b.avg - a.avg)

  return (
    <div className="page-container py-10">
      <div className="text-xs text-dim mb-5">
        <Link href="/companies" className="hover:text-accent no-underline text-dim">Companies</Link>
        <span className="mx-2">/</span>
        <span className="text-mid">{company.name}</span>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">{company.name}</h1>
          <div className="flex items-center gap-2 text-sm text-dim">
            <span>{company.industry}</span>
            {company.hq && <><span>·</span><span>{company.hq}</span></>}
            {company.size && <><span>·</span><span>{company.size}</span></>}
            {company.website && (
              <>
                <span>·</span>
                <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline no-underline">{company.website}</a>
              </>
            )}
          </div>
        </div>
        <Link href={`/compare?ids=${company.id}`} className="btn btn-outline no-underline">Compare</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        <div className="card stat-block"><div className="stat-label">Entries</div><div className="stat-value">{sals.length}</div></div>
        <div className="card stat-block"><div className="stat-label">Avg Base</div><div className="stat-value mono">{formatINR(avgBase)}</div></div>
        <div className="card stat-block"><div className="stat-label">Avg CTC</div><div className="stat-value mono text-accent">{formatINR(avgTotal)}</div></div>
        <div className="card stat-block"><div className="stat-label">Max CTC</div><div className="stat-value mono text-green">{formatINR(maxTotal)}</div></div>
        <div className="card stat-block"><div className="stat-label">Min CTC</div><div className="stat-value mono">{formatINR(minTotal)}</div></div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Level Progression */}
        <div className="card card-padded">
          <div className="section-title">Level Progression</div>
          <div className="space-y-3">
            {levels.map((l) => (
              <div key={l.level}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{l.level} <span className="text-dim text-xs">({l.count})</span></span>
                  <span className="text-sm font-semibold mono text-accent">{formatINR(l.avg)}</span>
                </div>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${(l.avg / maxLvl) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        {/* Role Breakdown */}
        <div className="card card-padded">
          <div className="section-title">By Role</div>
          <div className="space-y-2">
            {roles.map((r) => (
              <div key={r.role} className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <div className="text-sm font-medium">{r.role}</div>
                  <div className="text-xs text-dim">{r.count} {r.count === 1 ? 'entry' : 'entries'}</div>
                </div>
                <span className="text-sm font-semibold mono text-accent">{formatINR(r.avg)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Salary table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-3" style={{ borderBottom: '1px solid var(--border-default)' }}>
          <div className="section-title mb-0">All Entries</div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Role</th><th>Level</th><th>Location</th>
              <th>Base</th><th>Bonus</th><th>Stock</th>
              <th>Total</th><th>YoE</th><th></th>
            </tr>
          </thead>
          <tbody>
            {sals.map((s) => (
              <tr key={s.id}>
                <td className="text-foreground font-medium">{s.role}</td>
                <td><span className="tag tag-neutral">{s.level}</span></td>
                <td>{s.location}</td>
                <td className="mono">{formatINR(s.base)}</td>
                <td className="mono">{formatINR(s.bonus)}</td>
                <td className="mono">{formatINR(s.stock)}</td>
                <td className="mono font-semibold text-foreground">{formatINR(s.base + s.bonus + s.stock)}</td>
                <td className="text-center">{s.yoe}</td>
                <td>{s.verified ? <span className="tag tag-green">✓</span> : <span className="tag tag-amber">?</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
