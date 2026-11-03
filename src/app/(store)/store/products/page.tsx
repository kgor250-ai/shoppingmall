import prisma from '@/lib/prisma'
import { connection } from 'next/server'
import { getSession } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { Plus, Package } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { formatINR } from '@/lib/utils'

export const dynamic = 'force-dynamic'

function extractProductImage(desc: string | null | undefined): string | null {
  if (!desc) return null
  const match = desc.match(/\[IMG:(.*?)\]/)
  if (match) return match[1]
  if (desc.startsWith('http://') || desc.startsWith('https://')) {
    return desc.split(' ')[0]
  }
  return null
}

export default async function StoreProductsPage() {
  await connection();
  const session = await getSession()
  if (!session?.storeId) redirect('/login')

  const products = await prisma.product.findMany({
    where: { storeId: session.storeId },
    include: {
      category: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products & Inventory</h1>
          <p className="text-sm text-stone-500 mt-1">Manage items, photos, pricing, and stock levels</p>
        </div>
        <Link href="/store/products/new" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" /> Add Product with Picture
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Store Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-900 border-b">
                <tr>
                  <th className="px-4 py-3">Item / Photo</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Selling Price</th>
                  <th className="px-4 py-3">Stock Level</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const imageUrl = extractProductImage(product.description)

                  return (
                    <tr key={product.id} className="border-b dark:border-zinc-800 hover:bg-stone-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <Package className="h-4 w-4 text-stone-400" />
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-stone-900 dark:text-stone-100 block">{product.name}</span>
                            <span className="text-xs text-stone-400 block truncate max-w-[200px]">
                              {product.description?.replace(/\[IMG:.*?\]\s*/, '') || 'No description'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{product.sku}</td>
                      <td className="px-4 py-3">{product.category.name}</td>
                      <td className="px-4 py-3 font-semibold">{formatINR(product.sellingPrice)}</td>
                      <td className="px-4 py-3">
                        <span className={product.currentStock <= product.minimumStock ? 'text-rose-500 font-bold flex items-center gap-1' : 'text-stone-700 dark:text-stone-300'}>
                          {product.currentStock} {product.unit}
                          {product.currentStock <= product.minimumStock && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-500">LOW</span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          product.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/store/products/${product.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                          Edit / View
                        </Link>
                      </td>
                    </tr>
                  )
                })}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-stone-500">
                      No products added yet. Click &quot;Add Product with Picture&quot; above to create your first item!
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
