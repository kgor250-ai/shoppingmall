'use client'

import { useActionState, useRef } from 'react'
import { loginAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, ShieldCheck, Store, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, undefined)
  const formRef = useRef<HTMLFormElement>(null)

  const handleQuickLogin = (email: string, pass: string) => {
    if (!formRef.current) return
    const emailInput = formRef.current.elements.namedItem('email') as HTMLInputElement
    const passInput = formRef.current.elements.namedItem('password') as HTMLInputElement
    if (emailInput && passInput) {
      emailInput.value = email
      passInput.value = pass
      formRef.current.requestSubmit()
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f2744 100%)',
      }}
    >
      {/* Decorative background grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative w-full max-w-md">
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
          </div>

          <form action={formAction} ref={formRef} className="space-y-5">
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
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
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
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>

            {state?.error && (
              <div className="text-sm font-medium text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2">
                <span className="text-red-400">⚠</span>
                {state.error}
              </div>
            )}

            <Button
              className="w-full h-11 text-base font-semibold mt-2"
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
                  onClick={() => handleQuickLogin('owenr1@gmail.com', 'owner123')}
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
    </div>
  )
}
