'use client'

import { useActionState, useState } from 'react'
import Link from 'next/link'
import { loginAction, registerCustomerAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Crown,
  Loader2,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Phone,
  Gift,
  ChevronDown,
  ChevronUp,
  Store,
  Sparkles,
} from 'lucide-react'

// Elegant Aurelia Signature Gold Monogram Emblem
function AureliaEmblem({ className = 'h-14 w-14' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="aureliaGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fae8c8" />
          <stop offset="45%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#9b7324" />
        </linearGradient>
      </defs>

      {/* 4-point star sparkle */}
      <path
        d="M 68 17 Q 68 25 76 25 Q 68 25 68 33 Q 68 25 60 25 Q 68 25 68 17 Z"
        fill="url(#aureliaGold)"
      />

      {/* Left stem of stylized A */}
      <path
        d="M 31 79 L 47 22 L 53 22 L 37 79 Z"
        fill="url(#aureliaGold)"
      />

      {/* Right stem of stylized A */}
      <path
        d="M 45 22 L 51 22 L 69 79 L 63 79 Z"
        fill="url(#aureliaGold)"
      />

      {/* Dynamic curved swoosh crossbar */}
      <path
        d="M 27 61 Q 48 43 73 59 Q 50 49 29 61 Z"
        fill="url(#aureliaGold)"
      />
    </svg>
  )
}

export default function LoginPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const [showDemoAccess, setShowDemoAccess] = useState(false)

  const [loginState, loginFormAction, loginPending] = useActionState(loginAction, undefined)
  const [registerState, registerFormAction, registerPending] = useActionState(registerCustomerAction, undefined)

  const [nameValue, setNameValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [phoneValue, setPhoneValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [clientError, setClientError] = useState<string | null>(null)
  const [fillNotice, setFillNotice] = useState<string | null>(null)

  const isPending = loginPending || registerPending

  // Only fills credentials into fields without auto-submitting
  const handleInsertCredentials = (email: string, pass: string, roleName: string) => {
    if (isPending) return
    setIsRegisterMode(false)
    setClientError(null)
    setEmailValue(email)
    setPasswordValue(pass)
    setFillNotice(`${roleName} details filled! Click "Sign In" below.`)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (isPending) {
      e.preventDefault()
      return
    }

    const email = emailValue.trim()
    const password = passwordValue.trim()

    if (isRegisterMode) {
      const name = nameValue.trim()
      if (!name) {
        e.preventDefault()
        setClientError('Please enter your full name.')
        return
      }
    }

    if (!email) {
      e.preventDefault()
      setClientError('Please enter your email address.')
      return
    }

    if (!password) {
      e.preventDefault()
      setClientError('Please enter your password.')
      return
    }

    setClientError(null)
    setFillNotice(null)
  }

  const activeError = clientError || (isRegisterMode ? registerState?.error : loginState?.error)

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 20%, #1c150c 0%, #0c0a09 60%, #050505 100%)',
      }}
    >
      {/* Ambient background gold glow & subtle geometric luxury mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-900/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative gold subtle grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(212,175,55,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.4) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative w-full max-w-[420px] z-10 animate-in fade-in duration-500">
        {/* Return to mall link */}
        <div className="mb-3 flex justify-between items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#d4af37]/80 hover:text-[#fae8c8] transition-colors py-1 px-3 rounded-full bg-black/40 border border-[#d4af37]/20 backdrop-blur-md"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Mall</span>
          </Link>

          <span className="text-[11px] uppercase tracking-widest text-stone-500 font-light hidden sm:inline-block">
            Haute Destination
          </span>
        </div>

        {/* Main Glassmorphic Card (100% Private & Clean — No Public Role Tabs) */}
        <div
          className="rounded-[26px] p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] border border-[#d4af37]/35 relative overflow-hidden backdrop-blur-2xl"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(35, 27, 18, 0.94) 0%, rgba(14, 12, 10, 0.96) 100%)',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.95), 0 0 35px -5px rgba(212, 175, 55, 0.15)',
          }}
        >
          {/* Subtle Top Gold Highlight Line */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#fae8c8] to-transparent opacity-60" />

          {/* Logo & Branding */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-2">
              <AureliaEmblem className="h-12 w-12 drop-shadow-[0_4px_12px_rgba(212,175,55,0.35)]" />
            </div>

            <h1 className="font-serif tracking-[0.28em] text-lg font-bold uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#fae8c8] via-[#e6ca85] to-[#c5a059]">
              AURELIA
            </h1>
            <p className="tracking-[0.3em] text-[10px] uppercase text-[#c5a059]/90 font-medium -mt-0.5">
              SHOPPING MALL
            </p>

            <h2 className="text-lg font-normal text-white tracking-wide mt-4">
              {isRegisterMode ? 'Create Your Account' : 'Welcome to Aurelia'}
            </h2>
            <p className="text-stone-400 text-xs mt-0.5">
              {isRegisterMode
                ? 'Join Aurelia VIP Club & claim exclusive rewards'
                : 'Enter your credentials to continue'}
            </p>
          </div>

          {/* Welcome Bonus Notice in Register Mode */}
          {isRegisterMode && (
            <div className="mt-3.5 p-2.5 rounded-xl bg-amber-950/40 border border-[#d4af37]/40 flex items-center gap-2 text-xs text-[#fae8c8]">
              <Gift className="h-4 w-4 text-[#d4af37] flex-shrink-0 animate-bounce" />
              <span>
                <strong>500 Welcome VIP Points</strong> will be credited on signup!
              </span>
            </div>
          )}

          {/* Unified Smart Form (Automatically routes based on role) */}
          <form
            action={isRegisterMode ? registerFormAction : loginFormAction}
            onSubmit={handleSubmit}
            className="space-y-3.5 mt-5"
          >
            {/* Full Name (Only in Register mode) */}
            {isRegisterMode && (
              <div className="space-y-1">
                <Label htmlFor="name" className="text-stone-300 text-xs font-medium flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-[#d4af37]" />
                  <span>Full Name</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Gor Kishan"
                  required
                  disabled={isPending}
                  value={nameValue}
                  onChange={(e) => {
                    setNameValue(e.target.value)
                    if (clientError) setClientError(null)
                  }}
                  className="h-10 bg-black/50 border-white/10 text-white placeholder:text-stone-500 rounded-xl focus:border-[#d4af37] text-xs"
                />
              </div>
            )}

            {/* Email Address */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-stone-300 text-xs font-medium flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#d4af37]" />
                <span>Email Address</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                disabled={isPending}
                value={emailValue}
                onChange={(e) => {
                  setEmailValue(e.target.value)
                  if (clientError) setClientError(null)
                  if (fillNotice) setFillNotice(null)
                }}
                className="h-10 bg-black/50 border-white/10 text-white placeholder:text-stone-500 rounded-xl focus:border-[#d4af37] text-xs"
              />
            </div>

            {/* Phone Number (Only in Register mode) */}
            {isRegisterMode && (
              <div className="space-y-1">
                <Label htmlFor="phone" className="text-stone-300 text-xs font-medium flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#d4af37]" />
                  <span>Mobile Phone (Optional)</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  disabled={isPending}
                  value={phoneValue}
                  onChange={(e) => {
                    setPhoneValue(e.target.value)
                    if (clientError) setClientError(null)
                  }}
                  className="h-10 bg-black/50 border-white/10 text-white placeholder:text-stone-500 rounded-xl focus:border-[#d4af37] text-xs"
                />
              </div>
            )}

            {/* Password with Eye Toggle */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-stone-300 text-xs font-medium flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-[#d4af37]" />
                <span>Password</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={
                    isRegisterMode
                      ? 'Create a secure password (min 6 chars)'
                      : 'Enter your password'
                  }
                  required
                  disabled={isPending}
                  value={passwordValue}
                  onChange={(e) => {
                    setPasswordValue(e.target.value)
                    if (clientError) setClientError(null)
                    if (fillNotice) setFillNotice(null)
                  }}
                  className="h-10 pr-10 bg-black/50 border-white/10 text-white placeholder:text-stone-500 rounded-xl focus:border-[#d4af37] text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-[#e6ca85] transition-colors cursor-pointer"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Notice / Feedback */}
            {fillNotice && !activeError && (
              <div
                role="status"
                className="text-xs font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-xl flex items-center gap-2 animate-in fade-in"
              >
                <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                <span>{fillNotice}</span>
              </div>
            )}

            {/* Error Message */}
            {activeError && (
              <div
                role="alert"
                aria-live="polite"
                className="text-xs font-medium text-rose-300 bg-rose-950/40 border border-rose-500/30 p-2.5 rounded-xl flex items-start gap-2 animate-in fade-in"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-400 mt-0.5" />
                <span>{activeError}</span>
              </div>
            )}

            {/* Gold Action Button */}
            <Button
              className="w-full h-11 text-xs font-bold uppercase tracking-wider rounded-xl text-stone-950 transition-all cursor-pointer shadow-lg hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed mt-2 border-0 flex items-center justify-center gap-2 group"
              type="submit"
              disabled={isPending}
              style={{
                background: 'linear-gradient(90deg, #f7dca1 0%, #d4af37 50%, #b38728 100%)',
                boxShadow: '0 4px 20px rgba(212, 175, 55, 0.35)',
              }}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-stone-950" />
                  <span>
                    {isRegisterMode ? 'Creating Account...' : 'Authenticating...'}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {isRegisterMode ? 'Create Account & Claim 500 Pts' : 'Sign In →'}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </Button>

            {/* Mode Switcher Link */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode)
                  setClientError(null)
                  setFillNotice(null)
                }}
                className="text-xs text-[#d4af37] hover:text-[#fae8c8] font-medium transition-colors cursor-pointer"
              >
                {isRegisterMode
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Create VIP Account"}
              </button>
            </div>
          </form>

          {/* ── DISCREET DEMO ACCESS (Folded by default for privacy) ── */}
          <div className="mt-5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowDemoAccess(!showDemoAccess)}
              className="w-full flex items-center justify-between text-[11px] text-stone-500 hover:text-stone-300 py-1 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-[#d4af37]" />
                <span>Quick Demo Credentials</span>
              </span>
              {showDemoAccess ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>

            {showDemoAccess && (
              <div className="mt-2.5 space-y-1.5 animate-in fade-in duration-200">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    handleInsertCredentials('kishan@gmail.com', 'kishan123', 'VIP Shopper (Gor Kishan)')
                  }
                  className="w-full flex items-center justify-between py-2 px-3 rounded-xl border border-white/5 bg-stone-900/60 hover:bg-[#d4af37]/10 hover:border-[#d4af37]/40 text-stone-300 text-xs transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Crown className="h-3.5 w-3.5 text-[#d4af37]" />
                    <span>Customer Demo (Gor Kishan)</span>
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">Fill ID</span>
                </button>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    handleInsertCredentials('owner1@gmail.com', 'owner123', 'Store Owner (Fashion Hub)')
                  }
                  className="w-full flex items-center justify-between py-2 px-3 rounded-xl border border-white/5 bg-stone-900/60 hover:bg-emerald-950/40 hover:border-emerald-500/40 text-stone-300 text-xs transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Store className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Merchant Demo (Fashion Hub)</span>
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">Fill ID</span>
                </button>

                <button
                  type="button"
                  disabled={isPending}
                  onClick={() =>
                    handleInsertCredentials('admin1@gmail.com', 'admin123', 'System Administrator')
                  }
                  className="w-full flex items-center justify-between py-2 px-3 rounded-xl border border-white/5 bg-stone-900/60 hover:bg-blue-950/40 hover:border-blue-500/40 text-stone-300 text-xs transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                    <span>Admin Demo (System Admin)</span>
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">Fill ID</span>
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-white/5 text-center">
            <p className="text-[10px] tracking-widest uppercase text-stone-500 font-light flex items-center justify-center gap-2">
              <span>Secure</span>
              <span className="text-[#d4af37]">•</span>
              <span>Encrypted</span>
              <span className="text-[#d4af37]">•</span>
              <span className="font-serif font-medium text-stone-400">AURELIA PLATFORM</span>
            </p>
          </div>
        </div>

        <p className="text-center text-stone-500/80 text-[11px] mt-4 font-light">
          &copy; 2026 Aurelia Shopping Mall System
        </p>
      </div>
    </div>
  )
}
