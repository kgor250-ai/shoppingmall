'use client'

import React, { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import {
  Search,
  MapPin,
  Store,
  Compass,
  Star,
  ArrowRight,
  ChevronRight,
  SlidersHorizontal,
  Navigation,
  Clock,
  Sparkles,
  ShoppingBag,
  Layers,
  X,
  CheckCircle2,
  Footprints,
} from 'lucide-react'
import {
  mall3DStores,
  Store3DData,
  calculateMallRoute,
  NavigationRoute,
  mallLandmarks,
} from '@/data/mall3dData'
import { getMall3DData } from '@/actions/mallLayout'
import { RealisticMallArchitecturalView } from './RealisticMallArchitecturalView'
import { BrandLogoBadge } from './BrandLogoBadge'
import { allStores } from '@/data/stores'

// Dynamically import 3D WebGL Canvas
const Mall3DScene = dynamic(() => import('./Mall3DScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-[#07070a]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-[#c5a059] uppercase tracking-widest font-serif">
          Loading 3D Architectural Model...
        </span>
      </div>
    </div>
  ),
})

export interface InteractiveMallMapProps {
  onSelectStoreDetails?: (store: any) => void
}

export function InteractiveMallMap({ onSelectStoreDetails }: InteractiveMallMapProps) {
  const [selectedFloor, setSelectedFloor] = useState<string>('ALL')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [enteredStore, setEnteredStore] = useState<Store3DData | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  const [startLandmarkId, setStartLandmarkId] = useState<string>(
    mallLandmarks[0]?.id || 'start-main-entrance'
  )

  const [dbStores, setDbStores] = useState<Store3DData[]>([])
  const [dbFloors, setDbFloors] = useState<any[]>([])

  React.useEffect(() => {
    getMall3DData().then((res) => {
      if (res.stores && res.floors) {
        setDbStores(res.stores)
        setDbFloors(res.floors)
      }
    })
  }, [])

  // Standard Ground Floor curated brands matching the reference screenshot exactly
  const curatedMallStores: Store3DData[] = useMemo(() => {
    const list: Store3DData[] = [
      // Ground Floor
      {
        id: 'zara-flagship',
        name: 'Zara',
        category: 'FASHION',
        floorId: 'G',
        wing: 'East Wing',
        shopNumber: 'G-12',
        modelPosition: [-11, 0.4, 9.8],
        description: 'Contemporary European runway fashion, updated twice weekly.',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
        rating: 4.5,
        reviewCount: 1200,
        hours: '10:00 AM – 10:00 PM',
        currentOffers: ['Mid-Season Private Sale: Up to 30% off'],
        tags: ['Fashion', 'Women', 'Men'],
      },
      {
        id: 'hm-flagship',
        name: 'H&M',
        category: 'FASHION',
        floorId: 'G',
        wing: 'East Wing',
        shopNumber: 'G-14',
        modelPosition: [-5.5, 0.4, 9.8],
        description: 'Fashion and quality at the best price in a sustainable way.',
        image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
        rating: 4.5,
        reviewCount: 950,
        hours: '10:00 AM – 10:00 PM',
        currentOffers: ['15% off with in-store garment recycling'],
        tags: ['Fashion', 'Casual'],
      },
      {
        id: 'levis-store',
        name: "Levi's",
        category: 'FASHION',
        floorId: 'G',
        wing: 'East Wing',
        shopNumber: 'G-18',
        modelPosition: [0, 0.4, 9.8],
        description: 'Home of authentic 501 original denim and tailor shop.',
        image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
        rating: 4.6,
        reviewCount: 850,
        hours: '10:00 AM – 10:00 PM',
        currentOffers: ['Complimentary custom patch embroidery'],
        tags: ['Fashion', 'Denim'],
      },
      {
        id: 'lifestyle-store',
        name: 'Lifestyle',
        category: 'FASHION',
        floorId: 'G',
        wing: 'West Wing',
        shopNumber: 'G-21',
        modelPosition: [5.5, 0.4, 9.8],
        description: 'Leading fashion destination showcasing global brands and footwear.',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
        rating: 4.4,
        reviewCount: 720,
        hours: '10:00 AM – 10:00 PM',
        currentOffers: ['Flat 20% privilege on purchase above ₹3,999'],
        tags: ['Fashion', 'Multi-Brand'],
      },
      {
        id: 'westside-store',
        name: 'Westside',
        category: 'FASHION',
        floorId: 'G',
        wing: 'West Wing',
        shopNumber: 'G-23',
        modelPosition: [11, 0.4, 9.8],
        description: 'Contemporary apparel, Studio West cosmetics, and footwear.',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
        rating: 4.3,
        reviewCount: 640,
        hours: '10:00 AM – 10:00 PM',
        currentOffers: ['Club West double points on new arrivals'],
        tags: ['Fashion', 'Apparel'],
      },
      {
        id: 'mcdonalds',
        name: "McDonald's",
        category: 'DINING',
        floorId: 'G',
        wing: 'West Wing',
        shopNumber: 'G-05',
        modelPosition: [-16, 0.4, 6],
        description: "World's favorite burgers and McCafé artisanal beverages.",
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
        rating: 4.6,
        reviewCount: 1400,
        hours: '08:00 AM – 11:30 PM',
        currentOffers: ['McCafé artisanal pastry combo at ₹299'],
        tags: ['Food', 'Quick Service'],
      },
      {
        id: 'starbucks-reserve',
        name: 'Starbucks',
        category: 'DINING',
        floorId: 'G',
        wing: 'East Wing',
        shopNumber: 'G-07',
        modelPosition: [8.5, 0.4, 6],
        description: 'Small-lot Reserve coffees, cold brew flights, and fresh bakery.',
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        reviewCount: 1100,
        hours: '08:00 AM – 11:00 PM',
        currentOffers: ['Gold Member double stars on Nitro Reserve'],
        tags: ['Food & Beverages', 'Coffee'],
      },
      {
        id: 'croma-electronics',
        name: 'Croma',
        category: 'ELECTRONICS',
        floorId: 'G',
        wing: 'East Wing',
        shopNumber: 'G-32',
        modelPosition: [12, 0.4, 6],
        description: 'Premium tech megastore with audio pods, laptops, and appliances.',
        image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80',
        rating: 4.6,
        reviewCount: 680,
        hours: '10:00 AM – 10:00 PM',
        currentOffers: ['Up to ₹5,000 instant bank cashback'],
        tags: ['Electronics', 'Tech'],
      },

      // Level 1
      {
        id: 'samsung-experience',
        name: 'Samsung',
        category: 'ELECTRONICS',
        floorId: '1',
        wing: 'West Wing',
        shopNumber: '1-04',
        modelPosition: [-16, 4.6, 6],
        description: 'Discover Galaxy AI, Z Fold6, and Neo QLED 8K displays.',
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        reviewCount: 760,
        hours: '10:00 AM – 10:00 PM',
        currentOffers: ['Galaxy AI Masterclass voucher worth ₹2,500'],
        tags: ['Electronics', 'Galaxy'],
      },
      {
        id: 'apple-flagship',
        name: 'Apple',
        category: 'ELECTRONICS',
        floorId: '1',
        wing: 'North Wing',
        shopNumber: '1-08',
        modelPosition: [0, 4.6, 6],
        description: 'Architectural glass flagship with Genius Bar and Today at Apple.',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        reviewCount: 2100,
        hours: '10:00 AM – 10:00 PM',
        currentOffers: ['Trade-in credit up to ₹65,000'],
        tags: ['Electronics', 'Apple'],
      },
      {
        id: 'sephora-flagship',
        name: 'Sephora',
        category: 'BEAUTY',
        floorId: '1',
        wing: 'East Wing',
        shopNumber: '1-12',
        modelPosition: [11, 4.6, 6],
        description: 'Prestige cosmetics, skincare, and custom Beauty Studio sessions.',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        reviewCount: 1100,
        hours: '10:00 AM – 10:00 PM',
        currentOffers: ['Complimentary 15-minute express makeover'],
        tags: ['Beauty', 'Cosmetics'],
      },
      {
        id: 'the-body-shop',
        name: 'The Body Shop',
        category: 'BEAUTY',
        floorId: '1',
        wing: 'East Wing',
        shopNumber: '1-16',
        modelPosition: [16.5, 4.6, 6],
        description: 'Cruelty-free botanical skincare, body butters, and refills.',
        image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        reviewCount: 510,
        hours: '10:00 AM – 10:00 PM',
        currentOffers: ['Buy 2 Get 1 Free on Body Butter collections'],
        tags: ['Beauty', 'Skincare'],
      },

      // Level 2
      {
        id: 'tommy-hilfiger',
        name: 'Tommy Hilfiger',
        category: 'FASHION',
        floorId: '2',
        wing: 'Central Atrium',
        shopNumber: '2-04',
        modelPosition: [-2, 8.8, 6],
        description: 'Classic American preppy styling, blazers, and heritage rugby shirts.',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        reviewCount: 430,
        hours: '10:00 AM – 10:00 PM',
        currentOffers: ['Flat 20% off on purchase of 2 heritage shirts'],
        tags: ['Fashion', 'Preppy'],
      },
      {
        id: 'nykaa-luxe',
        name: 'Nykaa Luxe',
        category: 'BEAUTY',
        floorId: '2',
        wing: 'East Wing',
        shopNumber: '2-12',
        modelPosition: [16.5, 8.8, 6],
        description: 'Global luxury beauty house presenting MAC, Clinique, and Estée Lauder.',
        image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        reviewCount: 620,
        hours: '10:00 AM – 10:00 PM',
        currentOffers: ['Free full-sized lipstick with ₹3,500 purchase'],
        tags: ['Beauty', 'Fragrance'],
      },

      // Level 3
      {
        id: 'pvr-cinemas',
        name: 'PVR INOX Insignia',
        category: 'ENTERTAINMENT',
        floorId: '3',
        wing: 'Central Atrium',
        shopNumber: '3-02',
        modelPosition: [-4, 13, 6],
        description: 'Ultra-exclusive 7-star cinematic retreat with butler dining.',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        reviewCount: 1890,
        hours: '09:00 AM – 01:30 AM',
        currentOffers: ['Insignia Gourmet Combo for ₹650'],
        tags: ['Entertainment', 'Cinema'],
      },
      {
        id: 'game-zone',
        name: 'Gaming Zone',
        category: 'ENTERTAINMENT',
        floorId: '3',
        wing: 'East Wing',
        shopNumber: '3-06',
        modelPosition: [6, 13, 6],
        description: 'Motion racing simulators, VR escape quests, and retro arcade.',
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        reviewCount: 940,
        hours: '11:00 AM – 11:30 PM',
        currentOffers: ['Load ₹2,000 get ₹1,000 bonus credits'],
        tags: ['Entertainment', 'VR Arcade'],
      },
      {
        id: 'kids-play-zone',
        name: 'Kids Play Zone',
        category: 'ENTERTAINMENT',
        floorId: '3',
        wing: 'East Wing',
        shopNumber: '3-10',
        modelPosition: [16, 13, 6],
        description: 'Multi-level soft playground, foam pits, and slides.',
        image: 'https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        reviewCount: 780,
        hours: '10:00 AM – 10:00 PM',
        currentOffers: ['2-hour play pass at ₹799 with grip socks'],
        tags: ['Entertainment', 'Kids'],
      },
      {
        id: 'atrium-cafe',
        name: 'The Atrium Café',
        category: 'DINING',
        floorId: '3',
        wing: 'West Wing',
        shopNumber: '3-14',
        modelPosition: [-16, 13, 6],
        description: 'Rooftop terrace overlooking the central atrium with specialty brews.',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        reviewCount: 560,
        hours: '09:00 AM – 11:00 PM',
        currentOffers: ['Sunset High Tea set for two at ₹1,499'],
        tags: ['Dining', 'Terrace'],
      },
      {
        id: 'food-court',
        name: 'Food Court',
        category: 'DINING',
        floorId: '3',
        wing: 'East Wing',
        shopNumber: '3-22',
        modelPosition: [16, 0.4, 6],
        description: 'Vibrant dining destination housing over 20 artisanal food kitchens.',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        reviewCount: 1420,
        hours: '10:00 AM – 11:00 PM',
        currentOffers: ['Happy Hours 4 PM - 7 PM: 15% off'],
        tags: ['Food', 'Food Court'],
      },

      // Level P1
      {
        id: 'vip-valet-lounge',
        name: 'Aurelia VIP Valet Lounge',
        tagline: 'Private reception, key return, and vehicle retrieval.',
        category: 'SERVICE',
        floorId: 'P1',
        wing: 'Central Atrium',
        shopNumber: 'P1-V01',
        modelPosition: [-8.0, -3.5, 2.0],
        description: 'Executive arrival lounge with Italian espresso bar, key holding, and dedicated private chauffeur dispatch.',
        image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80',
        rating: 4.9,
        reviewCount: 680,
        hours: '24 Hours',
        currentOffers: ['Complimentary first 2 hours valet for Aurelia Black members'],
        tags: ['Valet', 'VIP Lounge', 'Concierge'],
      },
      {
        id: 'ev-supercharger-hub',
        name: 'Aurelia EV Supercharger Hub',
        tagline: 'Ultra-fast 250kW charging for Tesla and luxury EVs.',
        category: 'SERVICE',
        floorId: 'P1',
        wing: 'East Wing',
        shopNumber: 'P1-EV04',
        modelPosition: [8.0, -3.5, 2.0],
        description: 'State-of-the-art charging hub with 16 ultra-fast bays supporting all EV platforms.',
        image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        reviewCount: 420,
        hours: '24 Hours',
        currentOffers: ['Free charging voucher with boutique shopping invoice > ₹5,000'],
        tags: ['EV Charging', 'Tesla', 'Clean Tech'],
      },
      {
        id: 'prestige-car-spa',
        name: 'Prestige Auto Spa & Detailing',
        tagline: 'Ceramic paint protection, steam wash, and bespoke car care.',
        category: 'SERVICE',
        floorId: 'P1',
        wing: 'West Wing',
        shopNumber: 'P1-S08',
        modelPosition: [0.0, -3.5, -4.0],
        description: 'Artisanal vehicle detailing using biodegradable nano-coating and interior purification.',
        image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80',
        rating: 4.7,
        reviewCount: 310,
        hours: '09:00 AM – 10:00 PM',
        currentOffers: ['20% privilege off complete ceramic quartz treatment'],
        tags: ['Car Detailing', 'Steam Wash'],
      },

      // Level P2
      {
        id: 'long-stay-valet',
        name: 'Secure Long-Stay Valet',
        tagline: 'Monitored underground bays with 24/7 security & battery tender.',
        category: 'SERVICE',
        floorId: 'P2',
        wing: 'West Wing',
        shopNumber: 'P2-L01',
        modelPosition: [-6.0, -7.0, 2.0],
        description: 'Long-duration secure parking facility with individual climate control and CCTV escort.',
        image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
        rating: 4.8,
        reviewCount: 290,
        hours: '24 Hours',
        currentOffers: ['Flat weekend overnight rate of ₹499'],
        tags: ['Long Stay', 'Secure Parking'],
      },
      {
        id: 'porter-luggage-vault',
        name: 'Porter & Luggage Vault',
        tagline: 'High-security luggage lockers and direct hotel porter transfer.',
        category: 'SERVICE',
        floorId: 'P2',
        wing: 'Central Atrium',
        shopNumber: 'P2-V02',
        modelPosition: [6.0, -7.0, 2.0],
        description: 'Convenient bag drop and direct porter service transferring shopping bags between car and boutique.',
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
        rating: 4.6,
        reviewCount: 180,
        hours: '08:00 AM – 11:00 PM',
        currentOffers: ['Complimentary bag holding with any dining or cinema booking'],
        tags: ['Luggage Storage', 'Porter'],
      },
    ]

    return list
  }, [])

  const combinedStores = useMemo(() => {
    const merged = [...curatedMallStores]
    for (const dbStore of dbStores) {
      if (!merged.find((s) => s.id === dbStore.id)) {
        merged.push(dbStore as any)
      }
    }
    return merged
  }, [curatedMallStores, dbStores])

  // Initialize selectedStore with Zara (from screenshot)
  const [selectedStore, setSelectedStore] = useState<Store3DData | null>(curatedMallStores[0])

  // Filter stores on currently selected floor & search query
  const displayedFloorStores = useMemo(() => {
    return combinedStores.filter((s) => {
      const matchFloor = selectedFloor === 'ALL' || s.floorId === selectedFloor
      const matchSearch =
        !searchQuery ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
      const matchCategory =
        !selectedCategory ||
        s.category.toUpperCase() === selectedCategory.toUpperCase()
      return matchFloor && matchSearch && matchCategory
    })
  }, [combinedStores, selectedFloor, searchQuery, selectedCategory])

  const handleOpenStoreModal = (store: Store3DData) => {
    const originalStore = allStores.find((s) => s.id === store.id) || {
      id: store.id,
      name: store.name,
      tagline: store.tagline || '',
      category: store.category,
      floor: `Level ${store.floorId} · ${store.wing}`,
      hours: store.hours || '10:00 AM – 10:00 PM',
      image: store.image,
      description: store.description || 'Welcome to our premium boutique.',
      rating: store.rating || 4.5,
      reviewCount: store.reviewCount || 1200,
      currentOffers: store.currentOffers || [],
      similarBrands: [],
    }

    if (onSelectStoreDetails) {
      onSelectStoreDetails(originalStore)
    }
  }

  const handleEnterShop = (store: Store3DData) => {
    setEnteredStore(store)
    setSelectedStore(store)
  }

  const handleExitShop = () => {
    setEnteredStore(null)
  }

  // Active store for right panel
  const activeDetailStore = selectedStore || displayedFloorStores[0] || curatedMallStores[0]

  const [navStepIndex, setNavStepIndex] = useState<number>(0)
  const [navIsRunning, setNavIsRunning] = useState<boolean>(false)

  // Computed navigation route using A* graph algorithm
  const currentRoute = useMemo(() => {
    if (!activeDetailStore) return null
    return calculateMallRoute(startLandmarkId, activeDetailStore)
  }, [startLandmarkId, activeDetailStore])

  return (
    <section
      id="map"
      className="pt-24 lg:pt-32 pb-20 px-3 sm:px-6 md:px-8 bg-[#060608] relative overflow-hidden font-sans select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#c5a059]/5 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#e6ca85]/5 blur-[160px] pointer-events-none" />

      <div className="max-w-[1780px] mx-auto relative z-10">
        {/* 3-Column Luxury Architecture Viewport matching reference screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* ========================================================= */}
          {/* LEFT PANEL: Interactive 3D Map, Floor Selector, Store List */}
          {/* ========================================================= */}
          <div className="lg:col-span-3 xl:col-span-3 space-y-4">
            <div className="bg-[#0d0c12]/95 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
              {/* Header Title */}
              <div className="mb-5">
                <h2 className="font-serif text-lg sm:text-xl text-[#c5a059] font-medium tracking-wide uppercase">
                  INTERACTIVE 3D MAP
                </h2>
                <p className="text-xs text-white/50 mt-1 leading-relaxed">
                  Explore our mall and find your favorite stores, restaurants and services across all levels.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative mb-5">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search stores, brands or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-[#fbf8f3] placeholder:text-white/30 focus:outline-none focus:border-[#c5a059] transition-all"
                />
                <SlidersHorizontal className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40" />
              </div>

              {/* Stores Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-[#fbf8f3]">
                    {selectedFloor === 'ALL'
                      ? 'All Stores & Boutiques'
                      : `Stores on ${selectedFloor === 'G' ? 'Ground Floor' : `Level ${selectedFloor}`}`}
                  </h4>
                  {selectedFloor !== 'ALL' && (
                    <button
                      onClick={() => setSelectedFloor('ALL')}
                      className="text-[10px] text-[#c5a059] hover:underline uppercase tracking-wider"
                    >
                      (Show All)
                    </button>
                  )}
                </div>
                <span className="text-xs text-white/40 font-medium">
                  {displayedFloorStores.length}
                </span>
              </div>

              {/* Stores List */}
              <div className="space-y-2 max-h-[460px] xl:max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
                {displayedFloorStores.length === 0 ? (
                  <div className="py-10 px-3 text-center rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center mb-3">
                      <Search className="h-4 w-4 text-[#c5a059]" />
                    </div>
                    <h5 className="font-serif text-xs text-[#fbf8f3] font-medium mb-1">
                      No stores found
                    </h5>
                    <p className="text-[10px] text-white/40 max-w-xs mb-3">
                      {searchQuery
                        ? `No results found for "${searchQuery}".`
                        : `No stores available on this level.`}
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('')
                        setSelectedCategory(null)
                        setSelectedFloor('ALL')
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-[#c5a059] text-white hover:text-black text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Clear Search & Filters
                    </button>
                  </div>
                ) : (
                  displayedFloorStores.map((store) => {
                    const isSelected = selectedStore?.id === store.id
                    return (
                      <div
                        key={store.id}
                        onClick={() => setSelectedStore(store)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-white/10 border-[#c5a059] shadow-md scale-[1.01]'
                            : 'bg-white/[0.02] border-transparent hover:border-white/10 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <BrandLogoBadge name={store.name} category={store.category} />
                          <div className="min-w-0">
                            <h5 className="font-medium text-xs text-[#fbf8f3] truncate leading-tight">
                              {store.name}
                            </h5>
                            <p className="text-[10px] text-white/40 truncate mt-0.5">
                              {store.category} · {store.shopNumber}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-white/30 shrink-0" />
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* CENTER PANEL: Realistic 3D Mall Cutaway & Interactive View */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-3">
            {/* Top Luxury Floor Selector Bar */}
            <div className="bg-[#0d0c12]/95 border border-white/10 rounded-2xl p-2.5 shadow-xl backdrop-blur-xl flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-1.5 text-xs font-serif text-[#c5a059] px-2 shrink-0">
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline font-bold uppercase tracking-wider text-[11px]">Level:</span>
              </div>
              <div className="flex items-center gap-1.5 flex-1 justify-end overflow-x-auto scrollbar-none">
                {[
                  { id: 'ALL', label: 'All Levels' },
                  { id: '3', label: 'Level 3' },
                  { id: '2', label: 'Level 2' },
                  { id: '1', label: 'Level 1' },
                  { id: 'G', label: 'Ground' },
                  { id: 'P1', label: 'P1 Valet' },
                  { id: 'P2', label: 'P2 Parking' },
                ].map((fl) => {
                  const isActive = selectedFloor === fl.id
                  return (
                    <button
                      key={fl.id}
                      onClick={() => setSelectedFloor(fl.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-[#0a0a0c] font-bold shadow-[0_0_15px_rgba(197,160,89,0.5)] scale-[1.02]'
                          : 'bg-white/[0.03] text-white/70 hover:text-white hover:bg-white/[0.08] border border-white/5'
                      }`}
                    >
                      <span>{fl.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="bg-[#060609]/90 rounded-2xl shadow-2xl border border-white/10 h-[640px] xl:h-[680px] relative overflow-hidden flex flex-col backdrop-blur-md">
              <div className="flex-1 w-full h-full relative">
                <RealisticMallArchitecturalView
                  selectedFloor={selectedFloor}
                  onSelectFloor={(floor) => setSelectedFloor(floor)}
                  selectedCategory={selectedCategory}
                  onClearCategory={() => setSelectedCategory(null)}
                  selectedStore={selectedStore}
                  onSelectStore={(store) => setSelectedStore(store)}
                  combinedStores={combinedStores}
                  onOpenStoreModal={handleOpenStoreModal}
                  onEnterStore={handleEnterShop}
                  enteredStore={enteredStore}
                  onExitStore={handleExitShop}
                />
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT PANEL: Selected Brand Details, Legend, Find Your Way */}
          {/* ========================================================= */}
          <div className="lg:col-span-3 xl:col-span-3 space-y-4">
            
            {/* 1. Selected Store Card */}
            {activeDetailStore && (
              <div className="bg-[#0d0c12]/95 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden animate-fade-in">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <BrandLogoBadge
                      name={activeDetailStore.name}
                      category={activeDetailStore.category}
                      size="lg"
                    />
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#fbf8f3] leading-tight">
                        {activeDetailStore.name}
                      </h3>
                      <p className="text-xs text-white/50 capitalize mt-0.5">
                        {activeDetailStore.category.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full border border-[#c5a059]/60 text-[10px] font-medium text-[#c5a059] tracking-wider uppercase shrink-0">
                    Featured
                  </span>
                </div>

                {/* Details list with luxury icons */}
                <div className="space-y-3 mb-6 text-xs text-[#e8e2d8]">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 text-[#c5a059] shrink-0" />
                    <span>
                      {activeDetailStore.floorId === 'G'
                        ? 'Floor 0 - Ground Floor'
                        : activeDetailStore.floorId === 'P1'
                          ? 'Basement P1 - Valet & EV Hub'
                          : activeDetailStore.floorId === 'P2'
                            ? 'Basement P2 - Parking & Vault'
                            : `Floor ${activeDetailStore.floorId} - Level ${activeDetailStore.floorId}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Store className="h-4 w-4 text-[#c5a059] shrink-0" />
                    <span>Shop No. {activeDetailStore.shopNumber}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Compass className="h-4 w-4 text-[#c5a059] shrink-0" />
                    <span>{activeDetailStore.wing}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Star className="h-4 w-4 text-[#c5a059] fill-[#c5a059] shrink-0" />
                    <span>
                      {activeDetailStore.rating || 4.5} (
                      {activeDetailStore.reviewCount
                        ? `${(activeDetailStore.reviewCount / 1000).toFixed(1)}k`
                        : '1.2k'}{' '}
                      reviews)
                    </span>
                  </div>
                </div>

                {/* Dual Action Buttons: Enter 3D Boutique & View Products */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => handleEnterShop(activeDetailStore)}
                    className="py-3 px-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#b38e42] text-[#0a0a0c] font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(197,160,89,0.4)] hover:shadow-[0_0_30px_rgba(197,160,89,0.7)] transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Store className="h-3.5 w-3.5 shrink-0" />
                    <span>Enter 3D Shop</span>
                  </button>

                  <button
                    onClick={() => handleOpenStoreModal(activeDetailStore)}
                    className="py-3 px-2 rounded-xl bg-white/10 hover:bg-white/20 border border-[#c5a059]/40 hover:border-[#c5a059] text-[#fbf8f3] font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <ShoppingBag className="h-3.5 w-3.5 text-[#c5a059] shrink-0" />
                    <span>View Products</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. Legend Card */}
            <div className="bg-[#0d0c12]/95 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
              <h4 className="font-serif text-sm font-bold text-[#fbf8f3] mb-4">Legend</h4>
              <div className="grid grid-cols-1 gap-2.5 text-xs text-[#e8e2d8]">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[10px]">
                    🛍️
                  </span>
                  <span>Store</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#ea580c]/20 border border-[#ea580c] flex items-center justify-center text-[10px]">
                    🍽️
                  </span>
                  <span>Restaurant / Food</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#a855f7]/20 border border-[#a855f7] flex items-center justify-center text-[10px]">
                    🎬
                  </span>
                  <span>Entertainment</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#3b82f6]/20 border border-[#3b82f6] flex items-center justify-center text-[10px]">
                    🚻
                  </span>
                  <span>Restroom</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#06b6d4]/20 border border-[#06b6d4] flex items-center justify-center text-[10px]">
                    🛗
                  </span>
                  <span>Elevator</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#14b8a6]/20 border border-[#14b8a6] flex items-center justify-center text-[10px]">
                    🪜
                  </span>
                  <span>Escalator</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#ec4899]/20 border border-[#ec4899] flex items-center justify-center text-[10px]">
                    💳
                  </span>
                  <span>ATM</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#6366f1]/20 border border-[#6366f1] flex items-center justify-center text-[10px]">
                    🅿️
                  </span>
                  <span>Parking</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#ef4444]/20 border border-[#ef4444] flex items-center justify-center text-[10px]">
                    🚨
                  </span>
                  <span>Emergency Exit</span>
                </div>
              </div>
            </div>

            {/* 3. Find Your Way Card */}
            <div
              onClick={() => {
                if (selectedStore) setIsNavigating(true)
              }}
              className="bg-[#0d0c12]/95 border border-white/10 rounded-2xl p-3.5 shadow-2xl backdrop-blur-xl flex items-center gap-3.5 cursor-pointer hover:border-[#c5a059]/50 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-white/5">
                <img
                  src="/aurelia/mall-realistic-view.jpg"
                  alt="Interior Map"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-serif text-xs font-bold text-[#fbf8f3] group-hover:text-[#c5a059] transition-colors">
                  Find Your Way
                </h5>
                <p className="text-[10px] text-white/50 line-clamp-2 mt-0.5 leading-tight">
                  Get directions to any store with our smart navigation.
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-[#c5a059] group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>

          </div>

        </div>
      </div>

      {/* Indoor Navigation Wayfinding Modal */}
      {isNavigating && currentRoute && activeDetailStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-fade-in select-none">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#0d0c12] border border-[#c5a059]/40 shadow-2xl p-6 sm:p-8 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#c5a059] flex items-center justify-center text-black shadow-lg">
                  <Navigation className="h-5 w-5 fill-black" />
                </div>
                <div>
                  <h3 className="font-serif text-lg sm:text-xl text-[#fbf8f3] font-bold tracking-wide">
                    Indoor Navigation & Wayfinding
                  </h3>
                  <p className="text-xs text-white/50">
                    A* Graph Pathfinder connecting corridors, escalators & elevators
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsNavigating(false)
                  setNavIsRunning(false)
                  setNavStepIndex(0)
                }}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto custom-scrollbar my-4 space-y-5 pr-1 flex-1">
              {/* Pickers: Start Location & Destination Store */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                  <label className="text-[10px] text-[#c5a059] uppercase tracking-widest block font-bold mb-1.5">
                    Start Location
                  </label>
                  <select
                    value={startLandmarkId}
                    onChange={(e) => {
                      setStartLandmarkId(e.target.value)
                      setNavStepIndex(0)
                    }}
                    className="w-full bg-[#141219] border border-white/10 rounded-xl px-3 py-2 text-xs text-[#fbf8f3] focus:outline-none focus:border-[#c5a059] cursor-pointer"
                  >
                    {mallLandmarks.map((lm) => (
                      <option key={lm.id} value={lm.id} className="bg-[#141219] text-white">
                        {lm.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                  <span className="text-[10px] text-[#c5a059] uppercase tracking-widest block font-bold mb-1.5">
                    Destination Store
                  </span>
                  <div className="text-xs font-serif text-[#fbf8f3] font-bold truncate">
                    {activeDetailStore.name} ({activeDetailStore.shopNumber})
                  </div>
                  <div className="text-[10px] text-white/50 mt-0.5 truncate">
                    Floor {activeDetailStore.floorId} · {activeDetailStore.wing}
                  </div>
                </div>
              </div>

              {/* Route Summary Stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-[#141219] border border-white/10">
                  <Clock className="h-4 w-4 text-[#c5a059] mx-auto mb-1" />
                  <div className="text-xs font-bold text-white font-mono">{currentRoute.walkTime}</div>
                  <div className="text-[9px] text-white/40 uppercase tracking-widest">Est. Walking Time</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#141219] border border-white/10">
                  <Footprints className="h-4 w-4 text-[#c5a059] mx-auto mb-1" />
                  <div className="text-xs font-bold text-white font-mono">{currentRoute.distance}</div>
                  <div className="text-[9px] text-white/40 uppercase tracking-widest">Route Distance</div>
                </div>
                <div className="p-3 rounded-2xl bg-[#141219] border border-white/10">
                  <Compass className="h-4 w-4 text-[#c5a059] mx-auto mb-1" />
                  <div className="text-xs font-bold text-white font-mono">
                    {currentRoute.floorTransition ? 'Level Change' : 'Same Level'}
                  </div>
                  <div className="text-[9px] text-white/40 uppercase tracking-widest">
                    {currentRoute.floorTransition ? currentRoute.floorTransition.type : 'Direct'}
                  </div>
                </div>
              </div>

              {/* Inter-Floor Transition Alert */}
              {currentRoute.floorTransition && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
                  <span className="text-base">🛗</span>
                  <span>
                    Inter-floor route: Take the <strong>{currentRoute.floorTransition.type}</strong> from Level {currentRoute.floorTransition.fromFloor} to Level {currentRoute.floorTransition.toFloor}.
                  </span>
                </div>
              )}

              {/* Step-by-Step Directions */}
              <div>
                <h4 className="text-xs font-serif font-bold text-[#fbf8f3] uppercase tracking-wider mb-3">
                  Turn-by-Turn Route Guidance
                </h4>
                <div className="space-y-2">
                  {currentRoute.routeSteps.map((step, idx) => {
                    const isStepActive = navIsRunning && navStepIndex === idx
                    const isCompleted = navIsRunning && navStepIndex > idx
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                          isStepActive
                            ? 'bg-[#c5a059]/20 border-[#c5a059] text-white shadow-md scale-[1.01]'
                            : isCompleted
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                              : 'bg-white/[0.02] border-white/5 text-white/70'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isStepActive
                              ? 'bg-[#c5a059] text-black'
                              : isCompleted
                                ? 'bg-emerald-400 text-black'
                                : 'bg-white/10 text-white/60'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : idx + 1}
                        </div>
                        <span className="text-xs font-sans leading-relaxed">{step}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  setNavIsRunning(false)
                  setNavStepIndex(0)
                }}
                className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-white/20 text-xs text-white/70 hover:text-white uppercase tracking-wider font-semibold transition-all cursor-pointer"
              >
                Reset Navigation
              </button>

              <div className="flex items-center gap-2">
                {navIsRunning && (
                  <button
                    onClick={() => {
                      if (navStepIndex < currentRoute.routeSteps.length - 1) {
                        setNavStepIndex((prev) => prev + 1)
                      } else {
                        setNavIsRunning(false)
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white uppercase tracking-wider transition-all cursor-pointer"
                  >
                    {navStepIndex < currentRoute.routeSteps.length - 1 ? 'Next Step →' : 'Arrived!'}
                  </button>
                )}

                <button
                  onClick={() => {
                    setNavIsRunning(true)
                    setNavStepIndex(0)
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-[#0a0a0c] font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(197,160,89,0.4)] hover:shadow-[0_0_30px_rgba(197,160,89,0.7)] transition-all cursor-pointer"
                >
                  {navIsRunning ? 'Restart Route' : 'Start Navigation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(197,160,89,0.5); }
      `,
        }}
      />
    </section>
  )
}
