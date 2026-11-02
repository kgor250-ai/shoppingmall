'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Store,
  Users,
  UserCheck,
  ShoppingCart,
  Building2,
  IndianRupee,
  AlertCircle,
  FileBarChart,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: 'Executive',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Operations & Directory',
    items: [
      { name: 'Stores', href: '/admin/stores', icon: Store },
      { name: 'Store Owners', href: '/admin/owners', icon: UserCheck },
      { name: 'Employees', href: '/admin/employees', icon: Users },
      { name: 'Customers', href: '/admin/customers', icon: Users },
      { name: 'Categories', href: '/admin/categories', icon: ShoppingCart },
      { name: 'Mall 3D Layout', href: '/admin/layout-management', icon: Building2 },
    ],
  },
  {
    title: 'Finance & Audit',
    items: [
      { name: 'Rent Management', href: '/admin/rent', icon: IndianRupee },
      { name: 'Reports & Sales', href: '/admin/reports', icon: FileBarChart },
      { name: 'Complaints', href: '/admin/complaints', icon: AlertCircle },
    ],
  },
]

export function AdminSidebarNav() {
  const pathname = usePathname()

  const isItemActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="flex-1 overflow-y-auto py-3 px-3 custom-dark-scrollbar overscroll-contain space-y-5">
      {navSections.map((section) => (
        <div key={section.title} className="space-y-1">
          <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-widest px-3 mb-1.5 font-mono">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const active = isItemActive(item.href)
              const Icon = item.icon

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group relative ${
                      active
                        ? 'bg-gradient-to-r from-[#d4af37]/20 via-[#d4af37]/10 to-transparent text-[#fae8c8] font-semibold border-l-2 border-[#d4af37] shadow-sm'
                        : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`h-4 w-4 flex-shrink-0 transition-colors ${
                          active
                            ? 'text-[#d4af37]'
                            : 'text-stone-500 group-hover:text-[#fae8c8]'
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {active ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d4af37] shadow-[0_0_8px_#d4af37]" />
                    ) : (
                      <ChevronRight className="h-3 w-3 text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}

      {/* Quick Mall Link */}
      <div className="pt-2 px-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-[#fae8c8] hover:bg-[#d4af37]/10 border border-[#d4af37]/20 transition-all group"
        >
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>View Public Mall</span>
          </span>
          <ExternalLink className="h-3 w-3 text-[#d4af37] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  )
}

