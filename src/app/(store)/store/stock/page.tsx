import prisma from '@/lib/prisma'
import { connection } from 'next/server'
import { getSession } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'

export default async function StoreStockPage() {
  await connection();
  const session = await getSession()
  if (!session?.storeId) redirect('/login')

  const products = await prisma.product.findMany({
    where: { storeId: session.storeId },
    orderBy: { currentStock: 'asc' }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Stock Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-900 border-b">
                <tr>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Current Stock</th>
                  <th className="px-4 py-3">Minimum Stock</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const isLow = product.currentStock <= product.minimumStock
                  return (
                    <tr key={product.id} className="border-b dark:border-zinc-800">
                      <td className="px-4 py-3 font-medium">{product.sku}</td>
                      <td className="px-4 py-3">{product.name}</td>
                      <td className="px-4 py-3 font-medium">
                        <span className={isLow ? 'text-red-500' : ''}>{product.currentStock}</span>
                      </td>
                      <td className="px-4 py-3">{product.minimumStock}</td>
                      <td className="px-4 py-3">
                        {isLow ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            LOW STOCK
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            IN STOCK
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No products found.
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
