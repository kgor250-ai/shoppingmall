'use client'

import React, { useState, useTransition } from 'react'
import {
  Search,
  Filter,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Globe,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Crown,
  Store,
  User,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'
import { toggleUserStatusAction } from '@/actions/auth'

export interface ActivityLogItem {
  id: string
  userId: string
  action: string
  createdAt: string
  deviceInfo: string
  ip: string
  userName: string
  userEmail: string
  userPhone: string
  role: string
  userStatus: string
}

interface UserLoginsTableProps {
  initialLogs: ActivityLogItem[]
}

function getDeviceIcon(deviceStr: string) {
  const d = deviceStr.toLowerCase()
  if (d.includes('iphone') || d.includes('android mobile') || d.includes('mobile')) {
    return <Smartphone className="h-4 w-4 text-emerald-400 flex-shrink-0" />
  }
  if (d.includes('ipad') || d.includes('tablet')) {
    return <Tablet className="h-4 w-4 text-purple-400 flex-shrink-0" />
  }
  if (d.includes('mac') || d.includes('laptop')) {
    return <Laptop className="h-4 w-4 text-blue-400 flex-shrink-0" />
  }
  return <Monitor className="h-4 w-4 text-amber-400 flex-shrink-0" />
}

function getRoleBadge(role: string) {
  switch (role) {
    case 'ADMIN':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-blue-950/80 text-blue-300 border border-blue-500/40">
          <ShieldCheck className="h-3 w-3" />
          <span>Admin</span>
        </span>
      )
    case 'STORE_OWNER':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
          <Store className="h-3 w-3" />
          <span>Merchant</span>
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#d4af37]/20 text-[#fae8c8] border border-[#d4af37]/40">
          <Crown className="h-3 w-3" />
          <span>Customer VIP</span>
        </span>
      )
  }
}

export function UserLoginsTable({ initialLogs }: UserLoginsTableProps) {
  const [logs, setLogs] = useState<ActivityLogItem[]>(initialLogs)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'CUSTOMER' | 'STORE_OWNER' | 'ADMIN'>('ALL')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'BLOCKED'>('ALL')
  const [isPending, startTransition] = useTransition()
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  const handleToggleStatus = (userId: string, currentStatus: string, userName: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE'
    const confirmText =
      newStatus === 'BLOCKED'
        ? `Are you sure you want to block ${userName} from logging in?`
        : `Activate ${userName}'s account?`

    if (!window.confirm(confirmText)) return

    startTransition(async () => {
      const res = await toggleUserStatusAction(userId, newStatus)
      if (res.error) {
        alert(res.error)
      } else {
        setLogs((prev) =>
          prev.map((l) => (l.userId === userId ? { ...l, userStatus: newStatus } : l))
        )
        setActionMessage(`Updated ${userName} status to ${newStatus}`)
        setTimeout(() => setActionMessage(null), 4000)
      }
    })
  }

  // Filter logs based on search query, role filter, and status filter
  const filteredLogs = logs.filter((item) => {
    const q = searchTerm.toLowerCase()
    const matchesSearch =
      !searchTerm ||
      item.userName.toLowerCase().includes(q) ||
      item.userEmail.toLowerCase().includes(q) ||
      item.userPhone.toLowerCase().includes(q) ||
      item.deviceInfo.toLowerCase().includes(q) ||
      item.ip.toLowerCase().includes(q)

    const matchesRole = roleFilter === 'ALL' || item.role === roleFilter
    const matchesStatus = statusFilter === 'ALL' || item.userStatus === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-[#d4af37]/20 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by customer name, email, phone or device..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-black/40 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role selector */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-black/40 p-1 rounded-xl border border-stone-200 dark:border-white/10 text-xs">
            <span className="text-[10px] text-stone-500 font-semibold px-2 uppercase">Role:</span>
            {(['ALL', 'CUSTOMER', 'STORE_OWNER', 'ADMIN'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  roleFilter === r
                    ? 'bg-[#d4af37] text-stone-950 font-semibold shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {r === 'ALL' ? 'All Roles' : r === 'CUSTOMER' ? 'Shoppers' : r === 'STORE_OWNER' ? 'Merchants' : 'Admins'}
              </button>
            ))}
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-black/40 p-1 rounded-xl border border-stone-200 dark:border-white/10 text-xs">
            <span className="text-[10px] text-stone-500 font-semibold px-2 uppercase">Status:</span>
            {(['ALL', 'ACTIVE', 'BLOCKED'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  statusFilter === s
                    ? 'bg-stone-800 text-white dark:bg-white dark:text-stone-950 font-semibold'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                }`}
              >
                {s === 'ALL' ? 'All' : s === 'ACTIVE' ? 'Active' : 'Blocked'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Activity Table */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 dark:bg-black/60 border-b border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 uppercase tracking-wider text-[10px] font-mono">
                <th className="py-3 px-4">User / Customer</th>
                <th className="py-3 px-4">Access Role</th>
                <th className="py-3 px-4">Device & Platform</th>
                <th className="py-3 px-4">Network & IP</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-500">
                    <User className="h-8 w-8 mx-auto mb-2 text-stone-400 opacity-50" />
                    <p className="font-medium text-sm text-stone-400">No login activity records match your criteria.</p>
                    <p className="text-xs text-stone-500 mt-1">Users will appear here automatically when they sign in or register.</p>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isBlocked = log.userStatus === 'BLOCKED'
                  const dateObj = new Date(log.createdAt)
                  const formattedDate = dateObj.toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                  const formattedTime = dateObj.toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  })

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-stone-50/80 dark:hover:bg-white/[0.02] transition-colors"
                    >
                      {/* User Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-stone-800 to-stone-700 dark:from-[#2a1d0d] dark:to-[#d4af37]/40 border border-[#d4af37]/30 flex items-center justify-center font-serif text-sm font-bold text-[#fae8c8] flex-shrink-0">
                            {log.userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-stone-900 dark:text-stone-100 truncate flex items-center gap-1.5">
                              <span>{log.userName}</span>
                              {log.action === 'USER_REGISTER' && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                  NEW REGISTRATION
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate font-mono">
                              {log.userEmail}
                            </p>
                            {log.userPhone && log.userPhone !== 'N/A' && (
                              <p className="text-[10px] text-stone-400 dark:text-stone-500">
                                {log.userPhone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Access Role */}
                      <td className="py-3.5 px-4">{getRoleBadge(log.role)}</td>

                      {/* Device & Platform */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                          {getDeviceIcon(log.deviceInfo)}
                          <span className="font-medium text-xs truncate max-w-[170px]" title={log.deviceInfo}>
                            {log.deviceInfo}
                          </span>
                        </div>
                      </td>

                      {/* IP & Location */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 font-mono text-[11px]">
                          <Globe className="h-3 w-3 text-stone-400" />
                          <span>{log.ip || '127.0.0.1'}</span>
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4">
                        <div className="text-stone-700 dark:text-stone-300">
                          <p className="font-medium">{formattedDate}</p>
                          <p className="text-[10px] text-stone-400 dark:text-stone-500 flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />
                            <span>{formattedTime}</span>
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isBlocked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-rose-950/70 text-rose-300 border border-rose-500/40">
                            <XCircle className="h-3 w-3 text-rose-400" />
                            <span>Blocked</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-950/70 text-emerald-300 border border-emerald-500/40">
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                            <span>Active</span>
                          </span>
                        )}
                      </td>

                      {/* Admin Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {log.role === 'ADMIN' ? (
                          <span className="text-[10px] text-stone-500 italic">Protected</span>
                        ) : (
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleToggleStatus(log.userId, log.userStatus, log.userName)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                              isBlocked
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                : 'bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 hover:text-white'
                            }`}
                          >
                            {isBlocked ? 'Activate' : 'Block User'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="py-3 px-4 bg-stone-50 dark:bg-black/40 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500">
          <span>
            Showing <strong className="text-stone-800 dark:text-stone-200">{filteredLogs.length}</strong> of{' '}
            {logs.length} logged events
          </span>
          <span className="text-[11px] font-mono text-[#d4af37]">
            Realtime Audit Log · Aurelia Security Engine
          </span>
        </div>
      </div>
    </div>
  )
}

