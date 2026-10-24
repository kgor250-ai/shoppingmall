'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Store3DData } from '@/data/mall3dData'

export async function getMall3DData() {
  const floors = await prisma.floor.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { number: 'asc' }
  })
  
  const stores = await prisma.store.findMany({
    where: { status: { in: ['ACTIVE', 'MAINTENANCE'] }, floorData: { status: 'ACTIVE' } },
    include: { category: true }
  })
  
  // Convert DB stores to Store3DData
  const formattedStores = stores.map((store: any) => ({
    id: store.id,
    name: store.name,
    category: (store.category?.name || 'STORE').toUpperCase(),
    floorId: store.floor,
    modelPosition: [store.positionX || 0, store.positionY || 0, store.positionZ || 0] as [number, number, number],
    rating: 4.5,
    reviewCount: 120,
    status: store.status === 'ACTIVE' ? 'Open' : 'Maintenance',
    wing: store.wing || 'Central Atrium',
    shopNumber: store.storeNumber,
    description: store.description || 'Welcome to our store!',
    image: store.logoUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    hours: '10:00 AM - 10:00 PM',
    currentOffers: [],
    tags: []
  }))
  
  return { floors, stores: formattedStores }
}

export async function addFloor(formData: FormData) {
  const code = formData.get('code') as string
  const name = formData.get('name') as string
  const numberStr = formData.get('number') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const status = formData.get('status') as string

  if (!code || !name || !numberStr) {
    return { error: 'Missing required fields (code, name, number)' }
  }

  const number = parseInt(numberStr, 10)
  if (isNaN(number)) {
    return { error: 'Floor number must be a valid integer' }
  }

  try {
    const existing = await prisma.floor.findFirst({
      where: {
        OR: [{ code }, { number }]
      }
    })
    
    if (existing) {
      return { error: 'Floor code or number already exists' }
    }

    const floor = await prisma.floor.create({
      data: {
        code,
        name,
        number,
        description,
        category,
        status,
        elevation: number * 6.2, // Base elevation calculation
      }
    })
    
    revalidatePath('/admin/layout-management')
    return { success: true, floor }
  } catch (err: any) {
    return { error: err.message || 'Failed to add floor' }
  }
}

export async function deleteFloor(id: string) {
  try {
    const floor = await prisma.floor.findUnique({
      where: { id },
      include: { stores: true }
    })
    
    if (!floor) return { error: 'Floor not found' }
    
    if (floor.stores.length > 0) {
      return { error: 'Cannot delete floor because it contains shops. Please move or delete them first.' }
    }
    
    await prisma.floor.delete({ where: { id } })
    revalidatePath('/admin/layout-management')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to delete floor' }
  }
}

export async function addShopToLayout(formData: FormData) {
  const name = formData.get('name') as string
  const storeNumber = formData.get('storeNumber') as string
  const floorId = formData.get('floorId') as string
  const categoryId = formData.get('categoryId') as string
  const brandName = formData.get('brandName') as string
  const description = formData.get('description') as string
  const shopSize = formData.get('shopSize') as string
  const positionX = formData.get('positionX') as string
  const positionZ = formData.get('positionZ') as string
  const wing = formData.get('wing') as string
  const status = formData.get('status') as string
  
  if (!name || !storeNumber || !floorId || !categoryId) {
    return { error: 'Missing required fields' }
  }
  
  try {
    const existing = await prisma.store.findUnique({ where: { storeNumber } })
    if (existing) {
      return { error: 'Shop ID / storeNumber already exists' }
    }
    
    const floor = await prisma.floor.findUnique({ where: { id: floorId } })
    if (!floor || floor.status !== 'ACTIVE') {
      return { error: 'Selected floor is invalid or inactive' }
    }

    const store = await prisma.store.create({
      data: {
        name,
        storeNumber,
        floor: floor.code, 
        categoryId,
        description,
        monthlyRent: 0, 
        openingDate: new Date(),
        status,
        brandName,
        shopSize: shopSize ? parseFloat(shopSize) : null,
        positionX: positionX ? parseFloat(positionX) : 0,
        positionY: floor.elevation, 
        positionZ: positionZ ? parseFloat(positionZ) : 0,
        wing,
      }
    })
    
    revalidatePath('/admin/layout-management')
    return { success: true, store }
  } catch (err: any) {
    return { error: err.message || 'Failed to add shop' }
  }
}

export async function deleteShop(id: string) {
  try {
    await prisma.store.delete({ where: { id } })
    revalidatePath('/admin/layout-management')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to delete shop' }
  }
}
