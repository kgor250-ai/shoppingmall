import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { connection } from 'next/server'

export const dynamic = 'force-dynamic'

export default async function AdminOwnersPage() {
  await connection()
  const owners = await prisma.user.findMany({
    where: { role: 'STORE_OWNER' },
    include: {
      stores: true
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Store Owners</h1>
        <Link href="/admin/owners/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" /> Add Owner
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Store Owners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-900 border-b">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Assigned Stores</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {owners.map((owner) => (
                  <tr key={owner.id} className="border-b dark:border-zinc-800">
                    <td className="px-4 py-3 font-medium">{owner.name}</td>
                    <td className="px-4 py-3">{owner.email}</td>
                    <td className="px-4 py-3">{owner.phone || 'N/A'}</td>
                    <td className="px-4 py-3">
                      {owner.stores.map(s => (
                        <span key={s.id} className="block text-xs">{s.name} ({s.storeNumber})</span>
                      ))}
                      {owner.stores.length === 0 && <span className="text-muted-foreground text-xs">None</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        owner.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {owner.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/owners/${owner.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {owners.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No owners found.
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
