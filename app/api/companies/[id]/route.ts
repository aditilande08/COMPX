import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const companyId = parseInt(id)

  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      salaries: {
        orderBy: { base: 'desc' },
      },
    },
  })

  if (!company) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 })
  }

  return NextResponse.json(company)
}
