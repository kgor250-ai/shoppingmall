export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { logoutAction } from '@/actions/auth'
import {
  Building2,
  LayoutDashboard,
  Store,
  Users,
  ShoppingCart,
  IndianRupee,
  AlertCircle,
  FileBarChart,
  LogOut,
  Shield,
} from 'lucide-react'
import { GlobalBackButton } from '@/components/GlobalBackButton'
import { AdminMobileMenu } from '@/components/AdminMobileMenu'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await connection()
  const session = await getSession()

  if (!session || session.role !== 'ADMIN') {
    redirect('/api/auth/logout')
  }

  const navItems = [
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

  return (
    <div className="h-screen w-full flex overflow-hidden" style={{ background: '#f1f5f9' }}>
      {/* ── Sidebar (desktop) ── */}
      <aside
        className="w-60 hidden md:flex flex-col flex-shrink-0 h-screen overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          borderRight: '1px solid #1e3a5f',
        }}
      >
        {/* Brand */}
        <div
          className="h-16 flex items-center px-5 gap-3 flex-shrink-0"
          style={{ borderBottom: '1px solid #1e3a5f' }}
        >
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
          >
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight">Mall Admin</div>
            <div className="text-blue-400 text-xs">Control Center</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 custom-dark-scrollbar overscroll-contain">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-2 mb-2">
            Management
          </p>
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-slate-400 hover:bg-blue-600/20 hover:text-blue-300 transition-all gap-3 group"
                >
                  <item.icon className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-3 flex-shrink-0 mt-auto" style={{ borderTop: '1px solid #1e3a5f' }}>
          <div className="px-3 py-2 mb-1">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-blue-600/30 flex items-center justify-center flex-shrink-0">
                <Shield className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-300 truncate">
                  {session.name || 'Admin'}
                </div>
                <div className="text-xs text-slate-500 truncate">{session.email}</div>
              </div>
            </div>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg hover:bg-red-900/30 text-slate-500 hover:text-red-400 transition-all gap-3"
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
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px 0 rgba(0,0,0,0.06)',
          }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <AdminMobileMenu session={session} />
            <div>
              <span className="font-semibold text-slate-800 text-sm">
                Welcome, {session.name || 'Admin'}
              </span>
              <span className="hidden md:inline text-slate-400 text-xs ml-2">
                — Administrator
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: '#dbeafe', color: '#1d4ed8' }}
            >
              <Shield className="h-3 w-3" />
              Admin
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
