'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { setAuthCookie, clearAuthCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function loginAction(prevState: unknown, formData: FormData) {
  try {
    let email = formData.get('email') as string
    let password = formData.get('password') as string

    if (!email || !password) {
      return { error: 'Email and password are required' }
    }

    email = email.trim().toLowerCase()
    password = password.trim()

    // Handle intentional typo for demo credentials
    if (email === 'owenr1@gmail.com') {
      email = 'owner1@gmail.com'
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        stores: true
      }
    })

    if (!user) {
      return { error: 'Invalid credentials' }
    }

    if (user.status !== 'ACTIVE') {
      return { error: 'Account is deactivated' }
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    
    if (!isPasswordValid) {
      return { error: 'Invalid credentials' }
    }

    // Set session cookie
    const storeId = user.stores.length > 0 ? user.stores[0].id : null
    
    if (user.role === 'STORE_OWNER' && !storeId) {
      return { error: 'No store assigned to your account. Contact Admin.' }
    }

    await setAuthCookie({
      userId: user.id,
      role: user.role,
      email: user.email,
      storeId: user.role === 'STORE_OWNER' ? storeId : null,
      name: user.name,
    })

    if (user.role === 'ADMIN') {
      redirect('/admin')
    } else {
      redirect('/store')
    }
  } catch (error: any) {
    if (error?.digest?.startsWith?.('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Login action error:', error)
    return { error: error?.message || 'Authentication error. Please try again.' }
  }
}

export async function logoutAction() {
  await clearAuthCookie()
  redirect('/login')
}

export interface CurrentAuthUser {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'STORE_OWNER' | string
  phone?: string | null
  store?: {
    id: string
    name: string
    floor: string
    category: string
    status: string
  } | null
  dashboardUrl: string
}

export async function getSessionUser(): Promise<CurrentAuthUser | null> {
  try {
    const session = await getSession()
    if (!session?.userId) return null

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        stores: true,
      },
    })

    if (!user) return null

    const store = user.stores?.[0] || null

    return {
      id: user.id,
      name: user.name || (user.role === 'ADMIN' ? 'Mall Administrator' : 'Store Owner'),
      email: user.email,
      role: user.role,
      phone: user.phone,
      store: store
        ? {
            id: store.id,
            name: store.name,
            floor: store.floor,
            category: store.category,
            status: store.status,
          }
        : null,
      dashboardUrl: user.role === 'ADMIN' ? '/admin' : '/store',
    }
  } catch (error) {
    console.error('getSessionUser error:', error)
    return null
  }
}
