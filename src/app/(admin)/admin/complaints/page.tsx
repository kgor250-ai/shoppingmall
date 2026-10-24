import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { connection } from 'next/server'

export const dynamic = 'force-dynamic'

export default async function AdminComplaintsPage() {
  await connection()
  const complaints = await prisma.complaint.findMany({
    include: { store: true, customer: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Complaints</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>All Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-900 border-b">
                <tr>
                  <th className="px-4 py-3">Store</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.id} className="border-b dark:border-zinc-800">
                    <td className="px-4 py-3 font-medium">{c.store.name}</td>
                    <td className="px-4 py-3">{c.customer ? c.customer.name : 'N/A'}</td>
                    <td className="px-4 py-3">{c.subject}</td>
                    <td className="px-4 py-3">{c.priority}</td>
                    <td className="px-4 py-3">{c.status}</td>
                  </tr>
                ))}
                {complaints.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No complaints found.
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
