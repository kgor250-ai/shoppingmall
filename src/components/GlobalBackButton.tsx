'use client'

import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { getRouteInfo } from '@/lib/navigation'

export function GlobalBackButton() {
  const router = useRouter()
  const pathname = usePathname()
  const routeInfo = getRouteInfo(pathname)
  const isRootDashboard = pathname === '/admin' || pathname === '/store'

  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-200/60">
      <div className="flex items-center gap-2">
        {!isRootDashboard ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.back()}
            className="h-7 px-2.5 text-xs text-slate-600 hover:text-slate-900 border-slate-200 bg-white shadow-xs"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            Back
          </Button>
        ) : null}

        {/* Accessible Breadcrumbs Trail */}
        <nav aria-label="Breadcrumb navigation" className="flex items-center text-xs text-slate-500 font-medium">
          <ol className="flex flex-wrap items-center space-x-1">
            {routeInfo.breadcrumbs.map((crumb, idx) => {
              const isLast = idx === routeInfo.breadcrumbs.length - 1
              return (
                <li key={crumb.label + idx} className="flex items-center">
                  {idx > 0 && <ChevronRight className="h-3 w-3 mx-1 text-slate-400 flex-shrink-0" />}
                  {isLast || !crumb.href ? (
                    <span className="font-semibold text-slate-800" aria-current="page">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="hover:text-blue-600 hover:underline transition-colors"
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

      <div className="hidden sm:block text-[11px] text-slate-400 font-mono">
        {pathname}
      </div>
    </div>
  )
}
