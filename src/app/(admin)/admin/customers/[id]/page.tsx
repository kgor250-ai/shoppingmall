import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatINR } from '@/lib/utils'
import { connection } from 'next/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminCustomerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await connection()
  const { id } = await params

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      sales: {
        where: { status: 'COMPLETED' },
        orderBy: { createdAt: 'desc' },
        include: {
          store: true,
          items: { include: { product: true } }
        }
      }
    }
  })

  if (!customer) {
    notFound()
  }

  const totalBills = customer.sales.length
  const totalAmount = customer.sales.reduce((sum, sale) => sum + sale.total, 0)
  const totalQuantity = customer.sales.reduce((sum, sale) => 
    sum + sale.items.reduce((qSum, item) => qSum + item.quantity, 0), 0)
  
  const averageBill = totalBills > 0 ? totalAmount / totalBills : 0
  const firstPurchase = totalBills > 0 ? customer.sales[totalBills - 1].createdAt : null
  const lastPurchase = totalBills > 0 ? customer.sales[0].createdAt : null

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Customer Details</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Name:</strong> {customer.name}</p>
            <p><strong>Phone:</strong> {customer.phone || 'N/A'}</p>
            <p><strong>Email:</strong> {customer.email || 'N/A'}</p>
            <p><strong>Address:</strong> {customer.address || 'N/A'}</p>
            <p><strong>Registered:</strong> {new Date(customer.createdAt).toLocaleDateString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Purchase Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Total Bills:</strong> {totalBills}</p>
            <p><strong>Total Quantity Purchased:</strong> {totalQuantity} items</p>
            <p><strong>Total Billing Amount:</strong> <span className="font-bold">{formatINR(totalAmount)}</span></p>
            <p><strong>Average Bill Value:</strong> {formatINR(averageBill)}</p>
            <p><strong>First Purchase:</strong> {firstPurchase ? new Date(firstPurchase).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Last Purchase:</strong> {lastPurchase ? new Date(lastPurchase).toLocaleDateString() : 'N/A'}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-900 border-b">
                <tr>
                  <th className="px-4 py-3">Invoice / Date</th>
                  <th className="px-4 py-3">Store</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total Amount</th>
                  <th className="px-4 py-3">Method</th>
                </tr>
              </thead>
              <tbody>
                {customer.sales.map((sale) => (
                  <tr key={sale.id} className="border-b dark:border-zinc-800">
                    <td className="px-4 py-3">
                      <div className="font-medium">{sale.invoiceNumber}</div>
                      <div className="text-xs text-muted-foreground">{new Date(sale.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-4 py-3">{sale.store.name}</td>
                    <td className="px-4 py-3">
                      <ul className="list-disc pl-4 text-xs">
                        {sale.items.map(item => (
                          <li key={item.id}>{item.product.name} x{item.quantity}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3 font-bold">{formatINR(sale.total)}</td>
                    <td className="px-4 py-3">{sale.paymentMethod}</td>
                  </tr>
                ))}
                {customer.sales.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No purchase history found.
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
