'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  Sparkles,
  Ticket,
  Clock,
  ArrowRight,
  CheckCircle,
  Copy,
  QrCode,
  Shield,
  Tag,
} from 'lucide-react'
import { allOffers } from '@/data/offers'
import { Offer } from '@/data/types'

export type OfferItem = Offer
export const luxuryOffers = allOffers

export function ExclusiveOffers() {
  const [revealedOffers, setRevealedOffers] = useState<string[]>([])
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('ALL')

  const toggleReveal = (id: string) => {
    setRevealedOffers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2500)
  }

  const categories = ['ALL', 'FASHION', 'JEWELLERY', 'DINING', 'ELECTRONICS', 'CINEMA', 'SERVICES']

  const filteredOffers = allOffers.filter((o) => {
    return activeCategory === 'ALL' || o.category === activeCategory
  })

  return (
    <section id="offers" className="py-28 px-6 md:px-12 bg-[#09080e] relative">
      <div className="max-w-7xl mx-auto">
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.32em] text-[#c5a059] mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Private Invitations & Privileges</span>
          </div>
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#fbf8f3] font-light tracking-wide uppercase mb-4">
            Exclusively Yours
          </h2>
          <div className="w-16 h-[1px] bg-[#c5a059] mx-auto mb-6" />
          <p className="text-sm md:text-base text-[#e8e2d8]/70 font-sans font-light tracking-wide">
            Curated private sales, vault previews, sommelier cellar passes, and tech upgrade vouchers unlocked for AURELIA members.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-[11px] font-sans tracking-[0.2em] uppercase transition-all duration-300 whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#c5a059] text-[#0a0a0c] font-semibold shadow-md shadow-[#c5a059]/30'
                  : 'bg-white/[0.03] text-[#e8e2d8]/70 hover:bg-white/[0.08] hover:text-[#fbf8f3] border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Campaign Offer Cards */}
        <div className="space-y-12">
          {filteredOffers.map((offer) => {
            const isRevealed = revealedOffers.includes(offer.id)

            return (
              <div
                key={offer.id}
                className="group relative rounded-3xl bg-[#100f17] border border-white/10 hover:border-[#c5a059]/40 overflow-hidden transition-all duration-700 grid grid-cols-1 lg:grid-cols-12 shadow-2xl"
              >
                {/* Large Campaign Visual (7 cols) */}
                <div className="lg:col-span-7 relative h-72 lg:h-[460px] overflow-hidden">
                  <Image
                    src={offer.image}
                    alt={offer.campaign}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                    onError={(e) => {
                      e.currentTarget.src = '/aurelia/atelier.jpg'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#100f17] via-transparent to-black/30 lg:hidden" />
                  
                  {/* Privilege Badge */}
                  <div className="absolute top-6 left-6 flex items-center gap-2">
                    <span className="px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-sans uppercase tracking-[0.25em] text-[#e6ca85]">
                      {offer.privilege}
                    </span>
                    {offer.discountPercentage && (
                      <span className="px-3 py-1.5 rounded-full bg-rose-500/90 text-[10px] font-sans font-bold text-white shadow-md">
                        {offer.discountPercentage}% OFF
                      </span>
                    )}
                  </div>
                </div>

                {/* Editorial Offer Body & Coupon Animation (5 cols) */}
                <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-sans uppercase tracking-[0.3em] text-[#c5a059] block mb-2">
                      {offer.maison}
                    </span>

                    <h3 className="font-serif text-3xl lg:text-4xl text-[#fbf8f3] font-light tracking-wide mb-3">
                      {offer.campaign}
                    </h3>

                    <p className="font-serif italic text-lg text-[#e8e2d8] mb-4">
                      “{offer.tagline}”
                    </p>

                    <p className="text-xs lg:text-sm text-[#e8e2d8]/70 font-sans font-light leading-relaxed mb-6">
                      {offer.details}
                    </p>

                    {/* Elegant Validity Tag */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-sans tracking-widest text-[#e6ca85] mb-8">
                      <Clock className="h-3.5 w-3.5 text-[#c5a059]" />
                      <span>{offer.validity}</span>
                    </div>
                  </div>

                  {/* Interactive Reveal Area */}
                  <div>
                    {!isRevealed ? (
                      <button
                        onClick={() => toggleReveal(offer.id)}
                        className="w-full py-4 rounded-full border border-[#c5a059]/50 bg-[#c5a059]/10 hover:bg-[#c5a059]/20 text-[#fbf8f3] text-xs font-sans uppercase tracking-[0.25em] font-semibold transition-all flex items-center justify-center gap-2 group-hover:border-[#c5a059]"
                      >
                        <Ticket className="h-4 w-4 text-[#e6ca85]" />
                        <span>Reveal Exclusive Privilege Pass</span>
                      </button>
                    ) : (
                      /* Revealed Digital Coupon Pass */
                      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#17141f] to-[#120f0d] border border-[#c5a059] shadow-xl animate-fade-in space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase tracking-widest text-[#c5a059] font-sans block">
                              Digital Privilege Voucher
                            </span>
                            <span className="font-mono text-xl tracking-[0.18em] text-[#fbf8f3] font-bold">
                              {offer.code}
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopy(offer.code)}
                            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors"
                            title="Copy Voucher Code"
                          >
                            {copiedCode === offer.code ? (
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[10px] font-sans text-[#e8e2d8]/60">
                          <span>Show this barcode or pass at boutique register</span>
                          <span className="text-[#c5a059] font-medium">Synced with Wallet</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
