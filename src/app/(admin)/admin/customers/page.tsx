import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatINR } from '@/lib/utils'
import Link from 'next/link'
import { connection } from 'next/server'

export const dynamic = 'force-dynamic'

export default async function AdminCustomersPage() {
  await connection()
  const customers = await prisma.customer.findMany({
    include: { 
      sales: {
        where: { status: 'COMPLETED' },
        select: { total: true }
      }
    }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-900 border-b">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Total Purchases</th>
                  <th className="px-4 py-3">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => {
                  const totalAmount = c.sales.reduce((sum, s) => sum + s.total, 0)
                  return (
                    <tr key={c.id} className="border-b dark:border-zinc-800">
                      <td className="px-4 py-3 font-medium">
                        <Link href={`/admin/customers/${c.id}`} className="text-blue-600 hover:underline">
                          {c.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">{c.phone || 'N/A'}</td>
                      <td className="px-4 py-3">{c.email || 'N/A'}</td>
                      <td className="px-4 py-3">{c.sales.length} bills</td>
                      <td className="px-4 py-3 font-bold">{formatINR(totalAmount)}</td>
                    </tr>
                  )
                })}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No customers found.
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
