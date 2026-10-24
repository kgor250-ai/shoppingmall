'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import {
  Utensils,
  Star,
  MapPin,
  Clock,
  Sparkles,
  Calendar,
  Users,
  ChevronRight,
  Filter,
  Search,
  CheckCircle,
} from 'lucide-react'
import { allRestaurants } from '@/data/restaurants'
import { Restaurant } from '@/data/types'

export type RestaurantData = Restaurant
export const luxuryRestaurants = allRestaurants

interface DiningExperienceProps {
  onReserveTable: (restaurant: Restaurant) => void
}

export function DiningExperience({ onReserveTable }: DiningExperienceProps) {
  const [selectedCuisine, setSelectedCuisine] = useState('ALL')
  const [vegOnly, setVegOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(4)

  const cuisines = [
    'ALL',
    'Indian',
    'Vegetarian',
    'French Haute',
    'Japanese Omakase',
    'Italian',
    'Chinese',
    'Cafe',
    'Desserts',
    'Fast Food',
    'Beverages',
  ]

  const filteredRestaurants = useMemo(() => {
    return allRestaurants.filter((r) => {
      const matchesCuisine =
        selectedCuisine === 'ALL' ||
        r.cuisine.toLowerCase().includes(selectedCuisine.toLowerCase())
      const matchesVeg = !vegOnly || r.vegetarianFriendly
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.chef.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.signatureDishes.some((d) => d.name.toLowerCase().includes(q))
      return matchesCuisine && matchesVeg && matchesSearch
    })
  }, [selectedCuisine, vegOnly, searchQuery])

  return (
    <section id="dining" className="py-28 px-6 md:px-12 bg-[#08080a] relative">
      <div className="max-w-7xl mx-auto">
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.32em] text-[#c5a059] mb-4">
            <Utensils className="h-3.5 w-3.5" />
            <span>Michelin Gastronomy & Artisanal Cafés</span>
          </div>
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#fbf8f3] font-light tracking-wide uppercase mb-4">
            A Table Worth Remembering
          </h2>
          <div className="w-16 h-[1px] bg-[#c5a059] mx-auto mb-6" />
          <p className="text-sm md:text-base text-[#e8e2d8]/70 font-sans font-light tracking-wide">
            From three-Michelin-star French institutions and private Hinoki omakase counters to pure vegetarian gourmet and Parisian sidewalk boulangeries.
          </p>
        </div>

        {/* Filters & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-14 pb-6 border-b border-white/10">
          {/* Cuisine Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {cuisines.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setSelectedCuisine(c)
                  setVisibleCount(4)
                }}
                className={`px-4 py-2 rounded-full text-[11px] font-sans tracking-[0.2em] uppercase transition-all duration-300 whitespace-nowrap ${
                  selectedCuisine === c
                    ? 'bg-[#c5a059] text-[#0a0a0c] font-semibold shadow-md shadow-[#c5a059]/30'
                    : 'bg-white/[0.03] text-[#e8e2d8]/70 hover:bg-white/[0.08] hover:text-[#fbf8f3] border border-white/5'
                }`}
              >
                {c === 'ALL' ? 'All Cuisines' : c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            {/* Vegetarian Toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-sans text-[#e8e2d8]/80 whitespace-nowrap">
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
                className="rounded accent-[#c5a059] h-4 w-4"
              />
              <span className="text-emerald-400 font-medium">100% Pure Veg Menus</span>
            </label>

            {/* Search Input */}
            <div className="relative w-48 sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#e8e2d8]/40" />
              <input
                type="text"
                placeholder="Search dish or cuisine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 focus:border-[#c5a059] focus:outline-none text-xs text-[#fbf8f3] placeholder-[#e8e2d8]/40 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Restaurant Cards Showcase */}
        {filteredRestaurants.length > 0 ? (
          <div className="space-y-12">
            {filteredRestaurants.slice(0, visibleCount).map((res) => (
              <div
                key={res.id}
                className="group rounded-3xl bg-[#0f0e15] border border-white/10 hover:border-[#c5a059]/40 overflow-hidden transition-all duration-700 grid grid-cols-1 lg:grid-cols-12 shadow-2xl"
              >
                {/* Left Photography (7 cols) */}
                <div className="lg:col-span-7 relative h-80 lg:h-[480px] overflow-hidden">
                  <Image
                    src={res.image || '/aurelia/dining.jpg'}
                    alt={res.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                    onError={(e) => {
                      e.currentTarget.src = '/aurelia/dining.jpg'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0e15] via-transparent to-black/20 lg:hidden" />
                  
                  {/* Category & Veg Badge */}
                  <div className="absolute top-6 left-6 flex items-center gap-2">
                    <span className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-sans uppercase tracking-[0.25em] text-[#e6ca85]">
                      {res.cuisine}
                    </span>
                    {res.vegetarianFriendly && (
                      <span className="px-3 py-1.5 rounded-full bg-emerald-500/80 backdrop-blur-md text-[9px] font-sans uppercase tracking-wider text-white font-semibold">
                        Pure Veg Friendly
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Editorial Info & Booking (5 cols) */}
                <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-sans text-[#c5a059] mb-2 tracking-widest uppercase">
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-[#c5a059]" />
                        {res.rating} ({res.reviewCount} Reviews) · {res.price}
                      </span>
                      <span>{res.floor}</span>
                    </div>

                    <h3 className="font-serif text-3xl lg:text-4xl text-[#fbf8f3] font-light tracking-wide mb-3">
                      {res.name}
                    </h3>

                    <p className="text-xs font-sans font-medium text-[#e6ca85] tracking-wide mb-4">
                      {res.chef} · {res.hours}
                    </p>

                    <p className="text-xs lg:text-sm text-[#e8e2d8]/70 font-sans font-light leading-relaxed mb-6">
                      {res.description}
                    </p>

                    {/* Signature Dish Highlights */}
                    {res.signatureDishes && res.signatureDishes.length > 0 && (
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 mb-8">
                        <span className="text-[10px] font-sans uppercase tracking-widest text-[#c5a059] block">
                          Chef Signature Special
                        </span>
                        <div className="flex justify-between items-baseline">
                          <div className="text-xs font-serif text-[#fbf8f3]">
                            {res.signatureDishes[0]?.name}
                          </div>
                          <div className="text-xs font-sans text-[#e6ca85] font-semibold">
                            {res.signatureDishes[0]?.price}
                          </div>
                        </div>
                        <div className="text-[11px] text-[#e8e2d8]/60 font-sans">
                          {res.signatureDishes[0]?.desc}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Reservation CTA Button */}
                  <div>
                    <button
                      onClick={() => onReserveTable(res)}
                      className="w-full py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#9a7837] text-[#0a0a0c] text-xs font-sans uppercase tracking-[0.25em] font-bold hover:shadow-[0_0_25px_rgba(197,160,89,0.5)] transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Reserve a Table</span>
                    </button>
                    <p className="text-center text-[10px] text-[#e8e2d8]/50 font-sans mt-2">
                      Priority seating guaranteed for Black Member Gor Kishan
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#e8e2d8]/50 text-sm font-sans bg-white/[0.01] rounded-3xl border border-white/5">
            No restaurants found matching your criteria. Try deselecting filters.
          </div>
        )}

        {/* Load More Restaurants Button */}
        {filteredRestaurants.length > visibleCount && (
          <div className="text-center mt-14">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-8 py-3.5 rounded-full border border-white/20 bg-white/5 hover:border-[#c5a059] hover:bg-[#c5a059]/15 text-xs font-sans uppercase tracking-[0.24em] text-[#fbf8f3] transition-all"
            >
              View All Restaurants ({filteredRestaurants.length - visibleCount} more)
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
