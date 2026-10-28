'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { getRouteInfo } from '@/lib/navigation'
import { ChevronRight } from 'lucide-react'

export function DashboardHeaderTitle({
  roleTitle = 'Admin',
}: {
  roleTitle?: 'Admin' | 'Store Owner'
}) {
  const pathname = usePathname()
  const routeInfo = getRouteInfo(pathname)

  return (
    <div className="flex items-center gap-2 min-w-0">
      <nav aria-label="Breadcrumb" className="flex items-center text-xs md:text-sm font-medium">
        <ol className="flex items-center space-x-1 md:space-x-1.5 text-slate-500">
          {routeInfo.breadcrumbs.map((crumb, idx) => {
            const isLast = idx === routeInfo.breadcrumbs.length - 1

            return (
              <li key={crumb.label + idx} className="flex items-center">
                {idx > 0 && (
                  <ChevronRight className="h-3 w-3 mx-1 text-slate-400 flex-shrink-0" />
                )}
                {isLast || !crumb.href ? (
                  <span
                    className="font-semibold text-slate-800 truncate max-w-[150px] md:max-w-[240px]"
                    aria-current="page"
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-blue-600 transition-colors truncate max-w-[120px]"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
