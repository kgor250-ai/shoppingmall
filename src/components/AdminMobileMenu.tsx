'use client'

import { useState } from 'react'
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
} from 'lucide-react'
import { AureliaMonogram } from '@/components/aurelia/AureliaMonogram'

export function AdminMobileMenu({ session }: { session: { name?: string; email?: string } }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Stores', href: '/admin/stores', icon: Store },
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

  return (
    <>
      <button
        className="md:hidden p-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors border border-stone-200 dark:border-stone-800"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <aside
            className="absolute left-0 top-0 h-full w-80 max-w-[85vw] flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-300"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, #1c150c 0%, #0d0c0a 60%, #060504 100%)',
              borderRight: '1px solid rgba(212, 175, 55, 0.25)',
            }}
          >
            {/* Header */}
            <div
              className="h-16 flex items-center justify-between px-5 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.18)' }}
            >
              <div className="flex items-center gap-3">
                <AureliaMonogram className="h-8 w-8" />
                <div>
                  <div className="font-serif tracking-[0.25em] text-xs font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#fae8c8] via-[#e6ca85] to-[#c5a059]">
                    AURELIA
                  </div>
                  <div className="text-[#c5a059]/80 text-[10px] tracking-widest uppercase">Admin Suite</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 custom-dark-scrollbar space-y-1">
              <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-widest px-3 mb-2 font-mono">
                Management System
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
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                          active
                            ? 'bg-gradient-to-r from-[#d4af37]/25 to-transparent text-[#fae8c8] font-semibold border-l-2 border-[#d4af37]'
                            : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${active ? 'text-[#d4af37]' : 'text-stone-500'}`} />
                          <span>{item.name}</span>
                        </div>
                        {active && <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37]" />}
                      </Link>
                    </li>
                  )
                })}
              </ul>

              <div className="pt-4 px-1">
                <Link
                  href="/"
                  target="_blank"
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

            {/* Footer */}
            <div
              className="p-4 flex-shrink-0 mt-auto bg-black/40"
              style={{ borderTop: '1px solid rgba(212, 175, 55, 0.15)' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-[#fae8c8]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-stone-200 truncate">
                    {session?.name || 'Administrator'}
                  </div>
                  <div className="text-[11px] text-stone-400 truncate">{session?.email}</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
