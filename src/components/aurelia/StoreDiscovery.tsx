'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { ArrowRight, Sparkles, Filter, Search, Tag, Star, ChevronDown, CheckCircle, ShoppingBag } from 'lucide-react'
import { allStores } from '@/data/stores'
import { allProducts } from '@/data/products'
import { Store, Product } from '@/data/types'
import { ProductDetailModal } from './ProductDetailModal'

export type BrandData = Store
export const luxuryBrandsList = allStores

interface StoreDiscoveryProps {
  onSelectStore: (store: Store) => void
  onSelectProduct?: (product: Product) => void
}

export function StoreDiscovery({ onSelectStore, onSelectProduct }: StoreDiscoveryProps) {
  const [viewMode, setViewMode] = useState<'stores' | 'products'>('stores')
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [activeSubCategory, setActiveSubCategory] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [priceFilter, setPriceFilter] = useState('ALL')
  const [specialFilter, setSpecialFilter] = useState<'ALL' | 'NEW' | 'TRENDING' | 'BESTSELLER' | 'OFFERS'>('ALL')
  const [visibleCount, setVisibleCount] = useState(12)
  const [selectedProductInternal, setSelectedProductInternal] = useState<Product | null>(null)

  const categories = [
    'ALL',
    'FASHION',
    'ELECTRONICS',
    'BEAUTY',
    'JEWELLERY',
    'GROCERY',
    'SPORTS',
    'KIDS',
    'ENTERTAINMENT',
    'DINING',
  ]

  // Dynamic subcategories based on activeCategory
  const availableSubcategories = useMemo(() => {
    if (activeCategory === 'ALL') {
      const set = new Set(allProducts.map((p) => p.subCategory))
      return ['ALL', ...Array.from(set).slice(0, 10)]
    }
    const filtered = allProducts.filter((p) => {
      if (activeCategory === 'KIDS') return p.category === 'KIDS' || p.storeId === 'kids-play-zone'
      if (activeCategory === 'ENTERTAINMENT') return p.category === 'ENTERTAINMENT' || p.storeId === 'kids-play-zone'
      return p.category === activeCategory
    })
    const set = new Set(filtered.map((p) => p.subCategory))
    return ['ALL', ...Array.from(set)]
  }, [activeCategory])

  // Filtered Stores
  const filteredBrands = useMemo(() => {
    return allStores.filter((b) => {
      const matchesCategory =
        activeCategory === 'ALL' ||
        b.category === activeCategory ||
        (activeCategory === 'KIDS' && (b.category === 'KIDS' || b.id === 'kids-play-zone')) ||
        (activeCategory === 'ENTERTAINMENT' && (b.category === 'ENTERTAINMENT' || b.id === 'kids-play-zone'))
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        b.name.toLowerCase().includes(q) ||
        b.tagline.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.floor.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      // Category filter
      const matchesCategory =
        activeCategory === 'ALL' ||
        p.category === activeCategory ||
        (activeCategory === 'KIDS' && (p.category === 'KIDS' || p.storeId === 'kids-play-zone')) ||
        (activeCategory === 'ENTERTAINMENT' && (p.category === 'ENTERTAINMENT' || p.storeId === 'kids-play-zone'))

      // SubCategory filter
      const matchesSubCategory =
        activeSubCategory === 'ALL' || p.subCategory === activeSubCategory

      // Search query
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.store.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))

      // Price filter
      let matchesPrice = true
      if (priceFilter === 'UNDER_1000') matchesPrice = p.price < 1000
      else if (priceFilter === '1000_5000') matchesPrice = p.price >= 1000 && p.price <= 5000
      else if (priceFilter === '5000_20000') matchesPrice = p.price > 5000 && p.price <= 20000
      else if (priceFilter === 'ABOVE_20000') matchesPrice = p.price > 20000

      // Special highlight filter
      let matchesSpecial = true
      if (specialFilter === 'NEW') matchesSpecial = p.isNew
      else if (specialFilter === 'TRENDING') matchesSpecial = p.isTrending
      else if (specialFilter === 'BESTSELLER') matchesSpecial = p.isBestSeller
      else if (specialFilter === 'OFFERS') matchesSpecial = p.discount > 0

      return matchesCategory && matchesSubCategory && matchesSearch && matchesPrice && matchesSpecial
    })
  }, [activeCategory, activeSubCategory, searchQuery, priceFilter, specialFilter])

  const handleProductClick = (prod: Product) => {
    if (onSelectProduct) {
      onSelectProduct(prod)
    } else {
      setSelectedProductInternal(prod)
    }
  }

  return (
    <section id="stores" className="py-28 px-6 md:px-12 bg-[#09080d] relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.32em] text-[#c5a059] mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Editorial Directory & Marketplace</span>
          </div>
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#fbf8f3] font-light tracking-wide uppercase mb-4">
            The Collection
          </h2>
          <div className="w-16 h-[1px] bg-[#c5a059] mx-auto mb-6" />
          <p className="text-sm md:text-base text-[#e8e2d8]/70 font-sans font-light tracking-wide">
            Explore 30+ exceptional flagship maisons and 150+ verified catalog items across Fashion, Electronics, Beauty, Jewellery, Sports, Kids, and Grocery.
          </p>
        </div>

        {/* View Switcher: Stores vs Products Catalog */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
            <button
              onClick={() => {
                setViewMode('stores')
                setVisibleCount(12)
              }}
              className={`px-6 py-2.5 rounded-full text-xs font-sans tracking-[0.2em] uppercase transition-all duration-300 font-semibold ${
                viewMode === 'stores'
                  ? 'bg-[#c5a059] text-[#0a0a0c] shadow-lg shadow-[#c5a059]/25'
                  : 'text-[#e8e2d8]/70 hover:text-white'
              }`}
            >
              Flagship Stores ({filteredBrands.length})
            </button>
            <button
              onClick={() => {
                setViewMode('products')
                setVisibleCount(12)
              }}
              className={`px-6 py-2.5 rounded-full text-xs font-sans tracking-[0.2em] uppercase transition-all duration-300 font-semibold flex items-center gap-2 ${
                viewMode === 'products'
                  ? 'bg-[#c5a059] text-[#0a0a0c] shadow-lg shadow-[#c5a059]/25'
                  : 'text-[#e8e2d8]/70 hover:text-white'
              }`}
            >
              <span>Product Catalog</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                viewMode === 'products' ? 'bg-[#0a0a0c] text-[#e6ca85]' : 'bg-white/10 text-white'
              }`}>
                {filteredProducts.length}
              </span>
            </button>
          </div>
        </div>

        {/* Category Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-6 border-b border-white/10">
          {/* Categories Tab Pill */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat)
                  setActiveSubCategory('ALL')
                  setVisibleCount(12)
                }}
                className={`px-4 py-2 rounded-full text-[11px] font-sans tracking-[0.2em] uppercase transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#c5a059] text-[#0a0a0c] font-semibold shadow-lg shadow-[#c5a059]/20'
                    : 'bg-white/[0.03] text-[#e8e2d8]/70 hover:text-[#fbf8f3] hover:bg-white/[0.08] border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#e8e2d8]/40" />
            <input
              type="text"
              placeholder={
                viewMode === 'stores'
                  ? 'Search boutique or suite...'
                  : 'Search product, brand, tag...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/[0.04] border border-white/10 focus:border-[#c5a059] focus:outline-none text-xs text-[#fbf8f3] placeholder-[#e8e2d8]/40 font-sans tracking-wide"
            />
          </div>
        </div>

        {/* Secondary Subcategory & Price Filters (Shown when in Products mode) */}
        {viewMode === 'products' && (
          <div className="space-y-4 mb-12 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            {/* Subcategory Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-[10px] font-sans uppercase tracking-widest text-[#c5a059] whitespace-nowrap mr-2">
                Subcategory:
              </span>
              {availableSubcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => {
                    setActiveSubCategory(sub)
                    setVisibleCount(12)
                  }}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-sans tracking-wider transition-all whitespace-nowrap ${
                    activeSubCategory === sub
                      ? 'bg-[#e6ca85] text-[#0a0a0c] font-bold shadow-sm'
                      : 'bg-white/[0.04] text-[#e8e2d8]/70 hover:text-white border border-white/5'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Quick Filter Attributes (Price & Badges) */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/5 text-xs font-sans">
              {/* Highlight Toggles */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#e8e2d8]/50">Curations:</span>
                {[
                  { key: 'ALL', label: 'All Items' },
                  { key: 'NEW', label: '✨ New Arrivals' },
                  { key: 'TRENDING', label: '🔥 Trending' },
                  { key: 'BESTSELLER', label: '⭐ Best Sellers' },
                  { key: 'OFFERS', label: '🏷️ On Sale' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setSpecialFilter(item.key as any)}
                    className={`px-3 py-1 rounded-full text-[10px] transition-all ${
                      specialFilter === item.key
                        ? 'bg-[#c5a059]/20 text-[#e6ca85] border border-[#c5a059]/50 font-medium'
                        : 'text-[#e8e2d8]/60 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Price Filter Select */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#e8e2d8]/50">Price:</span>
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="bg-[#121118] border border-white/10 rounded-full px-3 py-1 text-[11px] text-[#fbf8f3] font-sans focus:outline-none focus:border-[#c5a059]"
                >
                  <option value="ALL">All Prices</option>
                  <option value="UNDER_1000">Under ₹1,000</option>
                  <option value="1000_5000">₹1,000 – ₹5,000</option>
                  <option value="5000_20000">₹5,000 – ₹20,000</option>
                  <option value="ABOVE_20000">₹20,000 & Above</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── 01: VIEW MODE = STORES ── */}
        {viewMode === 'stores' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBrands.slice(0, visibleCount).map((brand) => (
                <div
                  key={brand.id}
                  onClick={() => onSelectStore(brand)}
                  className="group relative h-[440px] rounded-3xl overflow-hidden cursor-pointer bg-[#110f17] border border-white/10 transition-all duration-700 hover:border-[#c5a059]/60 hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
                >
                  {/* Background Imagery with Smooth Zoom on Hover */}
                  <div className="absolute inset-0">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      fill
                      className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = '/aurelia/atelier.jpg'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/50 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-85" />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700" />
                  </div>

                  {/* Top Tag Badges */}
                  <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] uppercase tracking-[0.24em] font-sans text-[#c5a059]">
                      {brand.category}
                    </span>
                    <span className="text-[11px] font-sans tracking-widest text-[#e8e2d8]/80 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                      {brand.floor.split('·')[0]}
                    </span>
                  </div>

                  {/* Bottom Editorial Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-10 flex flex-col justify-end">
                    <div className="w-0 h-[1.5px] bg-gradient-to-r from-[#e6ca85] to-[#c5a059] mb-4 transition-all duration-500 ease-out group-hover:w-16" />

                    <div className="transform transition-transform duration-500 ease-out group-hover:-translate-y-2">
                      <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#c5a059] block mb-1">
                        {brand.floor}
                      </span>
                      <h3 className="font-serif text-3xl md:text-4xl text-[#fbf8f3] font-light tracking-wide mb-2">
                        {brand.name}
                      </h3>
                      <p className="text-xs text-[#e8e2d8]/70 font-sans font-light line-clamp-2">
                        {brand.tagline}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/10 text-xs font-sans uppercase tracking-[0.25em] text-[#e8e2d8] opacity-80 group-hover:opacity-100 group-hover:text-[#e6ca85] transition-all duration-300">
                      <span className="group-hover:tracking-[0.3em] transition-all duration-300">
                        Explore Maison
                      </span>
                      <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More / View All Button for Stores */}
            {filteredBrands.length > visibleCount && (
              <div className="text-center mt-14">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 12)}
                  className="px-8 py-3.5 rounded-full border border-white/20 bg-white/5 hover:border-[#c5a059] hover:bg-[#c5a059]/15 text-xs font-sans uppercase tracking-[0.24em] text-[#fbf8f3] transition-all"
                >
                  View All Stores ({filteredBrands.length - visibleCount} more)
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── 02: VIEW MODE = PRODUCTS CATALOG ── */}
        {viewMode === 'products' && (
          <div>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.slice(0, visibleCount).map((product) => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer bg-[#100f17] border border-white/10 transition-all duration-500 hover:border-[#c5a059]/60 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex flex-col justify-between"
                  >
                    {/* Top Image Showcase */}
                    <div className="relative h-64 w-full overflow-hidden bg-[#161420]">
                      <Image
                        src={product.image || '/aurelia/atelier.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = '/aurelia/atelier.jpg'
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#100f17] via-transparent to-black/20" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                        <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] uppercase tracking-wider font-sans text-[#e6ca85]">
                          {product.badge}
                        </span>
                        {product.discount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/90 text-[9px] font-sans font-bold text-white shadow-md">
                            {product.discount}% OFF
                          </span>
                        )}
                      </div>

                      {/* Store Tag */}
                      <div className="absolute bottom-3 left-3 text-[10px] font-sans text-[#c5a059] bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/5">
                        {product.store}
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-sans text-[#e8e2d8]/60 uppercase tracking-wider mb-1.5">
                          <span>{product.subCategory}</span>
                          <span className="flex items-center gap-1 text-[#e6ca85]">
                            <Star className="h-3 w-3 fill-[#e6ca85]" />
                            {product.rating}
                          </span>
                        </div>

                        <h4 className="font-serif text-lg text-[#fbf8f3] font-light tracking-wide line-clamp-1 mb-2 group-hover:text-[#e6ca85] transition-colors">
                          {product.name}
                        </h4>

                        <p className="text-[11px] text-[#e8e2d8]/60 font-sans line-clamp-2 mb-4 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      {/* Price & Action */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <div>
                          <div className="font-serif text-lg text-[#fbf8f3] font-medium">
                            ₹{product.price.toLocaleString('en-IN')}
                          </div>
                          {product.originalPrice > product.price && (
                            <div className="text-[10px] text-[#e8e2d8]/40 line-through">
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-[11px] font-sans uppercase tracking-widest text-[#c5a059] group-hover:translate-x-1 transition-transform">
                          <span>Details</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-[#e8e2d8]/50 text-sm font-sans bg-white/[0.01] rounded-3xl border border-white/5">
                No products found matching your current filter. Try selecting &ldquo;All Items&rdquo; or clearing search.
              </div>
            )}

            {/* Load More Button for Products */}
            {filteredProducts.length > visibleCount && (
              <div className="text-center mt-14">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 16)}
                  className="px-8 py-3.5 rounded-full border border-white/20 bg-white/5 hover:border-[#c5a059] hover:bg-[#c5a059]/15 text-xs font-sans uppercase tracking-[0.24em] text-[#fbf8f3] transition-all"
                >
                  Load More Products ({filteredProducts.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Internal Product Detail Modal if opened directly here */}
      <ProductDetailModal
        product={selectedProductInternal}
        onClose={() => setSelectedProductInternal(null)}
        onNavigateToMap={(storeName, floor) => {
          window.location.hash = '#map'
        }}
      />
    </section>
  )
}
