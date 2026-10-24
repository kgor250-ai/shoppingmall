'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Store,
  ShoppingBag,
  Info,
  ChevronRight,
  Sparkles,
  MapPin,
  Compass,
  ArrowRight,
  LogOut,
  Star,
  Layers,
  MousePointer2,
} from 'lucide-react'
import { Store3DData, mall3DStores } from '@/data/mall3dData'
import dynamic from 'next/dynamic'
import { Canvas } from '@react-three/fiber'
import { StoreInteriorScene } from './StoreInteriorScene'

// High-precision hotspot coordinates mapping directly onto the luxury mall render
interface ArchitecturalHotspot {
  id: string
  name: string
  brand: string
  floorId: 'G' | '1' | '2' | '3' | 'P1' | 'P2'
  category: string
  x: number // percentage 0 - 100
  y: number // percentage 0 - 100
  badge: string
}

const ARCHITECTURAL_HOTSPOTS: ArchitecturalHotspot[] = [
  // BASEMENT PARKING 1 — VIP Valet & Superchargers
  {
    id: 'vip-valet-lounge',
    name: 'Aurelia VIP Valet Lounge',
    brand: 'VIP VALET',
    floorId: 'P1',
    category: 'SERVICE',
    x: 25.0,
    y: 48.0,
    badge: 'Valet Lounge',
  },
  {
    id: 'ev-supercharger-hub',
    name: 'Aurelia EV Supercharger Hub',
    brand: 'EV SUPERCHARGER',
    floorId: 'P1',
    category: 'SERVICE',
    x: 50.0,
    y: 48.0,
    badge: '250kW Hub',
  },
  {
    id: 'prestige-car-spa',
    name: 'Prestige Auto Spa & Detailing',
    brand: 'CAR SPA',
    floorId: 'P1',
    category: 'SERVICE',
    x: 75.0,
    y: 48.0,
    badge: 'Detailing',
  },

  // BASEMENT PARKING 2 — Long-Stay Valet & Luggage Vault
  {
    id: 'long-stay-valet',
    name: 'Secure Long-Stay Valet',
    brand: 'LONG-STAY VALET',
    floorId: 'P2',
    category: 'SERVICE',
    x: 35.0,
    y: 48.0,
    badge: 'Secure Parking',
  },
  {
    id: 'porter-luggage-vault',
    name: 'Porter & Luggage Vault',
    brand: 'PORTER VAULT',
    floorId: 'P2',
    category: 'SERVICE',
    x: 65.0,
    y: 48.0,
    badge: 'Luggage Transfer',
  },
  // LEVEL 3 — Entertainment, Cinemas & Rooftop Dining
  {
    id: 'atrium-cafe',
    name: 'The Atrium Café & Terrace',
    brand: 'The Atrium Café',
    floorId: '3',
    category: 'DINING',
    x: 18.5,
    y: 34.5,
    badge: 'Rooftop Lounge',
  },
  {
    id: 'pvr-cinemas',
    name: 'PVR INOX Insignia',
    brand: 'PVR CINEMAS',
    floorId: '3',
    category: 'ENTERTAINMENT',
    x: 36.5,
    y: 28.5,
    badge: '7-Star Cinema',
  },
  {
    id: 'game-zone',
    name: 'Aurelia Game Zone & VR Arcade',
    brand: 'Gaming Zone',
    floorId: '3',
    category: 'ENTERTAINMENT',
    x: 54.5,
    y: 27.5,
    badge: 'VR & Arcade',
  },
  {
    id: 'kids-play-zone',
    name: 'Wonderland Kids Play Zone',
    brand: 'Kids Play Zone',
    floorId: '3',
    category: 'ENTERTAINMENT',
    x: 78.5,
    y: 31.0,
    badge: 'Family Fun',
  },

  // LEVEL 2 — Fashion & Haute Couture
  {
    id: 'zara-flagship',
    name: 'Zara',
    brand: 'ZARA',
    floorId: '2',
    category: 'FASHION',
    x: 14.2,
    y: 43.5,
    badge: 'Fashion',
  },
  {
    id: 'hm-flagship',
    name: 'H&M',
    brand: 'H&M',
    floorId: '2',
    category: 'FASHION',
    x: 29.5,
    y: 43.5,
    badge: 'Fashion',
  },
  {
    id: 'tommy-hilfiger',
    name: 'Tommy Hilfiger',
    brand: 'TOMMY HILFIGER',
    floorId: '2',
    category: 'FASHION',
    x: 38.5,
    y: 40.5,
    badge: 'Heritage',
  },
  {
    id: 'sephora-flagship',
    name: 'Sephora',
    brand: 'SEPHORA',
    floorId: '2',
    category: 'BEAUTY',
    x: 74.0,
    y: 43.5,
    badge: 'Cosmetics',
  },
  {
    id: 'nykaa-luxe',
    name: 'Nykaa Luxe',
    brand: 'NYKAA LUXE',
    floorId: '2',
    category: 'BEAUTY',
    x: 85.5,
    y: 46.0,
    badge: 'Prestige Beauty',
  },

  // LEVEL 1 — Tech Innovation & Skincare
  {
    id: 'samsung-experience',
    name: 'Samsung Experience Store',
    brand: 'SAMSUNG',
    floorId: '1',
    category: 'ELECTRONICS',
    x: 14.0,
    y: 62.5,
    badge: 'Galaxy Studio',
  },
  {
    id: 'apple-flagship',
    name: 'Apple Flagship Showroom',
    brand: 'Apple',
    floorId: '1',
    category: 'ELECTRONICS',
    x: 31.0,
    y: 62.5,
    badge: 'Flagship Store',
  },
  {
    id: 'croma-electronics',
    name: 'Croma Electronics',
    brand: 'crōma',
    floorId: '1',
    category: 'ELECTRONICS',
    x: 74.0,
    y: 63.5,
    badge: 'Tech & Audio',
  },
  {
    id: 'the-body-shop',
    name: 'The Body Shop',
    brand: 'THE BODY SHOP',
    floorId: '1',
    category: 'BEAUTY',
    x: 85.5,
    y: 66.0,
    badge: 'Botanical Skincare',
  },

  // GROUND FLOOR — Gourmet Dining, Cafés & Grand Central Atrium
  {
    id: 'mcdonalds',
    name: "McDonald's Gourmet",
    brand: "McDonald's",
    floorId: 'G',
    category: 'DINING',
    x: 16.0,
    y: 79.5,
    badge: 'Food',
  },
  {
    id: 'fountain-atrium',
    name: 'Grand Central Atrium & Fountain',
    brand: 'CENTRAL ATRIUM',
    floorId: 'G',
    category: 'SERVICE',
    x: 49.0,
    y: 81.0,
    badge: 'Golden Fountain',
  },
  {
    id: 'starbucks-reserve',
    name: 'Starbucks Reserve',
    brand: 'STARBUCKS',
    floorId: 'G',
    category: 'DINING',
    x: 61.5,
    y: 77.0,
    badge: 'Food & Beverages',
  },
  {
    id: 'food-court',
    name: 'Aurelia Grand Food Court',
    brand: 'Food Court',
    floorId: 'G',
    category: 'DINING',
    x: 83.5,
    y: 80.5,
    badge: 'Food Court',
  },
]

interface RealisticMallArchitecturalViewProps {
  selectedFloor?: string
  onSelectFloor?: (floor: string) => void
  selectedCategory?: string | null
  onClearCategory?: () => void
  selectedStore: Store3DData | null
  onSelectStore: (store: Store3DData) => void
  combinedStores: Store3DData[]
  onOpenStoreModal?: (store: Store3DData) => void
  onEnterStore?: (store: Store3DData) => void
  enteredStore?: Store3DData | null
  onExitStore?: () => void
}

export function RealisticMallArchitecturalView({
  selectedFloor = 'ALL',
  onSelectFloor,
  selectedCategory,
  onClearCategory,
  selectedStore,
  onSelectStore,
  combinedStores,
  onOpenStoreModal,
  onEnterStore,
  enteredStore,
  onExitStore,
}: RealisticMallArchitecturalViewProps) {
  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [hoveredHotspot, setHoveredHotspot] = useState<ArchitecturalHotspot | null>(null)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [isEnteringAnim, setIsEnteringAnim] = useState<boolean>(false)

  const containerRef = useRef<HTMLDivElement>(null)

  // Floor Vertical Focus Targets
  const floorFocusTargets: Record<string, { zoom: number; panY: number }> = {
    ALL: { zoom: 1, panY: 0 },
    '3': { zoom: 1.45, panY: 26 }, // Focus top level
    '2': { zoom: 1.45, panY: 8 },  // Focus level 2
    '1': { zoom: 1.45, panY: -12 }, // Focus level 1
    G: { zoom: 1.45, panY: -30 },   // Focus ground level
    P1: { zoom: 1, panY: 0 },       // Basement Level 1
    P2: { zoom: 1, panY: 0 },       // Basement Level 2
  }

  // Smoothly center when floor changes
  useEffect(() => {
    if (selectedFloor && floorFocusTargets[selectedFloor]) {
      const target = floorFocusTargets[selectedFloor]
      const timer = setTimeout(() => {
        setZoom(target.zoom)
        setPan({ x: 0, y: target.panY })
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [selectedFloor])

  // Smoothly center when category changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedCategory?.toUpperCase() === 'FASHION') {
        setZoom(1.35)
        setPan({ x: 0, y: 8 })
      } else if (!selectedCategory) {
        if (selectedFloor && floorFocusTargets[selectedFloor]) {
          const target = floorFocusTargets[selectedFloor]
          setZoom(target.zoom)
          setPan({ x: 0, y: target.panY })
        }
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [selectedCategory, selectedFloor])

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (enteredStore) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || enteredStore) return
    const newX = e.clientX - dragStart.x
    const newY = e.clientY - dragStart.y
    const maxPanX = (zoom - 1) * 350
    const maxPanY = (zoom - 1) * 250 + 100
    setPan({
      x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
      y: Math.max(-maxPanY, Math.min(maxPanY, newY)),
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Touch handlers
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const handleTouchStart = (e: React.TouchEvent) => {
    if (enteredStore || e.touches.length !== 1) return
    setIsDragging(true)
    touchStartRef.current = {
      x: e.touches[0].clientX - pan.x,
      y: e.touches[0].clientY - pan.y,
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || enteredStore || e.touches.length !== 1) return
    const newX = e.touches[0].clientX - touchStartRef.current.x
    const newY = e.touches[0].clientY - touchStartRef.current.y
    const maxPanX = (zoom - 1) * 350
    const maxPanY = (zoom - 1) * 250 + 100
    setPan({
      x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
      y: Math.max(-maxPanY, Math.min(maxPanY, newY)),
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Zoom controls
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.3, 3.0))
  }

  const handleZoomOut = () => {
    setZoom((prev) => {
      const next = Math.max(prev - 0.3, 1.0)
      if (next === 1) setPan({ x: 0, y: 0 })
      return next
    })
  }

  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => { })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => { })
      setIsFullscreen(false)
    }
  }

  // Resolve store details
  const resolveStore = (hotspot: ArchitecturalHotspot): Store3DData => {
    const found = combinedStores.find((s) => s.id === hotspot.id)
    if (found) return found
    const fallback = mall3DStores.find((s) => s.id === hotspot.id)
    if (fallback) return fallback

    return {
      id: hotspot.id,
      name: hotspot.name,
      tagline: hotspot.badge,
      category: hotspot.category as any,
      floorId: hotspot.floorId,
      wing: 'East Wing',
      shopNumber: `${hotspot.floorId}-12`,
      modelPosition: [0, 0, 0],
      description: `Welcome to ${hotspot.name} at AURELIA Luxury Mall.`,
      image: '/aurelia/mall-realistic-view.jpg',
      rating: 4.5,
      reviewCount: 1200,
      hours: '10:00 AM – 10:00 PM',
      currentOffers: ['Exclusive AURELIA Privilege Access'],
      tags: [hotspot.category],
    }
  }

  const handleHotspotClick = (hotspot: ArchitecturalHotspot, e: React.MouseEvent) => {
    e.stopPropagation()
    const store = resolveStore(hotspot)
    onSelectStore(store)
  }

  // If user entered a store, render the 3D interior
  if (enteredStore) {
    return (
      <div className="w-full h-full relative bg-[#060608] overflow-hidden select-none">
        {/* Top Floating Exit Bar */}
        <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-none">
          <button
            onClick={() => onExitStore && onExitStore()}
            className="pointer-events-auto px-5 py-2.5 rounded-full bg-[#0a0a0e]/90 hover:bg-[#c5a059] text-[#fbf8f3] hover:text-[#0a0a0c] border border-white/20 hover:border-[#c5a059] text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 shadow-2xl backdrop-blur-xl flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>← Exit Shop / Return to Aurelia Mall</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a0a0e]/80 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-serif text-[#c5a059]">{enteredStore.name}</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Level {enteredStore.floorId}</span>
          </div>
        </div>

        {/* 3D Interior Canvas */}
        <Canvas
          shadows
          camera={{ position: [0, 2.5, 9], fov: 50, near: 0.1, far: 100 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <StoreInteriorScene store={enteredStore} onExit={() => onExitStore && onExitStore()} />
        </Canvas>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden bg-[#07070a] select-none flex items-center justify-center ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Category Filter Active Pill */}
      {selectedCategory && (
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2.5 bg-[#0a0a0e]/90 backdrop-blur-xl px-4 py-2 rounded-full border border-[#c5a059]/60 shadow-[0_0_25px_rgba(197,160,89,0.35)] animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-ping" />
          <span className="text-xs font-serif text-[#fbf8f3]">
            Filter: <strong className="text-[#e6ca85] uppercase tracking-wider">{selectedCategory.toUpperCase() === 'FASHION' ? 'Clothing & Fashion' : selectedCategory}</strong>
          </span>
          {onClearCategory && (
            <button
              onClick={onClearCategory}
              className="ml-2 text-[10px] text-white/60 hover:text-white px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 transition-all uppercase tracking-wider font-bold"
            >
              Show All
            </button>
          )}
        </div>
      )}

      {/* Main Architectural Canvas with Hotspots */}
      <div
        className="w-full h-full relative transition-transform duration-300 ease-out flex items-center justify-center"
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
        }}
      >
        {/* If Subterranean Parking Level P1 or P2 is selected */}
        {selectedFloor === 'P1' || selectedFloor === 'P2' ? (
          <div className="relative w-full h-full max-w-[1250px] max-h-[720px] p-6 rounded-3xl bg-[#09080d]/95 border border-[#c5a059]/40 flex flex-col justify-between shadow-2xl backdrop-blur-2xl overflow-hidden">
            {/* Top Bar with Live Indicators */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="font-serif text-lg md:text-xl text-[#fbf8f3] font-bold tracking-wide">
                    {selectedFloor === 'P1'
                      ? 'Basement Level P1 — Executive Valet & EV Supercharger Hub'
                      : 'Basement Level P2 — Long-Stay Valet & Luggage Vault'}
                  </h3>
                </div>
                <p className="text-xs text-white/50 mt-0.5">
                  Direct glass elevator access connecting seamlessly to Ground Floor and upper levels.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#e6ca85]">
                  <strong className="text-white">142 / 180</strong> Bays Available
                </div>
                <button
                  onClick={() => onSelectFloor && onSelectFloor('G')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-[#0a0a0c] font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Elevator to Ground Floor</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Parking Deck Blueprint Schematic */}
            <div className="flex-1 my-4 relative rounded-2xl bg-[#06060a] border border-white/5 p-6 flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#c5a059_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

              {/* Bay Rows & Service Zones */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="text-[11px] font-bold text-[#c5a059] uppercase tracking-wider mb-2">Zone A — VIP Valet Bays</div>
                  <div className="grid grid-cols-4 gap-2">
                    {['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8'].map((bay, i) => (
                      <div key={bay} className={`py-2 text-center rounded-lg text-[10px] font-mono font-bold border ${i % 3 === 0 ? 'bg-white/5 border-white/10 text-white/40' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
                        {bay}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-2">Zone B — EV Superchargers</div>
                  <div className="grid grid-cols-4 gap-2">
                    {['EV1', 'EV2', 'EV3', 'EV4', 'EV5', 'EV6', 'EV7', 'EV8'].map((bay, i) => (
                      <div key={bay} className={`py-2 text-center rounded-lg text-[10px] font-mono font-bold border ${i === 2 ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-sky-500/10 border-sky-500/30 text-sky-400'}`}>
                        {bay}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                  <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider mb-2">Zone C — Vertical Circulation</div>
                  <div className="flex flex-col gap-2">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-xs text-white">
                      <span>🛗 Panoramic Glass Elevator</span>
                      <span className="text-[10px] text-emerald-400">Online</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-xs text-white">
                      <span>🛗 Service & Porter Lift</span>
                      <span className="text-[10px] text-emerald-400">Online</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Service Hotspots on Parking Floor */}
              <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-4">
                {ARCHITECTURAL_HOTSPOTS.filter(h => h.floorId === selectedFloor).map(hotspot => {
                  const isSelected = selectedStore?.id === hotspot.id
                  return (
                    <div
                      key={hotspot.id}
                      onClick={(e) => handleHotspotClick(hotspot, e)}
                      className={`px-4 py-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#c5a059] text-black border-white shadow-[0_0_20px_rgba(197,160,89,0.8)] scale-105 font-bold'
                          : 'bg-black/60 border-[#c5a059]/40 text-[#fbf8f3] hover:border-[#c5a059] hover:bg-white/5'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <div className="text-left">
                        <div className="text-xs font-serif font-bold leading-tight">{hotspot.name}</div>
                        <div className="text-[9px] uppercase tracking-wider opacity-70">{hotspot.badge}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
        /* The Luxury Mall Realistic Render */
        <div className="relative w-full h-full max-w-[1500px] max-h-[850px] aspect-[16/9] flex items-center justify-center">
          <img
            src="/aurelia/mall-realistic-view.jpg"
            alt="Aurelia Luxury Shopping Mall Realistic 3D Architecture"
            className="w-full h-full object-contain pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-all duration-500"
            draggable={false}
          />

          {/* Compass Rose N Indicator */}
          <div className="absolute top-4 left-6 z-30 pointer-events-none flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border border-[#c5a059]/60 bg-[#0a0a0e]/90 backdrop-blur-md flex flex-col items-center justify-center shadow-lg">
              <div className="w-1.5 h-1.5 border-t-2 border-r-2 border-[#c5a059] -rotate-45 mb-0.5" />
              <span className="text-[9px] font-bold text-[#c5a059] leading-none">N</span>
            </div>
          </div>

          {/* Architectural Cutaway Floor Labels (Left Edge) */}
          <div className="absolute left-6 top-[13%] z-30 pointer-events-auto">
            <div
              onClick={() => onSelectFloor && onSelectFloor('3')}
              className={`px-3 py-1.5 rounded-xl bg-[#0a0a0e]/90 border backdrop-blur-md cursor-pointer transition-all ${selectedFloor === '3' ? 'border-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.5)] scale-105' : 'border-white/10 hover:border-white/30'
                }`}
            >
              <div className="text-[11px] font-bold text-[#fbf8f3] leading-tight">Level 3</div>
              <div className="text-[8px] text-[#c5a059] tracking-wider">Entertainment & Lifestyle</div>
            </div>
          </div>



          <div className="absolute left-6 top-[70%] z-30 pointer-events-auto">
            <div
              onClick={() => onSelectFloor && onSelectFloor('G')}
              className={`px-3 py-1.5 rounded-xl bg-[#0a0a0e]/90 border backdrop-blur-md cursor-pointer transition-all ${selectedFloor === 'G' ? 'border-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.5)] scale-105' : 'border-white/10 hover:border-white/30'
                }`}
            >
              <div className="text-[11px] font-bold text-[#fbf8f3] leading-tight">Ground Floor</div>
              <div className="text-[8px] text-[#c5a059] tracking-wider">Dining & Essentials</div>
            </div>
          </div>

          {/* Interactive Store Hotspots Overlay */}
          {ARCHITECTURAL_HOTSPOTS.map((hotspot) => {
            const isCategoryMatch = !selectedCategory || selectedCategory === 'ALL' || hotspot.category.toUpperCase() === selectedCategory.toUpperCase()
            if (!isCategoryMatch) return null

            const isFloorActive = selectedFloor === 'ALL' || selectedFloor === hotspot.floorId
            const isSelected = selectedStore?.id === hotspot.id
            const isHovered = hoveredHotspot?.id === hotspot.id

            return (
              <div
                key={hotspot.id}
                style={{
                  left: `${hotspot.x}%`,
                  top: `${hotspot.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute z-30 transition-all duration-300 ${isFloorActive ? 'opacity-100 scale-100' : 'opacity-25 scale-90 hover:opacity-80'
                  }`}
                onMouseEnter={() => setHoveredHotspot(hotspot)}
                onMouseLeave={() => setHoveredHotspot(null)}
                onClick={(e) => handleHotspotClick(hotspot, e)}
              >
                {/* Hotspot Pin Icon / Beacon */}
                <div className="relative group cursor-pointer flex flex-col items-center">
                  {/* Glowing Pulse Waves */}
                  {isSelected && (
                    <div className="absolute -inset-2.5 rounded-full bg-[#c5a059] opacity-40 animate-ping pointer-events-none" />
                  )}
                  {isFloorActive && !isSelected && (
                    <div className="absolute -inset-1 rounded-full bg-[#e6ca85] opacity-20 animate-pulse pointer-events-none" />
                  )}

                  {/* Pin Core */}
                  <div
                    className={`px-2.5 py-1 rounded-full border shadow-2xl backdrop-blur-md flex items-center gap-1.5 transition-all duration-300 ${isSelected
                        ? 'bg-gradient-to-r from-[#d4af37] to-[#c5a059] text-[#0a0a0c] border-white scale-110 shadow-[0_0_20px_rgba(197,160,89,0.8)]'
                        : isHovered
                          ? 'bg-[#0d0c12]/95 border-[#c5a059] text-[#e6ca85] scale-105 shadow-[0_0_15px_rgba(197,160,89,0.4)]'
                          : 'bg-[#0a0a0e]/85 border-white/20 text-[#fbf8f3] hover:border-[#c5a059]'
                      }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[#0a0a0c]' : 'bg-[#c5a059]'
                        }`}
                    />
                    <span className="text-[10px] sm:text-xs font-bold font-serif tracking-wider uppercase whitespace-nowrap">
                      {hotspot.brand}
                    </span>
                  </div>

                  {/* Floating Tooltip On Hover */}
                  {isHovered && !isSelected && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 pointer-events-none bg-[#0a0a0e]/95 border border-[#c5a059]/50 rounded-xl px-3 py-2 shadow-2xl backdrop-blur-xl whitespace-nowrap animate-fade-in flex flex-col items-center gap-0.5 z-40">
                      <div className="text-[11px] font-bold text-[#fbf8f3] font-serif">{hotspot.name}</div>
                      <div className="text-[9px] text-[#c5a059] uppercase tracking-widest font-sans flex items-center gap-1">
                        <span>Level {hotspot.floorId}</span>
                        <span>•</span>
                        <span>{hotspot.badge}</span>
                      </div>
                      <div className="text-[8px] text-white/40 tracking-wider mt-0.5">Click to view store details</div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        )}
      </div>

      {/* Bottom Center Drag to Rotate & Bottom Right Zoom Controls */}
      <div className="absolute bottom-4 left-0 right-0 z-20 px-6 flex items-center justify-between pointer-events-none">
        <div className="w-24" /> {/* Spacer */}

        {/* Center: Drag to rotate hint */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#0a0a0e]/85 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs text-white/60">
          <span className="text-sm">←</span>
          <MousePointer2 className="h-3.5 w-3.5 text-[#c5a059]" />
          <span className="text-[11px] font-sans font-medium tracking-wider">Drag to rotate</span>
          <span className="text-sm">→</span>
        </div>

        {/* Right: Zoom controls */}
        <div className="pointer-events-auto flex items-center gap-2 bg-[#0a0a0e]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <span className="text-[11px] text-white/50 uppercase tracking-wider font-semibold ml-1">Zoom</span>
          <button
            onClick={handleZoomOut}
            className="w-6 h-6 rounded-full hover:bg-white/10 text-[#fbf8f3] flex items-center justify-center font-bold text-sm transition-colors"
            title="Zoom Out"
          >
            —
          </button>
          <button
            onClick={handleZoomIn}
            className="w-6 h-6 rounded-full hover:bg-white/10 text-[#fbf8f3] flex items-center justify-center font-bold text-sm transition-colors"
            title="Zoom In"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}
