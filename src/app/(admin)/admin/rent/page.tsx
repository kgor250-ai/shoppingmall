import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatINR } from '@/lib/utils'
import { RecordRentPayment } from './RecordRentPayment'
import { connection } from 'next/server'

export const dynamic = 'force-dynamic'

export default async function AdminRentPage() {
  await connection()
  const rents = await prisma.rent.findMany({
    include: { store: true },
    orderBy: [{ year: 'desc' }, { month: 'desc' }]
  })

  // Dynamic status check logic
  const now = new Date()
  rents.forEach(r => {
    if (r.status === 'PENDING' && new Date(r.dueDate) < now) {
      r.status = 'OVERDUE'
    }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Rent Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Rent Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-900 border-b">
                <tr>
                  <th className="px-4 py-3">Store</th>
                  <th className="px-4 py-3">Month/Year</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rents.map((rent) => (
                  <tr key={rent.id} className="border-b dark:border-zinc-800">
                    <td className="px-4 py-3 font-medium">{rent.store.name}</td>
                    <td className="px-4 py-3">{rent.month}/{rent.year}</td>
                    <td className="px-4 py-3">{formatINR(rent.amount)}</td>
                    <td className="px-4 py-3">{new Date(rent.dueDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        rent.status === 'PAID' ? 'bg-green-100 text-green-700' : rent.status === 'OVERDUE' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {rent.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {rent.status !== 'PAID' ? (
                        <RecordRentPayment rentId={rent.id} amount={rent.amount} storeName={rent.store.name} month={rent.month} year={rent.year} />
                      ) : (
                        <span className="text-xs text-muted-foreground">Paid on {rent.paidDate ? new Date(rent.paidDate).toLocaleDateString() : 'N/A'}</span>
                      )}
                    </td>
                  </tr>
                ))}
                {rents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No rent records found.
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
