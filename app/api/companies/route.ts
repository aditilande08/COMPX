import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const companies = await prisma.company.findMany({
    include: {
      _count: { select: { salaries: true } },
      salaries: { select: { base: true, bonus: true, stock: true } },
    },
    orderBy: { name: 'asc' },
  })

  const result = companies.map((c) => {
    const avgBase = c.salaries.length > 0
      ? Math.round(c.salaries.reduce((sum, s) => sum + s.base, 0) / c.salaries.length)
      : 0
    const avgTotal = c.salaries.length > 0
      ? Math.round(c.salaries.reduce((sum, s) => sum + s.base + s.bonus + s.stock, 0) / c.salaries.length)
      : 0
    return {
      id: c.id,
      name: c.name,
      industry: c.industry,
      hq: c.hq,
      size: c.size,
      _count: c._count,
      avgBase,
      avgTotal,
    }
  })

  return NextResponse.json(result)
}
