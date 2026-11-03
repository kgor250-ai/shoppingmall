import prisma from '@/lib/prisma'
import { connection } from 'next/server'
import { getSession } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import { formatINR } from '@/lib/utils'
import Link from 'next/link'
import {
  Receipt,
  Calendar,
  CalendarDays,
  History,
  PlusCircle,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function StoreSalesPage(props: {
  params?: Promise<Record<string, string | string[] | undefined>>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  await connection()
  const session = await getSession()
  if (!session?.storeId) redirect('/login')

  const params = props.searchParams ? await props.searchParams : {}
  const activeFilter = params.filter === 'today' ? 'today' : params.filter === 'month' ? 'month' : 'all'

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0)

  // Determine query condition based on filter
  let dateCondition: Record<string, any> = {}
  if (activeFilter === 'today') {
    dateCondition = { createdAt: { gte: startOfDay } }
  } else if (activeFilter === 'month') {
    dateCondition = { createdAt: { gte: startOfMonth } }
  }

  // Fetch sales and count metrics for all periods
  const [sales, todayCount, monthCount, allCount, todayTotalAgg, monthTotalAgg, allTotalAgg] = await Promise.all([
    prisma.sale.findMany({
      where: {
        storeId: session.storeId,
        ...dateCondition,
      },
      include: {
        customer: true,
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.sale.count({
      where: { storeId: session.storeId, createdAt: { gte: startOfDay } },
    }),
    prisma.sale.count({
      where: { storeId: session.storeId, createdAt: { gte: startOfMonth } },
    }),
    prisma.sale.count({
      where: { storeId: session.storeId },
    }),
    prisma.sale.aggregate({
      where: { storeId: session.storeId, createdAt: { gte: startOfDay } },
      _sum: { total: true },
    }),
    prisma.sale.aggregate({
      where: { storeId: session.storeId, createdAt: { gte: startOfMonth } },
      _sum: { total: true },
    }),
    prisma.sale.aggregate({
      where: { storeId: session.storeId },
      _sum: { total: true },
    }),
  ])

  const currentTotal = sales.reduce((acc, s) => acc + s.total, 0)

  const filterLabels: Record<string, { title: string; subtitle: string }> = {
    today: {
      title: "Today's Invoices",
      subtitle: `Displaying invoices generated today (${now.toLocaleDateString('en-IN', { dateStyle: 'full' })})`,
    },
    month: {
      title: "This Month's Invoices",
      subtitle: `Displaying invoices for ${now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`,
    },
    all: {
      title: 'All Invoices (Historical)',
      subtitle: 'Displaying complete sales transaction history',
    },
  }

  return (
    <div className="space-y-6">
      {/* Header with Title and Create New Bill Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100">
            {filterLabels[activeFilter].title}
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1 font-light">
            {filterLabels[activeFilter].subtitle}
          </p>
        </div>

        <Link
          href="/store/billing"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-xs font-semibold hover:brightness-105 shadow-md active:scale-95 transition-all self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Billing POS Sale</span>
        </Link>
      </div>

      {/* Date Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-stone-200/70 dark:bg-stone-900/80 w-fit border border-stone-300/60 dark:border-stone-800">
        <Link
          href="/store/sales?filter=today"
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
          href="/store/sales?filter=month"
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
            activeFilter === 'month'
              ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold shadow-sm border border-stone-200/80 dark:border-stone-700'
              : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <CalendarDays className="h-3.5 w-3.5 text-teal-600" />
          <span>This Month ({monthCount})</span>
        </Link>

        <Link
          href="/store/sales?filter=all"
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

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl p-4 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
            Selected Invoices Count
          </span>
          <div className="text-2xl font-bold font-serif text-stone-900 dark:text-stone-100 mt-1">
            {sales.length}
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
            Selected Sales Volume
          </span>
          <div className="text-2xl font-bold font-serif text-emerald-700 dark:text-emerald-400 mt-1">
            {formatINR(currentTotal)}
          </div>
        </div>

        <div className="rounded-2xl p-4 bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm">
          <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
            Store All-Time Total
          </span>
          <div className="text-2xl font-bold font-serif text-stone-600 dark:text-stone-300 mt-1">
            {formatINR(allTotalAgg._sum.total)}
          </div>
        </div>
      </div>

      {/* Invoices Table Card */}
      <Card className="rounded-2xl border-stone-200/80 dark:border-stone-800 shadow-sm overflow-hidden">
        <CardHeader className="bg-stone-50/60 dark:bg-stone-900/60 border-b border-stone-200/80 dark:border-stone-800 py-4 px-6 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold text-stone-800 dark:text-stone-200">
            {filterLabels[activeFilter].title} ({sales.length})
          </CardTitle>
          <span className="text-xs text-stone-500 font-mono">
            Total: {formatINR(currentTotal)}
          </span>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[11px] font-mono uppercase text-stone-500 bg-stone-50 dark:bg-stone-900/90 border-b border-stone-200/80 dark:border-stone-800">
                <tr>
                  <th className="px-5 py-3.5">Invoice #</th>
                  <th className="px-5 py-3.5">Date &amp; Time</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Items</th>
                  <th className="px-5 py-3.5">Payment</th>
                  <th className="px-5 py-3.5 text-right">Total Amount</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
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
                    <td className="px-5 py-3.5 text-stone-700 dark:text-stone-300">
                      {sale.customer?.name || 'Walk-in Customer'}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-stone-500">
                      {sale.items?.length || 1} item{sale.items?.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-mono">
                        {sale.paymentMethod}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-serif font-bold text-right text-stone-900 dark:text-stone-100">
                      {formatINR(sale.total)}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>COMPLETED</span>
                      </span>
                    </td>
                  </tr>
                ))}

                {sales.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-14 text-center">
                      <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                        <div className="h-12 w-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
                          <AlertCircle className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-stone-800 dark:text-stone-200 text-sm">
                          {activeFilter === 'today'
                            ? 'No Invoices Generated Today (0 Sales)'
                            : activeFilter === 'month'
                            ? 'No Invoices This Month (0 Sales)'
                            : 'No Invoices Found'}
                        </h3>
                        <p className="text-xs text-stone-500 font-light">
                          {activeFilter === 'today'
                            ? "There are 0 sales recorded for today. Previous transactions are stored under the 'All Invoices' tab."
                            : "No invoices matched the selected filter."}
                        </p>
                        <div className="flex items-center gap-2 pt-2">
                          <Link
                            href="/store/billing"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-sm"
                          >
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span>Create Sale in POS</span>
                          </Link>
                          {activeFilter !== 'all' && (
                            <Link
                              href="/store/sales?filter=all"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-200 transition-all border border-stone-200 dark:border-stone-700"
                            >
                              <History className="h-3.5 w-3.5" />
                              <span>View All Invoices ({allCount})</span>
                            </Link>
                          )}
                        </div>
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
