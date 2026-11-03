export const dynamic = 'force-dynamic'

import React from 'react'
import { connection } from 'next/server'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import {
  Users,
  UserCheck,
  Activity,
  Shield,
  Smartphone,
  Sparkles,
  Lock,
  ArrowUpRight,
} from 'lucide-react'
import { UserLoginsTable, ActivityLogItem } from './UserLoginsTable'

export default async function AdminUserLoginsPage() {
  await connection()
  const session = await getSession()

  // Strict server-side access control: ONLY ADMIN role can view
  if (!session || session.role !== 'ADMIN') {
    redirect('/api/auth/logout')
  }

  // Fetch all users to map names, current status, phone, role
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      createdAt: true,
    },
  })
  const userMap = new Map(allUsers.map((u) => [u.id, u]))

  // Fetch login & registration audit logs
  const rawLogs = await prisma.auditLog.findMany({
    where: {
      action: { in: ['USER_LOGIN', 'USER_REGISTER'] },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 150,
  })

  // Format logs for client table
  const formattedLogs: ActivityLogItem[] = rawLogs.map((log) => {
    let parsedDesc: any = {}
    try {
      parsedDesc = JSON.parse(log.description)
    } catch {
      parsedDesc = { description: log.description }
    }

    const linkedUser = userMap.get(log.userId)

    const userName = linkedUser?.name || parsedDesc.name || 'Anonymous User'
    const userEmail = linkedUser?.email || parsedDesc.email || 'N/A'
    const userPhone = linkedUser?.phone || parsedDesc.phone || 'N/A'
    const role = linkedUser?.role || parsedDesc.role || 'CUSTOMER'
    const userStatus = linkedUser?.status || 'ACTIVE'
    const deviceInfo = log.recordId || parsedDesc.device || 'Web Browser'
    const ip = parsedDesc.ip || '127.0.0.1'

    return {
      id: log.id,
      userId: log.userId,
      action: log.action,
      createdAt: log.createdAt.toISOString(),
      deviceInfo,
      ip,
      userName,
      userEmail,
      userPhone,
      role,
      userStatus,
    }
  })

  // KPI Metrics Calculation
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const todayLogs = rawLogs.filter((l) => new Date(l.createdAt) >= startOfToday)
  const todayUniqueUsers = new Set(todayLogs.map((l) => l.userId)).size
  const totalCustomers = allUsers.filter((u) => u.role === 'CUSTOMER').length
  const totalStoreOwners = allUsers.filter((u) => u.role === 'STORE_OWNER').length

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#fae8c8]">
              SECURITY & ACCESS AUDIT
            </span>
            <span className="text-xs text-stone-500">· Admin Access Only</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            Customer Logins & Activity
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Realtime monitoring of shopper logins, registered user accounts, device telemetry, and security access.
          </p>
        </div>

        {/* Security Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-stone-900/80 border border-[#d4af37]/30 text-stone-200 text-xs shadow-sm self-start md:self-auto">
          <Lock className="h-4 w-4 text-[#d4af37]" />
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-mono">
              Protected Endpoint
            </span>
            <span className="font-medium text-[#fae8c8]">Encrypted Session (256-bit)</span>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Unique Shoppers Today */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-[#d4af37]/30 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 font-mono">
              Active Shoppers Today
            </span>
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity className="h-4 w-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-stone-900 dark:text-stone-100">
              {todayUniqueUsers}
            </span>
            <span className="text-xs font-medium text-emerald-500">Live Today</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Unique accounts accessed mall services</p>
        </div>

        {/* Card 2: Registered Shoppers */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 font-mono">
              Registered Shoppers
            </span>
            <div className="h-8 w-8 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-stone-900 dark:text-stone-100">
              {totalCustomers}
            </span>
            <span className="text-xs font-medium text-[#d4af37]">VIP Members</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Total registered customer accounts</p>
        </div>

        {/* Card 3: Today's Login Sessions */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 font-mono">
              Today's Logins
            </span>
            <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-stone-900 dark:text-stone-100">
              {todayLogs.length}
            </span>
            <span className="text-xs font-medium text-blue-400">Auth Events</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Successful sign-ins since midnight</p>
        </div>

        {/* Card 4: Store Merchants */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 font-mono">
              Store Merchants
            </span>
            <div className="h-8 w-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Shield className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-stone-900 dark:text-stone-100">
              {totalStoreOwners}
            </span>
            <span className="text-xs font-medium text-purple-400">Active Shops</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Assigned merchant and POS operators</p>
        </div>
      </div>

      {/* Main Interactive Table */}
      <UserLoginsTable initialLogs={formattedLogs} />
    </div>
  )
}

