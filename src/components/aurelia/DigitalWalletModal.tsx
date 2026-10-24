'use client'

import React, { useState } from 'react'
import {
  X,
  CreditCard,
  QrCode,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  CheckCircle,
  Copy,
  Shield,
  Smartphone,
} from 'lucide-react'

interface DigitalWalletModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DigitalWalletModal({ isOpen, onClose }: DigitalWalletModalProps) {
  const [activeTab, setActiveTab] = useState<'pass' | 'coupons' | 'history'>('pass')
  const [redeemed, setRedeemed] = useState(false)
  const [scanPayOpen, setScanPayOpen] = useState(false)

  if (!isOpen) return null

  const transactions = [
    {
      id: 'tx-1',
      title: "L'Écrin Céleste — Tasting Dinner",
      date: '02 Oct 2026',
      points: '+420 pts',
      amount: '₹42,000',
    },
    {
      id: 'tx-2',
      title: 'Boucheron Paris — Quatre Ring Deposit',
      date: '28 Sep 2026',
      points: '+2,400 pts',
      amount: '₹2,40,000',
    },
    {
      id: 'tx-3',
      title: 'AURELIA Rewards Concierge Redemption',
      date: '15 Sep 2026',
      points: '-5,000 pts',
      amount: '₹5,000 Credit',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0b0a10] border border-[#c5a059]/40 shadow-2xl p-6 md:p-10 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors z-20"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.28em] text-[#c5a059] mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AURELIA Pass</span>
            </div>
            <h3 className="font-serif text-3xl text-[#fbf8f3] tracking-wide">
              Digital Wallet & Vault
            </h3>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto custom-dark-scrollbar flex-1 py-6 space-y-8">
          {/* Virtual Pass Card */}
          <div className="rounded-3xl p-7 bg-gradient-to-br from-[#1a1724] via-[#100f16] to-[#0c0a10] border border-[#c5a059]/50 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <span className="font-serif tracking-[0.25em] text-sm text-[#fbf8f3] uppercase">
                AURELIA BLACK
              </span>
              <span className="px-3 py-1 rounded-full bg-[#c5a059]/20 text-[#e6ca85] text-[10px] font-sans tracking-widest uppercase">
                Pass Active
              </span>
            </div>

            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-widest text-[#e8e2d8]/60 font-sans block mb-1">
                Available Rewards Balance
              </span>
              <div className="font-serif text-4xl text-[#fbf8f3] font-light">
                24,850 <span className="text-sm font-sans text-[#c5a059] font-medium">PTS</span>
              </div>
              <p className="text-xs text-[#e8e2d8]/60 font-sans mt-1">
                Equivalent credit: <span className="text-white font-medium">₹24,850</span> redeemable instantly at all 180+ boutiques.
              </p>
            </div>

            {/* Simulated Barcode / QR Section */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <QrCode className="h-8 w-8 text-[#c5a059]" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-white/50 font-sans block">
                    NFC TOUCH & PAY
                  </span>
                  <span className="font-mono text-xs text-[#fbf8f3]">
                    AUR-8921-9988-5431
                  </span>
                </div>
              </div>

              <button
                onClick={() => setScanPayOpen(!scanPayOpen)}
                className="px-4 py-2 rounded-full bg-[#c5a059] text-[#0a0a0c] text-xs font-sans uppercase tracking-widest font-bold hover:bg-[#e6ca85] transition-colors"
              >
                Scan & Pay
              </button>
            </div>
          </div>

          {scanPayOpen && (
            <div className="p-6 rounded-2xl bg-[#14121b] border border-[#c5a059]/40 text-center animate-fade-in space-y-3">
              <QrCode className="h-28 w-28 text-[#c5a059] mx-auto animate-pulse" />
              <div className="text-xs font-sans text-[#fbf8f3] font-medium">
                Hold phone near boutique terminal or present QR to associate
              </div>
              <p className="text-[10px] text-[#e8e2d8]/50 font-sans">
                Payment will automatically apply Black Member discount and allocate reward points.
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setRedeemed(true)}
              className="flex-1 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#c5a059]/40 text-xs font-sans uppercase tracking-widest text-[#fbf8f3] font-medium transition-all flex items-center justify-center gap-2"
            >
              <Gift className="h-4 w-4 text-[#c5a059]" />
              <span>{redeemed ? '₹5,000 Voucher Added' : 'Redeem Points'}</span>
            </button>
            <button
              onClick={() => alert('Gift card catalog opened.')}
              className="flex-1 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#c5a059]/40 text-xs font-sans uppercase tracking-widest text-[#fbf8f3] font-medium transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="h-4 w-4 text-[#c5a059]" />
              <span>Digital Gift Cards</span>
            </button>
          </div>

          {/* Recent Luxury Transactions */}
          <div>
            <span className="text-xs font-sans uppercase tracking-[0.28em] text-[#c5a059] block mb-3">
              Recent Activity
            </span>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-sans"
                >
                  <div>
                    <div className="font-medium text-[#fbf8f3]">{tx.title}</div>
                    <div className="text-[10px] text-[#e8e2d8]/50 mt-0.5">{tx.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-[#fbf8f3]">{tx.amount}</div>
                    <div className="text-[10px] text-[#c5a059] font-mono">{tx.points}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
