'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { isRouteActive } from '@/lib/navigation'
import {
  LayoutDashboard,
  Store,
  Users,
  ShoppingCart,
  Building2,
  IndianRupee,
  AlertCircle,
  FileBarChart,
} from 'lucide-react'

export const adminNavItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Stores', href: '/admin/stores', icon: Store },
  { name: 'Store Owners', href: '/admin/owners', icon: Users },
  { name: 'Employees', href: '/admin/employees', icon: Users },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Categories', href: '/admin/categories', icon: ShoppingCart },
  { name: 'Mall Layout', href: '/admin/layout-management', icon: Building2 },
  { name: 'Rent', href: '/admin/rent', icon: IndianRupee },
  { name: 'Complaints', href: '/admin/complaints', icon: AlertCircle },
  { name: 'Reports', href: '/admin/reports', icon: FileBarChart },
]

export function AdminNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <ul className="space-y-1">
      {adminNavItems.map((item) => {
        const isActive = isRouteActive(pathname, item.href, item.href === '/admin')

        return (
          <li key={item.name}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center px-3 py-2.5 text-sm rounded-lg transition-all gap-3 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold shadow-md shadow-blue-500/25 ring-1 ring-blue-400/30'
                  : 'text-slate-400 hover:bg-blue-600/15 hover:text-blue-300 font-medium'
              }`}
            >
              {/* Active left indicator pill */}
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-white rounded-r-full shadow-sm" />
              )}
              <item.icon
                className={`h-4 w-4 transition-colors flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'
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
