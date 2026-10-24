import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { formatINR } from '@/lib/utils'
import Link from 'next/link'
import { connection } from 'next/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminStoreDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  await connection()
  const { id } = await params

  const store = await prisma.store.findUnique({
    where: { id },
    include: {
      owner: true,
      category: true,
      products: true,
      employees: true,
      sales: { orderBy: { createdAt: 'desc' }, take: 5 },
      rents: { orderBy: [{ year: 'desc' }, { month: 'desc' }], take: 5 },
      complaints: { orderBy: { createdAt: 'desc' }, take: 5 },
      _count: { select: { products: true, sales: true, employees: true, complaints: true } }
    }
  })

  if (!store) {
    notFound()
  }

  // Calculate aggregates
  const totalStock = store.products.reduce((acc, p) => acc + p.currentStock, 0)
  
  const totalSalesAgg = await prisma.sale.aggregate({
    where: { storeId: id, status: 'COMPLETED' },
    _sum: { total: true }
  })
  
  const now = new Date()
  const currentMonthSalesAgg = await prisma.sale.aggregate({
    where: { 
      storeId: id, 
      status: 'COMPLETED',
      createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) }
    },
    _sum: { total: true }
  })

  const rentPending = store.rents.filter(r => r.status === 'PENDING').reduce((acc, r) => acc + r.amount, 0)
  const rentOverdue = store.rents.filter(r => r.status === 'OVERDUE').reduce((acc, r) => acc + r.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{store.name}</h1>
          <p className="text-muted-foreground">{store.storeNumber} • {store.category.name}</p>
        </div>
        <Link href={`/admin/stores/${store.id}/edit`} className={buttonVariants({ variant: "outline" })}>
          Edit Store
        </Link>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Products</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{store._count.products}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Stock</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalStock}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Sales</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatINR(totalSalesAgg._sum.total)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Current Month</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatINR(currentMonthSalesAgg._sum.total)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Overdue Rent</CardTitle></CardHeader>
          <CardContent><div className={`text-2xl font-bold ${rentOverdue > 0 ? 'text-red-500' : ''}`}>{formatINR(rentOverdue)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Pending Rent</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatINR(rentPending)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Employees</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{store._count.employees}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Complaints</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{store._count.complaints}</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Floor:</strong> {store.floor}</p>
            <p><strong>Phone:</strong> {store.phone || 'N/A'}</p>
            <p><strong>Email:</strong> {store.email || 'N/A'}</p>
            <p><strong>Opening Date:</strong> {new Date(store.openingDate).toLocaleDateString()}</p>
            <p><strong>Monthly Rent:</strong> {formatINR(store.monthlyRent)}</p>
            <p><strong>Status:</strong> {store.status}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Store Owner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {store.owner ? (
              <>
                <p><strong>Name:</strong> <Link href={`/admin/owners/${store.ownerId}`} className="text-blue-600 hover:underline">{store.owner.name}</Link></p>
                <p><strong>Email:</strong> {store.owner.email}</p>
                <p><strong>Phone:</strong> {store.owner.phone || 'N/A'}</p>
                <p><strong>Account Status:</strong> {store.owner.status}</p>
              </>
            ) : (
              <p className="text-muted-foreground">No owner assigned.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-900 border-b">
                <tr>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Method</th>
                </tr>
              </thead>
              <tbody>
                {store.sales.map((sale) => (
                  <tr key={sale.id} className="border-b dark:border-zinc-800">
                    <td className="px-4 py-3 font-medium">{sale.invoiceNumber}</td>
                    <td className="px-4 py-3">{new Date(sale.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-bold">{formatINR(sale.total)}</td>
                    <td className="px-4 py-3">{sale.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
