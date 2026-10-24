import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatINR } from '@/lib/utils'
import { connection } from 'next/server'

export const dynamic = 'force-dynamic'

export default async function AdminReportsPage() {
  await connection()
  
  const sales = await prisma.sale.findMany({
    where: { status: 'COMPLETED' },
    include: { store: true, items: true, customer: true },
    orderBy: { createdAt: 'desc' }
  })
  
  const totalSalesCount = sales.length

  const totalNet = sales.reduce((sum, s) => sum + s.total, 0)
  const totalItemsSold = sales.reduce((sum, s) => sum + s.items.reduce((q, i) => q + i.quantity, 0), 0)
  const averageInvoice = totalSalesCount > 0 ? totalNet / totalSalesCount : 0

  const rents = await prisma.rent.findMany()
  const expectedRent = rents.reduce((sum, r) => sum + r.amount, 0)
  const paidRent = rents.filter(r => r.status === 'PAID').reduce((sum, r) => sum + r.amount, 0)
  const pendingRent = rents.filter(r => r.status === 'PENDING').reduce((sum, r) => sum + r.amount, 0)
  const overdueRent = rents.filter(r => r.status === 'OVERDUE').reduce((sum, r) => sum + r.amount, 0)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">System Reports</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Net Sales Revenue</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatINR(totalNet)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Invoices</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalSalesCount}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Items Sold</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalItemsSold}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Average Invoice</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatINR(averageInvoice)}</div></CardContent></Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Expected Rent</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatINR(expectedRent)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Rent Collected</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">{formatINR(paidRent)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Rent Pending</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatINR(pendingRent)}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Rent Overdue</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-red-500">{formatINR(overdueRent)}</div></CardContent></Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Detailed Sales Report</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="overflow-x-auto h-96 overflow-y-auto relative">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-900 sticky top-0 border-b">
                <tr>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Store</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3 text-right">Subtotal</th>
                  <th className="px-4 py-3 text-right">Tax</th>
                  <th className="px-4 py-3 text-right">Net Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-b dark:border-zinc-800">
                    <td className="px-4 py-3 font-medium">{sale.invoiceNumber}</td>
                    <td className="px-4 py-3">{new Date(sale.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{sale.store.name}</td>
                    <td className="px-4 py-3">{sale.customer?.name || 'Walk-in'}</td>
                    <td className="px-4 py-3">{sale.items.length}</td>
                    <td className="px-4 py-3 text-right">{formatINR(sale.subtotal)}</td>
                    <td className="px-4 py-3 text-right">{formatINR(sale.tax)}</td>
                    <td className="px-4 py-3 font-bold text-right">{formatINR(sale.total)}</td>
                  </tr>
                ))}
                {sales.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                      No sales records found.
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
