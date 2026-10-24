import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductForm } from '../new/ProductForm'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'

export const dynamic = 'force-dynamic'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await connection()
  const session = await getSession()
  if (!session?.storeId) redirect('/login')

  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id }
  })

  // SECURITY: Ensure the product belongs to the authenticated store owner's store
  if (!product || product.storeId !== session.storeId) {
    redirect('/store/products')
  }

  const categories = await prisma.category.findMany({ where: { status: 'ACTIVE' } })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm categories={categories} storeId={session.storeId} initialData={product} />
        </CardContent>
      </Card>
    </div>
  )
}
