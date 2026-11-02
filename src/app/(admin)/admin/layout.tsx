export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { logoutAction } from '@/actions/auth'
import {
  LogOut,
  Shield,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import { GlobalBackButton } from '@/components/GlobalBackButton'
import { AdminMobileMenu } from '@/components/AdminMobileMenu'
import { AdminSidebarNav } from '@/components/AdminSidebarNav'
import { AureliaMonogram } from '@/components/aurelia/AureliaMonogram'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await connection()
  const session = await getSession()

  if (!session || session.role !== 'ADMIN') {
    redirect('/api/auth/logout')
  }

  return (
    <div className="h-screen w-full flex overflow-hidden bg-stone-100 dark:bg-stone-950 font-sans">
      {/* ── Luxury Sidebar (Desktop) ── */}
      <aside
        className="w-64 hidden md:flex flex-col flex-shrink-0 h-screen overflow-hidden select-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #1c150c 0%, #0d0c0a 60%, #060504 100%)',
          borderRight: '1px solid rgba(212, 175, 55, 0.22)',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Brand Header */}
        <div
          className="h-16 flex items-center px-4 gap-3 flex-shrink-0 relative overflow-hidden"
          style={{ borderBottom: '1px solid rgba(212, 175, 55, 0.18)' }}
        >
          {/* Subtle gold ambient glow */}
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#d4af37]/15 rounded-full blur-xl pointer-events-none" />

          <Link href="/admin" className="flex items-center gap-3 group">
            <AureliaMonogram className="h-9 w-9 drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-serif tracking-[0.25em] text-sm font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#fae8c8] via-[#e6ca85] to-[#c5a059]">
                  AURELIA
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#fae8c8] font-mono font-medium">
                  ADMIN
                </span>
              </div>
              <p className="text-[10px] tracking-[0.2em] text-[#c5a059]/80 uppercase font-light truncate -mt-0.5">
                Control Center
              </p>
            </div>
          </Link>
        </div>

        {/* Dynamic Route-Aware Navigation */}
        <AdminSidebarNav />

        {/* Footer with Administrator Identity & Logout */}
        <div
          className="p-3 flex-shrink-0 mt-auto bg-black/40 backdrop-blur-md"
          style={{ borderTop: '1px solid rgba(212, 175, 55, 0.15)' }}
        >
          <div className="px-3 py-2 mb-2 rounded-xl bg-stone-900/80 border border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#d4af37]/30 to-[#9b7324]/30 border border-[#d4af37]/40 flex items-center justify-center flex-shrink-0">
                <Shield className="h-4 w-4 text-[#fae8c8]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-stone-200 truncate flex items-center gap-1.5">
                  <span>{session.name || 'System Admin'}</span>
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
              <span>Sign Out from Admin</span>
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0 bg-[#faf8f5] dark:bg-stone-950">
        {/* Top Header Bar */}
        <header
          className="h-16 flex items-center justify-between px-4 md:px-7 flex-shrink-0 z-10 bg-white/95 dark:bg-stone-900/90 backdrop-blur-md"
          style={{
            borderBottom: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
          }}
        >
          <div className="flex items-center gap-3.5">
            {/* Mobile menu trigger */}
            <AdminMobileMenu session={session} />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                  Welcome, {session.name || 'Admin'}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  System Operational
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-stone-400">
                Aurelia Shopping Mall Management &amp; Analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-[#d4af37]/40 bg-[#d4af37]/10 text-stone-800 dark:text-[#fae8c8] hover:bg-[#d4af37]/20 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
              <span>View Mall</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-900 text-stone-100 border border-[#d4af37]/50 shadow-sm">
                <Shield className="h-3.5 w-3.5 text-[#d4af37]" />
                <span className="tracking-wide">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
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
