import prisma from '@/lib/prisma'
import { connection } from 'next/server'
import { getSession } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Package,
  ShoppingBag,
  Receipt,
  AlertTriangle,
  TrendingUp,
  Users,
  IndianRupee,
  BarChart2,
} from 'lucide-react'
import { formatINR } from '@/lib/utils'
import { StoreCharts } from '@/components/StoreCharts'
import Link from 'next/link'

export default async function StoreDashboard() {
  await connection()
  const session = await getSession()

  if (!session) return null

  // SECURITY: storeId comes from the server-side session JWT, NOT from the browser
  const storeId = session.storeId as string

  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  // KPI aggregates — all scoped to THIS store only
  const [todaySales, monthlySales, totalProductsCount] = await Promise.all([
    prisma.sale.aggregate({
      where: { storeId, createdAt: { gte: startOfDay } },
      _sum: { total: true },
      _count: { id: true },
    }),
    prisma.sale.aggregate({
      where: { storeId, createdAt: { gte: startOfMonth } },
      _sum: { total: true },
      _count: { id: true },
    }),
    prisma.product.count({ where: { storeId } }),
  ])

  // Products for stock analysis
  const products = await prisma.product.findMany({
    where: { storeId },
    select: { id: true, name: true, currentStock: true, minimumStock: true },
  })
  const totalStock = products.reduce((acc, p) => acc + p.currentStock, 0)
  const lowStockCount = products.filter(
    (p) => p.currentStock > 0 && p.currentStock <= p.minimumStock
  ).length
  const outOfStockCount = products.filter((p) => p.currentStock === 0).length

  // All-time revenue for this store
  const allTimeRevenue = await prisma.sale.aggregate({
    where: { storeId },
    _sum: { total: true },
    _count: { id: true },
  })
  const totalRevenue = allTimeRevenue._sum.total ?? 0

  // Unique customers served (sale linked to a customer)
  const uniqueCustomerCount = await prisma.sale
    .groupBy({
      by: ['customerId'],
      where: { storeId, customerId: { not: null } },
    })
    .then((rows) => rows.length)

  // ============================================================
  // Chart Data — scoped to this store
  // ============================================================

  // Daily sales last 7 days
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 6)

  const dailySalesByDate = (await prisma.$queryRaw`
    SELECT date(createdAt) as day, SUM(total) as total, COUNT(id) as cnt
    FROM Sale
    WHERE storeId = ${storeId} AND createdAt >= ${sevenDaysAgo}
    GROUP BY day
    ORDER BY day ASC
  `) as { day: string; total: number; cnt: number }[]

  const salesData = dailySalesByDate.map((d) => ({
    name: new Date(d.day + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }),
    total: Number(d.total) || 0,
    count: Number(d.cnt) || 0,
  }))

  // Inventory breakdown
  const inventoryData = [
    {
      name: 'In Stock',
      value: products.filter((p) => p.currentStock > p.minimumStock).length,
      color: '#10b981',
    },
    { name: 'Low Stock', value: lowStockCount, color: '#f59e0b' },
    { name: 'Out of Stock', value: outOfStockCount, color: '#ef4444' },
  ].filter((d) => d.value > 0)

  // Top products by quantity sold
  const saleItemsAgg = await prisma.saleItem.groupBy({
    by: ['productId'],
    where: { sale: { storeId } },
    _sum: { quantity: true, total: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 5,
  })

  const productIds = saleItemsAgg.map((i) => i.productId)
  const productNames = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, name: true },
  })
  const nameMap = Object.fromEntries(productNames.map((p) => [p.id, p.name]))

  const topProductsData = saleItemsAgg.map((i) => ({
    name: nameMap[i.productId] ?? 'Unknown',
    quantity: i._sum.quantity ?? 0,
    revenue: Number(i._sum.total) || 0,
  }))

  // Best selling product
  const bestSelling = topProductsData.length > 0 ? topProductsData[0].name : 'N/A'

  // Payment method breakdown
  const paymentBreakdown = await prisma.sale.groupBy({
    by: ['paymentMethod'],
    where: { storeId },
    _count: { id: true },
    _sum: { total: true },
  })
  const paymentData = paymentBreakdown.map((p) => ({
    name: p.paymentMethod,
    count: p._count.id,
    total: Number(p._sum.total) || 0,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#064e3b' }}>
          Store Dashboard
        </h1>
        <p className="text-emerald-700/60 text-sm mt-1">
          Live statistics for your store only
        </p>
      </div>

      {/* Row 1 — Today & Monthly */}
      <div>
        <h2 className="text-xs font-semibold text-emerald-700/50 uppercase tracking-widest mb-3">
          Today &amp; This Month
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            href="/store/sales"
            title="Today's Bills"
            value={formatINR(todaySales._sum.total)}
            subtitle={`${todaySales._count.id} bill${todaySales._count.id !== 1 ? 's' : ''} today`}
            icon={Receipt}
            accent="emerald"
          />
          <DashboardCard
            href="/store/reports"
            title="Monthly Bills"
            value={formatINR(monthlySales._sum.total)}
            subtitle={`${monthlySales._count.id} bills this month`}
            icon={Receipt}
            accent="teal"
          />
          <DashboardCard
            href="/store/sales"
            title="Today's Sales"
            value={todaySales._count.id}
            subtitle={formatINR(todaySales._sum.total)}
            icon={TrendingUp}
            accent="green"
          />
          <DashboardCard
            href="/store/reports"
            title="Monthly Sales"
            value={monthlySales._count.id}
            subtitle={formatINR(monthlySales._sum.total)}
            icon={BarChart2}
            accent="lime"
          />
        </div>
      </div>

      {/* Row 2 — Revenue & Customers */}
      <div>
        <h2 className="text-xs font-semibold text-emerald-700/50 uppercase tracking-widest mb-3">
          Revenue &amp; Customers
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            href="/store/reports"
            title="Total Revenue"
            value={formatINR(totalRevenue)}
            subtitle={`${allTimeRevenue._count.id} total invoices`}
            icon={IndianRupee}
            accent="emerald"
          />
          <DashboardCard
            href="/store/sales"
            title="Customers Served"
            value={uniqueCustomerCount}
            subtitle="unique customers"
            icon={Users}
            accent="teal"
          />
          <DashboardCard
            href="/store/products"
            title="Best-Selling"
            value={bestSelling}
            icon={TrendingUp}
            accent="green"
            truncateValue
          />
          <DashboardCard
            href="/store/products"
            title="Total Products"
            value={totalProductsCount}
            icon={Package}
            accent="default"
          />
        </div>
      </div>

      {/* Row 3 — Inventory */}
      <div>
        <h2 className="text-xs font-semibold text-emerald-700/50 uppercase tracking-widest mb-3">
          Inventory
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            href="/store/stock"
            title="Current Stock"
            value={totalStock}
            subtitle="total units"
            icon={Package}
            accent="default"
          />
          <DashboardCard
            href="/store/low-stock"
            title="Low Stock"
            value={lowStockCount}
            subtitle="products below minimum"
            icon={AlertTriangle}
            accent={lowStockCount > 0 ? 'yellow' : 'default'}
          />
          <DashboardCard
            href="/store/products"
            title="Out of Stock"
            value={outOfStockCount}
            icon={AlertTriangle}
            accent={outOfStockCount > 0 ? 'red' : 'default'}
          />
          <DashboardCard
            href="/store/products"
            title="Active Products"
            value={totalProductsCount - outOfStockCount}
            subtitle="with available stock"
            icon={ShoppingBag}
            accent="default"
          />
        </div>
      </div>

      <StoreCharts
        salesData={salesData}
        inventoryData={inventoryData}
        topProductsData={topProductsData}
        paymentData={paymentData}
      />
    </div>
  )
}

type StoreAccent =
  | 'emerald'
  | 'teal'
  | 'green'
  | 'lime'
  | 'yellow'
  | 'red'
  | 'default'

const accentMap: Record<StoreAccent, { card: string; icon: string; value: string }> = {
  emerald: {
    card: 'border-l-4 border-l-emerald-500',
    icon: 'text-emerald-600',
    value: 'text-emerald-800',
  },
  teal: {
    card: 'border-l-4 border-l-teal-500',
    icon: 'text-teal-600',
    value: 'text-teal-800',
  },
  green: {
    card: 'border-l-4 border-l-green-500',
    icon: 'text-green-600',
    value: 'text-green-800',
  },
  lime: {
    card: 'border-l-4 border-l-lime-500',
    icon: 'text-lime-600',
    value: 'text-lime-800',
  },
  yellow: {
    card: 'border-l-4 border-l-amber-400',
    icon: 'text-amber-600',
    value: 'text-amber-800',
  },
  red: {
    card: 'border-l-4 border-l-red-500',
    icon: 'text-red-600',
    value: 'text-red-700',
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
  truncateValue = false,
}: {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  accent?: StoreAccent
  href?: string
  truncateValue?: boolean
}) {
  const a = accentMap[accent]

  const cardContent = (
    <Card
      className={`h-full transition-all duration-200 bg-white ${a.card} ${href ? 'hover:shadow-md hover:-translate-y-0.5' : ''}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${a.icon}`} />
      </CardHeader>
      <CardContent>
        <div
          className={`text-2xl font-bold ${a.value} ${truncateValue ? 'truncate text-lg' : ''}`}
          title={truncateValue ? String(value) : undefined}
        >
          {value}
        </div>
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
