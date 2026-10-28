'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { BrandData } from './StoreDiscovery'
import { allProducts } from '@/data/products'
import { Product } from '@/data/types'
import { ProductDetailModal } from './ProductDetailModal'
import { ImageWithFallback } from './ImageWithFallback'
import {
  X,
  MapPin,
  Clock,
  Compass,
  Bookmark,
  Share2,
  Sparkles,
  Star,
  CheckCircle,
  Calendar,
  ArrowRight,
  Phone,
  Tag,
} from 'lucide-react'

interface StoreDetailModalProps {
  store: BrandData | null
  onClose: () => void
  onNavigateToMap: (storeName: string, floor: string) => void
  onBookAppointment?: (storeName: string) => void
}

export function StoreDetailModal({
  store,
  onClose,
  onNavigateToMap,
}: StoreDetailModalProps) {
  const [saved, setSaved] = useState(false)
  const [appointmentBooked, setAppointmentBooked] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [activeSubFilter, setActiveSubFilter] = useState('ALL')

  if (!store) return null

  // Fetch all products matching this store from allProducts
  const storeProducts = allProducts.filter(
    (p) =>
      p.storeId === store.id ||
      p.store.toLowerCase().includes(store.name.toLowerCase()) ||
      store.name.toLowerCase().includes(p.brand.toLowerCase())
  )

  // Subcategories present in this store
  const storeSubcategories = ['ALL', ...Array.from(new Set(storeProducts.map((p) => p.subCategory)))]

  // Filtered store products
  const displayedProducts = storeProducts.filter(
    (p) => activeSubFilter === 'ALL' || p.subCategory === activeSubFilter
  )

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-2xl animate-fade-in overflow-y-auto">
        <div className="relative w-full max-w-5xl my-8 rounded-3xl bg-[#0b0a0f] border border-[#c5a059]/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-30 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:bg-black/90 transition-all duration-300"
            aria-label="Close Boutique"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Scrollable Modal Body */}
          <div className="overflow-y-auto custom-scrollbar flex-1">
            {/* Full-width Editorial Hero */}
            <div className="relative h-[420px] md:h-[480px] w-full overflow-hidden">
              <ImageWithFallback
                src={store.image}
                alt={store.name || 'Unnamed Store'}
                category={store.category}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a0f] via-[#0b0a0f]/40 to-black/30 pointer-events-none" />

              {/* Hero Overlay Details */}
              <div className="absolute bottom-10 left-8 md:left-14 right-8 z-10">
                {/* Modal Breadcrumb Trail */}
                <nav aria-label="Boutique path" className="flex items-center gap-1.5 text-[11px] font-sans tracking-wider text-[#e8e2d8]/60 mb-3">
                  <button
                    onClick={() => {
                      onClose()
                      window.location.hash = '#hero'
                    }}
                    className="hover:text-[#c5a059] transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                  <span>→</span>
                  <button
                    onClick={() => {
                      onClose()
                      window.location.hash = '#stores'
                    }}
                    className="hover:text-[#c5a059] transition-colors cursor-pointer"
                  >
                    Stores
                  </button>
                  <span>→</span>
                  <span className="text-[#c5a059] font-medium truncate max-w-[200px]" aria-current="page">
                    {store.name}
                  </span>
                </nav>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 text-[10px] font-sans uppercase tracking-[0.28em] text-[#e6ca85] mb-4 backdrop-blur-md">
                  <Sparkles className="h-3 w-3" />
                  <span>
                    {store.category === 'ENTERTAINMENT'
                      ? 'Entertainment & Activity Venue'
                      : store.category === 'DINING'
                      ? 'Culinary & Dining Promenade'
                      : 'Flagship Boutique'} · {store.category}
                  </span>
                </div>

                <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#fbf8f3] font-light tracking-wide mb-3">
                  {store.name}
                </h2>

                <p className="font-serif italic text-xl md:text-2xl text-[#e8e2d8] font-normal mb-6 max-w-2xl">
                  “{store.tagline}”
                </p>

                {/* Floor & Hours Badges */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-sans tracking-widest text-[#e8e2d8]/80 mb-8">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                    <MapPin className="h-3.5 w-3.5 text-[#c5a059]" />
                    {store.floor}
                  </span>
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                    <Clock className="h-3.5 w-3.5 text-[#c5a059]" />
                    {store.hours}
                  </span>
                  <span className="flex items-center gap-1 text-[#e6ca85] px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                    <Star className="h-3.5 w-3.5 fill-[#e6ca85]" />
                    {store.rating} ({store.reviewCount} Reviews)
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => {
                      onClose()
                      onNavigateToMap(store.name, store.floor)
                    }}
                    className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#9a7837] text-[#0a0a0c] text-xs font-sans uppercase tracking-[0.24em] font-bold hover:shadow-[0_0_25px_rgba(197,160,89,0.5)] transition-all flex items-center gap-2"
                  >
                    <Compass className="h-4 w-4" />
                    <span>Get Directions (3D Map)</span>
                  </button>

                  <button
                    onClick={() => setSaved(!saved)}
                    className={`px-5 py-3.5 rounded-full border text-xs font-sans uppercase tracking-[0.24em] font-medium transition-all flex items-center gap-2 ${
                      saved
                        ? 'border-[#c5a059] bg-[#c5a059]/20 text-[#e6ca85]'
                        : 'border-white/20 bg-white/5 text-[#fbf8f3] hover:border-[#c5a059]'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${saved ? 'fill-[#c5a059]' : ''}`} />
                    <span>{saved ? 'Saved to Wishlist' : 'Save Venue'}</span>
                  </button>

                  <button
                    onClick={() => setAppointmentBooked(true)}
                    className="px-5 py-3.5 rounded-full border border-white/20 bg-white/5 text-[#fbf8f3] hover:border-[#c5a059] text-xs font-sans uppercase tracking-[0.24em] font-medium transition-all flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4 text-[#c5a059]" />
                    <span>
                      {appointmentBooked
                        ? 'Confirmed Pass'
                        : store.category === 'ENTERTAINMENT'
                        ? 'Book Play Session / Admission Pass'
                        : 'Book VIP Salon'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Editorial Content Below Hero */}
            <div className="p-8 md:p-14 space-y-16">
              {/* About the Brand */}
              <div>
                <span className="text-xs font-sans uppercase tracking-[0.3em] text-[#c5a059] block mb-2">
                  {store.category === 'ENTERTAINMENT' ? 'Venue & Experience' : 'Heritage & Vision'}
                </span>
                <h3 className="font-serif text-3xl md:text-4xl text-[#fbf8f3] tracking-wide mb-6">
                  {store.category === 'ENTERTAINMENT' ? 'About The Venue' : 'About The Maison'}
                </h3>
                <p className="text-base text-[#e8e2d8]/80 font-sans font-light leading-relaxed max-w-4xl">
                  {store.description}
                </p>
              </div>

              {/* Store Products / Collection */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs font-sans uppercase tracking-[0.3em] text-[#c5a059] block mb-1">
                      {store.category === 'ENTERTAINMENT' ? 'Activities & Passes' : 'In-Store Catalog'}
                    </span>
                    <h3 className="font-serif text-3xl text-[#fbf8f3] tracking-wide">
                      Available at {store.name} ({displayedProducts.length} items)
                    </h3>
                  </div>

                  {/* Subcategory filter pills if multiple exist */}
                  {storeSubcategories.length > 2 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {storeSubcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => setActiveSubFilter(sub)}
                          className={`px-3 py-1 rounded-full text-[10px] font-sans tracking-wider whitespace-nowrap transition-all ${
                            activeSubFilter === sub
                              ? 'bg-[#c5a059] text-[#0a0a0c] font-bold'
                              : 'bg-white/[0.04] text-[#e8e2d8]/70 hover:text-white border border-white/5'
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {displayedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {displayedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => setSelectedProduct(prod)}
                        className="group rounded-2xl bg-[#141219] border border-white/10 hover:border-[#c5a059]/40 overflow-hidden transition-all duration-500 cursor-pointer flex flex-col justify-between"
                      >
                        <div className="relative h-56 w-full overflow-hidden bg-[#181622]">
                          <ImageWithFallback
                            src={prod.image}
                            alt={prod.name}
                            category={prod.subCategory || store.category}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute top-3 left-3 flex gap-1.5">
                            {prod.badge && (
                              <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] uppercase tracking-wider text-[#e6ca85]">
                                {prod.badge}
                              </span>
                            )}
                            {prod.discount > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-rose-500/90 text-[9px] font-bold text-white">
                                {prod.discount}% OFF
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="text-[10px] text-[#e8e2d8]/50 uppercase tracking-widest font-sans mb-1">
                            {prod.subCategory || 'Category not specified'}
                          </div>
                          <h4 className="font-serif text-base text-[#fbf8f3] tracking-wide mb-2 line-clamp-1 group-hover:text-[#e6ca85] transition-colors">
                            {prod.name || 'Unnamed Product'}
                          </h4>
                          <div className="flex items-baseline justify-between pt-2 border-t border-white/5">
                            <span className="text-sm font-serif text-[#c5a059] font-medium">
                              {prod.price ? `₹${prod.price.toLocaleString('en-IN')}` : 'Price unavailable'}
                            </span>
                            <span className="text-[10px] font-sans text-emerald-400">
                              {prod.availability || (store.category === 'ENTERTAINMENT' || prod.category === 'ENTERTAINMENT' ? 'Available Sessions' : 'In Stock')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : store.featuredCollection && store.featuredCollection.length > 0 ? (
                  /* Fallback to featured collection */
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {store.featuredCollection.map((item, idx) => (
                      <div
                        key={idx}
                        className="group rounded-2xl bg-[#141219] border border-white/10 hover:border-[#c5a059]/40 overflow-hidden transition-all duration-500"
                      >
                        <div className="relative h-60 w-full overflow-hidden">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.title}
                            category={store.category}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                        <div className="p-5">
                          <h4 className="font-serif text-lg text-[#fbf8f3] tracking-wide mb-1">
                            {item.title}
                          </h4>
                          <p className="text-xs font-sans font-semibold text-[#c5a059] tracking-wider">
                            {item.price || 'Price unavailable'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 px-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center mx-auto mb-3">
                      <Tag className="h-5 w-5 text-[#c5a059]" />
                    </div>
                    <h4 className="font-serif text-lg text-[#fbf8f3] font-medium mb-1">
                      No products available for this store yet
                    </h4>
                    <p className="text-xs text-white/40 mb-4 max-w-sm mx-auto">
                      New seasonal collections and catalogue arrivals will be updated shortly.
                    </p>
                    {activeSubFilter !== 'ALL' && (
                      <button
                        onClick={() => setActiveSubFilter('ALL')}
                        className="px-4 py-2 rounded-full bg-white/10 hover:bg-[#c5a059] text-white hover:text-black text-xs font-bold uppercase tracking-wider transition-all"
                      >
                        Reset Subcategory Filter
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Current Offers & Privileges */}
              <div className="p-8 rounded-2xl bg-gradient-to-br from-[#1a1512] to-[#120f0d] border border-[#c5a059]/30">
                <span className="text-xs font-sans uppercase tracking-[0.3em] text-[#c5a059] block mb-2">
                  Privileges for Gor Kishan
                </span>
                <h3 className="font-serif text-2xl md:text-3xl text-[#fbf8f3] tracking-wide mb-6">
                  Current Boutique Privileges
                </h3>
                <ul className="space-y-3">
                  {store.currentOffers.map((offer, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-[#e8e2d8]/90 font-sans">
                      <CheckCircle className="h-4 w-4 text-[#c5a059] flex-shrink-0 mt-0.5" />
                      <span>{offer}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Similar Brands */}
              <div>
                <span className="text-xs font-sans uppercase tracking-[0.3em] text-[#c5a059] block mb-2">
                  You May Also Appreciate
                </span>
                <h3 className="font-serif text-2xl text-[#fbf8f3] tracking-wide mb-4">
                  Similar Maisons
                </h3>
                <div className="flex flex-wrap gap-3">
                  {(store.similarBrands || []).map((brandName, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs font-sans tracking-wider text-[#e8e2d8] hover:border-[#c5a059] cursor-pointer transition-colors"
                    >
                      {brandName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Product Detail Modal when clicking an item from this store */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onNavigateToMap={onNavigateToMap}
      />
    </>
  )
}
