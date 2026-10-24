'use client'

import React, { useState } from 'react'
import {
  Crown,
  Shield,
  CheckCircle,
  Sparkles,
  ArrowRight,
  CreditCard,
  Wine,
  Car,
  Key,
} from 'lucide-react'

interface VipMembershipProps {
  onOpenWallet: () => void
}

export function VipMembership({ onOpenWallet }: VipMembershipProps) {
  const [activeTier, setActiveTier] = useState<'SILVER' | 'GOLD' | 'BLACK' | 'SIGNATURE'>('BLACK')

  const tiers = [
    {
      name: 'SILVER',
      spend: 'Annual spend up to ₹5,00,000',
      badge: 'Entry Tier',
      benefits: [
        'Complimentary 2 hours valet parking',
        'Seasonal trend previews and newsletters',
        'Earn 1 AURELIA Point per ₹100 spent',
      ],
    },
    {
      name: 'GOLD',
      spend: 'Annual spend ₹5,00,000 – ₹20,00,000',
      badge: 'Privileged',
      benefits: [
        'Unlimited complimentary valet parking',
        'Priority table reservations across dining venues',
        'Earn 1.5 AURELIA Points per ₹100 spent',
        'Birthday gift coffret from Maison Francis Kurkdjian',
      ],
    },
    {
      name: 'BLACK',
      spend: 'Annual spend ₹20,00,000 – ₹75,00,000',
      badge: 'Your Active Tier · Gor Kishan',
      benefits: [
        'Dedicated 24/7 personal human concierge + AURA AI',
        'Full access to Black Member Lounge & Champagne Bar',
        'Guaranteed table reservations at 3 Michelin-star venues',
        'Complimentary private salon fitting suites',
        'Earn 2.5 AURELIA Points per ₹100 spent (24,850 pts active)',
        'Private chauffeur departure at P2 Porte-Cochère',
      ],
    },
    {
      name: 'SIGNATURE',
      spend: 'By Invitation Only (₹75,00,000+)',
      badge: 'Sovereign Invitation',
      benefits: [
        'Private biometric penthouse access & safe deposit vault',
        'First allocation on limited high horology & haute joaillerie',
        'Annual private dinner prepared by Michelin guest chefs',
        'International reciprocal privileges at Paris, London & Tokyo',
        'Bespoke Rolls-Royce / Maybach chauffeur fleet',
      ],
    },
  ]

  const currentTierData = tiers.find((t) => t.name === activeTier)!

  return (
    <section id="vip" className="py-28 px-6 md:px-12 bg-[#060608] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.32em] text-[#c5a059] mb-4">
            <Crown className="h-3.5 w-3.5" />
            <span>The Patronage Society</span>
          </div>
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#fbf8f3] font-light tracking-wide uppercase mb-4">
            Enter The Inner Circle
          </h2>
          <div className="w-16 h-[1px] bg-[#c5a059] mx-auto mb-6" />
          <p className="text-sm md:text-base text-[#e8e2d8]/70 font-sans font-light tracking-wide">
            Four tiers of transcendent luxury. Elevated concierge privileges, private salon suites, and global access reserved for AURELIA patrons.
          </p>
        </div>

        {/* Tier Tabs */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex p-1.5 rounded-full bg-white/[0.04] border border-white/10 gap-2">
            {tiers.map((t) => (
              <button
                key={t.name}
                onClick={() => setActiveTier(t.name as any)}
                className={`px-6 py-2.5 rounded-full text-xs font-sans tracking-[0.24em] uppercase transition-all duration-300 ${
                  activeTier === t.name
                    ? 'bg-[#c5a059] text-[#0a0a0c] font-bold shadow-lg shadow-[#c5a059]/30'
                    : 'text-[#e8e2d8]/70 hover:text-white'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive VIP Membership Card Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Holographic Shimmer Virtual Card (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md h-64 rounded-3xl p-8 bg-gradient-to-br from-[#1e1c25] via-[#100f15] to-[#0c0a0f] border border-[#c5a059]/50 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden group">
              {/* Shimmer light sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c5a059]/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full border border-[#c5a059] flex items-center justify-center text-[10px] font-serif text-[#c5a059]">
                    A
                  </div>
                  <span className="font-serif tracking-[0.25em] text-sm text-[#fbf8f3] uppercase">
                    AURELIA
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 text-[9px] font-sans tracking-widest text-[#e6ca85] uppercase font-semibold">
                  {activeTier} MEMBER
                </span>
              </div>

              {/* Chip / Contactless Indicator */}
              <div className="flex items-center gap-3 mb-6">
                <div className="h-7 w-9 rounded-md bg-gradient-to-tr from-[#9a7837] to-[#e6ca85] opacity-80" />
                <span className="text-[10px] font-sans tracking-widest text-white/40">
                  NFC PASS READY
                </span>
              </div>

              {/* Card Footer Details */}
              <div className="flex items-end justify-between pt-2 border-t border-white/10">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#e8e2d8]/50 block">
                    CARDHOLDER
                  </span>
                  <span className="font-serif text-lg tracking-wider text-[#fbf8f3]">
                    GOR KISHAN
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-widest text-[#c5a059] block">
                    ACTIVE REWARDS
                  </span>
                  <span className="font-mono text-xs text-[#fbf8f3]">
                    24,850 PTS
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tier Privileges Breakdown (7 cols) */}
          <div className="lg:col-span-7 bg-[#0f0e15] border border-white/10 rounded-3xl p-8 md:p-12">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-sans uppercase tracking-[0.3em] text-[#c5a059] block">
                {currentTierData.badge}
              </span>
              <span className="text-xs text-[#e8e2d8]/60 font-sans">
                {currentTierData.spend}
              </span>
            </div>

            <h3 className="font-serif text-3xl md:text-4xl text-[#fbf8f3] tracking-wide mb-6">
              AURELIA {currentTierData.name} Privileges
            </h3>

            <div className="space-y-4 mb-8">
              {currentTierData.benefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-[#c5a059] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#e8e2d8]/85 font-sans leading-relaxed">
                    {b}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/10">
              <button
                onClick={onOpenWallet}
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#9a7837] text-[#0a0a0c] text-xs font-sans uppercase tracking-[0.24em] font-bold hover:shadow-[0_0_20px_rgba(197,160,89,0.5)] transition-all flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                <span>Open Digital Pass & Wallet</span>
              </button>

              <span className="text-xs text-[#e8e2d8]/60 font-sans">
                Tier status renewal date: 31 Dec 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
