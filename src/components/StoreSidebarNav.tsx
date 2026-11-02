'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Receipt,
  Package,
  Store,
  AlertTriangle,
  ShoppingBag,
  BarChart,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/store', icon: LayoutDashboard },
  { name: 'Billing POS', href: '/store/billing', icon: Receipt },
  { name: 'Products Catalog', href: '/store/products', icon: Package },
  { name: 'Stock Inventory', href: '/store/stock', icon: Store },
  { name: 'Low Stock Alerts', href: '/store/low-stock', icon: AlertTriangle },
  { name: 'Sales Ledger', href: '/store/sales', icon: ShoppingBag },
  { name: 'Analytics & Reports', href: '/store/reports', icon: BarChart },
]

export function StoreSidebarNav() {
  const pathname = usePathname()

  const isItemActive = (href: string) => {
    if (href === '/store') return pathname === '/store'
    return pathname.startsWith(href)
  }

  return (
    <div className="flex-1 overflow-y-auto py-4 px-3 custom-dark-scrollbar space-y-4">
      <div>
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
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    active
                      ? 'bg-gradient-to-r from-emerald-500/20 via-[#d4af37]/15 to-transparent text-[#fae8c8] font-semibold border-l-2 border-[#d4af37] shadow-sm'
                      : 'text-stone-300/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`h-4 w-4 flex-shrink-0 transition-colors ${
                        active ? 'text-[#d4af37]' : 'text-emerald-400/80 group-hover:text-emerald-300'
                      }`}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>

                  {active ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37]" />
                  ) : (
                    <ChevronRight className="h-3 w-3 text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="pt-2 px-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 transition-all group"
        >
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>View Public Mall</span>
          </span>
          <ExternalLink className="h-3 w-3 text-emerald-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  )
}
