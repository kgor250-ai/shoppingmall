import React from 'react'
import prisma from '@/lib/prisma'
import AddShopForm from './AddShopForm'

export const dynamic = 'force-dynamic'

export default async function AddShopPage() {
  const floors = await prisma.floor.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { number: 'asc' }
  })
  
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  })

  return <AddShopForm floors={floors} categories={categories} />
}
