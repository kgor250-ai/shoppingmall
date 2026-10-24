'use client'

import React, { useState, useMemo } from 'react'
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  MapPin,
  Store as StoreIcon,
  ShoppingBag,
  Utensils,
  Film,
  Wrench,
  Gamepad2,
  Tag,
} from 'lucide-react'
import { searchMallData } from '@/data/index'
import { Store, Product } from '@/data/types'
import { ProductDetailModal } from './ProductDetailModal'

interface AureliaSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectStore: (store: Store) => void
  onSelectProduct?: (product: Product) => void
}

export function AureliaSearchModal({
  isOpen,
  onClose,
  onSelectStore,
  onSelectProduct,
}: AureliaSearchModalProps) {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'products' | 'stores' | 'dining' | 'cinema' | 'services'>('all')
  const [selectedProductInternal, setSelectedProductInternal] = useState<Product | null>(null)

  const searchResults = useMemo(() => {
    return searchMallData(query)
  }, [query])

  if (!isOpen) return null

  const totalResultsCount =
    searchResults.products.length +
    searchResults.stores.length +
    searchResults.restaurants.length +
    searchResults.movies.length +
    searchResults.entertainment.length +
    searchResults.services.length

  const handleProductClick = (prod: Product) => {
    if (onSelectProduct) {
      onClose()
      onSelectProduct(prod)
    } else {
      setSelectedProductInternal(prod)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 md:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in overflow-y-auto">
        <div className="relative w-full max-w-4xl rounded-3xl bg-[#0c0b11] border border-[#c5a059]/40 shadow-2xl p-6 md:p-8 overflow-hidden max-h-[88vh] flex flex-col">
          {/* Search Bar Input */}
          <div className="flex items-center gap-3 pb-5 border-b border-white/10">
            <Search className="h-5 w-5 text-[#c5a059]" />
            <input
              type="text"
              autoFocus
              placeholder="Search products, brands (Nike, Apple, Levi's), boutiques, dining, cinema, services..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent text-base md:text-lg text-[#fbf8f3] placeholder-[#e8e2d8]/40 focus:outline-none font-sans font-light tracking-wide"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-xs text-[#e8e2d8]/50 hover:text-white px-2 py-1"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="py-3.5 flex flex-wrap gap-2 border-b border-white/5 text-xs font-sans overflow-x-auto scrollbar-none">
            <span className="text-[#e8e2d8]/40 py-1 whitespace-nowrap">Suggested:</span>
            {[
              'Nike',
              'Apple iPhone',
              'Zara',
              "Levi's",
              'Tanishq Gold',
              'Vegetarian Dining',
              'IMAX Cinema',
              'Car Wash',
              'Boucheron',
            ].map((item) => (
              <button
                key={item}
                onClick={() => setQuery(item)}
                className="px-3 py-1 rounded-full bg-white/[0.03] hover:bg-[#c5a059]/20 text-[#e8e2d8]/75 hover:text-white border border-white/5 whitespace-nowrap transition-colors"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Result Type Tabs */}
          {query.trim() && (
            <div className="flex items-center gap-2 py-3 overflow-x-auto border-b border-white/5 scrollbar-none text-[11px] font-sans">
              {[
                { id: 'all', label: `All Results (${totalResultsCount})` },
                { id: 'products', label: `Products (${searchResults.products.length})` },
                { id: 'stores', label: `Stores (${searchResults.stores.length})` },
                { id: 'dining', label: `Dining (${searchResults.restaurants.length})` },
                { id: 'cinema', label: `Cinema (${searchResults.movies.length})` },
                { id: 'services', label: `Services (${searchResults.services.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                    activeFilter === tab.id
                      ? 'bg-[#c5a059] text-[#0a0a0c] font-bold'
                      : 'bg-white/[0.02] text-[#e8e2d8]/60 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Results Stream */}
          <div className="overflow-y-auto custom-dark-scrollbar py-4 space-y-6 flex-1 pr-1">
            {!query.trim() ? (
              <div className="text-center py-16 text-[#e8e2d8]/50 text-sm font-sans space-y-2">
                <Search className="h-8 w-8 text-[#c5a059]/40 mx-auto" />
                <p>Type to search 150+ catalog items, 30+ stores, Michelin restaurants, movies & services.</p>
              </div>
            ) : totalResultsCount === 0 ? (
              <div className="text-center py-16 text-[#e8e2d8]/50 text-sm font-sans">
                No matching results found across the mall for &ldquo;{query}&rdquo;.
              </div>
            ) : (
              <div className="space-y-6">
                {/* 1. Products Section */}
                {(activeFilter === 'all' || activeFilter === 'products') && searchResults.products.length > 0 && (
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#c5a059] block mb-3">
                      Products & Catalog ({searchResults.products.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {searchResults.products.slice(0, activeFilter === 'all' ? 6 : 20).map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => handleProductClick(prod)}
                          className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-[#c5a059]/10 border border-white/5 hover:border-[#c5a059]/40 transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#c5a059] flex-shrink-0">
                              <ShoppingBag className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-serif text-sm text-[#fbf8f3] group-hover:text-[#e6ca85] transition-colors line-clamp-1">
                                {prod.name}
                              </h4>
                              <p className="text-[11px] text-[#e8e2d8]/60 font-sans">
                                {prod.brand} · {prod.store} ({prod.floor.split('·')[0]})
                              </p>
                              <div className="text-xs font-serif text-[#c5a059] font-medium mt-0.5">
                                ₹{prod.price.toLocaleString('en-IN')}
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#c5a059] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Stores Section */}
                {(activeFilter === 'all' || activeFilter === 'stores') && searchResults.stores.length > 0 && (
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#c5a059] block mb-3">
                      Flagship Boutiques ({searchResults.stores.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {searchResults.stores.slice(0, activeFilter === 'all' ? 4 : 20).map((store) => (
                        <div
                          key={store.id}
                          onClick={() => {
                            onClose()
                            onSelectStore(store)
                          }}
                          className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-[#c5a059]/10 border border-white/5 hover:border-[#c5a059]/40 transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#c5a059] flex-shrink-0">
                              <StoreIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-serif text-sm text-[#fbf8f3] group-hover:text-[#e6ca85] transition-colors">
                                {store.name}
                              </h4>
                              <p className="text-[11px] text-[#e8e2d8]/60 font-sans">
                                {store.category} · {store.floor}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#c5a059] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Dining Section */}
                {(activeFilter === 'all' || activeFilter === 'dining') && searchResults.restaurants.length > 0 && (
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#c5a059] block mb-3">
                      Gastronomy & Dining ({searchResults.restaurants.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {searchResults.restaurants.slice(0, activeFilter === 'all' ? 4 : 20).map((res) => (
                        <div
                          key={res.id}
                          onClick={() => {
                            onClose()
                            window.location.hash = '#dining'
                          }}
                          className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-[#c5a059]/10 border border-white/5 hover:border-[#c5a059]/40 transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#c5a059] flex-shrink-0">
                              <Utensils className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-serif text-sm text-[#fbf8f3] group-hover:text-[#e6ca85] transition-colors">
                                {res.name}
                              </h4>
                              <p className="text-[11px] text-[#e8e2d8]/60 font-sans">
                                {res.cuisine} · {res.floor}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#c5a059] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Cinema Section */}
                {(activeFilter === 'all' || activeFilter === 'cinema') && searchResults.movies.length > 0 && (
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#c5a059] block mb-3">
                      Cinema & Movies ({searchResults.movies.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {searchResults.movies.map((mov) => (
                        <div
                          key={mov.id}
                          onClick={() => {
                            onClose()
                            window.location.hash = '#experiences'
                          }}
                          className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-[#c5a059]/10 border border-white/5 hover:border-[#c5a059]/40 transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#c5a059] flex-shrink-0">
                              <Film className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-serif text-sm text-[#fbf8f3] group-hover:text-[#e6ca85] transition-colors">
                                {mov.title}
                              </h4>
                              <p className="text-[11px] text-[#e8e2d8]/60 font-sans">
                                {mov.screen} · {mov.duration}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-sans text-[#c5a059] uppercase tracking-wider">Book</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Services Section */}
                {(activeFilter === 'all' || activeFilter === 'services') && searchResults.services.length > 0 && (
                  <div>
                    <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#c5a059] block mb-3">
                      Mall Services ({searchResults.services.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {searchResults.services.map((srv) => (
                        <div
                          key={srv.id}
                          onClick={() => {
                            onClose()
                            window.location.hash = '#experiences'
                          }}
                          className="p-3.5 rounded-2xl bg-white/[0.02] hover:bg-[#c5a059]/10 border border-white/5 hover:border-[#c5a059]/40 transition-all cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#c5a059] flex-shrink-0">
                              <Wrench className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-serif text-sm text-[#fbf8f3] group-hover:text-[#e6ca85] transition-colors">
                                {srv.name}
                              </h4>
                              <p className="text-[11px] text-[#e8e2d8]/60 font-sans">
                                {srv.category} · {srv.floor}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-[#c5a059] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Internal Product Detail Modal if opened from search */}
      <ProductDetailModal
        product={selectedProductInternal}
        onClose={() => setSelectedProductInternal(null)}
        onNavigateToMap={(storeName, floor) => {
          onClose()
          window.location.hash = '#map'
        }}
      />
    </>
  )
}
