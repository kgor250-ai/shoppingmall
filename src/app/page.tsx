'use client'

import React, { useState } from 'react'
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

export default function AureliaHomePage() {
  // Modal & Drawer State Management
  const [selectedStore, setSelectedStore] = useState<BrandData | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantData | null>(null)
  const [conciergeOpen, setConciergeOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [walletOpen, setWalletOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '')
      if (hash) setActiveSection(hash)
    }

    const sections = [
      'hero',
      'personalized',
      'stores',
      'map',
      'dining',
      'offers',
      'experiences',
      'parking',
      'vip',
    ]

    const handleScroll = () => {
      const scrollPos = window.scrollY + 160
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const top = el.offsetTop
          const h = el.offsetHeight
          if (scrollPos >= top && scrollPos < top + h) {
            setActiveSection(id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Quick navigation handlers
  const handleSelectStoreById = (storeId: string) => {
    const found = luxuryBrandsList.find((b) => b.id === storeId)
    if (found) {
      setSelectedStore(found)
    }
  }

  const handleNavigateToMap = (storeName: string, floor: string) => {
    window.location.hash = '#map'
    setActiveSection('map')
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-[#fbf8f3] font-sans selection:bg-[#c5a059] selection:text-[#0a0a0c] relative">
      {/* ── 02: SMART FLOATING HEADER ── */}
      <AureliaHeader
        currentSection={activeSection}
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
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setConciergeOpen(true)}
          className="group relative flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-tr from-[#9a7837] via-[#c5a059] to-[#f3e7cf] shadow-[0_0_30px_rgba(197,160,89,0.5)] hover:shadow-[0_0_40px_rgba(197,160,89,0.8)] hover:scale-105 transition-all duration-500"
          aria-label="Open AURA AI Concierge"
          title="Consult Luxury Concierge AURA"
        >
          {/* Outer Pulsing Particle Ring */}
          <span className="absolute -inset-1 rounded-full bg-[#c5a059]/30 blur-sm animate-pulse" />
          
          <div className="h-[92%] w-[92%] rounded-full bg-[#0a0a0c] flex items-center justify-center relative z-10">
            <Sparkles className="h-6 w-6 text-[#e6ca85] group-hover:rotate-45 transition-transform duration-500" />
          </div>

          {/* Tooltip on hover */}
          <span className="hidden md:block absolute right-16 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#c5a059]/30 text-[10px] font-sans tracking-widest text-[#fbf8f3] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Ask AURA
          </span>
        </button>
      </div>

      {/* ── 16: MOBILE BOTTOM LUXURY DOCK ── */}
      {(() => {
        const isHome = activeSection === 'hero' || activeSection === 'personalized'
        const isStores = activeSection === 'stores'
        const isMap = activeSection === 'map'
        const isOffers = activeSection === 'offers' || activeSection === 'dining' || activeSection === 'experiences'

        return (
          <nav
            aria-label="Mobile quick navigation dock"
            className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#08080a]/95 backdrop-blur-xl border-t border-[#c5a059]/20 px-6 py-2.5 flex items-center justify-between text-[10px] font-sans tracking-widest"
          >
            <a
              href="#hero"
              onClick={() => setActiveSection('hero')}
              aria-current={isHome ? 'location' : undefined}
              className={`flex flex-col items-center gap-1 transition-all py-1 ${
                isHome ? 'text-[#c5a059] font-bold drop-shadow-[0_0_6px_rgba(197,160,89,0.5)]' : 'text-[#e8e2d8]/70 hover:text-[#c5a059]'
              }`}
            >
              <Home className={`h-4 w-4 ${isHome ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
              <span>HOME</span>
            </a>
            <a
              href="#stores"
              onClick={() => setActiveSection('stores')}
              aria-current={isStores ? 'location' : undefined}
              className={`flex flex-col items-center gap-1 transition-all py-1 ${
                isStores ? 'text-[#c5a059] font-bold drop-shadow-[0_0_6px_rgba(197,160,89,0.5)]' : 'text-[#e8e2d8]/70 hover:text-[#c5a059]'
              }`}
            >
              <ShoppingBag className={`h-4 w-4 ${isStores ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
              <span>STORES</span>
            </a>
            <a
              href="#map"
              onClick={() => setActiveSection('map')}
              aria-current={isMap ? 'location' : undefined}
              className={`flex flex-col items-center gap-1 transition-all py-1 ${
                isMap ? 'text-[#c5a059] font-bold drop-shadow-[0_0_6px_rgba(197,160,89,0.5)]' : 'text-[#e8e2d8]/70 hover:text-[#c5a059]'
              }`}
            >
              <Compass className={`h-4 w-4 ${isMap ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
              <span>MAP</span>
            </a>
            <a
              href="#offers"
              onClick={() => setActiveSection('offers')}
              aria-current={isOffers ? 'location' : undefined}
              className={`flex flex-col items-center gap-1 transition-all py-1 ${
                isOffers ? 'text-[#c5a059] font-bold drop-shadow-[0_0_6px_rgba(197,160,89,0.5)]' : 'text-[#e8e2d8]/70 hover:text-[#c5a059]'
              }`}
            >
              <Tag className={`h-4 w-4 ${isOffers ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
              <span>OFFERS</span>
            </a>
            <button
              onClick={() => setProfileOpen(true)}
              aria-label="Open VIP Profile"
              className={`flex flex-col items-center gap-1 transition-all py-1 cursor-pointer ${
                profileOpen ? 'text-[#c5a059] font-bold' : 'text-[#e8e2d8]/70 hover:text-[#c5a059]'
              }`}
            >
              <User className={`h-4 w-4 ${profileOpen ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
              <span>PROFILE</span>
            </button>
          </nav>
        )
      })()}
    </div>
  )
}
