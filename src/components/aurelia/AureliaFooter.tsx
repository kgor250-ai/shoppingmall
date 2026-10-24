'use client'

import React from 'react'
import Link from 'next/link'
import { AureliaMonogram } from './AureliaMonogram'
import { MapPin, Phone, Mail, Shield, ArrowUp } from 'lucide-react'

export function AureliaFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#050507] border-t border-white/10 pt-20 pb-12 px-6 md:px-12 text-[#e8e2d8]/70 relative">
      <div className="max-w-7xl mx-auto">
        {/* Top Brand Statement */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 pb-16 border-b border-white/10">
          <div>
            <AureliaMonogram className="h-10 w-10 mb-4" withText={true} />
            <p className="font-serif italic text-2xl text-[#fbf8f3] font-light max-w-xl mt-3">
              “Where Luxury Meets Experience.”
            </p>
            <p className="text-xs font-sans text-[#e8e2d8]/60 mt-2 max-w-md">
              A high-precision luxury retail platform bridging architectural grandeur, haute gastronomy, and intelligent spatial concierge services.
            </p>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 hover:border-[#c5a059] bg-white/[0.02] text-xs font-sans uppercase tracking-[0.24em] text-[#fbf8f3] transition-all group"
          >
            <span>Return to Top</span>
            <ArrowUp className="h-3.5 w-3.5 text-[#c5a059] group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Column Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16 border-b border-white/10 text-xs font-sans">
          {/* Col 1 */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a059] font-semibold block mb-4">
              The Maisons
            </span>
            <ul className="space-y-2.5">
              <li><a href="#stores" className="hover:text-white transition-colors">Haute Couture & Ateliers</a></li>
              <li><a href="#stores" className="hover:text-white transition-colors">High Jewellery Salons</a></li>
              <li><a href="#stores" className="hover:text-white transition-colors">Haute Horlogerie</a></li>
              <li><a href="#dining" className="hover:text-white transition-colors">Michelin Gastronomy</a></li>
              <li><a href="#stores" className="hover:text-white transition-colors">Artisanal Parfumerie</a></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a059] font-semibold block mb-4">
              Guest Services
            </span>
            <ul className="space-y-2.5">
              <li><a href="#hero" className="hover:text-white transition-colors">AI Concierge AURA</a></li>
              <li><a href="#map" className="hover:text-white transition-colors">Interactive 3D Mall Twin</a></li>
              <li><a href="#parking" className="hover:text-white transition-colors">Smart Valet & EV Hub</a></li>
              <li><a href="#experiences" className="hover:text-white transition-colors">Private Salon Fittings</a></li>
              <li><a href="#dining" className="hover:text-white transition-colors">Table Reservations</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a059] font-semibold block mb-4">
              The Inner Circle
            </span>
            <ul className="space-y-2.5">
              <li><a href="#vip" className="hover:text-white transition-colors">Patronage Tiers (Silver to Signature)</a></li>
              <li><a href="#personalized" className="hover:text-white transition-colors">AURELIA Digital Pass</a></li>
              <li><a href="#offers" className="hover:text-white transition-colors">Private Autumn Salon Invitations</a></li>
              <li><a href="#vip" className="hover:text-white transition-colors">Black Lounge & Champagne Bar</a></li>
            </ul>
          </div>

          {/* Col 4: Location & Operating Hours */}
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a059] font-semibold block mb-4">
              Concierge Desk
            </span>
            <p className="text-[#e8e2d8]/70 leading-relaxed">
              Grand Atrium Level 01<br />
              Open Daily: 10:00 AM – 11:30 PM<br />
              Valet Porte-Cochère: 24/7 Access
            </p>
            <div className="pt-2 text-[#c5a059]">
              concierge@aureliamall.luxury<br />
              +91 (022) 8800-AURELIA
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Staff Access */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] font-sans text-[#e8e2d8]/50">
          <div>
            © 2026 AURELIA Luxury Destinations Ltd. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <Link href="/admin" className="hover:text-[#c5a059] transition-colors flex items-center gap-1.5">
              <Shield className="h-3 w-3" />
              <span>Mall Admin Portal</span>
            </Link>
            <Link href="/store" className="hover:text-[#c5a059] transition-colors">
              Merchant POS
            </Link>
            <span>Terms of Patronage</span>
            <span>Privacy Charter</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
