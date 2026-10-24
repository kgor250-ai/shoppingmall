'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/data/types'
import { allProducts } from '@/data/products'
import { ImageWithFallback } from './ImageWithFallback'
import {
  X,
  MapPin,
  Star,
  Sparkles,
  ShoppingBag,
  Bookmark,
  Compass,
  CheckCircle,
  Tag,
  Shield,
  Clock,
  ArrowRight,
} from 'lucide-react'

interface ProductDetailModalProps {
  product: Product | null
  onClose: () => void
  onNavigateToMap: (storeName: string, floor: string) => void
  onSelectStoreByName?: (storeName: string) => void
}

export function ProductDetailModal({
  product,
  onClose,
  onNavigateToMap,
  onSelectStoreByName,
}: ProductDetailModalProps) {
  const [saved, setSaved] = useState(false)
  const [reserved, setReserved] = useState(false)
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const recommendedProducts = React.useMemo(() => {
    if (!product) return []
    const recommendations = allProducts.filter(
      (p) =>
        p.id !== product.id &&
        (p.subCategory === product.subCategory || p.brand === product.brand || p.category === product.category)
    )
    return recommendations
      .sort((a, b) => {
        let scoreA = 0
        let scoreB = 0
        if (a.brand === product.brand) scoreA += 2
        if (a.subCategory === product.subCategory) scoreA += 2
        if (a.category === product.category) scoreA += 1
        if (b.brand === product.brand) scoreB += 2
        if (b.subCategory === product.subCategory) scoreB += 2
        if (b.category === product.category) scoreB += 1
        return scoreB - scoreA
      })
      .slice(0, 4)
  }, [product])


  if (!product) return null

  const isEntertainment =
    product.category === 'ENTERTAINMENT' ||
    product.store.toLowerCase().includes('kids') ||
    product.store.toLowerCase().includes('play') ||
    product.store.toLowerCase().includes('game') ||
    product.store.toLowerCase().includes('cinema')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-2xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl my-8 rounded-3xl bg-[#0b0a0f] border border-[#c5a059]/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-30 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:bg-black/90 transition-all duration-300"
          aria-label="Close Product"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto custom-scrollbar flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
            {/* Left: Product Image Showcase (5 cols) */}
            <div className="md:col-span-5 relative h-80 md:h-auto min-h-[380px] bg-[#141219] overflow-hidden">
              <ImageWithFallback
                src={product.image}
                alt={product.name || 'Unnamed Product'}
                category={product.category || product.subCategory}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a0f] via-transparent to-black/20 md:hidden pointer-events-none" />

              {/* Badge */}
              <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                {product.badge && (
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#c5a059]/40 text-[9px] uppercase tracking-[0.24em] font-sans text-[#e6ca85]">
                    {product.badge}
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="px-3 py-1 rounded-full bg-rose-500/90 text-[9px] font-sans font-bold tracking-widest text-white shadow-lg">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Right: Product Details & Purchase Actions (7 cols) */}
            <div className="md:col-span-7 p-8 md:p-10 flex flex-col justify-between space-y-6">
              <div>
                {/* Category & Store Badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-sans text-[#c5a059] uppercase tracking-widest mb-2">
                  <span>{product.category || 'Luxury'} · {product.subCategory || 'Collection'}</span>
                  <span className="text-white/60 lowercase tracking-normal text-[11px]">
                    Brand: <strong className="text-[#fbf8f3] capitalize">{product.brand || product.store}</strong>
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-serif text-3xl md:text-4xl text-[#fbf8f3] font-light tracking-wide mb-3">
                  {product.name || 'Unnamed Product'}
                </h2>

                {/* Rating & Availability */}
                <div className="flex flex-wrap items-center gap-3 text-xs font-sans text-[#e8e2d8]/70 mb-6">
                  {product.rating ? (
                    <span className="flex items-center gap-1 text-[#e6ca85] bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/10">
                      <Star className="h-3.5 w-3.5 fill-[#e6ca85]" />
                      {product.rating} ({product.reviewCount || 100} Reviews)
                    </span>
                  ) : null}
                  <span className={`px-2.5 py-1 rounded-full border text-[11px] ${
                    (product.availability || '').toLowerCase().includes('stock') ||
                    (product.availability || '').toLowerCase().includes('available') ||
                    (product.availability || '').toLowerCase().includes('active')
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                  }`}>
                    {product.availability || (isEntertainment ? 'Available Sessions' : 'In Stock')}
                  </span>
                </div>

                {/* Price Display */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 mb-6 flex items-baseline gap-3">
                  <span className="font-serif text-3xl md:text-4xl text-[#fbf8f3] font-light">
                    {product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Price unavailable'}
                  </span>
                  {product.originalPrice && product.originalPrice > (product.price || 0) && (
                    <span className="text-sm font-sans text-[#e8e2d8]/40 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.discount > 0 && product.price && product.originalPrice && (
                    <span className="text-xs font-sans text-[#c5a059] font-semibold tracking-wider">
                      Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')} ({product.discount}%)
                    </span>
                  )}
                </div>

                {/* Store Location Card */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#17141f] to-[#120f0d] border border-[#c5a059]/30 mb-6 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-widest text-[#c5a059] block">
                      {isEntertainment ? 'Venue Location' : 'Available at Boutique'}
                    </span>
                    <div className="font-serif text-lg text-[#fbf8f3] mt-0.5">
                      {product.store}
                    </div>
                    <div className="text-[11px] font-sans text-[#e8e2d8]/60 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-[#c5a059]" />
                      <span>{product.floor}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose()
                      onNavigateToMap(product.store, product.floor)
                    }}
                    className="px-3.5 py-2 rounded-full border border-[#c5a059]/40 hover:border-[#c5a059] bg-[#c5a059]/10 text-xs font-sans text-[#e6ca85] flex items-center gap-1.5 transition-all"
                  >
                    <Compass className="h-3.5 w-3.5" />
                    <span>View on Map</span>
                  </button>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#c5a059] block mb-2">
                    Item Description
                  </span>
                  <p className="text-xs md:text-sm text-[#e8e2d8]/80 font-sans font-light leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 text-[10px] font-sans text-[#e8e2d8]/60"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Special Offer Alert */}
                {product.offers && (
                  <div className="p-3.5 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/30 text-xs font-sans text-[#e6ca85] flex items-center gap-2 mb-6">
                    <Tag className="h-3.5 w-3.5 text-[#c5a059] flex-shrink-0" />
                    <span>{product.offers}</span>
                    {product.couponCode && (
                      <span className="ml-auto font-mono text-[11px] bg-black/60 px-2 py-0.5 rounded border border-[#c5a059]/40 text-white font-bold">
                        {product.couponCode}
                      </span>
                    )}
                  </div>
                )}
              </div>

              
                {/* Recommendations */}
                {recommendedProducts.length > 0 && (
                  <div className="mb-6">
                    <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#c5a059] block mb-3">
                      Recommended For You
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      {recommendedProducts.map((rec) => (
                        <div key={rec.id} className="p-2 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-2 cursor-pointer" onClick={() => {}}>
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={rec.image}
                              alt={rec.name}
                              category={rec.category || rec.subCategory}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="text-xs text-[#fbf8f3] font-serif line-clamp-1">{rec.name}</div>
                            <div className="text-[10px] text-[#e8e2d8]/60 font-sans">
                              {rec.price ? `₹${rec.price.toLocaleString('en-IN')}` : 'Price unavailable'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              {/* Action Buttons */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setReserved(true)}
                    className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#9a7837] text-[#0a0a0c] text-xs font-sans uppercase tracking-[0.22em] font-bold hover:shadow-[0_0_20px_rgba(197,160,89,0.5)] transition-all flex items-center justify-center gap-2"
                  >
                    {reserved ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>{isEntertainment ? 'Session / Pass Reserved' : 'Reserved in Boutique'}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        <span>{isEntertainment ? 'Book Activity / Admission Pass' : 'Reserve for In-Store Pickup'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setSaved(!saved)}
                    className={`p-3.5 rounded-full border text-xs font-sans transition-all ${
                      saved
                        ? 'border-[#c5a059] bg-[#c5a059]/20 text-[#e6ca85]'
                        : 'border-white/20 bg-white/5 text-[#fbf8f3] hover:border-[#c5a059]'
                    }`}
                    title="Add to Wishlist"
                  >
                    <Bookmark className={`h-4 w-4 ${saved ? 'fill-[#c5a059]' : ''}`} />
                  </button>
                </div>

                {reserved && (
                  <p className="text-center text-[10px] text-emerald-400 font-sans animate-fade-in">
                    {isEntertainment
                      ? `Play session & admission pass confirmed at ${product.store} for Gor Kishan.`
                      : `Item held at ${product.store} for 24 hours under Gor Kishan (Black Member #8921).`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
