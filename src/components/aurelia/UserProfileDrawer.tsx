'use client'

import React from 'react'
import Link from 'next/link'
import {
  X,
  User,
  Crown,
  Bookmark,
  Calendar,
  Car,
  CreditCard,
  Sparkles,
  Shield,
  ChevronRight,
  LogOut,
  LogIn,
  Store,
  MapPin,
  Utensils,
  CheckCircle2,
  Building2,
  Receipt,
} from 'lucide-react'
import { DiningReservation } from '@/data/diningReservations'
import { CurrentAuthUser } from '@/actions/auth'

interface UserProfileDrawerProps {
  isOpen: boolean
  onClose: () => void
  onOpenWallet: () => void
  onOpenConcierge: () => void
  onOpenReservations?: () => void
  activeReservation?: DiningReservation | null
  currentUser?: CurrentAuthUser | null
}

export function UserProfileDrawer({
  isOpen,
  onClose,
  onOpenWallet,
  onOpenConcierge,
  onOpenReservations,
  activeReservation,
  currentUser,
}: UserProfileDrawerProps) {
  if (!isOpen) return null

  const isStoreOwner = currentUser?.role === 'STORE_OWNER'
  const isAdmin = currentUser?.role === 'ADMIN'
  const isCustomer = currentUser?.role === 'CUSTOMER'
  const isGuest = !currentUser

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-[#0d0c12] border-l border-[#c5a059]/30 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto custom-dark-scrollbar shadow-2xl">
        {/* Top Header & Close */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
            <span className="font-serif tracking-[0.25em] text-sm text-[#fbf8f3] uppercase">
              {isStoreOwner
                ? 'MERCHANT PORTAL'
                : isAdmin
                ? 'MALL ADMINISTRATION'
                : isCustomer
                ? 'VIP INNER CIRCLE'
                : 'YOUR AURELIA'}
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Profile"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              DYNAMIC PROFILE CARD (Store Owner vs Admin vs Guest)
          ───────────────────────────────────────────────────────────── */}
          {isStoreOwner ? (
            /* STORE OWNER PROFILE CARD */
            <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-[#1a1612] via-[#141217] to-[#0e0c10] border border-[#d4af37]/40 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-[#2a1d0d] via-[#7a5c1a] to-[#d4af37] border border-[#fae8c8] flex items-center justify-center font-serif text-2xl text-stone-950 font-bold shadow-lg flex-shrink-0">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-xl text-[#fbf8f3]">{currentUser.name}</h3>
                    <Store className="h-4 w-4 text-[#d4af37]" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 text-[9px] font-sans tracking-widest uppercase font-semibold inline-block mt-1">
                    Store Owner · {currentUser.store?.name || 'Retail'}
                  </span>
                </div>
              </div>

              {/* Shopkeeper Details */}
              <div className="mt-4 pt-3.5 border-t border-white/10 space-y-2 text-xs font-sans">
                <div className="flex justify-between items-center text-stone-300">
                  <span className="text-stone-400">Shop Name:</span>
                  <span className="text-[#fae8c8] font-medium">{currentUser.store?.name || 'Fashion Hub'}</span>
                </div>
                <div className="flex justify-between items-center text-stone-300">
                  <span className="text-stone-400">Floor Location:</span>
                  <span className="text-stone-200">{currentUser.store?.floor || 'Ground Floor'}</span>
                </div>
                <div className="flex justify-between items-center text-stone-300">
                  <span className="text-stone-400">Merchant Account:</span>
                  <span className="font-mono text-stone-400 text-[11px]">{currentUser.email}</span>
                </div>
              </div>

              {/* Shopkeeper Quick Navigation */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Link
                  href="/store"
                  onClick={onClose}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-[11px] font-semibold text-center transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Store className="h-3.5 w-3.5" />
                  <span>Store POS Portal</span>
                </Link>
                <Link
                  href="/store/sales"
                  onClick={onClose}
                  className="py-2.5 px-3 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-stone-200 text-[11px] font-medium text-center border border-white/10 transition-all flex items-center justify-center gap-1.5"
                >
                  <Receipt className="h-3.5 w-3.5 text-[#c5a059]" />
                  <span>Bills & Invoices</span>
                </Link>
              </div>
            </div>
          ) : isAdmin ? (
            /* MALL ADMINISTRATOR PROFILE CARD */
            <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-[#121624] via-[#0d101b] to-[#090b14] border border-blue-400/30 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-[#13223f] to-[#3b82f6] border border-blue-300 flex items-center justify-center font-serif text-2xl text-white font-bold shadow-lg flex-shrink-0">
                  A
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-xl text-[#fbf8f3]">{currentUser.name || 'Mall Administrator'}</h3>
                    <Shield className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-950/70 text-blue-300 border border-blue-500/40 text-[9px] font-sans tracking-widest uppercase font-semibold inline-block mt-1">
                    System Administrator
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-white/10 space-y-2 text-xs font-sans">
                <div className="flex justify-between items-center text-stone-300">
                  <span className="text-stone-400">Access Level:</span>
                  <span className="text-blue-300 font-medium">Full Mall Management Control</span>
                </div>
                <div className="flex justify-between items-center text-stone-300">
                  <span className="text-stone-400">Admin Account:</span>
                  <span className="font-mono text-stone-400 text-[11px]">{currentUser.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold text-center transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span>Admin Center</span>
                </Link>
                <Link
                  href="/admin/reports"
                  onClick={onClose}
                  className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-medium text-center border border-white/10 transition-all flex items-center justify-center gap-1.5"
                >
                  <Building2 className="h-3.5 w-3.5 text-blue-400" />
                  <span>Mall Reports</span>
                </Link>
              </div>
            </div>
          ) : isCustomer ? (
            /* AUTHENTICATED VIP CUSTOMER PROFILE CARD */
            <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-[#1c160c] via-[#15120e] to-[#0d0c0a] border border-[#d4af37]/40 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-[#2a1d0d] via-[#7a5c1a] to-[#d4af37] border border-[#fae8c8] flex items-center justify-center font-serif text-2xl text-stone-950 font-bold shadow-lg flex-shrink-0">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-xl text-[#fbf8f3]">{currentUser.name}</h3>
                    <Crown className="h-4 w-4 text-[#d4af37]" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#d4af37]/20 text-[#fae8c8] border border-[#d4af37]/40 text-[9px] font-sans tracking-widest uppercase font-semibold inline-block mt-1">
                    Aurelia VIP Club · Black Tier
                  </span>
                </div>
              </div>

              {/* Customer Details */}
              <div className="mt-4 pt-3.5 border-t border-white/10 space-y-2 text-xs font-sans">
                <div className="flex justify-between items-center text-stone-300">
                  <span className="text-stone-400">Registered Email:</span>
                  <span className="font-mono text-stone-200 text-[11px]">{currentUser.email}</span>
                </div>
                {currentUser.phone && (
                  <div className="flex justify-between items-center text-stone-300">
                    <span className="text-stone-400">VIP Phone:</span>
                    <span className="text-stone-300 text-[11px]">{currentUser.phone}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-stone-300">
                  <span className="text-stone-400">VIP Reward Points:</span>
                  <span className="text-[#fae8c8] font-bold text-sm">
                    {currentUser.points ? `${currentUser.points.toLocaleString()} pts` : '24,850 pts'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-stone-300">
                  <span className="text-stone-400">Privilege Status:</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Verified Active VIP</span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* GUEST VISITOR PROFILE CARD */
            <div className="mb-6 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-[#1f1b29] to-[#c5a059]/50 border border-[#c5a059] flex items-center justify-center font-serif text-2xl text-[#fbf8f3] shadow-lg flex-shrink-0">
                  G
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-xl text-[#fbf8f3]">Guest Visitor</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-stone-300 text-[9px] font-sans tracking-widest uppercase font-semibold inline-block mt-1">
                    Exploring Curated Collections
                  </span>
                </div>
              </div>

              {/* Login Switcher Hint */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
                <span>Sign in for VIP rewards (500 pts):</span>
                <Link
                  href="/login"
                  onClick={onClose}
                  className="text-[#c5a059] hover:text-[#fae8c8] font-semibold flex items-center gap-1"
                >
                  <span>Sign In / Register</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              QUICK MENU SECTIONS
          ───────────────────────────────────────────────────────────── */}
          <div className="space-y-3">
            {/* Rewards points only shown for Customer/Guest, NOT for Store Owner */}
            {(isGuest || isCustomer) && (
              <div
                onClick={() => {
                  onClose()
                  onOpenWallet()
                }}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#c5a059]/40 hover:bg-white/[0.05] transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-[#c5a059]" />
                  <span className="text-xs font-sans tracking-wide text-[#fbf8f3]">
                    Digital Wallet & Rewards (24,850 pts)
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-[#c5a059] transition-colors" />
              </div>
            )}

            <a
              href="#stores"
              onClick={onClose}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#c5a059]/40 hover:bg-white/[0.05] transition-all cursor-pointer flex items-center justify-between group block"
            >
              <div className="flex items-center gap-3">
                <Bookmark className="h-4 w-4 text-[#c5a059]" />
                <span className="text-xs font-sans tracking-wide text-[#fbf8f3]">
                  {isStoreOwner ? 'Explore Mall Directory & Stores' : 'Saved Boutiques & Wishlist (4)'}
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-[#c5a059] transition-colors" />
            </a>

            {/* Confirmed Dining Reservations Button */}
            <div
              onClick={() => {
                onClose()
                if (onOpenReservations) {
                  onOpenReservations()
                }
              }}
              className="p-4 rounded-xl bg-white/[0.02] border border-[#c5a059]/30 hover:border-[#c5a059] hover:bg-white/[0.05] transition-all cursor-pointer flex items-center justify-between group relative overflow-hidden"
            >
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-[#c5a059] flex-shrink-0" />
                <div>
                  <span className="text-xs font-sans tracking-wide text-[#fbf8f3] block font-medium">
                    Confirmed Dining Reservations (Tonight)
                  </span>
                  {activeReservation && activeReservation.status === 'CONFIRMED' ? (
                    <span className="text-[11px] text-emerald-400 font-sans flex items-center gap-1.5 mt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-medium text-[#fbf8f3]">{activeReservation.restaurantName}</span>
                      <span className="text-stone-400">·</span>
                      <span>{activeReservation.timeSlot} ({activeReservation.guests})</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#e8e2d8]/60 font-sans block mt-0.5">
                      View or update your VIP table passes
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-sans font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ACTIVE
                </span>
                <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-[#c5a059] transition-colors" />
              </div>
            </div>

            <a
              href="#parking"
              onClick={onClose}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#c5a059]/40 hover:bg-white/[0.05] transition-all cursor-pointer flex items-center justify-between group block"
            >
              <div className="flex items-center gap-3">
                <Car className="h-4 w-4 text-[#c5a059]" />
                <span className="text-xs font-sans tracking-wide text-[#fbf8f3]">
                  Smart Valet Ticket (P2 · Slot 42)
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-[#c5a059] transition-colors" />
            </a>

            <div
              onClick={() => {
                onClose()
                onOpenConcierge()
              }}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#c5a059]/40 hover:bg-white/[0.05] transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4 text-[#e6ca85]" />
                <span className="text-xs font-sans tracking-wide text-[#fbf8f3]">
                  AI Concierge AURA History
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-[#c5a059] transition-colors" />
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            BOTTOM: PROMINENT LOGIN / LOGOUT BUTTON
        ───────────────────────────────────────────────────────────── */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          {currentUser ? (
            /* Clear, Prominent Logout Button */
            <a
              href="/api/auth/logout"
              className="w-full py-3.5 rounded-2xl bg-rose-950/50 hover:bg-rose-900/70 border border-rose-500/40 text-rose-200 hover:text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
              title="Log out from account"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out ({currentUser.email})</span>
            </a>
          ) : (
            /* Clear, Prominent Sign In Button */
            <Link
              href="/login"
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#fae8c8] via-[#d4af37] to-[#9b7324] text-stone-950 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-lg shadow-[#d4af37]/25"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In / VIP Register</span>
            </Link>
          )}

          <div className="text-center text-[10px] text-[#e8e2d8]/40 font-sans">
            AURELIA LUXURY PLATFORM · v4.2 HAUTE EDITION
          </div>
        </div>
      </div>
    </div>
  )
}
