'use client'

import { useState } from 'react'
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
} from 'lucide-react'

type SessionData = {
  name?: string
  email?: string
}

type StoreData = {
  name: string
  storeNumber: string
}

export function StoreMobileMenu({
  session,
  store,
}: {
  session: SessionData
  store: StoreData
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/store', icon: LayoutDashboard },
    { name: 'Billing POS', href: '/store/billing', icon: Receipt },
    { name: 'Products Catalog', href: '/store/products', icon: Package },
    { name: 'Stock Inventory', href: '/store/stock', icon: StoreIcon },
    { name: 'Low Stock Alerts', href: '/store/low-stock', icon: AlertTriangle },
    { name: 'Sales Ledger', href: '/store/sales', icon: ShoppingBag },
    { name: 'Analytics & Reports', href: '/store/reports', icon: BarChart },
  ]

  const isItemActive = (href: string) => {
    if (href === '/store') return pathname === '/store'
    return pathname.startsWith(href)
  }

  return (
    <>
      <button
        className="md:hidden p-2 rounded-xl text-emerald-800 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors border border-emerald-500/20"
        onClick={() => setOpen(true)}
        aria-label="Open store navigation menu"
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
              background: 'radial-gradient(ellipse at 50% 0%, #06241a 0%, #081712 60%, #030a07 100%)',
              borderRight: '1px solid rgba(16, 185, 129, 0.25)',
            }}
          >
            {/* Header */}
            <div
              className="h-16 flex items-center justify-between px-5 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(16, 185, 129, 0.2)' }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                  <StoreIcon className="h-4 w-4 text-emerald-300" />
                </div>
                <div className="min-w-0">
                  <div className="text-white font-bold text-xs truncate" title={store?.name}>
                    {store?.name}
                  </div>
                  <div className="text-emerald-300 text-[10px] font-mono">{store?.storeNumber}</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-900/40 transition-colors"
                aria-label="Close store navigation menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 custom-dark-scrollbar space-y-1">
              <p className="text-[10px] font-semibold text-emerald-400/70 uppercase tracking-widest px-3 mb-2 font-mono">
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
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                          active
                            ? 'bg-gradient-to-r from-emerald-500/25 to-transparent text-[#fae8c8] font-semibold border-l-2 border-[#d4af37]'
                            : 'text-stone-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${active ? 'text-[#d4af37]' : 'text-emerald-400'}`} />
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
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-stone-300 bg-stone-900 border border-emerald-500/30 hover:border-emerald-500/60 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>View Public Mall</span>
                  </span>
                  <ExternalLink className="h-3 w-3 text-emerald-400" />
                </Link>
              </div>
            </nav>

            {/* Footer */}
            <div
              className="p-4 flex-shrink-0 mt-auto bg-black/40"
              style={{ borderTop: '1px solid rgba(16, 185, 129, 0.2)' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Layers className="h-3.5 w-3.5 text-emerald-300" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-stone-200 truncate">
                    {session?.name || 'Store Owner'}
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
