'use server'

import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createSale(data: {
  storeId: string,
  cart: { id: string, quantity: number, unitPrice: number }[],
  customerName: string,
  customerPhone: string,
  paymentMethod: string,
  subtotal: number,
  discount: number,
  tax: number,
  total: number
}) {
  const session = await getSession()
  if (!session || session.role !== 'STORE_OWNER' || session.storeId !== data.storeId) {
    return { error: 'Unauthorized' }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Re-check stock to ensure no overselling
      const productIds = data.cart.map(c => c.id)
      const products = await tx.product.findMany({
        where: { id: { in: productIds }, storeId: data.storeId }
      })

      for (const item of data.cart) {
        const product = products.find(p => p.id === item.id)
        if (!product) throw new Error(`Product ${item.id} not found`)
        if (product.currentStock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`)
        }
      }

      // 2. Handle customer (create if not exists based on phone)
      let customerId = undefined
      if (data.customerPhone) {
        let customer = await tx.customer.findFirst({
          where: { phone: data.customerPhone }
        })
        if (!customer) {
          customer = await tx.customer.create({
            data: {
              name: data.customerName || 'Unknown',
              phone: data.customerPhone
            }
          })
        } else if (data.customerName && customer.name !== data.customerName) {
          customer = await tx.customer.update({
            where: { id: customer.id },
            data: { name: data.customerName }
          })
        }
        customerId = customer.id
      } else if (data.customerName) {
        const customer = await tx.customer.create({
          data: { name: data.customerName }
        })
        customerId = customer.id
      }

      // 3. Create Sale
      const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      const sale = await tx.sale.create({
        data: {
          invoiceNumber,
          storeId: data.storeId,
          customerId,
          createdBy: session.userId as string,
          subtotal: data.subtotal,
          discount: data.discount,
          tax: data.tax,
          total: data.total,
          paymentMethod: data.paymentMethod,
          paymentStatus: 'PAID',
          status: 'COMPLETED'
        }
      })

      // 4. Create Sale Items and update stock + transactions
      for (const item of data.cart) {
        const product = products.find(p => p.id === item.id)!
        const itemTotal = (item.unitPrice * item.quantity) // Add proportional tax if needed

        await tx.saleItem.create({
          data: {
            saleId: sale.id,
            productId: item.id,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: itemTotal
          }
        })

        // Update product stock
        await tx.product.update({
          where: { id: item.id },
          data: { currentStock: product.currentStock - item.quantity }
        })

        // Create Stock Transaction
        await tx.stockTransaction.create({
          data: {
            productId: item.id,
            storeId: data.storeId,
            type: 'SALE',
            quantity: item.quantity,
            previousStock: product.currentStock,
            newStock: product.currentStock - item.quantity,
            reason: `Sale ${invoiceNumber}`,
            createdBy: session.userId as string
          }
        })
      }
      
      // Audit Log
      await tx.auditLog.create({
        data: {
          userId: session.userId as string,
          action: 'CREATED',
          module: 'SALE',
          recordId: sale.id,
          description: `Generated invoice ${invoiceNumber} for ₹${data.total}`
        }
      })

      return sale
    })

    revalidatePath('/store/billing')
    revalidatePath('/store')
    return { success: true, invoiceNumber: result.invoiceNumber }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to process checkout' }
  }
}
