import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatINR } from '@/lib/utils'
import { connection } from 'next/server'
import Link from 'next/link'
import {
  Calendar,
  CalendarDays,
  History,
  AlertCircle,
  FileBarChart,
  CheckCircle2,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams?: Promise<{ filter?: string }>
}

export default async function AdminReportsPage({ searchParams }: Props) {
  await connection()

  const params = searchParams ? await searchParams : {}
  const activeFilter = params.filter === 'today' ? 'today' : params.filter === 'month' ? 'month' : 'all'

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)

  let dateCondition: Record<string, any> = {}
  if (activeFilter === 'today') {
    dateCondition = { createdAt: { gte: startOfDay } }
  } else if (activeFilter === 'month') {
    dateCondition = { createdAt: { gte: startOfMonth } }
  }

  const [
    sales,
    todayCount,
    monthCount,
    allCount,
    rents,
  ] = await Promise.all([
    prisma.sale.findMany({
      where: {
        status: 'COMPLETED',
        ...dateCondition,
      },
      include: { store: true, items: true, customer: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.sale.count({
      where: { status: 'COMPLETED', createdAt: { gte: startOfDay } },
    }),
    prisma.sale.count({
      where: { status: 'COMPLETED', createdAt: { gte: startOfMonth } },
    }),
    prisma.sale.count({
      where: { status: 'COMPLETED' },
    }),
    prisma.rent.findMany(),
  ])

  const totalSalesCount = sales.length
  const totalNet = sales.reduce((sum, s) => sum + s.total, 0)
  const totalItemsSold = sales.reduce(
    (sum, s) => sum + s.items.reduce((q, i) => q + i.quantity, 0),
    0
  )
  const averageInvoice = totalSalesCount > 0 ? totalNet / totalSalesCount : 0

  const expectedRent = rents.reduce((sum, r) => sum + r.amount, 0)
  const paidRent = rents.filter((r) => r.status === 'PAID').reduce((sum, r) => sum + r.amount, 0)
  const pendingRent = rents
    .filter((r) => r.status === 'PENDING')
    .reduce((sum, r) => sum + r.amount, 0)
  const overdueRent = rents
    .filter((r) => r.status === 'OVERDUE')
    .reduce((sum, r) => sum + r.amount, 0)

  const filterLabels: Record<string, { title: string; subtitle: string }> = {
    today: {
      title: "Today's Mall Invoices",
      subtitle: `Displaying invoices generated across all stores today (${now.toLocaleDateString('en-IN', { dateStyle: 'full' })})`,
    },
    month: {
      title: "This Month's Invoices",
      subtitle: `Displaying invoices for ${now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`,
    },
    all: {
      title: 'All Mall Invoices (Historical)',
      subtitle: 'Displaying complete aggregate mall sales records',
    },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100">
            {filterLabels[activeFilter].title}
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1 font-light">
            {filterLabels[activeFilter].subtitle}
          </p>
        </div>
      </div>

      {/* Date Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-stone-200/70 dark:bg-stone-900/80 w-fit border border-stone-300/60 dark:border-stone-800">
        <Link
          href="/admin/reports?filter=today"
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
            activeFilter === 'today'
              ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold shadow-sm border border-stone-200/80 dark:border-stone-700'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <Calendar className="h-3.5 w-3.5 text-emerald-600" />
          <span>Today ({todayCount})</span>
        </Link>

        <Link
          href="/admin/reports?filter=month"
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
            activeFilter === 'month'
              ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold shadow-sm border border-stone-200/80 dark:border-stone-700'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <CalendarDays className="h-3.5 w-3.5 text-[#d4af37]" />
          <span>This Month ({monthCount})</span>
        </Link>

        <Link
          href="/admin/reports?filter=all"
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
            activeFilter === 'all'
              ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold shadow-sm border border-stone-200/80 dark:border-stone-700'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <History className="h-3.5 w-3.5 text-stone-500" />
          <span>All Invoices ({allCount})</span>
        </Link>
      </div>

      {/* KPI Cards for active period */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-stone-200/80 dark:border-stone-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-stone-500">
              Selected Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {formatINR(totalNet)}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-stone-200/80 dark:border-stone-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-stone-500">
              Selected Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {totalSalesCount}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-stone-200/80 dark:border-stone-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-stone-500">
              Items Sold
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {totalItemsSold}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-stone-200/80 dark:border-stone-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-stone-500">
              Average Ticket
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {formatINR(averageInvoice)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rent Summary (for reference) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
        <Card className="rounded-2xl border-stone-200/80 dark:border-stone-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-stone-500">
              Expected Tenant Rent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-serif font-bold">{formatINR(expectedRent)}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-stone-200/80 dark:border-stone-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-stone-500">
              Rent Collected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-serif font-bold text-emerald-600">
              {formatINR(paidRent)}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-stone-200/80 dark:border-stone-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-stone-500">
              Rent Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-serif font-bold text-amber-600">
              {formatINR(pendingRent)}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-stone-200/80 dark:border-stone-800 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono uppercase tracking-wider text-stone-500">
              Rent Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-serif font-bold text-rose-600">
              {formatINR(overdueRent)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Invoices Report Card */}
      <Card className="rounded-2xl border-stone-200/80 dark:border-stone-800 shadow-sm overflow-hidden mt-6">
        <CardHeader className="bg-stone-50/60 dark:bg-stone-900/60 border-b border-stone-200/80 dark:border-stone-800 py-4 px-6 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold text-stone-800 dark:text-stone-200">
            {filterLabels[activeFilter].title} ({sales.length})
          </CardTitle>
          <span className="text-xs text-stone-500 font-mono">
            Total: {formatINR(totalNet)}
          </span>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto relative">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] font-mono uppercase text-stone-500 bg-stone-50 dark:bg-stone-900/90 border-b border-stone-200/80 dark:border-stone-800 sticky top-0 z-10">
                <tr>
                  <th className="px-5 py-3.5">Invoice #</th>
                  <th className="px-5 py-3.5">Date &amp; Time</th>
                  <th className="px-5 py-3.5">Boutique Store</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5 text-center">Items</th>
                  <th className="px-5 py-3.5 text-right">Subtotal</th>
                  <th className="px-5 py-3.5 text-right">Tax</th>
                  <th className="px-5 py-3.5 text-right">Net Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition-colors">
                    <td className="px-5 py-3.5 font-medium font-mono text-stone-900 dark:text-stone-100">
                      {sale.invoiceNumber}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-stone-500">
                      {new Date(sale.createdAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-stone-800 dark:text-stone-200 font-medium">
                      {sale.store.name}
                    </td>
                    <td className="px-5 py-3.5 text-stone-600 dark:text-stone-400">
                      {sale.customer?.name || 'Walk-in'}
                    </td>
                    <td className="px-5 py-3.5 text-center text-xs text-stone-500">
                      {sale.items.length}
                    </td>
                    <td className="px-5 py-3.5 text-right text-stone-600 dark:text-stone-400">
                      {formatINR(sale.subtotal)}
                    </td>
                    <td className="px-5 py-3.5 text-right text-stone-500 text-xs">
                      {formatINR(sale.tax)}
                    </td>
                    <td className="px-5 py-3.5 font-serif font-bold text-right text-stone-900 dark:text-stone-100">
                      {formatINR(sale.total)}
                    </td>
                  </tr>
                ))}

                {sales.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-14 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                        <div className="h-12 w-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                          <AlertCircle className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-stone-800 dark:text-stone-200 text-sm">
                          {activeFilter === 'today'
                            ? 'No Invoices Recorded Today (0 Sales)'
                            : activeFilter === 'month'
                            ? 'No Invoices Recorded This Month (0 Sales)'
                            : 'No Invoices Found'}
                        </h3>
                        <p className="text-xs text-stone-500 font-light">
                          {activeFilter === 'today'
                            ? "There are zero sales transactions recorded for today across the mall. Historical transactions are available under 'All Invoices'."
                            : activeFilter === 'month'
                            ? "There are zero sales recorded for the current month so far."
                            : 'No sales records found in the database.'}
                        </p>
                        {activeFilter !== 'all' && (
                          <Link
                            href="/admin/reports?filter=all"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-200 transition-all border border-stone-200 dark:border-stone-700 mt-2"
                          >
                            <History className="h-3.5 w-3.5" />
                            <span>View All Historical Invoices ({allCount})</span>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
