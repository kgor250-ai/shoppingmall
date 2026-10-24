'use server'

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createStore(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

  try {
    const storeNumber = formData.get('storeNumber') as string
    
    const existing = await prisma.store.findUnique({ where: { storeNumber } })
    if (existing) return { error: 'Store number already exists' }

    await prisma.store.create({
      data: {
        name: formData.get('name') as string,
        storeNumber,
        floor: formData.get('floor') as string,
        categoryId: formData.get('categoryId') as string,
        description: formData.get('description') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        monthlyRent: parseFloat(formData.get('monthlyRent') as string),
        openingDate: new Date(formData.get('openingDate') as string),
        ownerId: (formData.get('ownerId') as string) || null,
      }
    })

    revalidatePath('/admin/stores')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to create store' }
  }
}

import bcrypt from 'bcryptjs'

export async function createOwner(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

  try {
    const email = formData.get('email') as string
    
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return { error: 'Email already exists' }

    const passwordHash = await bcrypt.hash(formData.get('password') as string, 10)

    await prisma.user.create({
      data: {
        name: formData.get('name') as string,
        email,
        phone: formData.get('phone') as string,
        passwordHash,
        role: 'STORE_OWNER',
      }
    })

    revalidatePath('/admin/owners')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to create owner' }
  }
}

export async function payRent(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

  try {
    const rentId = formData.get('rentId') as string
    
    await prisma.rent.update({
      where: { id: rentId },
      data: {
        status: 'PAID',
        paidDate: new Date(formData.get('paymentDate') as string),
        paymentMethod: formData.get('paymentMethod') as string,
        paymentReference: formData.get('paymentReference') as string,
        notes: (formData.get('notes') as string) || null
      }
    })

    revalidatePath('/admin/rent')
    revalidatePath('/admin/stores')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to record rent payment' }
  }
}

export async function updateStore(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' }

  try {
    const storeId = formData.get('storeId') as string
    await prisma.store.update({
      where: { id: storeId },
      data: {
        name: formData.get('name') as string,
        storeNumber: formData.get('storeNumber') as string,
        floor: formData.get('floor') as string,
        categoryId: formData.get('categoryId') as string,
        description: formData.get('description') as string,
        phone: formData.get('phone') as string,
        email: formData.get('email') as string,
        monthlyRent: parseFloat(formData.get('monthlyRent') as string),
        openingDate: new Date(formData.get('openingDate') as string),
        ownerId: (formData.get('ownerId') as string) || null,
      }
    })

    revalidatePath('/admin/stores')
    revalidatePath('/admin/stores/' + storeId)
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to update store' }
  }
}