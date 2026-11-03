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
  MapPin,
  Utensils,
  CheckCircle2,
} from 'lucide-react'
import { DiningReservation } from '@/data/diningReservations'

interface UserProfileDrawerProps {
  isOpen: boolean
  onClose: () => void
  onOpenWallet: () => void
  onOpenConcierge: () => void
  onOpenReservations?: () => void
  activeReservation?: DiningReservation | null
}

export function UserProfileDrawer({
  isOpen,
  onClose,
  onOpenWallet,
  onOpenConcierge,
  onOpenReservations,
  activeReservation,
}: UserProfileDrawerProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md h-full bg-[#0d0c12] border-l border-[#c5a059]/30 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto custom-dark-scrollbar shadow-2xl">
        {/* Top Header & Close */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
            <span className="font-serif tracking-[0.25em] text-sm text-[#fbf8f3] uppercase">
              YOUR AURELIA
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Profile"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center gap-4 mb-8 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-[#1f1b29] to-[#c5a059]/50 border border-[#c5a059] flex items-center justify-center font-serif text-2xl text-[#fbf8f3] shadow-lg">
              G
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl text-[#fbf8f3]">Gor Kishan</h3>
                <Crown className="h-4 w-4 text-[#c5a059]" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#c5a059]/20 text-[#e6ca85] text-[9px] font-sans tracking-widest uppercase font-semibold inline-block mt-1">
                Black Tier Member
              </span>
            </div>
          </div>

          {/* Quick Menu Sections */}
          <div className="space-y-3">
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

            <a
              href="#stores"
              onClick={onClose}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#c5a059]/40 hover:bg-white/[0.05] transition-all cursor-pointer flex items-center justify-between group block"
            >
              <div className="flex items-center gap-3">
                <Bookmark className="h-4 w-4 text-[#c5a059]" />
                <span className="text-xs font-sans tracking-wide text-[#fbf8f3]">
                  Saved Boutiques & Wishlist (4)
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

        {/* Bottom Gateway to Administrative Systems */}
        <div className="pt-8 border-t border-white/10 space-y-4">
          <div className="p-4 rounded-2xl bg-[#14121b] border border-white/10">
            <span className="text-[10px] font-sans uppercase tracking-widest text-[#c5a059] block mb-1">
              Mall Operations Gateway
            </span>
            <p className="text-xs text-[#e8e2d8]/60 font-sans mb-3">
              Switch to back-office mall administrator or store merchant dashboard.
            </p>
            <div className="flex gap-2">
              <Link
                href="/admin"
                className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-[#c5a059]/20 border border-white/10 hover:border-[#c5a059] text-[11px] font-sans text-center text-[#fbf8f3] transition-all"
              >
                Mall Admin
              </Link>
              <Link
                href="/store"
                className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-[#c5a059]/20 border border-white/10 hover:border-[#c5a059] text-[11px] font-sans text-center text-[#fbf8f3] transition-all"
              >
                Store POS
              </Link>
            </div>
          </div>

          <div className="text-center text-[10px] text-[#e8e2d8]/40 font-sans">
            AURELIA LUXURY PLATFORM · v4.2 HAUTE EDITION
          </div>
        </div>
      </div>
    </div>
  )
}
