export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { logoutAction } from '@/actions/auth'
import prisma from '@/lib/prisma'
import {
  Store as StoreIcon,
  LogOut,
  Sparkles,
  ExternalLink,
  Layers,
} from 'lucide-react'
import { GlobalBackButton } from '@/components/GlobalBackButton'
import { StoreMobileMenu } from '@/components/StoreMobileMenu'
import { StoreSidebarNav } from '@/components/StoreSidebarNav'
import { AureliaMonogram } from '@/components/aurelia/AureliaMonogram'

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  await connection()
  const session = await getSession()

  if (!session || session.role !== 'STORE_OWNER' || !session.storeId) {
    redirect('/api/auth/logout')
  }

  const store = await prisma.store.findUnique({
    where: { id: session.storeId },
  })

  if (!store) {
    redirect('/api/auth/logout')
  }

  return (
    <div className="h-screen w-full flex overflow-hidden bg-stone-100 dark:bg-stone-950 font-sans">
      {/* ── Luxury Store Owner Sidebar (desktop) ── */}
      <aside
        className="w-64 hidden md:flex flex-col flex-shrink-0 h-screen overflow-hidden select-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #06241a 0%, #081712 60%, #030a07 100%)',
          borderRight: '1px solid rgba(16, 185, 129, 0.2)',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.35)',
        }}
      >
        {/* Brand & Store Header */}
        <div
          className="h-16 flex items-center px-4 gap-3 flex-shrink-0 relative overflow-hidden"
          style={{ borderBottom: '1px solid rgba(16, 185, 129, 0.18)' }}
        >
          <div className="h-9 w-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <StoreIcon className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[#fbf8f3] font-semibold text-xs leading-tight truncate" title={store.name}>
              {store.name}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-emerald-300 font-mono">{store.storeNumber}</span>
              <span className="text-[10px] text-stone-500">•</span>
              <span className="text-[10px] text-stone-400 truncate">{store.floor}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Route-Aware Navigation */}
        <StoreSidebarNav />

        {/* Footer with Store Owner Info & Logout */}
        <div
          className="p-3 flex-shrink-0 mt-auto bg-black/40 backdrop-blur-md"
          style={{ borderTop: '1px solid rgba(16, 185, 129, 0.15)' }}
        >
          <div className="px-3 py-2 mb-2 rounded-xl bg-stone-900/80 border border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <Layers className="h-3.5 w-3.5 text-emerald-300" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-stone-200 truncate">
                  {session.name || 'Store Owner'}
                </div>
                <div className="text-[11px] text-stone-400 truncate">{session.email}</div>
              </div>
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center w-full px-3 py-2 text-xs font-medium rounded-xl hover:bg-rose-950/40 text-stone-400 hover:text-rose-300 border border-transparent hover:border-rose-900/40 transition-all gap-2.5 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out from Store</span>
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 bg-[#f9fafb] dark:bg-stone-950">
        {/* Top Header */}
        <header
          className="h-16 flex items-center justify-between px-4 md:px-7 flex-shrink-0 z-10 bg-white/95 dark:bg-stone-900/90 backdrop-blur-md"
          style={{
            borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div className="flex items-center gap-3.5">
            <StoreMobileMenu store={store} session={session} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                  {store.name}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active Boutique
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-stone-400">
                Aurelia Mall Merchant Portal — {store.floor} ({store.storeNumber})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>View Mall</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-200 border border-emerald-500/40 shadow-sm">
                <StoreIcon className="h-3.5 w-3.5 text-emerald-400" />
                <span className="tracking-wide">Owner</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar overscroll-contain">
          <div className="max-w-7xl mx-auto space-y-6">
            <GlobalBackButton />
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
