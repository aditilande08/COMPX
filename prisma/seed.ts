import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.levelMapping.deleteMany()
  await prisma.salary.deleteMany()
  await prisma.company.deleteMany()

  // ── Companies ──
  const companies = [
    { name: 'Google', industry: 'Technology', website: 'google.com', hq: 'Mountain View, CA', size: '150,000+' },
    { name: 'Microsoft', industry: 'Technology', website: 'microsoft.com', hq: 'Redmond, WA', size: '220,000+' },
    { name: 'Amazon', industry: 'E-Commerce', website: 'amazon.com', hq: 'Seattle, WA', size: '1,500,000+' },
    { name: 'Meta', industry: 'Technology', website: 'meta.com', hq: 'Menlo Park, CA', size: '70,000+' },
    { name: 'Apple', industry: 'Technology', website: 'apple.com', hq: 'Cupertino, CA', size: '160,000+' },
    { name: 'Flipkart', industry: 'E-Commerce', website: 'flipkart.com', hq: 'Bangalore, KA', size: '30,000+' },
    { name: 'Swiggy', industry: 'Food Tech', website: 'swiggy.com', hq: 'Bangalore, KA', size: '5,000+' },
    { name: 'Razorpay', industry: 'Fintech', website: 'razorpay.com', hq: 'Bangalore, KA', size: '3,000+' },
    { name: 'PhonePe', industry: 'Fintech', website: 'phonepe.com', hq: 'Bangalore, KA', size: '6,000+' },
    { name: 'Atlassian', industry: 'Technology', website: 'atlassian.com', hq: 'Sydney, AU', size: '10,000+' },
    { name: 'Adobe', industry: 'Technology', website: 'adobe.com', hq: 'San Jose, CA', size: '30,000+' },
    { name: 'Goldman Sachs', industry: 'Finance', website: 'goldmansachs.com', hq: 'New York, NY', size: '45,000+' },
  ]

  const companyMap: Record<string, number> = {}
  for (const c of companies) {
    const created = await prisma.company.create({ data: c })
    companyMap[c.name] = created.id
  }

  // ── Level Mappings (the core differentiator) ──
  // normalizedLevel: 1=Intern, 2=New Grad, 3=Junior, 4=Mid, 5=Senior, 6=Staff, 7=Principal, 8=Distinguished
  const levelMappings = [
    // Google
    { companyId: companyMap['Google'], companyLevel: 'L3', normalizedLevel: 3, title: 'Software Engineer II', seniorityLabel: 'Junior' },
    { companyId: companyMap['Google'], companyLevel: 'L4', normalizedLevel: 4, title: 'Software Engineer III', seniorityLabel: 'Mid' },
    { companyId: companyMap['Google'], companyLevel: 'L5', normalizedLevel: 5, title: 'Senior Software Engineer', seniorityLabel: 'Senior' },
    { companyId: companyMap['Google'], companyLevel: 'L6', normalizedLevel: 6, title: 'Staff Software Engineer', seniorityLabel: 'Staff' },
    { companyId: companyMap['Google'], companyLevel: 'L7', normalizedLevel: 7, title: 'Principal Engineer', seniorityLabel: 'Principal' },

    // Microsoft
    { companyId: companyMap['Microsoft'], companyLevel: 'SDE1 (59)', normalizedLevel: 3, title: 'Software Engineer', seniorityLabel: 'Junior' },
    { companyId: companyMap['Microsoft'], companyLevel: 'SDE2 (61)', normalizedLevel: 4, title: 'Software Engineer II', seniorityLabel: 'Mid' },
    { companyId: companyMap['Microsoft'], companyLevel: 'Senior (63)', normalizedLevel: 5, title: 'Senior Software Engineer', seniorityLabel: 'Senior' },
    { companyId: companyMap['Microsoft'], companyLevel: 'Principal (65)', normalizedLevel: 6, title: 'Principal Software Engineer', seniorityLabel: 'Staff' },
    { companyId: companyMap['Microsoft'], companyLevel: 'Partner (67)', normalizedLevel: 7, title: 'Partner Software Engineer', seniorityLabel: 'Principal' },

    // Amazon
    { companyId: companyMap['Amazon'], companyLevel: 'SDE1 (L4)', normalizedLevel: 3, title: 'SDE I', seniorityLabel: 'Junior' },
    { companyId: companyMap['Amazon'], companyLevel: 'SDE2 (L5)', normalizedLevel: 4, title: 'SDE II', seniorityLabel: 'Mid' },
    { companyId: companyMap['Amazon'], companyLevel: 'SDE3 (L6)', normalizedLevel: 5, title: 'Senior SDE', seniorityLabel: 'Senior' },
    { companyId: companyMap['Amazon'], companyLevel: 'Principal (L7)', normalizedLevel: 6, title: 'Principal SDE', seniorityLabel: 'Staff' },

    // Meta
    { companyId: companyMap['Meta'], companyLevel: 'E3', normalizedLevel: 3, title: 'Software Engineer', seniorityLabel: 'Junior' },
    { companyId: companyMap['Meta'], companyLevel: 'E4', normalizedLevel: 4, title: 'Software Engineer', seniorityLabel: 'Mid' },
    { companyId: companyMap['Meta'], companyLevel: 'E5', normalizedLevel: 5, title: 'Senior Software Engineer', seniorityLabel: 'Senior' },
    { companyId: companyMap['Meta'], companyLevel: 'E6', normalizedLevel: 6, title: 'Staff Software Engineer', seniorityLabel: 'Staff' },
    { companyId: companyMap['Meta'], companyLevel: 'E7', normalizedLevel: 7, title: 'Principal Engineer', seniorityLabel: 'Principal' },

    // Apple
    { companyId: companyMap['Apple'], companyLevel: 'ICT2', normalizedLevel: 3, title: 'Software Engineer', seniorityLabel: 'Junior' },
    { companyId: companyMap['Apple'], companyLevel: 'ICT3', normalizedLevel: 4, title: 'Software Engineer', seniorityLabel: 'Mid' },
    { companyId: companyMap['Apple'], companyLevel: 'ICT4', normalizedLevel: 5, title: 'Senior Software Engineer', seniorityLabel: 'Senior' },
    { companyId: companyMap['Apple'], companyLevel: 'ICT5', normalizedLevel: 6, title: 'Staff Engineer', seniorityLabel: 'Staff' },

    // Flipkart
    { companyId: companyMap['Flipkart'], companyLevel: 'SDE1', normalizedLevel: 3, title: 'Software Development Engineer I', seniorityLabel: 'Junior' },
    { companyId: companyMap['Flipkart'], companyLevel: 'SDE2', normalizedLevel: 4, title: 'Software Development Engineer II', seniorityLabel: 'Mid' },
    { companyId: companyMap['Flipkart'], companyLevel: 'SDE3', normalizedLevel: 5, title: 'Senior SDE', seniorityLabel: 'Senior' },

    // Swiggy
    { companyId: companyMap['Swiggy'], companyLevel: 'L3', normalizedLevel: 3, title: 'Software Engineer', seniorityLabel: 'Junior' },
    { companyId: companyMap['Swiggy'], companyLevel: 'L4', normalizedLevel: 4, title: 'Senior Engineer', seniorityLabel: 'Mid' },
    { companyId: companyMap['Swiggy'], companyLevel: 'L5', normalizedLevel: 5, title: 'Staff Engineer', seniorityLabel: 'Senior' },

    // Razorpay
    { companyId: companyMap['Razorpay'], companyLevel: 'SDE1', normalizedLevel: 3, title: 'Software Engineer', seniorityLabel: 'Junior' },
    { companyId: companyMap['Razorpay'], companyLevel: 'SDE2', normalizedLevel: 4, title: 'Senior Software Engineer', seniorityLabel: 'Mid' },
    { companyId: companyMap['Razorpay'], companyLevel: 'SDE3', normalizedLevel: 5, title: 'Staff Engineer', seniorityLabel: 'Senior' },

    // PhonePe
    { companyId: companyMap['PhonePe'], companyLevel: 'SDE1', normalizedLevel: 3, title: 'Software Engineer', seniorityLabel: 'Junior' },
    { companyId: companyMap['PhonePe'], companyLevel: 'SDE2', normalizedLevel: 4, title: 'Senior Software Engineer', seniorityLabel: 'Mid' },
    { companyId: companyMap['PhonePe'], companyLevel: 'Senior', normalizedLevel: 5, title: 'Senior Engineer', seniorityLabel: 'Senior' },

    // Atlassian
    { companyId: companyMap['Atlassian'], companyLevel: 'P3', normalizedLevel: 3, title: 'Software Engineer', seniorityLabel: 'Junior' },
    { companyId: companyMap['Atlassian'], companyLevel: 'P4', normalizedLevel: 4, title: 'Senior Software Engineer', seniorityLabel: 'Mid' },
    { companyId: companyMap['Atlassian'], companyLevel: 'P5', normalizedLevel: 5, title: 'Principal Engineer', seniorityLabel: 'Senior' },

    // Adobe
    { companyId: companyMap['Adobe'], companyLevel: 'MTS1', normalizedLevel: 3, title: 'Member of Technical Staff', seniorityLabel: 'Junior' },
    { companyId: companyMap['Adobe'], companyLevel: 'MTS2', normalizedLevel: 4, title: 'Member of Technical Staff II', seniorityLabel: 'Mid' },
    { companyId: companyMap['Adobe'], companyLevel: 'SMTS', normalizedLevel: 5, title: 'Senior MTS', seniorityLabel: 'Senior' },

    // Goldman Sachs
    { companyId: companyMap['Goldman Sachs'], companyLevel: 'Analyst', normalizedLevel: 3, title: 'Analyst', seniorityLabel: 'Junior' },
    { companyId: companyMap['Goldman Sachs'], companyLevel: 'Associate', normalizedLevel: 4, title: 'Associate', seniorityLabel: 'Mid' },
    { companyId: companyMap['Goldman Sachs'], companyLevel: 'VP', normalizedLevel: 5, title: 'Vice President', seniorityLabel: 'Senior' },
    { companyId: companyMap['Goldman Sachs'], companyLevel: 'ED', normalizedLevel: 6, title: 'Executive Director', seniorityLabel: 'Staff' },
  ]

  for (const lm of levelMappings) {
    await prisma.levelMapping.create({ data: lm })
  }

  // ── Salaries ──
  // Using companyLevel values that match the level mappings for proper joins
  const salaries = [
    // Google
    { companyId: companyMap['Google'], role: 'Software Engineer', level: 'L3', location: 'Bangalore', base: 2200000, bonus: 400000, stock: 1000000, yoe: 1, verified: true },
    { companyId: companyMap['Google'], role: 'Software Engineer', level: 'L3', location: 'Hyderabad', base: 2100000, bonus: 380000, stock: 950000, yoe: 2, verified: true },
    { companyId: companyMap['Google'], role: 'Software Engineer', level: 'L4', location: 'Bangalore', base: 3500000, bonus: 700000, stock: 2000000, yoe: 4, verified: true },
    { companyId: companyMap['Google'], role: 'Software Engineer', level: 'L5', location: 'Hyderabad', base: 5000000, bonus: 1200000, stock: 4000000, yoe: 7, verified: true },
    { companyId: companyMap['Google'], role: 'Software Engineer', level: 'L6', location: 'Bangalore', base: 7500000, bonus: 2000000, stock: 8000000, yoe: 12, verified: false },
    { companyId: companyMap['Google'], role: 'Data Scientist', level: 'L4', location: 'Bangalore', base: 3800000, bonus: 750000, stock: 2200000, yoe: 5, verified: true },
    { companyId: companyMap['Google'], role: 'Product Manager', level: 'L5', location: 'Bangalore', base: 5500000, bonus: 1500000, stock: 4500000, yoe: 8, verified: true },
    { companyId: companyMap['Google'], role: 'DevOps Engineer', level: 'L3', location: 'Hyderabad', base: 2300000, bonus: 420000, stock: 1100000, yoe: 2, verified: false },

    // Microsoft
    { companyId: companyMap['Microsoft'], role: 'Software Engineer', level: 'SDE1 (59)', location: 'Hyderabad', base: 2000000, bonus: 300000, stock: 800000, yoe: 0, verified: true },
    { companyId: companyMap['Microsoft'], role: 'Software Engineer', level: 'SDE1 (59)', location: 'Bangalore', base: 2100000, bonus: 320000, stock: 850000, yoe: 1, verified: true },
    { companyId: companyMap['Microsoft'], role: 'Software Engineer', level: 'SDE2 (61)', location: 'Hyderabad', base: 3200000, bonus: 600000, stock: 1500000, yoe: 4, verified: true },
    { companyId: companyMap['Microsoft'], role: 'Software Engineer', level: 'Senior (63)', location: 'Bangalore', base: 4800000, bonus: 1000000, stock: 3000000, yoe: 8, verified: true },
    { companyId: companyMap['Microsoft'], role: 'Program Manager', level: 'SDE2 (61)', location: 'Bangalore', base: 2800000, bonus: 500000, stock: 1200000, yoe: 3, verified: true },
    { companyId: companyMap['Microsoft'], role: 'Data Scientist', level: 'SDE2 (61)', location: 'Hyderabad', base: 3400000, bonus: 650000, stock: 1600000, yoe: 5, verified: false },
    { companyId: companyMap['Microsoft'], role: 'DevOps Engineer', level: 'SDE1 (59)', location: 'Noida', base: 1900000, bonus: 280000, stock: 750000, yoe: 1, verified: true },

    // Amazon
    { companyId: companyMap['Amazon'], role: 'Software Engineer', level: 'SDE1 (L4)', location: 'Bangalore', base: 1800000, bonus: 200000, stock: 600000, yoe: 0, verified: true },
    { companyId: companyMap['Amazon'], role: 'Software Engineer', level: 'SDE1 (L4)', location: 'Hyderabad', base: 1750000, bonus: 180000, stock: 550000, yoe: 1, verified: true },
    { companyId: companyMap['Amazon'], role: 'Software Engineer', level: 'SDE2 (L5)', location: 'Bangalore', base: 3000000, bonus: 400000, stock: 1200000, yoe: 4, verified: true },
    { companyId: companyMap['Amazon'], role: 'Software Engineer', level: 'SDE3 (L6)', location: 'Bangalore', base: 5200000, bonus: 1000000, stock: 3500000, yoe: 9, verified: true },
    { companyId: companyMap['Amazon'], role: 'Data Engineer', level: 'SDE1 (L4)', location: 'Hyderabad', base: 1900000, bonus: 250000, stock: 700000, yoe: 2, verified: true },
    { companyId: companyMap['Amazon'], role: 'Product Manager', level: 'SDE2 (L5)', location: 'Bangalore', base: 2800000, bonus: 500000, stock: 1000000, yoe: 4, verified: false },

    // Meta
    { companyId: companyMap['Meta'], role: 'Software Engineer', level: 'E3', location: 'Hyderabad', base: 2400000, bonus: 500000, stock: 1500000, yoe: 0, verified: true },
    { companyId: companyMap['Meta'], role: 'Software Engineer', level: 'E4', location: 'Hyderabad', base: 3800000, bonus: 800000, stock: 2800000, yoe: 4, verified: true },
    { companyId: companyMap['Meta'], role: 'Software Engineer', level: 'E5', location: 'Hyderabad', base: 5500000, bonus: 1400000, stock: 5000000, yoe: 8, verified: true },

    // Apple
    { companyId: companyMap['Apple'], role: 'Software Engineer', level: 'ICT2', location: 'Hyderabad', base: 2200000, bonus: 350000, stock: 1200000, yoe: 1, verified: true },
    { companyId: companyMap['Apple'], role: 'Software Engineer', level: 'ICT3', location: 'Bangalore', base: 3600000, bonus: 600000, stock: 2200000, yoe: 4, verified: true },
    { companyId: companyMap['Apple'], role: 'Software Engineer', level: 'ICT4', location: 'Hyderabad', base: 5200000, bonus: 1000000, stock: 4000000, yoe: 8, verified: false },

    // Flipkart
    { companyId: companyMap['Flipkart'], role: 'Software Engineer', level: 'SDE1', location: 'Bangalore', base: 1600000, bonus: 150000, stock: 400000, yoe: 0, verified: true },
    { companyId: companyMap['Flipkart'], role: 'Software Engineer', level: 'SDE2', location: 'Bangalore', base: 2800000, bonus: 350000, stock: 900000, yoe: 3, verified: true },
    { companyId: companyMap['Flipkart'], role: 'Software Engineer', level: 'SDE3', location: 'Bangalore', base: 4200000, bonus: 700000, stock: 2000000, yoe: 7, verified: true },
    { companyId: companyMap['Flipkart'], role: 'Data Scientist', level: 'SDE1', location: 'Bangalore', base: 1800000, bonus: 200000, stock: 500000, yoe: 1, verified: false },

    // Swiggy
    { companyId: companyMap['Swiggy'], role: 'Software Engineer', level: 'L3', location: 'Bangalore', base: 1700000, bonus: 200000, stock: 500000, yoe: 1, verified: true },
    { companyId: companyMap['Swiggy'], role: 'Software Engineer', level: 'L4', location: 'Bangalore', base: 2600000, bonus: 350000, stock: 800000, yoe: 4, verified: true },
    { companyId: companyMap['Swiggy'], role: 'Data Scientist', level: 'L4', location: 'Bangalore', base: 2500000, bonus: 400000, stock: 800000, yoe: 4, verified: true },

    // Razorpay
    { companyId: companyMap['Razorpay'], role: 'Software Engineer', level: 'SDE1', location: 'Bangalore', base: 1500000, bonus: 150000, stock: 300000, yoe: 0, verified: true },
    { companyId: companyMap['Razorpay'], role: 'Software Engineer', level: 'SDE2', location: 'Bangalore', base: 2400000, bonus: 300000, stock: 600000, yoe: 3, verified: true },
    { companyId: companyMap['Razorpay'], role: 'Software Engineer', level: 'SDE3', location: 'Bangalore', base: 3800000, bonus: 500000, stock: 1200000, yoe: 6, verified: true },

    // PhonePe
    { companyId: companyMap['PhonePe'], role: 'Software Engineer', level: 'SDE1', location: 'Bangalore', base: 1600000, bonus: 160000, stock: 400000, yoe: 0, verified: true },
    { companyId: companyMap['PhonePe'], role: 'Software Engineer', level: 'SDE2', location: 'Bangalore', base: 2600000, bonus: 350000, stock: 800000, yoe: 3, verified: true },
    { companyId: companyMap['PhonePe'], role: 'Software Engineer', level: 'Senior', location: 'Bangalore', base: 4000000, bonus: 600000, stock: 1500000, yoe: 7, verified: true },

    // Atlassian
    { companyId: companyMap['Atlassian'], role: 'Software Engineer', level: 'P3', location: 'Bangalore', base: 2400000, bonus: 500000, stock: 1200000, yoe: 1, verified: true },
    { companyId: companyMap['Atlassian'], role: 'Software Engineer', level: 'P4', location: 'Bangalore', base: 3800000, bonus: 800000, stock: 2500000, yoe: 5, verified: true },
    { companyId: companyMap['Atlassian'], role: 'Software Engineer', level: 'P5', location: 'Bangalore', base: 5500000, bonus: 1200000, stock: 4000000, yoe: 9, verified: false },

    // Adobe
    { companyId: companyMap['Adobe'], role: 'Software Engineer', level: 'MTS1', location: 'Noida', base: 2000000, bonus: 350000, stock: 800000, yoe: 0, verified: true },
    { companyId: companyMap['Adobe'], role: 'Software Engineer', level: 'MTS2', location: 'Noida', base: 3200000, bonus: 600000, stock: 1500000, yoe: 4, verified: true },
    { companyId: companyMap['Adobe'], role: 'Software Engineer', level: 'SMTS', location: 'Bangalore', base: 4800000, bonus: 1000000, stock: 3000000, yoe: 8, verified: true },
    { companyId: companyMap['Adobe'], role: 'Data Scientist', level: 'MTS1', location: 'Noida', base: 2200000, bonus: 400000, stock: 900000, yoe: 1, verified: false },

    // Goldman Sachs
    { companyId: companyMap['Goldman Sachs'], role: 'Software Engineer', level: 'Analyst', location: 'Bangalore', base: 1800000, bonus: 400000, stock: 0, yoe: 0, verified: true },
    { companyId: companyMap['Goldman Sachs'], role: 'Software Engineer', level: 'Associate', location: 'Bangalore', base: 3200000, bonus: 800000, stock: 0, yoe: 4, verified: true },
    { companyId: companyMap['Goldman Sachs'], role: 'Software Engineer', level: 'VP', location: 'Bangalore', base: 5500000, bonus: 1500000, stock: 0, yoe: 10, verified: true },
    { companyId: companyMap['Goldman Sachs'], role: 'Data Scientist', level: 'Associate', location: 'Bangalore', base: 3500000, bonus: 900000, stock: 0, yoe: 5, verified: false },
  ]

  for (const s of salaries) {
    await prisma.salary.create({ data: s })
  }

  console.log(`✅ Seeded ${companies.length} companies, ${levelMappings.length} level mappings, ${salaries.length} salary entries`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())