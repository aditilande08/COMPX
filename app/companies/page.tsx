import { prisma } from '@/lib/prisma'
import { formatINR } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const IND_CLASS: Record<string, string> = {
  Technology: 'ind-tech',
  'E-Commerce': 'ind-ecom',
  'Food Tech': 'ind-food',
  Finance: 'ind-fin',
  Fintech: 'ind-fintech',
}

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({
    include: {
      _count: { select: { salaries: true } },
      salaries: { select: { base: true, bonus: true, stock: true } },
    },
    orderBy: { name: 'asc' },
  })

  const enriched = companies.map((c) => {
    const avgBase = c.salaries.length > 0 ? Math.round(c.salaries.reduce((s, x) => s + x.base, 0) / c.salaries.length) : 0
    const avgTotal = c.salaries.length > 0 ? Math.round(c.salaries.reduce((s, x) => s + x.base + x.bonus + x.stock, 0) / c.salaries.length) : 0
    return { ...c, avgBase, avgTotal }
  })

  return (
    <div className="page-container py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Companies</h1>
        <p className="text-sm text-dim">{companies.length} companies tracked</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {enriched.map((c) => (
          <Link key={c.id} href={`/companies/${c.id}`} className="card card-padded card-hover no-underline text-foreground block">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-base font-semibold mb-1.5">{c.name}</div>
                <span className={`tag ${IND_CLASS[c.industry] || 'tag-neutral'}`}>{c.industry}</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold mono text-accent">{formatINR(c.avgTotal)}</div>
                <div className="text-xs text-dim">avg CTC</div>
              </div>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-dim">Avg Base</span><span className="mono text-mid">{formatINR(c.avgBase)}</span></div>
              <div className="flex justify-between"><span className="text-dim">Entries</span><span className="text-mid">{c._count.salaries}</span></div>
              <div className="flex justify-between"><span className="text-dim">HQ</span><span className="text-mid">{c.hq || '—'}</span></div>
              <div className="flex justify-between"><span className="text-dim">Size</span><span className="text-mid">{c.size || '—'}</span></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
