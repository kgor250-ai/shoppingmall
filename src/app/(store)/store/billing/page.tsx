import BillingClient from './BillingClient'
import { connection } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function BillingPage() {
  await connection();
  const session = await getSession()
  if (!session?.storeId) redirect('/login')

  const products = await prisma.product.findMany({
    where: { storeId: session.storeId, status: 'ACTIVE' },
    select: { id: true, name: true, sku: true, sellingPrice: true, currentStock: true }
  })

  return <BillingClient initialProducts={products} storeId={session.storeId} />
}
