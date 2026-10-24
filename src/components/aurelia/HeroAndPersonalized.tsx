'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  Sparkles,
  ArrowRight,
  Clock,
  Compass,
  Crown,
  ChevronRight,
  Bookmark,
  Calendar,
  ShieldCheck,
  Star,
  MapPin,
} from 'lucide-react'

interface HeroAndPersonalizedProps {
  onSelectStore: (storeId: string) => void
  onOpenConcierge: () => void
  onOpenDining: () => void
  onOpenWallet: () => void
}

export function HeroAndPersonalized({
  onSelectStore,
  onOpenConcierge,
  onOpenDining,
  onOpenWallet,
}: HeroAndPersonalizedProps) {
  const [savedItems, setSavedItems] = useState<string[]>([])

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSavedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const recentBrands = [
    {
      id: 'luxe-atelier',
      name: 'Luxe Atelier',
      category: 'Haute Couture',
      floor: 'Level 02 · Suite 210',
      image: '/aurelia/atelier.jpg',
      tagline: 'Autumn / Winter Private Collection',
    },
    {
      id: 'boucheron-salon',
      name: 'Maison Boucheron Paris',
      category: 'High Jewellery',
      floor: 'Level 01 · Salon 104',
      image: '/aurelia/jewelry.jpg',
      tagline: 'Serpent Bohème High Jewels Exhibition',
    },
    {
      id: 'apple-flagship',
      name: 'Apple Flagship Store',
      category: 'Technology & Audio',
      floor: 'Level 01 · Tech Pavilion Suite 101',
      image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
      tagline: 'iPhone 16 Pro, MacBook M3 & Audio',
    },
  ]

  const curatedCategories = [
    {
      title: 'Haute Horlogerie',
      subtitle: 'Audemars Piguet, Patek Philippe & Vacheron Constantin',
      tag: 'Curated for Gor Kishan',
      action: 'Explore Salons',
      target: '#stores',
    },
    {
      title: 'Artisanal Fragrance',
      subtitle: 'Bespoke bottle engraving and private scent consultation',
      tag: 'VIP Privilege',
      action: 'Reserve Session',
      target: '#experiences',
    },
    {
      title: 'Private Salon Fitting',
      subtitle: 'Dedicated champagne suite with master stylist',
      tag: 'Black Member Access',
      action: 'Book Atelier',
      target: '#experiences',
    },
  ]

  const todayEvents = [
    {
      time: '18:30 – 21:00',
      title: 'Midnight Jazz & Vintage Krug Tasting',
      location: 'Grand Atrium Promenade',
      status: 'Live Tonight',
      rsvp: true,
    },
    {
      time: '19:00 – 20:30',
      title: 'Private Autumn Preview: Saint Laurent',
      location: 'Level 02 Salon Privé',
      status: 'Exclusive RSVP',
      rsvp: true,
    },
    {
      time: 'All Evening',
      title: 'Complimentary Valet & EV Chauffeur Departure',
      location: 'P2 Private Porte-Cochère',
      status: 'Active for You',
      rsvp: false,
    },
  ]

  return (
    <div className="relative">
      {/* ─────────────────────────────────────────────────────────────
          01 — CINEMATIC LANDING HERO
      ───────────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden"
      >
        {/* Full-bleed photography with subtle parallax & luxury gradient overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/aurelia/hero.jpg"
            alt="Aurelia Luxury Interior"
            fill
            priority
            className="object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Subtle architectural vignette & obsidian shadows */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/40 to-[#08080a]/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#08080a_100%)] opacity-80" />
        </div>

        {/* Hero Editorial Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          {/* Subtle brand crest badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#c5a059]/30 bg-[#08080a]/60 backdrop-blur-md mb-8 animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c5a059] animate-pulse" />
            <span className="text-[11px] font-sans uppercase tracking-[0.32em] text-[#e6ca85]">
              Haute Retail & Cultural Destination
            </span>
          </div>

          {/* Hero Display Typography */}
          <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light tracking-[0.16em] text-[#fbf8f3] uppercase leading-[0.95] mb-6">
            AURELIA
          </h1>

          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#c5a059] to-transparent mb-6" />

          <p className="font-serif italic text-2xl md:text-3xl text-[#e8e2d8] tracking-widest font-normal mb-6">
            “Where Luxury Meets Experience.”
          </p>

          <p className="max-w-2xl text-sm md:text-base text-[#e8e2d8]/75 font-sans font-light tracking-wide leading-relaxed mb-10">
            Discover exceptional brands, extraordinary dining, unforgettable experiences and effortless luxury — all in one transcendent destination.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a
              href="#personalized"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#9a7837] text-[#0a0a0c] text-xs uppercase tracking-[0.25em] font-sans font-semibold hover:shadow-[0_0_30px_rgba(197,160,89,0.5)] transition-all duration-500 hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <span>Explore Aurelia</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>

            <a
              href="#stores"
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-[#fbf8f3] text-xs uppercase tracking-[0.25em] font-sans font-medium hover:border-[#c5a059] hover:text-[#c5a059] transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Discover Stores</span>
            </a>
          </div>

          {/* Scroll Down Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
            <span className="text-[10px] tracking-[0.3em] font-sans uppercase text-[#e8e2d8]">
              Scroll to explore
            </span>
            <span className="text-[#c5a059] text-xs animate-bounce">↓</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          03 — PERSONALIZED HOME EXPERIENCE (Gor Kishan Portal)
      ───────────────────────────────────────────────────────────── */}
      <section id="personalized" className="relative py-24 px-6 md:px-12 bg-[#08080a]">
        <div className="max-w-7xl mx-auto">
          {/* Personalized Salutation Header */}
          <div className="border-b border-white/10 pb-12 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.28em] text-[#c5a059] mb-3">
                <Crown className="h-3.5 w-3.5" />
                <span>Private Member Suite · Tier Black</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#fbf8f3] font-light tracking-wide leading-tight">
                {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}, <span className="italic font-normal text-[#e6ca85]">Gor Kishan.</span>
              </h2>
              <p className="text-sm md:text-base text-[#e8e2d8]/60 font-sans font-light mt-2">
                Your curated AURELIA experience awaits. Current concierge status: <span className="text-[#c5a059]">Assigned Chauffeur On-Site</span>.
              </p>
            </div>

            {/* Quick Guest Stats Card */}
            <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="pr-4 border-r border-white/10 cursor-pointer" onClick={onOpenWallet}>
                <span className="text-[10px] uppercase tracking-widest text-[#e8e2d8]/60 font-sans block">
                  Reward Points
                </span>
                <span className="font-serif text-2xl text-[#fbf8f3] font-light">
                  24,850 <span className="text-xs font-sans text-[#c5a059]">pts</span>
                </span>
              </div>
              <div className="cursor-pointer" onClick={onOpenDining}>
                <span className="text-[10px] uppercase tracking-widest text-[#e8e2d8]/60 font-sans block">
                  Active Table
                </span>
                <span className="text-xs text-[#e8e2d8] font-sans flex items-center gap-1.5 mt-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  L&apos;Écrin (20:00)
                </span>
              </div>
            </div>
          </div>

          {/* Continue Exploring — Large Editorial Cards */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#c5a059] font-sans block">
                  Recently Visited
                </span>
                <h3 className="font-serif text-2xl md:text-3xl text-[#fbf8f3] tracking-wide">
                  Continue Exploring
                </h3>
              </div>
              <a
                href="#stores"
                className="text-xs uppercase tracking-[0.2em] text-[#e8e2d8]/60 hover:text-[#c5a059] transition-colors flex items-center gap-1"
              >
                <span>View All 180+ Stores</span>
                <ChevronRight className="h-3 w-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentBrands.map((brand) => (
                <div
                  key={brand.id}
                  onClick={() => onSelectStore(brand.id)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#0f0e13] border border-white/10 hover:border-[#c5a059]/40 transition-all duration-700 flex flex-col justify-between"
                >
                  {/* Image container */}
                  <div className="relative h-72 w-full overflow-hidden">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0e13] via-transparent to-black/20" />

                    {/* Bookmark button */}
                    <button
                      onClick={(e) => toggleSave(brand.id, e)}
                      className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-[#c5a059] transition-colors"
                    >
                      <Bookmark
                        className={`h-4 w-4 ${
                          savedItems.includes(brand.id) ? 'fill-[#c5a059] text-[#c5a059]' : ''
                        }`}
                      />
                    </button>

                    {/* Category pill */}
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] uppercase tracking-widest text-[#e8e2d8]">
                      {brand.category}
                    </div>
                  </div>

                  {/* Editorial Card Body */}
                  <div className="p-6">
                    <div className="text-[11px] font-sans uppercase tracking-widest text-[#c5a059] mb-1">
                      {brand.floor}
                    </div>
                    <h4 className="font-serif text-2xl text-[#fbf8f3] tracking-wide mb-2 group-hover:text-[#e6ca85] transition-colors">
                      {brand.name}
                    </h4>
                    <p className="text-xs text-[#e8e2d8]/60 font-sans font-light mb-6">
                      {brand.tagline}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-sans uppercase tracking-[0.2em] text-[#e8e2d8]/70 group-hover:text-[#c5a059] transition-colors">
                      <span>Explore Boutique</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Curated For You & Today at AURELIA Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Curated Recommendations (7 cols) */}
            <div className="lg:col-span-7 bg-gradient-to-br from-[#121118] via-[#0c0c10] to-[#141219] p-8 md:p-10 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#c5a059]/5 blur-3xl pointer-events-none" />

              <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.28em] text-[#c5a059] mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Recommendation Engine</span>
              </div>
              <h3 className="font-serif text-3xl text-[#fbf8f3] tracking-wide mb-3">
                “You may love these, Gor Kishan.”
              </h3>
              <p className="text-xs text-[#e8e2d8]/60 font-sans font-light mb-8 max-w-lg">
                Crafted based on your affinity for Swiss high horology, haute joaillerie exhibitions, and curated omakase dining.
              </p>

              <div className="space-y-4">
                {curatedCategories.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#c5a059]/30 hover:bg-white/[0.04] transition-all duration-300 flex items-center justify-between group cursor-pointer"
                    onClick={onOpenConcierge}
                  >
                    <div>
                      <span className="text-[10px] font-sans uppercase tracking-widest text-[#c5a059] block mb-1">
                        {item.tag}
                      </span>
                      <h4 className="font-serif text-lg text-[#fbf8f3] tracking-wide group-hover:text-[#e6ca85] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#e8e2d8]/60 font-sans mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 group-hover:border-[#c5a059]/50 text-[11px] font-sans uppercase tracking-widest text-[#e8e2d8]/70 group-hover:text-[#c5a059] transition-all">
                      <span>{item.action}</span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today at AURELIA (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#121118] via-[#0c0c10] to-[#141219] p-8 md:p-10 rounded-3xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.28em] text-[#c5a059] mb-2">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Live Happenings</span>
                </div>
                <h3 className="font-serif text-3xl text-[#fbf8f3] tracking-wide mb-6">
                  Today at Aurelia
                </h3>

                <div className="space-y-5">
                  {todayEvents.map((evt, idx) => (
                    <div key={idx} className="pb-5 border-b border-white/10 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between text-[11px] font-sans tracking-widest uppercase mb-1">
                        <span className="text-[#c5a059] flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          {evt.time}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/5 text-[9px] text-[#e8e2d8]/70">
                          {evt.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-[#fbf8f3] tracking-wide">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-[#e8e2d8]/50 mt-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#c5a059]/70" />
                        {evt.location}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Concierge button trigger */}
              <div className="pt-8 border-t border-white/10 mt-6">
                <button
                  onClick={onOpenConcierge}
                  className="w-full py-3.5 px-4 rounded-xl border border-[#c5a059]/30 bg-[#c5a059]/10 hover:bg-[#c5a059]/20 text-[#fbf8f3] text-xs uppercase tracking-[0.22em] font-sans font-medium flex items-center justify-center gap-2 transition-all duration-300"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#e6ca85]" />
                  <span>Ask AURA to plan my evening</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
