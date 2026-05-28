import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const company = searchParams.get('company')
  const role = searchParams.get('role')
  const location = searchParams.get('location')
  const level = searchParams.get('level')
  const sort = searchParams.get('sort') || 'base'
  const order = searchParams.get('order') || 'desc'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const where: Record<string, unknown> = {}
  if (company) where.company = { name: { contains: company, mode: 'insensitive' } }
  if (role) where.role = { contains: role, mode: 'insensitive' }
  if (location) where.location = { contains: location, mode: 'insensitive' }
  if (level) where.level = { contains: level, mode: 'insensitive' }

  const [salaries, total] = await Promise.all([
    prisma.salary.findMany({
      where,
      include: { company: { select: { id: true, name: true, industry: true } } },
      orderBy: { [sort]: order },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.salary.count({ where }),
  ])

  return NextResponse.json({
    data: salaries,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}
