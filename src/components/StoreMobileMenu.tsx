'use client'

import { useState } from 'react'
import { Menu, X, Store as StoreIcon, Layers } from 'lucide-react'
import { StoreNavLinks } from './StoreNavLinks'

type SessionData = {
  name?: string
  email?: string
}

type StoreData = {
  name: string
  storeNumber: string
}

export function StoreMobileMenu({
  session,
  store,
}: {
  session: SessionData
  store: StoreData
}) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="md:hidden p-2 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
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
              background: 'linear-gradient(180deg, #064e3b 0%, #065f46 50%, #047857 100%)',
              borderRight: '1px solid #065f46',
            }}
          >
            {/* Header */}
            <div
              className="h-16 flex items-center justify-between px-5 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                >
                  <StoreIcon className="h-4 w-4 text-white" />
                </div>
                <div className="min-w-0">
                  <div
                    className="text-white font-bold text-sm leading-tight truncate"
                    title={store?.name}
                  >
                    {store?.name}
                  </div>
                  <div className="text-emerald-300 text-xs">{store?.storeNumber}</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 custom-dark-scrollbar overscroll-contain">
              <p className="text-xs font-semibold text-emerald-400/60 uppercase tracking-widest px-2 mb-2">
                Store Panel
              </p>
              <StoreNavLinks onNavigate={() => setOpen(false)} />
            </nav>

            {/* Footer */}
            <div className="p-3 flex-shrink-0 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="px-3 py-2">
                <div className="flex items-center gap-2">
                  <div
                    className="h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.15)' }}
                  >
                    <Layers className="h-3.5 w-3.5 text-emerald-200" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-emerald-100 truncate">
                      {session?.name || 'Store Owner'}
                    </div>
                    <div className="text-xs text-emerald-400/60 truncate">{session?.email}</div>
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
