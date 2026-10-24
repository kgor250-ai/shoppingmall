import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'

export const dynamic = 'force-dynamic'

export default async function LowStockPage() {
  await connection()
  const session = await getSession()
  if (!session?.storeId) redirect('/login')
  
  const products = await prisma.product.findMany({ 
    where: { storeId: session.storeId, currentStock: { lte: prisma.product.fields.minimumStock } }
  })
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Low Stock Alerts</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Products Below Minimum Stock</CardTitle>
        </CardHeader>
        <CardContent>
           <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-900 border-b">
                <tr>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Current Stock</th>
                  <th className="px-4 py-3">Min Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b dark:border-zinc-800">
                    <td className="px-4 py-3 font-medium">{p.sku}</td>
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3 text-red-500 font-bold">{p.currentStock}</td>
                    <td className="px-4 py-3">{p.minimumStock}</td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      No low stock products.
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
