import prisma from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EditStoreForm } from './EditStoreForm'
import { connection } from 'next/server'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function EditStorePage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  const { id } = await params
  
  const store = await prisma.store.findUnique({ where: { id } })
  if (!store) notFound()

  const categories = await prisma.category.findMany({ where: { status: 'ACTIVE' } })
  const owners = await prisma.user.findMany({ where: { role: 'STORE_OWNER', status: 'ACTIVE' } })

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Edit Store</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Store Details: {store.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <EditStoreForm store={store} categories={categories} owners={owners} />
        </CardContent>
      </Card>
    </div>
  )
}
