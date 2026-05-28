import { prisma } from '@/lib/prisma'
import { formatINR } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [totalSalaries, totalCompanies, salaries, companies] = await Promise.all([
    prisma.salary.count(),
    prisma.company.count(),
    prisma.salary.findMany({
      include: { company: { select: { name: true } } },
      orderBy: { base: 'desc' },
      take: 6,
    }),
    prisma.company.findMany({
      include: { salaries: { select: { base: true, bonus: true, stock: true } } },
      orderBy: { name: 'asc' },
    }),
  ])

  const allSalaries = await prisma.salary.findMany()
  const avgTotal = allSalaries.length > 0
    ? Math.round(allSalaries.reduce((s, x) => s + x.base + x.bonus + x.stock, 0) / allSalaries.length)
    : 0
  const maxTotal = allSalaries.length > 0
    ? Math.max(...allSalaries.map((x) => x.base + x.bonus + x.stock))
    : 0
  const locations = new Set(allSalaries.map((s) => s.location))

  const topCompanies = companies
    .map((c) => ({
      id: c.id,
      name: c.name,
      count: c.salaries.length,
      avgTotal: c.salaries.length > 0
        ? Math.round(c.salaries.reduce((s, x) => s + x.base + x.bonus + x.stock, 0) / c.salaries.length)
        : 0,
    }))
    .sort((a, b) => b.avgTotal - a.avgTotal)
    .slice(0, 8)

  const maxAvg = topCompanies[0]?.avgTotal || 1

  return (
    <div className="page-container py-10">
      {/* Header — clean, no gradient */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Compensation Overview</h1>
        <p className="text-sm text-dim">
          {totalSalaries} salary entries across {totalCompanies} companies · {locations.size} cities
        </p>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-4 gap-3 mb-10">
        <div className="card stat-block">
          <div className="stat-label">Total Entries</div>
          <div className="stat-value">{totalSalaries}</div>
        </div>
        <div className="card stat-block">
          <div className="stat-label">Companies</div>
          <div className="stat-value">{totalCompanies}</div>
        </div>
        <div className="card stat-block">
          <div className="stat-label">Avg Total CTC</div>
          <div className="stat-value text-accent">{formatINR(avgTotal)}</div>
        </div>
        <div className="card stat-block">
          <div className="stat-label">Highest CTC</div>
          <div className="stat-value text-green">{formatINR(maxTotal)}</div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Left — Top companies */}
        <div className="col-span-3 card card-padded">
          <div className="flex items-center justify-between mb-5">
            <div className="section-title mb-0">Top Paying Companies</div>
            <Link href="/companies" className="text-xs text-accent hover:underline no-underline">View all →</Link>
          </div>
          <div className="space-y-4">
            {topCompanies.map((c, i) => (
              <div key={c.id}>
                <div className="flex items-center justify-between mb-1">
                  <Link
                    href={`/companies/${c.id}`}
                    className="text-sm font-medium text-foreground hover:text-accent no-underline transition-colors"
                  >
                    <span className="text-dim mr-2 mono text-xs">{String(i + 1).padStart(2, '0')}</span>
                    {c.name}
                  </Link>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-dim">{c.count} entries</span>
                    <span className="text-sm font-semibold mono text-accent">{formatINR(c.avgTotal)}</span>
                  </div>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${(c.avgTotal / maxAvg) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Highest offers */}
        <div className="col-span-2 card card-padded">
          <div className="flex items-center justify-between mb-5">
            <div className="section-title mb-0">Top Offers</div>
            <Link href="/salaries" className="text-xs text-accent hover:underline no-underline">Explore →</Link>
          </div>
          <div className="space-y-1">
            {salaries.map((s, i) => (
              <div
                key={s.id}
                className="flex items-center justify-between py-3"
                style={{ borderBottom: i < salaries.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
              >
                <div>
                  <div className="text-sm font-medium">{s.role}</div>
                  <div className="text-xs text-dim">
                    {s.company.name} · {s.level} · {s.location}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold mono text-accent">
                    {formatINR(s.base + s.bonus + s.stock)}
                  </div>
                  <div className="text-xs text-dim">{s.yoe} YoE</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick nav */}
      <div className="mt-8 flex gap-3">
        <Link href="/salaries" className="btn btn-primary no-underline">
          Browse Salaries
        </Link>
        <Link href="/compare" className="btn btn-outline no-underline">
          Compare Companies
        </Link>
        <Link href="/insights" className="btn btn-outline no-underline">
          View Insights
        </Link>
      </div>
    </div>
  )
}
