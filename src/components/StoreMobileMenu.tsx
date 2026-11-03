'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  Store as StoreIcon,
  Layers,
  LayoutDashboard,
  Package,
  BarChart,
  ShoppingBag,
  Receipt,
  AlertTriangle,
  ExternalLink,
  LogOut,
} from 'lucide-react'

type SessionData = {
  name?: string
  email?: string
}

type StoreData = {
  name: string
  storeNumber: string
  floor?: string
}

export function StoreMobileMenu({
  session,
  store,
}: {
  session: SessionData
  store: StoreData
}) {
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
    { name: 'Dashboard', href: '/store', icon: LayoutDashboard },
    { name: 'Billing POS', href: '/store/billing', icon: Receipt },
    { name: 'Products Catalog', href: '/store/products', icon: Package },
    { name: 'Stock Inventory', href: '/store/stock', icon: StoreIcon },
    { name: 'Low Stock Alerts', href: '/store/low-stock', icon: AlertTriangle },
    { name: 'Sales & Invoices', href: '/store/sales', icon: ShoppingBag },
    { name: 'Analytics & Reports', href: '/store/reports', icon: BarChart },
  ]

  const isItemActive = (href: string) => {
    if (href === '/store') return pathname === '/store'
    return pathname.startsWith(href)
  }

  const menuContent = open && mounted && (
    <div className="fixed inset-0 z-[99999] md:hidden flex">
      {/* Dark Backdrop with full screen dimming */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Solid Opaque Drawer */}
      <aside
        className="relative z-10 w-[82vw] max-w-xs h-[100dvh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)] animate-in slide-in-from-left duration-300 select-none"
        style={{
          backgroundColor: '#071812',
          backgroundImage: 'radial-gradient(ellipse at 50% 0%, #0c2b20 0%, #071812 60%, #030d09 100%)',
          borderRight: '1px solid rgba(16, 185, 129, 0.3)',
        }}
      >
        {/* Header with Store Info & Close Button */}
        <div
          className="h-16 flex items-center justify-between px-4 flex-shrink-0 bg-[#061e16] border-b border-emerald-500/25"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0 shadow-sm">
              <StoreIcon className="h-4 w-4 text-emerald-300" />
            </div>
            <div className="min-w-0">
              <div className="text-white font-bold text-xs leading-tight truncate" title={store?.name}>
                {store?.name || 'My Store'}
              </div>
              <div className="text-emerald-300/90 text-[10px] font-mono mt-0.5">
                {store?.storeNumber} {store?.floor ? `· ${store.floor}` : ''}
              </div>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-xl text-emerald-300 hover:text-white hover:bg-emerald-800/40 transition-colors cursor-pointer"
            aria-label="Close store navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-dark-scrollbar space-y-1">
          <p className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-widest px-3 mb-2 font-mono">
            Store Operations
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
                        ? 'bg-gradient-to-r from-emerald-500/30 to-emerald-500/10 text-[#fae8c8] font-bold border-l-3 border-[#d4af37] shadow-sm'
                        : 'text-stone-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-4 w-4 ${active ? 'text-[#d4af37]' : 'text-emerald-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {active && <span className="h-2 w-2 rounded-full bg-[#d4af37] animate-pulse" />}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Quick Mall Link */}
          <div className="pt-4 px-1">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-stone-200 bg-black/40 border border-emerald-500/30 hover:border-emerald-500/60 transition-all"
            >
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>View Public Mall</span>
              </span>
              <ExternalLink className="h-3 w-3 text-emerald-400" />
            </Link>
          </div>
        </nav>

        {/* Footer with Store Owner Info & Direct Logout Button */}
        <div className="p-3.5 flex-shrink-0 bg-[#040e0a] border-t border-emerald-500/25 space-y-2.5">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl bg-white/[0.03]">
            <div className="h-7 w-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Layers className="h-3.5 w-3.5 text-emerald-300" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-stone-100 truncate">
                {session?.name || 'Store Owner'}
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
        className="md:hidden p-2 rounded-xl text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors border border-emerald-500/20 cursor-pointer"
        onClick={() => setOpen(true)}
        aria-label="Open store navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mounted && typeof document !== 'undefined' && createPortal(menuContent, document.body)}
    </>
  )
}
