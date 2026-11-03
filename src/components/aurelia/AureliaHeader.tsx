'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { AureliaMonogram } from './AureliaMonogram'
import { Search, MapPin, Sparkles, Shield, Compass } from 'lucide-react'

interface AureliaHeaderProps {
  onOpenConcierge: () => void
  onOpenProfile: () => void
  onOpenSearch: () => void
  currentSection?: string
}

const sectionTitles: Record<string, { label: string; parent?: string }> = {
  hero: { label: 'Grand Atrium' },
  personalized: { label: 'Discover', parent: 'Home' },
  stores: { label: 'Stores', parent: 'Home' },
  products: { label: 'Products', parent: 'Home' },
  categories: { label: 'Categories', parent: 'Home' },
  dining: { label: 'Dining', parent: 'Home' },
  experiences: { label: 'Experiences', parent: 'Home' },
  offers: { label: 'Offers', parent: 'Home' },
  map: { label: 'Mall Map', parent: 'Home' },
  parking: { label: 'Smart Parking', parent: 'Home' },
  vip: { label: 'VIP Inner Circle', parent: 'Home' },
}

const sectionLocations: Record<string, string> = {
  hero: 'Level 1 · Grand Atrium',
  personalized: 'Level 1 · Concierge Grand Lobby',
  stores: 'Level 1 & 2 · The Collection',
  products: 'Level 1 & 2 · Curated Merchandising',
  categories: 'All Levels · Department Directory',
  dining: 'Level 3 · Promenade Dining',
  experiences: 'Level 4 · Entertainment & IMAX',
  offers: 'VIP Lounge · Exclusive Privileges',
  map: 'All Levels · 3D Interactive Map',
  parking: 'Basement · Smart Valet & Bays',
  vip: 'Private Suites · Inner Circle',
}

export function AureliaHeader({
  onOpenConcierge,
  onOpenProfile,
  onOpenSearch,
  currentSection: propSection,
}: AureliaHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [internalSection, setInternalSection] = useState('hero')

  const activeSection = propSection || internalSection

  useEffect(() => {
    // Check initial hash on mount
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashId = window.location.hash.replace('#', '')
      if (hashId) setInternalSection(hashId)
    }

    const sections = [
      'hero',
      'personalized',
      'stores',
      'products',
      'categories',
      'map',
      'dining',
      'offers',
      'experiences',
      'parking',
      'vip',
    ]

    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 40)

      // Find section currently in viewport
      const scrollPosition = scrollY + 160
      let current = 'hero'

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            current = sectionId
            break
          }
        }
      }

      setInternalSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { id: 'hero', label: 'Home', href: '#hero' },
    { id: 'stores', label: 'Stores', href: '#stores' },
    { id: 'products', label: 'Products', href: '#products' },
    { id: 'categories', label: 'Categories', href: '#categories' },
    { id: 'offers', label: 'Offers', href: '#offers' },
    { id: 'map', label: 'Mall Map', href: '#map', isMap: true },
    { id: 'dining', label: 'Dining', href: '#dining' },
    { id: 'experiences', label: 'Experiences', href: '#experiences' },
  ]

  const activeLocation = sectionLocations[activeSection] || 'Level 1 · Grand Atrium'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${scrolled
        ? 'bg-[#08080a]/90 backdrop-blur-xl border-b border-[#c5a059]/20 shadow-2xl py-3.5'
        : 'bg-gradient-to-b from-[#08080a]/95 via-[#08080a]/50 to-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Left: Brand Monogram & Logo */}
        <Link
          href="#hero"
          onClick={() => setInternalSection('hero')}
          className="flex items-center group"
          aria-label="Aurelia Luxury Mall Home"
        >
          <AureliaMonogram className="h-8 w-8" withText={true} />
        </Link>

        {/* Center: Luxury Editorial Navigation with Route-Aware Active States */}
        <nav
          aria-label="Main shopping mall navigation"
          className="hidden lg:flex items-center gap-5 xl:gap-7 text-[11px] xl:text-[12px] uppercase font-sans tracking-[0.18em] xl:tracking-[0.22em] font-medium"
        >
          {navLinks.map((link) => {
            const isActive =
              activeSection === link.id ||
              (link.id === 'hero' && (!activeSection || activeSection === 'hero'))

            return (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setInternalSection(link.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative py-1 transition-all duration-300 flex items-center gap-1.5 ${isActive
                  ? 'text-[#c5a059] font-semibold drop-shadow-[0_0_8px_rgba(197,160,89,0.4)]'
                  : 'text-[#e8e2d8]/75 hover:text-[#c5a059]'
                  }`}
              >
                {link.isMap && (
                  <Compass
                    className={`h-3.5 w-3.5 transition-colors ${isActive ? 'text-[#c5a059]' : 'text-[#c5a059]/70 group-hover:text-[#c5a059]'
                      }`}
                  />
                )}
                <span>{link.label}</span>
                {/* Active Underline Indicator */}
                <span
                  className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 ${isActive
                    ? 'w-full bg-gradient-to-r from-[#c5a059] to-[#e6ca85] shadow-[0_0_6px_rgba(197,160,89,0.8)]'
                    : 'w-0 bg-[#c5a059] group-hover:w-full'
                    }`}
                />
              </a>
            )
          })}
        </nav>

        {/* Right: Actions, Profile & Concierge Trigger */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 text-[#e8e2d8]/80 hover:text-[#c5a059] hover:bg-white/5 rounded-full transition-all duration-300 cursor-pointer"
            aria-label="Search Collection"
            title="Search Luxury Brands & Experiences"
          >
            <Search className="h-4 w-4 stroke-[1.5]" />
          </button>

          {/* Dynamic Current Page & Location Indicator */}
          <a
            href="#map"
            onClick={() => setInternalSection('map')}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#c5a059]/30 bg-white/5 text-[11px] font-sans tracking-wider text-[#e8e2d8]/85 hover:border-[#c5a059]/60 hover:text-[#c5a059] transition-all duration-300"
            title="Current location · Click to view on 3D Mall Map"
          >
            <MapPin className="h-3 w-3 text-[#c5a059] animate-pulse flex-shrink-0" />
            <nav aria-label="Current location breadcrumb" className="flex items-center gap-1">
              <span className="text-[#c5a059] font-medium">
                {sectionTitles[activeSection]?.parent
                  ? `${sectionTitles[activeSection].parent} → ${sectionTitles[activeSection].label}`
                  : 'Home'}
              </span>
              <span className="text-white/30 hidden 2xl:inline">·</span>
              <span className="font-light text-[#e8e2d8]/75 hidden 2xl:inline">{activeLocation}</span>
            </nav>
          </a>

          {/* AI Concierge Trigger */}
          <button
            onClick={onOpenConcierge}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#c5a059]/20 via-[#e6ca85]/15 to-[#c5a059]/20 border border-[#c5a059]/40 hover:border-[#c5a059] text-[11px] font-sans uppercase tracking-[0.2em] text-[#fbf8f3] font-semibold shadow-lg hover:shadow-[#c5a059]/20 transition-all duration-500 group cursor-pointer"
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
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#c5a059]/40 transition-all duration-300 text-left cursor-pointer"
            aria-label="Open VIP Profile"
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
            aria-label="Staff and Admin Portal"
          >
            <Shield className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
