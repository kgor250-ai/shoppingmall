'use client'

import { useActionState, useRef, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { loginAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, ShieldCheck, Store, Loader2, ArrowLeft, AlertCircle } from 'lucide-react'

function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined)
  const formRef = useRef<HTMLFormElement>(null)
  const searchParams = useSearchParams()
  const fromParam = searchParams.get('from') || ''
  const [clientError, setClientError] = useState<string | null>(null)
  const [emailValue, setEmailValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')

  const handleQuickLogin = (email: string, pass: string) => {
    if (pending) return
    setClientError(null)
    setEmailValue(email)
    setPasswordValue(pass)
    if (!formRef.current) return
    const emailInput = formRef.current.elements.namedItem('email') as HTMLInputElement
    const passInput = formRef.current.elements.namedItem('password') as HTMLInputElement
    if (emailInput && passInput) {
      emailInput.value = email
      passInput.value = pass
      formRef.current.requestSubmit()
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (pending) {
      e.preventDefault()
      return
    }

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value.trim()
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value

    if (!email) {
      e.preventDefault()
      setClientError('Please enter your email address')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      e.preventDefault()
      setClientError('Please enter a valid email address (e.g., admin1@gmail.com)')
      return
    }

    if (!password) {
      e.preventDefault()
      setClientError('Please enter your password')
      return
    }

    setClientError(null)
  }

  const activeError = clientError || state?.error

  return (
    <div className="relative w-full max-w-md">
      {/* Return to public site link */}
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-blue-400 transition-colors py-1 px-2 rounded-md hover:bg-white/5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Return to Aurelia Shopping Mall
        </Link>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl p-8 shadow-2xl border border-white/10"
        style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(20px)' }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
          >
            <Building2 className="text-white h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Shopping Mall System</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to access your dashboard</p>
          {fromParam && (
            <p className="text-xs text-blue-400 mt-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
              Please sign in to access your requested page
            </p>
          )}
        </div>

        <form action={formAction} ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          {fromParam && <input type="hidden" name="redirectTo" value={fromParam} />}

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-slate-300 text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              disabled={pending}
              value={emailValue}
              onChange={(e) => {
                setEmailValue(e.target.value)
                if (clientError) setClientError(null)
              }}
              className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-slate-300 text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              disabled={pending}
              value={passwordValue}
              onChange={(e) => {
                setPasswordValue(e.target.value)
                if (clientError) setClientError(null)
              }}
              className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 disabled:opacity-50"
            />
          </div>

          {activeError && (
            <div
              role="alert"
              aria-live="polite"
              className="text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2 animate-in fade-in duration-200"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
              <span>{activeError}</span>
            </div>
          )}

          <Button
            className="w-full h-11 text-base font-semibold mt-2 transition-all cursor-pointer disabled:cursor-not-allowed"
            type="submit"
            disabled={pending}
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
          >
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          {/* Quick Login Section */}
          <div className="pt-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-slate-500 font-medium">Quick Access</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={pending}
                onClick={() => handleQuickLogin('admin1@gmail.com', 'admin123')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium hover:bg-blue-500/20 hover:border-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                Login as Admin
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => handleQuickLogin('owner1@gmail.com', 'owner123')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm font-medium hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Store className="h-4 w-4" />
                )}
                Login as Owner
              </button>
            </div>
          </div>
        </form>
      </div>

      <p className="text-center text-slate-600 text-xs mt-6">
        &copy; 2026 Shopping Mall Management System
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f2744 100%)',
      }}
    >
      {/* Decorative background grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <Suspense fallback={
        <div className="flex items-center justify-center text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
          <span>Loading login...</span>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  )
}
