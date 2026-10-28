'use client'

import { useState } from 'react'
import { Building2, Shield, Menu, X } from 'lucide-react'
import { AdminNavLinks } from './AdminNavLinks'

export function AdminMobileMenu({ session }: { session: { name?: string; email?: string } }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <aside
            className="absolute left-0 top-0 h-full w-72 flex flex-col shadow-2xl animate-in slide-in-from-left duration-300"
            style={{
              background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
              borderRight: '1px solid #1e3a5f',
            }}
          >
            {/* Header */}
            <div
              className="h-16 flex items-center justify-between px-5 flex-shrink-0"
              style={{ borderBottom: '1px solid #1e3a5f' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
                >
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Mall Admin</div>
                  <div className="text-blue-400 text-xs">Control Center</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 custom-dark-scrollbar overscroll-contain">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-2 mb-2">
                Management
              </p>
              <AdminNavLinks onNavigate={() => setOpen(false)} />
            </nav>

            {/* Footer */}
            <div className="p-3 flex-shrink-0 mt-auto" style={{ borderTop: '1px solid #1e3a5f' }}>
              <div className="px-3 py-2 mb-1">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-blue-600/30 flex items-center justify-center">
                    <Shield className="h-3.5 w-3.5 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-300 truncate">
                      {session?.name || 'Administrator'}
                    </div>
                    <div className="text-xs text-slate-500 truncate">{session?.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
