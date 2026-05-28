// Format INR currency
export function formatINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`
  }
  return `₹${amount.toLocaleString('en-IN')}`
}

// Format full INR amount
export function formatINRFull(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`
}

// Calculate total compensation
export function totalComp(base: number, bonus: number, stock: number): number {
  return base + bonus + stock
}

// Get initials from company name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Color palette for companies
const COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-purple-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-yellow-500', 'bg-indigo-500',
  'bg-pink-500', 'bg-teal-500', 'bg-red-500', 'bg-lime-500',
]

export function getCompanyColor(index: number): string {
  return COLORS[index % COLORS.length]
}

// Severity badge for insights
export function getSeverityClass(type: 'high' | 'medium' | 'low'): string {
  switch (type) {
    case 'high': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    case 'medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    case 'low': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
  }
}
