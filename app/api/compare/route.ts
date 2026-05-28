import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const idsParam = searchParams.get('ids')

  if (!idsParam) {
    return NextResponse.json({ error: 'Provide company ids as comma-separated values' }, { status: 400 })
  }

  const ids = idsParam.split(',').map((id) => parseInt(id.trim())).filter((id) => !isNaN(id))

  if (ids.length < 2) {
    return NextResponse.json({ error: 'Need at least 2 company IDs to compare' }, { status: 400 })
  }

  const companies = await prisma.company.findMany({
    where: { id: { in: ids } },
    include: {
      salaries: {
        orderBy: { base: 'desc' },
      },
    },
  })

  const comparison = companies.map((c) => {
    const sals = c.salaries
    const avgBase = sals.length > 0 ? Math.round(sals.reduce((s, x) => s + x.base, 0) / sals.length) : 0
    const avgBonus = sals.length > 0 ? Math.round(sals.reduce((s, x) => s + x.bonus, 0) / sals.length) : 0
    const avgStock = sals.length > 0 ? Math.round(sals.reduce((s, x) => s + x.stock, 0) / sals.length) : 0
    const avgTotal = avgBase + avgBonus + avgStock
    const maxTotal = sals.length > 0 ? Math.max(...sals.map((x) => x.base + x.bonus + x.stock)) : 0
    const minTotal = sals.length > 0 ? Math.min(...sals.map((x) => x.base + x.bonus + x.stock)) : 0

    // Group by role
    const roleMap = new Map<string, { total: number; count: number }>()
    for (const s of sals) {
      const r = roleMap.get(s.role) || { total: 0, count: 0 }
      r.total += s.base + s.bonus + s.stock
      r.count++
      roleMap.set(s.role, r)
    }
    const byRole = Array.from(roleMap.entries()).map(([role, data]) => ({
      role,
      avg: Math.round(data.total / data.count),
      count: data.count,
    }))

    return {
      id: c.id,
      name: c.name,
      industry: c.industry,
      hq: c.hq,
      size: c.size,
      totalEntries: sals.length,
      avgBase,
      avgBonus,
      avgStock,
      avgTotal,
      maxTotal,
      minTotal,
      byRole,
    }
  })

  return NextResponse.json(comparison)
}
