'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { setAuthCookie, clearAuthCookie } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function loginAction(prevState: unknown, formData: FormData) {
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
    storeId: user.role === 'STORE_OWNER' ? storeId : null
  })

  if (user.role === 'ADMIN') {
    redirect('/admin')
  } else {
    redirect('/store')
  }
}

export async function logoutAction() {
  await clearAuthCookie()
  redirect('/login')
}
