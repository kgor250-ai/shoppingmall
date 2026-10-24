import prisma from '@/lib/prisma'
import { connection } from 'next/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default async function AdminStoresPage() {
  await connection();
  const stores = await prisma.store.findMany({
    include: {
      owner: true,
      category: true
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Stores</h1>
        <Link href="/admin/stores/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" /> Add Store
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Stores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-900 border-b">
                <tr>
                  <th className="px-4 py-3">Store #</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id} className="border-b dark:border-zinc-800">
                    <td className="px-4 py-3 font-medium">{store.storeNumber}</td>
                    <td className="px-4 py-3">{store.name}</td>
                    <td className="px-4 py-3">{store.category.name}</td>
                    <td className="px-4 py-3">{store.owner ? store.owner.name : 'Unassigned'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        store.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {store.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/stores/${store.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
                {stores.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No stores found.
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
