'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { AureliaMonogram } from './AureliaMonogram'
import { Search, MapPin, Sparkles, User, Shield, Compass, Navigation } from 'lucide-react'

interface AureliaHeaderProps {
  onOpenConcierge: () => void
  onOpenProfile: () => void
  onOpenSearch: () => void
}

export function AureliaHeader({
  onOpenConcierge,
  onOpenProfile,
  onOpenSearch,
}: AureliaHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${
        scrolled
          ? 'bg-[#08080a]/85 backdrop-blur-xl border-b border-[#c5a059]/20 shadow-2xl py-3.5'
          : 'bg-gradient-to-b from-[#08080a]/90 via-[#08080a]/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Left: Brand Monogram & Logo */}
        <Link href="#hero" className="flex items-center">
          <AureliaMonogram className="h-8 w-8" withText={true} />
        </Link>

        {/* Center: Luxury Editorial Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-[12px] uppercase font-sans tracking-[0.24em] font-medium text-[#e8e2d8]/75">
          <a
            href="#personalized"
            className="hover:text-[#c5a059] transition-colors duration-300 relative py-1 group"
          >
            Discover
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c5a059] transition-all duration-300 group-hover:w-full" />
          </a>
          <a
            href="#stores"
            className="hover:text-[#c5a059] transition-colors duration-300 relative py-1 group"
          >
            Stores
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c5a059] transition-all duration-300 group-hover:w-full" />
          </a>
          <a
            href="#dining"
            className="hover:text-[#c5a059] transition-colors duration-300 relative py-1 group"
          >
            Dining
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c5a059] transition-all duration-300 group-hover:w-full" />
          </a>
          <a
            href="#experiences"
            className="hover:text-[#c5a059] transition-colors duration-300 relative py-1 group"
          >
            Experiences
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c5a059] transition-all duration-300 group-hover:w-full" />
          </a>
          <a
            href="#offers"
            className="hover:text-[#c5a059] transition-colors duration-300 relative py-1 group"
          >
            Offers
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c5a059] transition-all duration-300 group-hover:w-full" />
          </a>
          <a
            href="#map"
            className="hover:text-[#c5a059] transition-colors duration-300 relative py-1 group flex items-center gap-1.5"
          >
            <Compass className="h-3.5 w-3.5 text-[#c5a059]" />
            3D Map
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c5a059] transition-all duration-300 group-hover:w-full" />
          </a>
          <a
            href="#parking"
            className="hover:text-[#c5a059] transition-colors duration-300 relative py-1 group"
          >
            Parking
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#c5a059] transition-all duration-300 group-hover:w-full" />
          </a>
        </nav>

        {/* Right: Actions, Profile & Concierge Trigger */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-[#e8e2d8]/80 hover:text-[#c5a059] hover:bg-white/5 rounded-full transition-all duration-300"
            aria-label="Search Collection"
            title="Search Luxury Brands & Experiences"
          >
            <Search className="h-4 w-4 stroke-[1.5]" />
          </button>

          {/* Location indicator */}
          <a
            href="#map"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] font-sans tracking-wider text-[#e8e2d8]/70 hover:border-[#c5a059]/40 hover:text-[#c5a059] transition-all duration-300"
          >
            <MapPin className="h-3 w-3 text-[#c5a059]" />
            <span>Level 1 · Grand Atrium</span>
          </a>

          {/* AI Concierge Trigger */}
          <button
            onClick={onOpenConcierge}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#c5a059]/20 via-[#e6ca85]/15 to-[#c5a059]/20 border border-[#c5a059]/40 hover:border-[#c5a059] text-[11px] font-sans uppercase tracking-[0.2em] text-[#fbf8f3] font-semibold shadow-lg hover:shadow-[#c5a059]/20 transition-all duration-500 group"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e6ca85] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c5a059]" />
            </span>
            <Sparkles className="h-3.5 w-3.5 text-[#e6ca85] group-hover:rotate-12 transition-transform duration-300" />
            <span className="hidden sm:inline">Concierge AURA</span>
          </button>

          {/* Profile Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#c5a059]/40 transition-all duration-300 text-left"
          >
            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-[#1a1512] to-[#c5a059]/50 flex items-center justify-center border border-[#c5a059]/40 text-[10px] font-serif text-[#fbf8f3]">
              G
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-[11px] font-medium leading-none text-[#fbf8f3]">Gor Kishan</span>
              <span className="text-[8px] tracking-widest text-[#c5a059] uppercase mt-0.5">VIP Black</span>
            </div>
          </button>

          {/* Staff / Management Gateway Discrete Link */}
          <Link
            href="/admin"
            className="p-1.5 text-white/30 hover:text-[#c5a059] transition-colors rounded-full"
            title="Management / Staff Portal"
          >
            <Shield className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
