import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { formatINR } from '@/lib/utils'
import { ArrowLeft, Store as StoreIcon, User, Package, IndianRupee, Users, TrendingUp, AlertTriangle } from 'lucide-react'
import { connection } from 'next/server'

export const dynamic = 'force-dynamic'

export default async function AdminOwnerDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  await connection()
  const { id } = await params

  const owner = await prisma.user.findUnique({
    where: { id, role: 'STORE_OWNER' },
    include: {
      stores: {
        include: {
          category: true,
          products: true,
          sales: {
            include: {
              items: true
            }
          },
          employees: true,
          rents: true
        }
      }
    }
  })

  if (!owner) {
    notFound()
  }

  const primaryStore = owner.stores[0]

  // Stats calculation
  let totalProducts = 0
  let totalSalesCount = 0
  let totalSalesAmount = 0
  let totalEmployees = 0
  let currentStock = 0
  let lowStockCount = 0
  let pendingRent = 0
  let paidRent = 0

  if (primaryStore) {
    totalProducts = primaryStore.products.length
    totalSalesCount = primaryStore.sales.length
    totalSalesAmount = primaryStore.sales.reduce((sum, sale) => sum + sale.total, 0)
    totalEmployees = primaryStore.employees.length
    currentStock = primaryStore.products.reduce((sum, p) => sum + p.currentStock, 0)
    lowStockCount = primaryStore.products.filter(p => p.currentStock <= p.minimumStock).length
    
    primaryStore.rents.forEach(rent => {
      if (rent.status === 'PENDING' || rent.status === 'OVERDUE') {
        pendingRent += rent.amount
      } else if (rent.status === 'PAID') {
        paidRent += rent.amount
      }
    })
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/owners" className={buttonVariants({ variant: "outline", size: "icon" })}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Owner Details</h1>
        </div>
        <div className="flex space-x-2">
          {/* <Link href={`/admin/owners/${owner.id}/edit`} className={buttonVariants({ variant: "outline" })}>
            <Edit className="mr-2 h-4 w-4" /> Edit Owner
          </Link> */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Owner Information */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-500" />
              <CardTitle>Owner Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Full Name</dt>
                <dd className="font-medium">{owner.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="font-medium">{owner.email}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd className="font-medium">{owner.phone || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Status</dt>
                <dd>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    owner.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {owner.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Account Created</dt>
                <dd className="font-medium">{new Date(owner.createdAt).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Last Updated</dt>
                <dd className="font-medium">{new Date(owner.updatedAt).toLocaleDateString()}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Assigned Store */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <StoreIcon className="h-5 w-5 text-blue-500" />
              <CardTitle>Assigned Store</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {primaryStore ? (
              <div className="space-y-4">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground">Store Name</dt>
                    <dd className="font-medium">{primaryStore.name}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Store ID (Unit)</dt>
                    <dd className="font-medium">{primaryStore.storeNumber}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="font-medium">{primaryStore.category?.name || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Floor</dt>
                    <dd className="font-medium">{primaryStore.floor}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Status</dt>
                    <dd>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        primaryStore.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-700'
                      }`}>
                        {primaryStore.status}
                      </span>
                    </dd>
                  </div>
                </dl>
                <div className="pt-2">
                  <Link href={`/admin/stores/${primaryStore.id}`} className={buttonVariants({ variant: "default", size: "sm" })}>
                    View Store Details
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <StoreIcon className="mx-auto h-8 w-8 mb-2 opacity-20" />
                <p>No store assigned to this owner.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {primaryStore && (
        <>
          {/* Store Statistics */}
          <h2 className="text-xl font-bold tracking-tight mt-8 mb-4">Store Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold mt-2">{formatINR(totalSalesAmount)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold mt-2">{totalSalesCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-2">
                  <p className="text-sm font-medium text-muted-foreground">Products (Stock)</p>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold mt-2">{totalProducts} <span className="text-sm font-normal text-muted-foreground">({currentStock} units)</span></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-2">
                  <p className="text-sm font-medium text-muted-foreground">Employees</p>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold mt-2">{totalEmployees}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-2">
                  <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                </div>
                <div className="text-2xl font-bold mt-2 text-orange-600">{lowStockCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-2">
                  <p className="text-sm font-medium text-muted-foreground">Pending Rent</p>
                  <IndianRupee className="h-4 w-4 text-red-500" />
                </div>
                <div className="text-2xl font-bold mt-2 text-red-600">{formatINR(pendingRent)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-2">
                  <p className="text-sm font-medium text-muted-foreground">Paid Rent</p>
                  <IndianRupee className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold mt-2 text-green-600">{formatINR(paidRent)}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Owner Products Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Products Summary</CardTitle>
                <CardDescription>Recent products in {primaryStore.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-900 border-b">
                      <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">SKU</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {primaryStore.products.slice(0, 5).map(product => (
                        <tr key={product.id} className="border-b dark:border-zinc-800 last:border-0">
                          <td className="px-4 py-2 font-medium">{product.name}</td>
                          <td className="px-4 py-2 text-muted-foreground">{product.sku}</td>
                          <td className="px-4 py-2">{formatINR(product.sellingPrice)}</td>
                          <td className="px-4 py-2">
                            <span className={product.currentStock <= product.minimumStock ? 'text-red-600 font-medium' : ''}>
                              {product.currentStock}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {primaryStore.products.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-4 text-center text-muted-foreground">No products found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {primaryStore.products.length > 5 && (
                  <div className="mt-4 text-center">
                    <Link href={`/admin/stores/${primaryStore.id}`} className="text-sm text-blue-600 hover:underline">
                      View all {primaryStore.products.length} products in Store
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Owner Sales Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>Latest transactions for {primaryStore.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-zinc-50 dark:bg-zinc-900 border-b">
                      <tr>
                        <th className="px-4 py-2">Receipt</th>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Amount</th>
                        <th className="px-4 py-2">Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {primaryStore.sales.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5).map(sale => (
                        <tr key={sale.id} className="border-b dark:border-zinc-800 last:border-0">
                          <td className="px-4 py-2 font-medium">{sale.invoiceNumber}</td>
                          <td className="px-4 py-2 text-muted-foreground">{new Date(sale.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-2 font-medium">{formatINR(sale.total)}</td>
                          <td className="px-4 py-2 text-xs">{sale.paymentMethod}</td>
                        </tr>
                      ))}
                      {primaryStore.sales.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-4 text-center text-muted-foreground">No sales found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
