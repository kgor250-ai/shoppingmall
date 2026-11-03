'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { setAuthCookie, clearAuthCookie, getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

// Helper to parse human-readable device and browser info from user-agent
function parseDeviceInfo(ua: string): string {
  if (!ua || ua === 'Unknown Device') return 'Web Browser'

  let os = 'Desktop'
  if (ua.includes('Android')) os = 'Android Mobile'
  else if (ua.includes('iPhone')) os = 'Apple iPhone'
  else if (ua.includes('iPad')) os = 'Apple iPad'
  else if (ua.includes('Windows NT 10.0') || ua.includes('Windows')) os = 'Windows PC'
  else if (ua.includes('Macintosh') || ua.includes('Mac OS')) os = 'macOS'
  else if (ua.includes('Linux')) os = 'Linux'

  let browser = 'Browser'
  if (ua.includes('Edg/')) browser = 'Edge'
  else if (ua.includes('Chrome/')) browser = 'Chrome'
  else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari'
  else if (ua.includes('Firefox/')) browser = 'Firefox'

  return `${browser} on ${os}`
}

async function extractClientMeta() {
  try {
    const headerList = await headers()
    const ua = headerList.get('user-agent') || 'Unknown Device'
    const forwardedFor = headerList.get('x-forwarded-for')
    const realIp = headerList.get('x-real-ip')
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : (realIp || '127.0.0.1')
    const device = parseDeviceInfo(ua)
    return { ip, device }
  } catch {
    return { ip: '127.0.0.1', device: 'Web Browser' }
  }
}

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

    // Auto-seed Demo Customer Gor Kishan if requested and doesn't exist yet
    if (email === 'kishan@gmail.com') {
      const existingDemo = await prisma.user.findUnique({ where: { email } })
      if (!existingDemo) {
        const hash = await bcrypt.hash('kishan123', 10)
        await prisma.user.create({
          data: {
            name: 'Gor Kishan',
            email: 'kishan@gmail.com',
            phone: '+91 98765 43210',
            passwordHash: hash,
            role: 'CUSTOMER',
            status: 'ACTIVE',
          },
        })
        const cust = await prisma.customer.findFirst({ where: { email } })
        if (!cust) {
          await prisma.customer.create({
            data: {
              name: 'Gor Kishan',
              email: 'kishan@gmail.com',
              phone: '+91 98765 43210',
            },
          })
        }
      }
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        stores: true,
      },
    })

    if (!user) {
      return { error: 'Invalid credentials. Please verify your email.' }
    }

    if (user.status !== 'ACTIVE') {
      return { error: 'Your account has been deactivated or suspended by administration.' }
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      return { error: 'Invalid password. Please check your credentials.' }
    }

    // Check store assignment for store owners
    const storeId = user.stores.length > 0 ? user.stores[0].id : null

    if (user.role === 'STORE_OWNER' && !storeId) {
      return { error: 'No store assigned to your account. Contact Admin.' }
    }

    // Capture device and IP info for security audit log
    const { ip, device } = await extractClientMeta()

    try {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_LOGIN',
          module: 'AUTH',
          recordId: device,
          description: JSON.stringify({
            name: user.name,
            email: user.email,
            phone: user.phone || 'N/A',
            role: user.role,
            device,
            ip,
            status: user.status,
            timestamp: new Date().toISOString(),
          }),
        },
      })
    } catch (auditErr) {
      console.warn('Could not write login audit log:', auditErr)
    }

    // Set session cookie
    await setAuthCookie({
      userId: user.id,
      role: user.role,
      email: user.email,
      storeId: user.role === 'STORE_OWNER' ? storeId : null,
      name: user.name,
    })

    if (user.role === 'ADMIN') {
      redirect('/admin')
    } else if (user.role === 'STORE_OWNER') {
      redirect('/store')
    } else {
      // CUSTOMER / Shopper redirects to Mall Home with personalized VIP experience
      redirect('/')
    }
  } catch (error: any) {
    if (error?.digest?.startsWith?.('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Login action error:', error)
    return { error: error?.message || 'Authentication error. Please try again.' }
  }
}

export async function registerCustomerAction(prevState: unknown, formData: FormData) {
  try {
    const name = (formData.get('name') as string)?.trim()
    let email = (formData.get('email') as string)?.trim().toLowerCase()
    const phone = (formData.get('phone') as string)?.trim()
    const password = (formData.get('password') as string)?.trim()

    if (!name || name.length < 2) {
      return { error: 'Please enter your full name (at least 2 characters).' }
    }

    if (!email || !email.includes('@')) {
      return { error: 'Please enter a valid email address.' }
    }

    if (!password || password.length < 6) {
      return { error: 'Password must be at least 6 characters long.' }
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      return { error: 'An account with this email already exists. Please sign in instead.' }
    }

    const passwordHash = await bcrypt.hash(password, 10)

    // Create user with CUSTOMER role
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash,
        role: 'CUSTOMER',
        status: 'ACTIVE',
      },
    })

    // Upsert or create entry in Customer model
    const existingCustomer = await prisma.customer.findFirst({
      where: { email },
    })

    if (!existingCustomer) {
      await prisma.customer.create({
        data: {
          name,
          email,
          phone: phone || null,
        },
      })
    }

    // Capture metadata for audit
    const { ip, device } = await extractClientMeta()

    try {
      await prisma.auditLog.create({
        data: {
          userId: newUser.id,
          action: 'USER_REGISTER',
          module: 'AUTH',
          recordId: device,
          description: JSON.stringify({
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone || 'N/A',
            role: 'CUSTOMER',
            device,
            ip,
            points: 500,
            status: 'ACTIVE',
            timestamp: new Date().toISOString(),
          }),
        },
      })
    } catch (auditErr) {
      console.warn('Could not write register audit log:', auditErr)
    }

    // Automatically set auth cookie for newly registered user
    await setAuthCookie({
      userId: newUser.id,
      role: 'CUSTOMER',
      email: newUser.email,
      storeId: null,
      name: newUser.name,
    })

    redirect('/')
  } catch (error: any) {
    if (error?.digest?.startsWith?.('NEXT_REDIRECT')) {
      throw error
    }
    console.error('Register action error:', error)
    return { error: error?.message || 'Registration failed. Please try again.' }
  }
}

export async function toggleUserStatusAction(userId: string, newStatus: 'ACTIVE' | 'BLOCKED') {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return { error: 'Unauthorized: Administrator access required.' }
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!targetUser) {
      return { error: 'User not found.' }
    }

    if (targetUser.role === 'ADMIN' && targetUser.id === session.userId) {
      return { error: 'You cannot block your own Administrator account.' }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: newStatus },
    })

    try {
      await prisma.auditLog.create({
        data: {
          userId: session.userId,
          action: 'STATUS_CHANGE',
          module: 'AUTH',
          recordId: userId,
          description: JSON.stringify({
            actionBy: session.email,
            targetUserId: userId,
            targetUserName: updatedUser.name,
            targetEmail: updatedUser.email,
            newStatus,
            timestamp: new Date().toISOString(),
          }),
        },
      })
    } catch (err) {
      console.warn('Audit error in status toggle:', err)
    }

    return { success: true, status: newStatus }
  } catch (error: any) {
    console.error('toggleUserStatusAction error:', error)
    return { error: error?.message || 'Failed to update user status.' }
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
  role: 'ADMIN' | 'STORE_OWNER' | 'CUSTOMER' | string
  phone?: string | null
  store?: {
    id: string
    name: string
    floor: string
    category: string
    status: string
  } | null
  dashboardUrl: string
  points?: number
}

export async function getSessionUser(): Promise<CurrentAuthUser | null> {
  try {
    const session = await getSession()
    if (!session?.userId) return null

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        stores: {
          include: {
            category: true,
          },
        },
      },
    })

    if (!user) return null

    const store = user.stores?.[0] || null

    let dashboardUrl = '/'
    if (user.role === 'ADMIN') {
      dashboardUrl = '/admin'
    } else if (user.role === 'STORE_OWNER') {
      dashboardUrl = '/store'
    }

    return {
      id: user.id,
      name: user.name || (user.role === 'ADMIN' ? 'Mall Administrator' : user.role === 'STORE_OWNER' ? 'Store Owner' : 'VIP Shopper'),
      email: user.email,
      role: user.role,
      phone: user.phone,
      points: user.role === 'CUSTOMER' ? 500 : undefined,
      store: store
        ? {
            id: store.id,
            name: store.name,
            floor: store.floor,
            category: store.category?.name || 'Retail',
            status: store.status,
          }
        : null,
      dashboardUrl,
    }
  } catch (error) {
    console.error('getSessionUser error:', error)
    return null
  }
}
