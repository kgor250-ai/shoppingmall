import { NextResponse } from 'next/server'
import { getSessionUser } from '@/actions/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getSessionUser()
    return NextResponse.json({ authenticated: Boolean(user), user })
  } catch {
    return NextResponse.json({ authenticated: false, user: null })
  }
}

