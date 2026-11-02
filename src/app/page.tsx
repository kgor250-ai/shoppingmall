'use client'

import React, { useState, useEffect } from 'react'
import { AureliaHeader } from '@/components/aurelia/AureliaHeader'
import { HeroAndPersonalized } from '@/components/aurelia/HeroAndPersonalized'
import { StoreDiscovery, BrandData, luxuryBrandsList } from '@/components/aurelia/StoreDiscovery'
import { StoreDetailModal } from '@/components/aurelia/StoreDetailModal'
import { InteractiveMallMap } from '@/components/aurelia/InteractiveMallMap'
import { DiningExperience, RestaurantData, luxuryRestaurants } from '@/components/aurelia/DiningExperience'
import { DiningReservationModal } from '@/components/aurelia/DiningReservationModal'
import { ExclusiveOffers } from '@/components/aurelia/ExclusiveOffers'
import { ExperiencesSection } from '@/components/aurelia/ExperiencesSection'
import { SmartParking } from '@/components/aurelia/SmartParking'
import { VipMembership } from '@/components/aurelia/VipMembership'
import { DigitalWalletModal } from '@/components/aurelia/DigitalWalletModal'
import { UserProfileDrawer } from '@/components/aurelia/UserProfileDrawer'
import { AuraConciergeModal } from '@/components/aurelia/AuraConciergeModal'
import { AureliaSearchModal } from '@/components/aurelia/AureliaSearchModal'
import { AureliaFooter } from '@/components/aurelia/AureliaFooter'
import { ProductDetailModal } from '@/components/aurelia/ProductDetailModal'
import { ScrollReveal } from '@/components/aurelia/ScrollReveal'
import { Product } from '@/data/types'
import {
  Sparkles,
  Home,
  Compass,
  Tag,
  User,
  ShoppingBag,
} from 'lucide-react'

type SectionName = 'home' | 'stores' | 'map' | 'dining' | 'offers' | 'experiences' | 'parking'

export default function AureliaHomePage() {
  // Modal & Drawer State Management
  const [selectedStore, setSelectedStore] = useState<BrandData | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantData | null>(null)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [walletOpen, setWalletOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Active section tracking for route-aware mobile dock & desktop header
  const [activeSection, setActiveSection] = useState<SectionName>('home')

  useEffect(() => {
    const sections: { id: string; name: SectionName }[] = [
      { id: 'hero', name: 'home' },
      { id: 'personalized', name: 'home' },
      { id: 'stores', name: 'stores' },
      { id: 'map', name: 'map' },
      { id: 'dining', name: 'dining' },
      { id: 'offers', name: 'offers' },
      { id: 'experiences', name: 'experiences' },
      { id: 'parking', name: 'parking' },
    ]

    const handleScroll = () => {
      const scrollY = window.scrollY + 240

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id)
        if (el) {
          const top = el.offsetTop
          if (scrollY >= top) {
            setActiveSection(sections[i].name)
            return
          }
        }
      }
      setActiveSection('home')
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // initial position check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Smooth scroll handler with immediate active state feedback
  const handleNavClick = (id: string, name: SectionName) => {
    setActiveSection(name)
    setProfileOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Quick navigation handlers
  const handleSelectStoreById = (storeId: string) => {
    const found = luxuryBrandsList.find((b) => b.id === storeId)
    if (found) {
      setSelectedStore(found)
    }
  }

  const handleNavigateToMap = (storeName: string, floor: string) => {
    setActiveSection('map')
    window.location.hash = '#map'
    const el = document.getElementById('map')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-[#fbf8f3] font-sans selection:bg-[#c5a059] selection:text-[#0a0a0c] relative">
      {/* ── 02: SMART FLOATING HEADER (DESKTOP ROUTE-AWARE) ── */}
      <AureliaHeader
        activeSection={activeSection}
        onOpenConcierge={() => setConciergeOpen(true)}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* ── 01 & 03: CINEMATIC HERO & PERSONALIZED GOR KISHAN PORTAL ── */}
      <HeroAndPersonalized
        onSelectStore={handleSelectStoreById}
        onOpenConcierge={() => setConciergeOpen(true)}
        onOpenDining={() => setSelectedRestaurant(luxuryRestaurants[0])}
        onOpenWallet={() => setWalletOpen(true)}
      />

      {/* ── 04: STORE DISCOVERY (THE COLLECTION) ── */}
      <ScrollReveal>
        <StoreDiscovery
          onSelectStore={(store) => setSelectedStore(store)}
          onSelectProduct={(prod) => setSelectedProduct(prod)}
        />
      </ScrollReveal>

      {/* ── 07: INTERACTIVE 3D MALL MAP ── */}
      <ScrollReveal>
        <InteractiveMallMap onSelectStoreDetails={(store: any) => setSelectedStore(store)} />
      </ScrollReveal>

      {/* ── 08: LUXURY DINING EXPERIENCE ── */}
      <ScrollReveal>
        <DiningExperience
          onReserveTable={(restaurant) => setSelectedRestaurant(restaurant)}
        />
      </ScrollReveal>

      {/* ── 09: EXCLUSIVE OFFERS & CAMPAIGNS ── */}
      <ScrollReveal>
        <ExclusiveOffers />
      </ScrollReveal>

      {/* ── 10: EXPERIENCES (MORE THAN SHOPPING) ── */}
      <ScrollReveal>
        <ExperiencesSection />
      </ScrollReveal>

      {/* ── 11: SMART PARKING NAVIGATOR ── */}
      <ScrollReveal>
        <SmartParking />
      </ScrollReveal>

      {/* ── 12: VIP MEMBERSHIP (INNER CIRCLE) ── */}
      <ScrollReveal>
        <VipMembership onOpenWallet={() => setWalletOpen(true)} />
      </ScrollReveal>

      {/* ── FOOTER ── */}
      <AureliaFooter />

      {/* ── MODALS & DRAWERS ── */}
      {/* 05: Store Detail Modal */}
      <StoreDetailModal
        store={selectedStore}
        onClose={() => setSelectedStore(null)}
        onNavigateToMap={handleNavigateToMap}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onNavigateToMap={handleNavigateToMap}
        onSelectStoreByName={(storeName) => {
          const found = luxuryBrandsList.find((b) => b.name.toLowerCase() === storeName.toLowerCase())
          if (found) setSelectedStore(found)
        }}
      />

      {/* 06: AI Concierge AURA */}
      <AuraConciergeModal
        isOpen={conciergeOpen}
        onClose={() => setConciergeOpen(false)}
        onNavigateMap={(target) => {
          window.location.hash = target
        }}
      />

      {/* 08: Dining Reservation Modal */}
      <DiningReservationModal
        restaurant={selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
      />

      {/* 13: Digital Wallet Modal */}
      <DigitalWalletModal
        isOpen={walletOpen}
        onClose={() => setWalletOpen(false)}
      />

      {/* 14: User Profile Drawer */}
      <UserProfileDrawer
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        onOpenWallet={() => setWalletOpen(true)}
        onOpenConcierge={() => setConciergeOpen(true)}
      />

      {/* Search Modal */}
      <AureliaSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectStore={(store) => setSelectedStore(store)}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
      />

      {/* ── FLOATING AI CONCIERGE BUTTON (AURA) ── */}
      {/* Positioned higher on mobile so it doesn't overlap the luxury dock */}
      <div className="fixed bottom-20 lg:bottom-6 right-5 z-40">
        <button
          onClick={() => setConciergeOpen(true)}
          className="group relative flex items-center justify-center h-13 w-13 lg:h-14 lg:w-14 rounded-full bg-gradient-to-tr from-[#9a7837] via-[#c5a059] to-[#f3e7cf] shadow-[0_0_30px_rgba(197,160,89,0.5)] hover:shadow-[0_0_40px_rgba(197,160,89,0.8)] hover:scale-105 transition-all duration-500 cursor-pointer"
          aria-label="Open AURA AI Concierge"
          title="Consult Luxury Concierge AURA"
        >
          {/* Outer Pulsing Particle Ring */}
          <span className="absolute -inset-1 rounded-full bg-[#c5a059]/30 blur-sm animate-pulse" />
          
          <div className="h-[92%] w-[92%] rounded-full bg-[#0a0a0c] flex items-center justify-center relative z-10">
            <Sparkles className="h-5 w-5 lg:h-6 lg:w-6 text-[#e6ca85] group-hover:rotate-45 transition-transform duration-500" />
          </div>

          {/* Tooltip on hover */}
          <span className="hidden md:block absolute right-16 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#c5a059]/30 text-[10px] font-sans tracking-widest text-[#fbf8f3] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Ask AURA
          </span>
        </button>
      </div>

      {/* ── 16: MOBILE BOTTOM LUXURY DOCK (ACTIVE ROUTE-AWARE) ── */}
      <nav
        aria-label="Mobile Navigation Dock"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#08080a]/95 backdrop-blur-2xl border-t border-[#d4af37]/25 px-2 py-1.5 flex items-center justify-around text-[10px] font-sans tracking-widest shadow-[0_-10px_35px_rgba(0,0,0,0.85)] select-none"
      >
        {/* HOME */}
        <button
          type="button"
          onClick={() => handleNavClick('hero', 'home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-300 relative group cursor-pointer ${
            activeSection === 'home' && !profileOpen
              ? 'text-[#fae8c8] font-bold bg-[#d4af37]/15 shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          {activeSection === 'home' && !profileOpen && (
            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-[2.5px] w-7 rounded-full bg-gradient-to-r from-[#fae8c8] via-[#d4af37] to-[#9b7324] shadow-[0_0_10px_#d4af37]" />
          )}
          <Home
            className={`h-4 w-4 transition-all duration-300 ${
              activeSection === 'home' && !profileOpen
                ? 'text-[#d4af37] scale-110 drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]'
                : 'text-stone-400 group-hover:text-stone-200'
            }`}
          />
          <span className="text-[9px] mt-0.5 tracking-wider">HOME</span>
        </button>

        {/* STORES */}
        <button
          type="button"
          onClick={() => handleNavClick('stores', 'stores')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-300 relative group cursor-pointer ${
            activeSection === 'stores' && !profileOpen
              ? 'text-[#fae8c8] font-bold bg-[#d4af37]/15 shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          {activeSection === 'stores' && !profileOpen && (
            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-[2.5px] w-7 rounded-full bg-gradient-to-r from-[#fae8c8] via-[#d4af37] to-[#9b7324] shadow-[0_0_10px_#d4af37]" />
          )}
          <ShoppingBag
            className={`h-4 w-4 transition-all duration-300 ${
              activeSection === 'stores' && !profileOpen
                ? 'text-[#d4af37] scale-110 drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]'
                : 'text-stone-400 group-hover:text-stone-200'
            }`}
          />
          <span className="text-[9px] mt-0.5 tracking-wider">STORES</span>
        </button>

        {/* 3D MAP */}
        <button
          type="button"
          onClick={() => handleNavClick('map', 'map')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-300 relative group cursor-pointer ${
            activeSection === 'map' && !profileOpen
              ? 'text-[#fae8c8] font-bold bg-[#d4af37]/15 shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          {activeSection === 'map' && !profileOpen && (
            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-[2.5px] w-7 rounded-full bg-gradient-to-r from-[#fae8c8] via-[#d4af37] to-[#9b7324] shadow-[0_0_10px_#d4af37]" />
          )}
          <Compass
            className={`h-4 w-4 transition-all duration-300 ${
              activeSection === 'map' && !profileOpen
                ? 'text-[#d4af37] scale-110 drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]'
                : 'text-stone-400 group-hover:text-stone-200'
            }`}
          />
          <span className="text-[9px] mt-0.5 tracking-wider">MAP</span>
        </button>

        {/* OFFERS */}
        <button
          type="button"
          onClick={() => handleNavClick('offers', 'offers')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-300 relative group cursor-pointer ${
            activeSection === 'offers' && !profileOpen
              ? 'text-[#fae8c8] font-bold bg-[#d4af37]/15 shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          {activeSection === 'offers' && !profileOpen && (
            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-[2.5px] w-7 rounded-full bg-gradient-to-r from-[#fae8c8] via-[#d4af37] to-[#9b7324] shadow-[0_0_10px_#d4af37]" />
          )}
          <Tag
            className={`h-4 w-4 transition-all duration-300 ${
              activeSection === 'offers' && !profileOpen
                ? 'text-[#d4af37] scale-110 drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]'
                : 'text-stone-400 group-hover:text-stone-200'
            }`}
          />
          <span className="text-[9px] mt-0.5 tracking-wider">OFFERS</span>
        </button>

        {/* PROFILE */}
        <button
          type="button"
          onClick={() => setProfileOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-300 relative group cursor-pointer ${
            profileOpen
              ? 'text-[#fae8c8] font-bold bg-[#d4af37]/15 shadow-sm'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          {profileOpen && (
            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-[2.5px] w-7 rounded-full bg-gradient-to-r from-[#fae8c8] via-[#d4af37] to-[#9b7324] shadow-[0_0_10px_#d4af37]" />
          )}
          <User
            className={`h-4 w-4 transition-all duration-300 ${
              profileOpen
                ? 'text-[#d4af37] scale-110 drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]'
                : 'text-stone-400 group-hover:text-stone-200'
            }`}
          />
          <span className="text-[9px] mt-0.5 tracking-wider">PROFILE</span>
        </button>
      </nav>
    </div>
  )
}
