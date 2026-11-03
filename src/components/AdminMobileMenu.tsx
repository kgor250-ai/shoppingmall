'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Shield,
  Menu,
  X,
  LayoutDashboard,
  Store,
  Users,
  UserCheck,
  ShoppingCart,
  IndianRupee,
  AlertCircle,
  FileBarChart,
  Building2,
  ExternalLink,
  LogOut,
} from 'lucide-react'
import { AureliaMonogram } from '@/components/aurelia/AureliaMonogram'

export function AdminMobileMenu({ session }: { session: { name?: string; email?: string } }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock background scrolling when menu drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Stores Directory', href: '/admin/stores', icon: Store },
    { name: 'Store Owners', href: '/admin/owners', icon: UserCheck },
    { name: 'Employees', href: '/admin/employees', icon: Users },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Categories', href: '/admin/categories', icon: ShoppingCart },
    { name: 'Mall 3D Layout', href: '/admin/layout-management', icon: Building2 },
    { name: 'Rent Management', href: '/admin/rent', icon: IndianRupee },
    { name: 'Reports & Sales', href: '/admin/reports', icon: FileBarChart },
    { name: 'Complaints', href: '/admin/complaints', icon: AlertCircle },
  ]

  const isItemActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const menuContent = open && mounted && (
    <div className="fixed inset-0 z-[99999] md:hidden flex">
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Solid Opaque Drawer */}
      <aside
        className="relative z-10 w-[82vw] max-w-xs h-[100dvh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.95)] animate-in slide-in-from-left duration-300 select-none"
        style={{
          backgroundColor: '#0d0c0a',
          backgroundImage: 'radial-gradient(ellipse at 50% 0%, #1c150c 0%, #0d0c0a 60%, #060504 100%)',
          borderRight: '1px solid rgba(212, 175, 55, 0.3)',
        }}
      >
        {/* Header */}
        <div
          className="h-16 flex items-center justify-between px-4 flex-shrink-0 bg-[#120f0a] border-b border-[#d4af37]/25"
        >
          <div className="flex items-center gap-3">
            <AureliaMonogram className="h-8 w-8" />
            <div>
              <div className="font-serif tracking-[0.25em] text-xs font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#fae8c8] via-[#e6ca85] to-[#c5a059]">
                AURELIA
              </div>
              <div className="text-[#c5a059]/90 text-[10px] tracking-widest uppercase">Admin Suite</div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-dark-scrollbar space-y-1">
          <p className="text-[10px] font-semibold text-[#d4af37]/80 uppercase tracking-widest px-3 mb-2 font-mono">
            Management Control
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const active = isItemActive(item.href)
              const Icon = item.icon

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      active
                        ? 'bg-gradient-to-r from-[#d4af37]/25 to-transparent text-[#fae8c8] font-bold border-l-3 border-[#d4af37] shadow-sm'
                        : 'text-stone-300 hover:text-stone-100 hover:bg-stone-850/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${active ? 'text-[#d4af37]' : 'text-stone-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {active && <span className="h-2 w-2 rounded-full bg-[#d4af37] animate-pulse" />}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="pt-4 px-1">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-stone-300 bg-stone-900 border border-[#d4af37]/30 hover:border-[#d4af37]/60 transition-all"
            >
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>View Public Mall</span>
              </span>
              <ExternalLink className="h-3 w-3 text-[#d4af37]" />
            </Link>
          </div>
        </nav>

        {/* Footer with Administrator Info & Direct Logout Button */}
        <div className="p-3.5 flex-shrink-0 bg-[#090807] border-t border-[#d4af37]/20 space-y-2.5">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl bg-white/[0.03]">
            <div className="h-8 w-8 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center flex-shrink-0">
              <Shield className="h-4 w-4 text-[#fae8c8]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-stone-200 truncate">
                {session?.name || 'Administrator'}
              </div>
              <div className="text-[10px] text-stone-400 truncate">{session?.email}</div>
            </div>
          </div>

          {/* Direct Mobile Logout Button */}
          <a
            href="/api/auth/logout"
            className="w-full py-2.5 px-3 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-200 hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </a>
        </div>
      </aside>
    </div>
  )

  return (
    <>
      <button
        className="md:hidden p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-stone-200 dark:border-stone-800 cursor-pointer"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mounted && typeof document !== 'undefined' && createPortal(menuContent, document.body)}
    </>
  )
}
