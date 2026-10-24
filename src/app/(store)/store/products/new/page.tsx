import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ProductForm } from './ProductForm'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'

export const dynamic = 'force-dynamic'

export default async function NewProductPage() {
  await connection()
  const session = await getSession()
  if (!session?.storeId) redirect('/login')

  const categories = await prisma.category.findMany({ where: { status: 'ACTIVE' } })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm categories={categories} storeId={session.storeId} />
        </CardContent>
      </Card>
    </div>
  )
}
