'use client'

import React, { useState } from 'react'
import {
  Car,
  Compass,
  CreditCard,
  History,
  CheckCircle,
  Clock,
  Sparkles,
  MapPin,
  Shield,
  ArrowRight,
  BatteryCharging,
} from 'lucide-react'

export function SmartParking() {
  const [activeTab, setActiveTab] = useState<'find' | 'reserve' | 'pay' | 'history'>('find')
  const [valetRequested, setValetRequested] = useState(false)
  const [paid, setPaid] = useState(false)

  return (
    <section id="parking" className="py-28 px-6 md:px-12 bg-[#08080a] relative">
      <div className="max-w-7xl mx-auto">
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.32em] text-[#c5a059] mb-4">
            <Car className="h-3.5 w-3.5" />
            <span>Autonomous Valet & Bay Management</span>
          </div>
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#fbf8f3] font-light tracking-wide uppercase mb-4">
            Smart Parking
          </h2>
          <div className="w-16 h-[1px] bg-[#c5a059] mx-auto mb-6" />
          <p className="text-sm md:text-base text-[#e8e2d8]/70 font-sans font-light tracking-wide">
            Biometric vehicle recognition, automated EV charging, and private Porte-Cochère chauffeur departure.
          </p>
        </div>

        {/* Hero Vehicle Widget Card: "YOUR CAR IS READY" */}
        <div className="rounded-3xl bg-gradient-to-br from-[#15121b] via-[#0d0c11] to-[#141018] border border-[#c5a059]/40 p-8 md:p-12 mb-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c5a059]/10 blur-[100px] pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-sans uppercase tracking-[0.25em] mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Vehicle Secure · Chauffeur Standby</span>
              </div>

              <h3 className="font-serif text-3xl md:text-5xl text-[#fbf8f3] font-light tracking-wide mb-2">
                Your Vehicle is Ready
              </h3>

              <div className="font-mono text-xl md:text-2xl text-[#c5a059] font-semibold tracking-wider mb-3">
                Level P2 · Zone B · Slot 42
              </div>

              <p className="text-xs md:text-sm text-[#e8e2d8]/70 font-sans max-w-xl">
                Mercedes-Benz S 580 (License: MH 02 EX 8899) · Fully Charged (100% via 350kW DC Fast Bay) · Polished & Prepared at Private Porte-Cochère.
              </p>
            </div>

            {/* Quick Action Button Box */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <button
                onClick={() => setValetRequested(true)}
                className={`w-full sm:w-auto px-8 py-4 rounded-full text-xs font-sans uppercase tracking-[0.24em] font-bold transition-all flex items-center justify-center gap-2 ${
                  valetRequested
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500'
                    : 'bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#9a7837] text-[#0a0a0c] hover:shadow-[0_0_25px_rgba(197,160,89,0.5)]'
                }`}
              >
                {valetRequested ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Chauffeur En Route to Gate A (2 Min)</span>
                  </>
                ) : (
                  <>
                    <Car className="h-4 w-4" />
                    <span>Summon Vehicle to Entrance</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Parking Availability Meters & Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Level P1 */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#e8e2d8]/50 font-sans block">
                Level P1 · Premium Bays
              </span>
              <span className="font-serif text-2xl text-[#fbf8f3] font-light">
                142 <span className="text-xs text-[#e8e2d8]/60 font-sans">available / 480</span>
              </span>
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-emerald-400 flex items-center justify-center text-xs font-mono text-emerald-400">
              70%
            </div>
          </div>

          {/* Level P2 */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#c5a059] font-sans block">
                Level P2 · Member Suites
              </span>
              <span className="font-serif text-2xl text-[#fbf8f3] font-light">
                86 <span className="text-xs text-[#e8e2d8]/60 font-sans">available / 320</span>
              </span>
            </div>
            <div className="h-10 w-10 rounded-full border-2 border-[#c5a059] flex items-center justify-center text-xs font-mono text-[#c5a059]">
              73%
            </div>
          </div>

          {/* Valet Concierge Desk */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-blue-400 font-sans block">
                EV Fast Hub & Valet
              </span>
              <span className="font-serif text-2xl text-[#fbf8f3] font-light">
                Active <span className="text-xs text-blue-300 font-sans">· 16 Superchargers Ready</span>
              </span>
            </div>
            <BatteryCharging className="h-7 w-7 text-blue-400" />
          </div>
        </div>

        {/* Parking Feature Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl bg-[#0f0e15] border border-white/10 hover:border-[#c5a059]/40 transition-colors cursor-pointer group">
            <Compass className="h-6 w-6 text-[#c5a059] mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-serif text-lg text-[#fbf8f3] mb-1">Find My Car</h4>
            <p className="text-xs text-[#e8e2d8]/60 font-sans">
              Turn-by-turn glowing path from anywhere inside AURELIA to Slot 42.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0f0e15] border border-white/10 hover:border-[#c5a059]/40 transition-colors cursor-pointer group">
            <Car className="h-6 w-6 text-[#c5a059] mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-serif text-lg text-[#fbf8f3] mb-1">Reserve Bay</h4>
            <p className="text-xs text-[#e8e2d8]/60 font-sans">
              Book a dedicated extra-wide bay with direct private elevator access.
            </p>
          </div>

          <div
            onClick={() => setPaid(true)}
            className="p-6 rounded-2xl bg-[#0f0e15] border border-white/10 hover:border-[#c5a059]/40 transition-colors cursor-pointer group"
          >
            <CreditCard className="h-6 w-6 text-[#c5a059] mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-serif text-lg text-[#fbf8f3] mb-1">
              {paid ? 'Valet Complimentary' : 'Pay Parking'}
            </h4>
            <p className="text-xs text-[#e8e2d8]/60 font-sans">
              {paid ? 'Waived for Black Tier Gor Kishan' : 'Fast automated payment via FASTag or Wallet.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0f0e15] border border-white/10 hover:border-[#c5a059]/40 transition-colors cursor-pointer group">
            <History className="h-6 w-6 text-[#c5a059] mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-serif text-lg text-[#fbf8f3] mb-1">Parking History</h4>
            <p className="text-xs text-[#e8e2d8]/60 font-sans">
              View past timestamps, receipts, and valet logs.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
