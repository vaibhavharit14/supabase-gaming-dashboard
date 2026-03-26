'use client'

import Link from 'next/link'
import { Trophy } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function Navbar() {
  const pathname = usePathname()
  
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    return null
  }

  const isLandingPage = pathname === '/'


  return (
    <nav className="glass sticky top-0 z-50 flex items-center justify-between py-4 px-8 mt-6 mx-4 md:mx-auto max-w-[1200px]">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-[var(--accent-gold)] to-[var(--accent-teal)] rounded-lg flex items-center justify-center">
          <Trophy className="text-black w-5 h-5" />
        </div>
        <span className="text-xl font-bold tracking-tight">DIGITAL<span className="text-[var(--accent-gold)]">HEROES</span></span>
      </Link>
      
      {isLandingPage && (
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-muted)]">
          <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
          <Link href="#charities" className="hover:text-white transition-colors">Charities</Link>
          <Link href="#prizes" className="hover:text-white transition-colors">Prize Pools</Link>
        </div>
      )}

      <div className="flex items-center gap-4">
        {pathname !== '/login' && (
          <Link href="/login" className="text-sm font-medium hover:text-[var(--accent-gold)] transition-colors">Sign In</Link>
        )}
        <Link href="/subscribe" className="premium-btn text-sm">Join the Club</Link>
      </div>
    </nav>
  )
}
