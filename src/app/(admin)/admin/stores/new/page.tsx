import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StoreForm } from './StoreForm'
import { connection } from 'next/server'

export const dynamic = 'force-dynamic'

export default async function NewStorePage() {
  await connection();
  const categories = await prisma.category.findMany({ where: { status: 'ACTIVE' } })
  const owners = await prisma.user.findMany({ where: { role: 'STORE_OWNER', status: 'ACTIVE' } })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Add New Store</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Store Details</CardTitle>
        </CardHeader>
        <CardContent>
          <StoreForm categories={categories} owners={owners} />
        </CardContent>
      </Card>
    </div>
  )
}
