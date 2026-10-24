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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Dashboard Overview
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Real-time statistics from the entire mall system
        </p>
      </div>

      {/* Row 1 — Financial KPIs */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Financial
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            href="/admin/reports"
            title="Total Revenue"
            value={formatINR(totalRevenue)}
            icon={IndianRupee}
            accent="blue"
          />
          <DashboardCard
            href="/admin/reports"
            title="This Month Sales"
            value={formatINR(currentMonthSales._sum.total)}
            subtitle={`${currentMonthSales._count.id} invoices`}
            icon={TrendingUp}
            accent="green"
          />
          <DashboardCard
            href="/admin/rent"
            title="Pending Rent"
            value={formatINR(pendingRent._sum.amount)}
            icon={IndianRupee}
            accent="yellow"
          />
          <DashboardCard
            href="/admin/rent"
            title="Overdue Rent"
            value={formatINR(overdueRent._sum.amount)}
            icon={AlertCircle}
            accent={overdueRent._sum.amount ? 'red' : 'default'}
          />
        </div>
      </div>

      {/* Row 2 — Operations KPIs */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Operations
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            href="/admin/stores"
            title="Total Stores"
            value={totalStores}
            subtitle={`${activeStores} active`}
            icon={Building2}
            accent="blue"
          />
          <DashboardCard
            href="/admin/owners"
            title="Store Owners"
            value={storeOwners}
            icon={UserCheck}
            accent="indigo"
          />
          <DashboardCard
            href="/admin/employees"
            title="Employees"
            value={employees}
            icon={Users}
            accent="violet"
          />
          <DashboardCard
            href="/admin/customers"
            title="Customers"
            value={customers}
            icon={Users}
            accent="sky"
          />
        </div>
      </div>

      {/* Row 3 — Inventory & Support KPIs */}
      <div>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Inventory &amp; Support
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            href="/admin/reports"
            title="Total Sales"
            value={totalSalesCount}
            subtitle="all time invoices"
            icon={Receipt}
            accent="teal"
          />
          <DashboardCard
            title="Total Products"
            value={totalProducts}
            icon={Package}
            accent="default"
          />
          <DashboardCard
            title="Low Stock Products"
            value={lowStockProducts}
            icon={ShoppingCart}
            accent={lowStockProducts > 0 ? 'red' : 'default'}
          />
          <DashboardCard
            href="/admin/complaints"
            title="Open Complaints"
            value={openComplaints}
            icon={AlertCircle}
            accent={openComplaints > 0 ? 'yellow' : 'default'}
          />
        </div>
      </div>

      <AdminCharts
        salesData={salesData}
        rentData={rentData}
        complaintData={complaintData}
        storePerformanceData={storePerformanceData}
        inventoryData={inventoryData}
      />
    </div>
  )
}

type Accent = 'blue' | 'green' | 'red' | 'yellow' | 'indigo' | 'violet' | 'sky' | 'teal' | 'default'

const accentMap: Record<Accent, { card: string; icon: string; value: string }> = {
  blue: {
    card: 'border-l-4 border-l-blue-500',
    icon: 'text-blue-500',
    value: 'text-blue-700 dark:text-blue-300',
  },
  green: {
    card: 'border-l-4 border-l-emerald-500',
    icon: 'text-emerald-500',
    value: 'text-emerald-700 dark:text-emerald-300',
  },
  red: {
    card: 'border-l-4 border-l-red-500',
    icon: 'text-red-500',
    value: 'text-red-600 dark:text-red-400',
  },
  yellow: {
    card: 'border-l-4 border-l-amber-400',
    icon: 'text-amber-500',
    value: 'text-amber-700 dark:text-amber-300',
  },
  indigo: {
    card: 'border-l-4 border-l-indigo-500',
    icon: 'text-indigo-500',
    value: 'text-indigo-700 dark:text-indigo-300',
  },
  violet: {
    card: 'border-l-4 border-l-violet-500',
    icon: 'text-violet-500',
    value: 'text-violet-700 dark:text-violet-300',
  },
  sky: {
    card: 'border-l-4 border-l-sky-500',
    icon: 'text-sky-500',
    value: 'text-sky-700 dark:text-sky-300',
  },
  teal: {
    card: 'border-l-4 border-l-teal-500',
    icon: 'text-teal-500',
    value: 'text-teal-700 dark:text-teal-300',
  },
  default: {
    card: '',
    icon: 'text-muted-foreground',
    value: '',
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
  const a = accentMap[accent]

  const cardContent = (
    <Card
      className={`h-full transition-all duration-200 ${a.card} ${href ? 'hover:shadow-md hover:-translate-y-0.5' : ''}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </CardTitle>
        <div
          className={`h-8 w-8 rounded-lg flex items-center justify-center ${accent !== 'default' ? 'bg-current/10' : 'bg-muted'}`}
          style={{ backgroundColor: accent !== 'default' ? undefined : undefined }}
        >
          <Icon className={`h-4 w-4 ${a.icon}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${a.value}`}>{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
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
