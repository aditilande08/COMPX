import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CompX — Compensation Intelligence",
  description: "Explore, compare, and analyze tech compensation data across top companies in India.",
};

function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(9, 9, 11, 0.8)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border-default)',
      }}
    >
      <div className="page-container flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="20" height="20" rx="4" fill="#3b82f6" />
            <path d="M7 12L10.5 15.5L17 8.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            CompX
          </span>
        </Link>

        <div className="flex items-center gap-0.5">
          <Link href="/" className="nav-link">Overview</Link>
          <Link href="/salaries" className="nav-link">Salaries</Link>
          <Link href="/levels" className="nav-link">Levels</Link>
          <Link href="/companies" className="nav-link">Companies</Link>
          <Link href="/compare" className="nav-link">Compare</Link>
          <Link href="/insights" className="nav-link">Insights</Link>
          <Link href="/submit" className="nav-link" style={{ color: 'var(--accent-blue)' }}>+ Submit</Link>
        </div>
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer
          className="py-5 text-center text-xs"
          style={{ color: 'var(--text-tertiary)', borderTop: '1px solid var(--border-default)' }}
        >
          CompX · Built with Next.js, Prisma, PostgreSQL
        </footer>
      </body>
    </html>
  );
}
