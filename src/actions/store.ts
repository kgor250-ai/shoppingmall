'use server'

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function saveProduct(formData: FormData) {
  const session = await getSession()
  if (!session || session.role !== 'STORE_OWNER') return { error: 'Unauthorized' }

  const storeId = formData.get('storeId') as string
  if (session.storeId !== storeId) return { error: 'Unauthorized store access' }

  const id = formData.get('id') as string | null

  try {
    const sku = formData.get('sku') as string
    
    // Check SKU uniqueness
    const existing = await prisma.product.findFirst({ where: { sku } })
    if (existing && existing.id !== id) return { error: 'SKU already exists' }

    if (id) {
      // Security: verify ownership again before updating
      const product = await prisma.product.findUnique({ where: { id } })
      if (!product || product.storeId !== session.storeId) return { error: 'Product not found or unauthorized' }

      await prisma.product.update({
        where: { id },
        data: {
          name: formData.get('name') as string,
          sku,
          categoryId: formData.get('categoryId') as string,
          description: formData.get('description') as string,
          costPrice: parseFloat(formData.get('costPrice') as string),
          sellingPrice: parseFloat(formData.get('sellingPrice') as string),
          minimumStock: parseInt(formData.get('minimumStock') as string, 10),
          unit: formData.get('unit') as string,
          status: formData.get('status') as string,
        }
      })
    } else {
      const initialStock = parseInt(formData.get('currentStock') as string, 10)
      
      const newProduct = await prisma.product.create({
        data: {
          storeId: session.storeId,
          categoryId: formData.get('categoryId') as string,
          name: formData.get('name') as string,
          sku,
          description: formData.get('description') as string,
          costPrice: parseFloat(formData.get('costPrice') as string),
          sellingPrice: parseFloat(formData.get('sellingPrice') as string),
          currentStock: initialStock,
          minimumStock: parseInt(formData.get('minimumStock') as string, 10),
          unit: formData.get('unit') as string,
        }
      })

      if (initialStock > 0) {
        await prisma.stockTransaction.create({
          data: {
            productId: newProduct.id,
            storeId: session.storeId,
            type: 'STOCK_IN',
            quantity: initialStock,
            previousStock: 0,
            newStock: initialStock,
            reason: 'Initial Stock',
            createdBy: session.userId as string
          }
        })
      }
    }

    revalidatePath('/store/products')
    revalidatePath('/store/low-stock')
    revalidatePath('/store/stock')
    return { success: true }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to save product' }
  }
}
