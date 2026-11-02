import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {

  Users,
  ShoppingCart,
  IndianRupee,
  AlertCircle,
  TrendingUp,
  Package,
  UserCheck,
  Building2,
  Receipt,
} from 'lucide-react'
import { connection } from 'next/server'
import { formatINR } from '@/lib/utils'
import { AdminCharts } from '@/components/AdminCharts'
import Link from 'next/link'

export default async function AdminDashboard() {
  await connection()

  // --- Counts ---
  const totalStores = await prisma.store.count()
  const activeStores = await prisma.store.count({ where: { status: 'ACTIVE' } })
  const storeOwners = await prisma.user.count({ where: { role: 'STORE_OWNER' } })
  const employees = await prisma.employee.count()
  const customers = await prisma.customer.count()
  const totalProducts = await prisma.product.count()

  // --- Sales ---
  const salesAgg = await prisma.sale.aggregate({
    _sum: { total: true },
    _count: { id: true },
  })
  const totalRevenue = salesAgg._sum.total ?? 0
  const totalSalesCount = salesAgg._count.id

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const currentMonthSales = await prisma.sale.aggregate({
    where: { createdAt: { gte: startOfMonth } },
    _sum: { total: true },
    _count: { id: true },
  })

  // --- Rent ---
  const pendingRent = await prisma.rent.aggregate({
    where: { status: 'PENDING' },
    _sum: { amount: true },
  })
  const overdueRent = await prisma.rent.aggregate({
    where: { status: 'OVERDUE' },
    _sum: { amount: true },
  })

  // --- Complaints ---
  const openComplaints = await prisma.complaint.count({
    where: { status: { in: ['PENDING', 'IN_PROGRESS'] } },
  })

  // --- Low Stock ---
  const products = await prisma.product.findMany({
    select: { currentStock: true, minimumStock: true },
  })
  const lowStockProducts = products.filter((p) => p.currentStock <= p.minimumStock).length

  // ============================================================
  // Chart Data — all from DB
  // ============================================================

  // Revenue by month (last 6 months)
  const salesByMonth = (await prisma.$queryRaw`
    SELECT strftime('%Y-%m', createdAt) as month,
           SUM(total)                    as total,
           COUNT(id)                     as cnt
    FROM Sale
    GROUP BY month
    ORDER BY month DESC
    LIMIT 6
  `) as { month: string; total: number; cnt: number }[]

  const salesData = salesByMonth
    .map((s) => ({ name: s.month, total: Number(s.total) || 0, count: Number(s.cnt) || 0 }))
    .reverse()

  // Rent breakdown
  const allRent = await prisma.rent.groupBy({
    by: ['status'],
    _sum: { amount: true },
  })
  const rentData = allRent.map((r) => ({
    name: r.status,
    value: r._sum.amount || 0,
    color:
      r.status === 'PAID' ? '#10b981' : r.status === 'PENDING' ? '#f59e0b' : '#ef4444',
  }))

  // Complaint breakdown
  const allComplaints = await prisma.complaint.groupBy({
    by: ['status'],
    _count: { id: true },
  })
  const complaintData = allComplaints.map((c) => ({
    name: c.status,
    count: c._count.id,
  }))

  // Store performance (top 8 by revenue)
  const storeSales = (await prisma.$queryRaw`
    SELECT s.name as storeName, SUM(sa.total) as revenue, COUNT(sa.id) as saleCount
    FROM Sale sa
    JOIN Store s ON sa.storeId = s.id
    GROUP BY sa.storeId, s.name
    ORDER BY revenue DESC
    LIMIT 8
  `) as { storeName: string; revenue: number; saleCount: number }[]

  const storePerformanceData = storeSales.map((s) => ({
    name: s.storeName,
    revenue: Number(s.revenue) || 0,
    sales: Number(s.saleCount) || 0,
  }))

  // Inventory summary
  const inventoryData = [
    {
      name: 'Healthy',
      value: products.filter((p) => p.currentStock > p.minimumStock).length,
      color: '#10b981',
    },
    {
      name: 'Low Stock',
      value: products.filter((p) => p.currentStock > 0 && p.currentStock <= p.minimumStock)
        .length,
      color: '#f59e0b',
    },
    {
      name: 'Out of Stock',
      value: products.filter((p) => p.currentStock === 0).length,
      color: '#ef4444',
    },
  ].filter((d) => d.value > 0)

  return (
    <div className="space-y-8">
      {/* Executive Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden border border-[#d4af37]/30 bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/35 text-[#fae8c8] text-xs font-medium mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>AURELIA EXECUTIVE INTELLIGENCE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#fae8c8] via-[#e6ca85] to-[#c5a059]">
              Mall Operations &amp; Financial Overview
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm mt-1 max-w-2xl font-light">
              Real-time enterprise analytics across all retail stores, tenant leasing, financial streams, and visitor operations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/stores"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#fae8c8] via-[#d4af37] to-[#b38728] text-stone-950 text-xs font-semibold hover:brightness-105 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Building2 className="h-4 w-4" />
              <span>Manage Stores ({totalStores})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Row 1 — Financial Performance */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 w-1 bg-[#d4af37] rounded-full" />
            <h2 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-widest font-mono">
              Financial Performance &amp; Revenue
            </h2>
          </div>
          <span className="text-[11px] text-stone-400 font-mono">Currency INR (₹)</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            href="/admin/reports"
            title="Total Mall Revenue"
            value={formatINR(totalRevenue)}
            subtitle="Gross aggregated sales"
            icon={IndianRupee}
            accent="gold"
          />
          <DashboardCard
            href="/admin/reports"
            title="This Month Sales"
            value={formatINR(currentMonthSales._sum.total)}
            subtitle={`${currentMonthSales._count.id} completed invoices`}
            icon={TrendingUp}
            accent="emerald"
          />
          <DashboardCard
            href="/admin/rent"
            title="Pending Tenant Rent"
            value={formatINR(pendingRent._sum.amount)}
            subtitle="Awaiting tenant settlement"
            icon={IndianRupee}
            accent="amber"
          />
          <DashboardCard
            href="/admin/rent"
            title="Overdue Rent"
            value={formatINR(overdueRent._sum.amount)}
            subtitle={overdueRent._sum.amount ? 'Immediate action required' : 'All accounts in good standing'}
            icon={AlertCircle}
            accent={overdueRent._sum.amount ? 'rose' : 'default'}
          />
        </div>
      </div>

      {/* Row 2 — Mall Operations & Directory */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-1 bg-blue-500 rounded-full" />
          <h2 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-widest font-mono">
            Mall Operations &amp; Directory
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            href="/admin/stores"
            title="Retail Stores"
            value={totalStores}
            subtitle={`${activeStores} actively operational`}
            icon={Building2}
            accent="sapphire"
          />
          <DashboardCard
            href="/admin/owners"
            title="Registered Store Owners"
            value={storeOwners}
            subtitle="Authorized tenant logins"
            icon={UserCheck}
            accent="violet"
          />
          <DashboardCard
            href="/admin/employees"
            title="Mall Staff &amp; Employees"
            value={employees}
            subtitle="Security, facilities & service"
            icon={Users}
            accent="sky"
          />
          <DashboardCard
            href="/admin/customers"
            title="Registered Customers"
            value={customers}
            subtitle="Loyalty & VIP members"
            icon={Users}
            accent="teal"
          />
        </div>
      </div>

      {/* Row 3 — Inventory & Support Intelligence */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-1 bg-stone-500 rounded-full" />
          <h2 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-widest font-mono">
            Inventory Health &amp; Tenant Support
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            href="/admin/reports"
            title="Total Sales Count"
            value={totalSalesCount}
            subtitle="All-time verified receipts"
            icon={Receipt}
            accent="sapphire"
          />
          <DashboardCard
            title="Catalogued Products"
            value={totalProducts}
            subtitle="Across all brand categories"
            icon={Package}
            accent="default"
          />
          <DashboardCard
            title="Low Stock Warning"
            value={lowStockProducts}
            subtitle={lowStockProducts > 0 ? 'Requires store restocking' : 'Inventory levels healthy'}
            icon={ShoppingCart}
            accent={lowStockProducts > 0 ? 'rose' : 'default'}
          />
          <DashboardCard
            href="/admin/complaints"
            title="Active Complaints"
            value={openComplaints}
            subtitle={openComplaints > 0 ? 'Pending resolution' : 'Zero active grievances'}
            icon={AlertCircle}
            accent={openComplaints > 0 ? 'amber' : 'default'}
          />
        </div>
      </div>

      {/* Row 4 — Charts & Interactive Analytics */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-3 w-1 bg-[#d4af37] rounded-full" />
          <h2 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-widest font-mono">
            Interactive Analytics &amp; Visual Trends
          </h2>
        </div>

        <AdminCharts
          salesData={salesData}
          rentData={rentData}
          complaintData={complaintData}
          storePerformanceData={storePerformanceData}
          inventoryData={inventoryData}
        />
      </div>
    </div>
  )
}

type Accent = 'gold' | 'emerald' | 'amber' | 'rose' | 'sapphire' | 'violet' | 'sky' | 'teal' | 'default'

interface AccentConfig {
  borderTop: string
  iconBg: string
  valueText: string
}

const accentConfig: Record<Accent, AccentConfig> = {
  gold: {
    borderTop: 'bg-gradient-to-r from-[#fae8c8] via-[#d4af37] to-[#b38728]',
    iconBg: 'bg-[#d4af37]/15 text-[#9b7324] dark:text-[#fae8c8] border border-[#d4af37]/30',
    valueText: 'text-stone-950 dark:text-[#fae8c8]',
  },
  emerald: {
    borderTop: 'bg-emerald-500',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40',
    valueText: 'text-emerald-700 dark:text-emerald-300',
  },
  amber: {
    borderTop: 'bg-amber-500',
    iconBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/40',
    valueText: 'text-amber-700 dark:text-amber-300',
  },
  rose: {
    borderTop: 'bg-rose-500',
    iconBg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-800/40',
    valueText: 'text-rose-700 dark:text-rose-300',
  },
  sapphire: {
    borderTop: 'bg-blue-600',
    iconBg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40',
    valueText: 'text-blue-800 dark:text-blue-300',
  },
  violet: {
    borderTop: 'bg-violet-600',
    iconBg: 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-200/50 dark:border-violet-800/40',
    valueText: 'text-violet-800 dark:text-violet-300',
  },
  sky: {
    borderTop: 'bg-sky-500',
    iconBg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/40',
    valueText: 'text-sky-800 dark:text-sky-300',
  },
  teal: {
    borderTop: 'bg-teal-600',
    iconBg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-200/50 dark:border-teal-800/40',
    valueText: 'text-teal-800 dark:text-teal-300',
  },
  default: {
    borderTop: 'bg-stone-300 dark:bg-stone-700',
    iconBg: 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700',
    valueText: 'text-stone-900 dark:text-stone-100',
  },
}

function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = 'default',
  href,
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  accent?: Accent
  href?: string
}) {
  const conf = accentConfig[accent]

  const cardContent = (
    <div
      className={`h-full rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300 p-5 flex flex-col justify-between relative overflow-hidden group ${href ? 'hover:-translate-y-1 cursor-pointer' : ''
        }`}
    >
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${conf.borderTop}`} />

      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider font-mono">
            {title}
          </span>
          <div
            className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${conf.iconBg}`}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className={`text-2xl sm:text-[26px] font-bold tracking-tight font-serif ${conf.valueText}`}>
          {value}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs">
        {subtitle ? (
          <span className="text-stone-500 font-medium truncate pr-2">{subtitle}</span>
        ) : (
          <span className="text-stone-400 text-[11px]">Mall System</span>
        )}

        {href && (
          <span className="text-[11px] font-semibold text-stone-400 group-hover:text-[#d4af37] transition-colors flex items-center gap-1 flex-shrink-0">
            <span>Manage</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        )}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {cardContent}
      </Link>
    )
  }
  return cardContent
}
