'use client'

import React, { useMemo, useState } from 'react'
import { Html, OrbitControls, RoundedBox, MeshReflectorMaterial, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { Store3DData } from '@/data/mall3dData'
import { allProducts } from '@/data/products'
import { ImageWithFallback } from './ImageWithFallback'
import { ShoppingBag, Star, CheckCircle, ArrowLeft, X, Sparkles } from 'lucide-react'

export function StoreInteriorScene({
  store,
  onExit,
}: {
  store: Store3DData
  onExit: () => void
}) {
  const storeProducts = useMemo(() => {
    const products = allProducts.filter(
      (p) =>
        p.storeId === store.id ||
        p.store.toLowerCase().includes(store.name.toLowerCase()) ||
        store.name.toLowerCase().includes(p.brand.toLowerCase())
    )
    if (products.length > 0) return products

    // Fallback verified products per category
    if (store.category === 'FASHION') {
      return [
        {
          id: 'f1',
          name: 'Tailored Wool Blazer',
          price: 18990,
          brand: store.name,
          category: 'FASHION',
          description: 'Italian virgin wool single-breasted structured blazer with horn buttons.',
          availability: 'In Stock',
          image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=600',
          sizes: ['38R', '40R', '42R'],
        },
        {
          id: 'f2',
          name: 'Silk Georgette Maxi Dress',
          price: 24500,
          brand: store.name,
          category: 'FASHION',
          description: 'Graceful floor-length evening dress crafted from pure Mulberry silk.',
          availability: 'In Stock',
          image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=600',
          sizes: ['XS', 'S', 'M', 'L'],
        },
        {
          id: 'f3',
          name: 'Handcrafted Leather Oxford Shoes',
          price: 14999,
          brand: store.name,
          category: 'FASHION',
          description: 'Goodyear-welted full-grain calfskin dress shoes with leather sole.',
          availability: 'In Stock',
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600',
          sizes: ['8 UK', '9 UK', '10 UK'],
        },
      ]
    }
    if (store.category === 'ELECTRONICS') {
      return [
        {
          id: 'e1',
          name: 'Flagship OLED Studio Display 32"',
          price: 129990,
          brand: store.name,
          category: 'ELECTRONICS',
          description: '4K Quantum OLED reference monitor with 99.5% DCI-P3 color gamut.',
          availability: 'In Stock',
          image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600',
          variants: ['Graphite', 'Silver'],
        },
        {
          id: 'e2',
          name: 'Wireless Spatial Audio Headphones',
          price: 34990,
          brand: store.name,
          category: 'ELECTRONICS',
          description: 'Custom acoustic architecture with active noise cancellation and lossless audio.',
          availability: 'In Stock',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
          variants: ['Midnight Black', 'Starlight'],
        },
      ]
    }
    if (store.category === 'ENTERTAINMENT') {
      return [
        {
          id: 'ent-fb-1',
          name: 'Mega Multi-Level Soft Play Adventure Pass',
          price: 799,
          brand: store.name,
          category: 'ENTERTAINMENT',
          description: 'All-access indoor soft-play arena with foam pits, giant slides, and toddler climbing towers.',
          availability: 'Available Sessions',
          image: 'https://images.unsplash.com/photo-1566454544259-f4b94c3d758c?auto=format&fit=crop&q=80&w=600',
        },
        {
          id: 'ent-fb-2',
          name: 'Interactive VR & Arcade Recharge Power Pass',
          price: 999,
          brand: store.name,
          category: 'ENTERTAINMENT',
          description: 'High-energy gaming pass with bonus credits, motion simulators, and interactive projections.',
          availability: 'Available Daily',
          image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=600',
        },
        {
          id: 'ent-fb-3',
          name: 'Wonderland VIP Birthday Celebration Package',
          price: 8999,
          brand: store.name,
          category: 'ENTERTAINMENT',
          description: 'Private celebration suite with full play access, dedicated host, and custom decorations.',
          availability: 'Advance Booking',
          image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=600',
        },
      ]
    }
    if (store.category === 'DINING') {
      return [
        {
          id: 'din-fb-1',
          name: 'Signature Chef Tasting Menu Flight',
          price: 2490,
          brand: store.name,
          category: 'DINING',
          description: 'Handcrafted culinary degustation course paired with artisan mocktails.',
          availability: 'Table Reservation Available',
          image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=600',
        },
        {
          id: 'din-fb-2',
          name: 'Artisanal Reserve Coffee & Pastry Pair',
          price: 495,
          brand: store.name,
          category: 'DINING',
          description: 'Single-origin pour-over paired with fresh house-baked butter croissant.',
          availability: 'Freshly Prepared Daily',
          image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=600',
        },
      ]
    }
    return [
      {
        id: 'gen-fb-1',
        name: `${store.name} Experience Voucher`,
        price: 1000,
        brand: store.name,
        category: store.category,
        description: `Official guest experience and admission voucher for ${store.name} at AURELIA Mall.`,
        availability: 'Available Now',
        image: store.image || 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=600',
      },
    ]
  }, [store])

  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const theme = useMemo(() => {
    switch (store.category) {
      case 'FASHION':
        return { wall: '#111015', floor: '#08080c', accents: '#d4af37', ambient: '#ffffff' }
      case 'JEWELLERY':
        return { wall: '#09080d', floor: '#050508', accents: '#e6ca85', ambient: '#ffeebf' }
      case 'ELECTRONICS':
        return { wall: '#121318', floor: '#0c0d12', accents: '#60a5fa', ambient: '#e2e8f0' }
      case 'BEAUTY':
        return { wall: '#150f14', floor: '#0c090c', accents: '#f472b6', ambient: '#fce7f3' }
      case 'DINING':
        return { wall: '#18120e', floor: '#0d0907', accents: '#ea580c', ambient: '#ffddbb' }
      case 'ENTERTAINMENT':
        return { wall: '#13111e', floor: '#090812', accents: '#a855f7', ambient: '#f3e8ff' }
      default:
        return { wall: '#111015', floor: '#08080c', accents: '#c5a059', ambient: '#ffffff' }
    }
  }, [store.category])

  return (
    <>
      <color attach="background" args={[theme.wall]} />
      <ambientLight intensity={0.6} color={theme.ambient} />
      <spotLight
        position={[0, 9, 0]}
        intensity={3.5}
        color={theme.ambient}
        angle={0.7}
        penumbra={0.9}
        castShadow
      />
      <directionalLight position={[5, 7, 4]} intensity={2.0} color={theme.accents} castShadow />
      <directionalLight position={[-5, 7, -4]} intensity={1.5} color="#ffffff" />

      <group>
        {/* Highly Reflective Polished Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
          <planeGeometry args={[40, 40]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={1024}
            mixBlur={1}
            mixStrength={45}
            roughness={0.15}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color={theme.floor}
            metalness={0.75}
            mirror={0.8}
          />
        </mesh>

        {/* Soft Contact Shadows */}
        <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={30} blur={2.5} far={5} />

        {/* Architectural Boutique Back & Side Walls */}
        <mesh position={[0, 4.5, -8]} receiveShadow>
          <planeGeometry args={[36, 12]} />
          <meshStandardMaterial color={theme.wall} roughness={0.35} metalness={0.25} />
        </mesh>
        <mesh position={[-14, 4.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[36, 12]} />
          <meshStandardMaterial color={theme.wall} roughness={0.35} metalness={0.25} />
        </mesh>
        <mesh position={[14, 4.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[36, 12]} />
          <meshStandardMaterial color={theme.wall} roughness={0.35} metalness={0.25} />
        </mesh>

        {/* Cinematic Illuminated Store Signage */}
        <Html position={[0, 5.8, -7.8]} center transform>
          <div className="flex flex-col items-center select-none text-center">
            <div
              className="font-serif text-5xl font-bold tracking-widest uppercase drop-shadow-[0_0_30px_rgba(212,175,55,0.8)]"
              style={{ color: theme.accents }}
            >
              {store.name}
            </div>
            <div className="font-sans text-xs tracking-[0.3em] uppercase mt-2 text-white/60 font-semibold">
              Level {store.floorId} · {store.wing} · Shop {store.shopNumber}
            </div>
          </div>
        </Html>

        {/* Luxury Pedestal Displays (No poles or floating signs) */}
        {storeProducts.slice(0, 4).map((product: any, idx: number) => {
          const xOffset = -4.5 + idx * 3.0
          const zOffset = -2.5

          return (
            <group key={product.id || idx} position={[xOffset, 0, zOffset]}>
              {/* Marble Display Pedestal */}
              <RoundedBox
                args={[1.6, 1.0, 1.6]}
                position={[0, 0.5, 0]}
                radius={0.06}
                smoothness={4}
                castShadow
                receiveShadow
              >
                <meshStandardMaterial
                  color="#15141c"
                  roughness={0.2}
                  metalness={0.7}
                />
              </RoundedBox>

              {/* Gold Plinth Rim */}
              <RoundedBox
                args={[1.65, 0.04, 1.65]}
                position={[0, 1.02, 0]}
                radius={0.02}
                smoothness={2}
              >
                <meshStandardMaterial color={theme.accents} metalness={0.9} roughness={0.15} />
              </RoundedBox>

              {/* Glass Vitrine Case */}
              <mesh position={[0, 1.55, 0]} castShadow>
                <boxGeometry args={[1.5, 1.0, 1.5]} />
                <meshPhysicalMaterial
                  color="#ffffff"
                  transmission={0.95}
                  opacity={0.3}
                  transparent
                  roughness={0.05}
                  ior={1.5}
                />
              </mesh>

              {/* Pedestal Spot Light */}
              <pointLight position={[0, 1.6, 0]} intensity={1.2} color={theme.accents} distance={3} />

              {/* Interactive Showcase Card Mounted Gracefully in Front of Pedestal */}
              {!selectedProduct && (
                <Html position={[0, 1.25, 0.9]} center className="select-none" zIndexRange={[10, 0]}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedProduct(product)
                    }}
                    className="bg-[#0b0a12]/95 border border-[#c5a059]/70 hover:border-[#ffd700] rounded-xl p-2.5 shadow-2xl backdrop-blur-xl cursor-pointer transition-all duration-300 hover:scale-105 flex items-center gap-2.5 w-56 group"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-black/40">
                      <img
                        src={product.image || '/aurelia/mall-realistic-view.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-bold text-white font-serif truncate group-hover:text-[#ffd700] transition-colors">
                        {product.name}
                      </div>
                      <div className="text-[10px] text-[#e6ca85] font-sans font-semibold mt-0.5">
                        {product.price ? `₹${Number(product.price).toLocaleString('en-IN')}` : 'Price unavailable'}
                      </div>
                      <div className="text-[8px] text-white/40 uppercase tracking-widest mt-0.5 flex items-center gap-1">
                        <span>Inspect</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                </Html>
              )}
            </group>
          )
        })}
      </group>

      {/* Floating Exit Button at Top-Left & Focused Modal */}
      <Html fullscreen zIndexRange={[99999, 99990]}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-6 left-6 pointer-events-auto">
            <button
              onClick={onExit}
              className="bg-[#0a0a0e]/95 hover:bg-[#c5a059] text-[#fbf8f3] hover:text-[#0a0a0c] border border-white/20 hover:border-[#c5a059] px-6 py-2.5 rounded-full font-sans text-xs font-bold tracking-widest uppercase transition-all shadow-2xl flex items-center gap-2 backdrop-blur-xl"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Aurelia Mall</span>
            </button>
          </div>

          {/* Focused Product View Modal */}
          {selectedProduct && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 pointer-events-auto animate-fade-in z-[99999]">
              <div className="relative w-full max-w-xl bg-[#0e0d14] border-2 border-[#c5a059]/80 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col sm:flex-row z-[100000]">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-white text-white hover:text-black flex items-center justify-center transition-colors border border-white/20"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Product Image */}
                <div className="w-full sm:w-1/2 h-64 sm:h-auto relative bg-[#07070a]">
                  <ImageWithFallback
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    category={selectedProduct.category || store.category}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#0a0a0e]/90 border border-[#c5a059]/60 px-2.5 py-1 rounded-full text-[9px] text-[#ffd700] uppercase font-bold tracking-wider">
                    {store.name}
                  </div>
                </div>

                {/* Product Details */}
                <div className="w-full sm:w-1/2 p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-[#c5a059] uppercase tracking-widest font-bold">
                      {selectedProduct.brand || store.name}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-white mt-1 leading-snug">
                      {selectedProduct.name}
                    </h3>
                    <div className="text-xl text-[#f3e5ab] font-sans font-bold mt-2">
                      {selectedProduct.price ? `₹${Number(selectedProduct.price).toLocaleString('en-IN')}` : 'Price unavailable'}
                    </div>
                    <p className="text-xs text-white/60 font-sans leading-relaxed mt-3 line-clamp-4">
                      {selectedProduct.description ||
                        'Crafted with premium materials and signature design excellence for AURELIA Mall visitors.'}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 font-medium">
                      <CheckCircle className="h-4 w-4" />
                      <span>
                        {selectedProduct.availability ||
                          (store.category === 'ENTERTAINMENT'
                            ? 'Available Sessions'
                            : store.category === 'DINING'
                            ? 'Available for Table Reservation'
                            : 'In Stock at Boutique')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        if (store.category === 'ENTERTAINMENT') {
                          alert(`Play session pass booked for "${selectedProduct.name}". Confirmation pass sent to guest.`)
                        } else if (store.category === 'DINING') {
                          alert(`Table reservation / order request received for "${selectedProduct.name}".`)
                        } else {
                          alert(`Added "${selectedProduct.name}" to shopping bag.`)
                        }
                      }}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#f5e6b3] to-[#c5a059] text-[#0a0a0c] font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_25px_rgba(255,215,0,0.8)] transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>
                        {store.category === 'ENTERTAINMENT'
                          ? 'Book Play Session / Admission Pass'
                          : store.category === 'DINING'
                          ? 'Reserve Table / Order Ahead'
                          : 'Add to Shopping Bag'}
                      </span>
                    </button>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                    >
                      ← Back to Store Interior
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Html>

      <OrbitControls
        makeDefault
        enabled={!selectedProduct}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={2.5}
        maxDistance={14}
        target={[0, 1.2, -1]}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  )
}
