'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isRouteActive } from '@/lib/navigation'
import {
  LayoutDashboard,
  Receipt,
  Package,
  Store as StoreIcon,
  AlertTriangle,
  ShoppingBag,
  BarChart,
} from 'lucide-react'

export const storeNavItems = [
  { name: 'Dashboard', href: '/store', icon: LayoutDashboard },
  { name: 'Billing POS', href: '/store/billing', icon: Receipt },
  { name: 'Products', href: '/store/products', icon: Package },
  { name: 'Stock', href: '/store/stock', icon: StoreIcon },
  { name: 'Low Stock', href: '/store/low-stock', icon: AlertTriangle },
  { name: 'Sales', href: '/store/sales', icon: ShoppingBag },
  { name: 'Reports', href: '/store/reports', icon: BarChart },
]

export function StoreNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <ul className="space-y-1">
      {storeNavItems.map((item) => {
        const isActive = isRouteActive(pathname, item.href, item.href === '/store')

        return (
          <li key={item.name}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-all gap-3 group relative ${
                isActive
                  ? 'bg-white/20 text-white font-semibold shadow-md shadow-emerald-950/20 ring-1 ring-emerald-300/30'
                  : 'text-emerald-100/80 hover:bg-white/10 hover:text-white font-medium'
              }`}
            >
              {/* Active left indicator pill */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-300 rounded-r-full shadow-sm" />
              )}
              <item.icon
                className={`h-4 w-4 transition-colors flex-shrink-0 ${
                  isActive ? 'text-emerald-100' : 'text-emerald-400 group-hover:text-emerald-200'
                }`}
              />
              <span className="truncate">{item.name}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
