export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { getSession } from '@/lib/auth'
import { logoutAction } from '@/actions/auth'
import prisma from '@/lib/prisma'
import {
  Store as StoreIcon,
  LogOut,
  Layers,
} from 'lucide-react'
import { GlobalBackButton } from '@/components/GlobalBackButton'
import { StoreMobileMenu } from '@/components/StoreMobileMenu'
import { StoreNavLinks } from '@/components/StoreNavLinks'
import { DashboardHeaderTitle } from '@/components/DashboardHeaderTitle'

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
    <div className="h-screen w-full flex overflow-hidden" style={{ background: '#f0fdf4' }}>
      {/* ── Sidebar (desktop) ── */}
      <aside
        className="w-60 hidden md:flex flex-col flex-shrink-0 h-screen overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #064e3b 0%, #065f46 50%, #047857 100%)',
          borderRight: '1px solid #065f46',
        }}
      >
        {/* Brand */}
        <div
          className="h-16 flex items-center px-5 gap-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
          >
            <StoreIcon className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="text-white font-bold text-sm leading-tight truncate" title={store.name}>
              {store.name}
            </div>
            <div className="text-emerald-300 text-xs">{store.storeNumber}</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-dark-scrollbar overscroll-contain">
          <p className="text-xs font-semibold text-emerald-400/60 uppercase tracking-widest px-2 mb-2">
            Store Panel
          </p>
          <StoreNavLinks />
        </nav>

        {/* Footer */}
        <div className="p-3 flex-shrink-0 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="px-3 py-2 mb-1">
            <div className="flex items-center gap-2">
              <div
                className="h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.15)' }}
              >
                <Layers className="h-3.5 w-3.5 text-emerald-200" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-emerald-100 truncate">
                  {session.name || 'Store Owner'}
                </div>
                <div className="text-xs text-emerald-400/60 truncate">{session.email}</div>
              </div>
            </div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg text-emerald-300/70 hover:bg-red-500/20 hover:text-red-300 transition-all gap-3 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Header */}
        <header
          className="h-14 flex items-center justify-between px-4 md:px-6 flex-shrink-0 z-10"
          style={{
            background: '#ffffff',
            borderBottom: '1px solid #d1fae5',
            boxShadow: '0 1px 3px 0 rgba(6,78,59,0.06)',
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <StoreMobileMenu session={session} store={store} />
            <DashboardHeaderTitle roleTitle="Store Owner" />
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-semibold text-emerald-900 text-xs truncate max-w-[150px]">
                {store.name}
              </span>
              <span className="text-emerald-600 text-[10px]">
                {store.storeNumber}
              </span>
            </div>
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: '#d1fae5', color: '#065f46' }}
            >
              <StoreIcon className="h-3 w-3" />
              Store Owner
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar overscroll-contain">
          <GlobalBackButton />
          {children}
        </main>
      </div>
    </div>
  )
}
