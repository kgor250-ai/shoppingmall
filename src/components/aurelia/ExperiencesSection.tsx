'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  ArrowRight,
  Film,
  Gamepad2,
  Wrench,
  Music,
  Star,
  Ticket,
  Users,
  Compass,
} from 'lucide-react'
import { allMovies } from '@/data/cinema'
import { allEntertainment } from '@/data/entertainment'
import { allServices } from '@/data/services'
import { Movie, Entertainment, Service } from '@/data/types'
import { CinemaBookingModal } from './CinemaBookingModal'

interface ExperienceItem {
  id: string
  title: string
  subtitle: string
  category: string
  date: string
  time: string
  location: string
  image: string
  description: string
}

const galaExperiences: ExperienceItem[] = [
  {
    id: 'midnight-jazz',
    title: 'MIDNIGHT JAZZ & VINTAGE KRUG',
    subtitle: 'An evening of live quartet music, bespoke cocktails and extraordinary company.',
    category: 'LIVE MUSIC & SALON',
    date: 'Tonight · 08 Oct 2026',
    time: '20:30 – 23:30',
    location: 'Grand Atrium Water Cascade',
    image: '/aurelia/hero.jpg',
    description:
      'Immerse yourself beneath the soaring marble arches of the Grand Atrium with the Parisian Jazz Quartet. Paired with vintage Krug Champagne and artisanal caviar canapés.',
  },
  {
    id: 'haute-couture-fall',
    title: 'HAUTE COUTURE RUNWAY 2026',
    subtitle: 'Front-row preview of the Autumn/Winter collections from Paris and Milan.',
    category: 'FASHION GALA',
    date: 'Friday · 10 Oct 2026',
    time: '19:00 Cocktails · 20:00 Runway',
    location: 'Level 02 Mezzanine Runway',
    image: '/aurelia/atelier.jpg',
    description:
      'Thirty-six international models present exclusive bespoke pieces from Saint Laurent, Luxe Atelier, and Valentino. Followed by an after-hours private boutique soiree.',
  },
  {
    id: 'art-biennale',
    title: 'SCULPTING LIGHT: CONTEMPORARY BIENNALE',
    subtitle: 'Curated monumental glass and kinetic light installations from Venice.',
    category: 'ART EXHIBITION',
    date: 'Daily through 30 Oct',
    time: '10:00 – 22:00',
    location: 'Level 03 Glasshouse Pavilion',
    image: '/aurelia/jewelry.jpg',
    description:
      'An architectural exhibition bridging contemporary spatial sculpture and illuminated obsidian crystal forms by master Venetian artisans.',
  },
]

export function ExperiencesSection() {
  const [activeTab, setActiveTab] = useState<'cinema' | 'entertainment' | 'services' | 'galas'>('cinema')
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [bookedExperience, setBookedExperience] = useState<string | null>(null)
  const [bookedService, setBookedService] = useState<string | null>(null)

  return (
    <section id="experiences" className="py-28 px-6 md:px-12 bg-[#060608] relative">
      <div className="max-w-7xl mx-auto">
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.32em] text-[#c5a059] mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Entertainment, Cinema & Services</span>
          </div>
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#fbf8f3] font-light tracking-wide uppercase mb-4">
            More Than Shopping
          </h2>
          <div className="w-16 h-[1px] bg-[#c5a059] mx-auto mb-6" />
          <p className="text-sm md:text-base text-[#e8e2d8]/70 font-sans font-light tracking-wide">
            State-of-the-art IMAX & 4DX cinema, immersive gaming zones, full-suite mall concierge services, and live symphonic galas.
          </p>
        </div>

        {/* Section Tabs Switcher */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md max-w-full pb-2 md:pb-1.5 scrollbar-none">
            {[
              { id: 'cinema', label: `Cinema & IMAX (${allMovies.length})`, icon: Film },
              { id: 'entertainment', label: `Entertainment Zones (${allEntertainment.length})`, icon: Gamepad2 },
              { id: 'services', label: `Mall Services (${allServices.length})`, icon: Wrench },
              { id: 'galas', label: 'Galas & Culture', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-2.5 rounded-full text-xs font-sans tracking-[0.18em] uppercase transition-all duration-300 font-semibold flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#c5a059] text-[#0a0a0c] shadow-lg shadow-[#c5a059]/25'
                      : 'text-[#e8e2d8]/70 hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── TAB 1: CINEMA & IMAX SHOWCASE ── */}
        {activeTab === 'cinema' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="group relative rounded-3xl bg-[#0e0d14] border border-white/10 hover:border-[#c5a059]/50 overflow-hidden transition-all duration-700 flex flex-col justify-between shadow-2xl"
                >
                  {/* Poster Image */}
                  <div className="relative h-96 w-full overflow-hidden bg-[#15131b]">
                    <Image
                      src={movie.poster}
                      alt={movie.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                      onError={(e) => {
                        e.currentTarget.src = '/aurelia/hero.jpg'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d14] via-[#0e0d14]/40 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-[#c5a059]/30 text-[9px] font-sans uppercase tracking-[0.2em] text-[#e6ca85]">
                        {movie.screen.split('·')[1] || movie.screen}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-sans text-white/90">
                        {movie.certificate}
                      </span>
                    </div>

                    {/* Bottom overlay info */}
                    <div className="absolute bottom-4 left-4 right-4 z-10">
                      <div className="flex items-center gap-2 text-[11px] font-sans text-[#c5a059] mb-1">
                        <Star className="h-3.5 w-3.5 fill-[#c5a059]" />
                        <span className="font-bold">{movie.rating}</span>
                        <span>·</span>
                        <span>{movie.duration}</span>
                        <span>·</span>
                        <span>{movie.language}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-serif text-2xl text-[#fbf8f3] font-light tracking-wide mb-1">
                        {movie.title}
                      </h3>
                      <p className="text-xs text-[#e8e2d8]/60 font-sans mb-4">
                        {movie.genre}
                      </p>

                      {/* Screen & Seats Status */}
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] font-sans flex items-center justify-between mb-4">
                        <span className="text-[#e8e2d8]/70">{movie.screen.split('·')[0]}</span>
                        <span className={`font-semibold ${
                          movie.bookingStatus === 'Selling Fast' ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {movie.availableSeats} seats left
                        </span>
                      </div>

                      {/* Showtimes Pills */}
                      <div className="mb-6">
                        <span className="text-[10px] font-sans uppercase tracking-widest text-[#c5a059] block mb-2">
                          Today&apos;s Showtimes:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {movie.showtimes.map((st, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-[10px] font-sans text-[#fbf8f3]"
                            >
                              {st}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => setSelectedMovie(movie)}
                      className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#9a7837] text-[#0a0a0c] text-xs font-sans uppercase tracking-[0.24em] font-bold hover:shadow-[0_0_20px_rgba(197,160,89,0.5)] transition-all flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                    >
                      <Ticket className="h-4 w-4" />
                      <span>BOOK NOW</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 2: ENTERTAINMENT & EXPERIENCES ── */}
        {activeTab === 'entertainment' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allEntertainment.map((ent) => (
              <div
                key={ent.id}
                className="group rounded-3xl bg-[#0f0e15] border border-white/10 hover:border-[#c5a059]/40 overflow-hidden transition-all duration-700 flex flex-col justify-between"
              >
                <div className="relative h-60 w-full overflow-hidden bg-[#161420]">
                  <Image
                    src={ent.image}
                    alt={ent.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = '/aurelia/hero.jpg'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0e15] via-transparent to-black/20" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-sans uppercase tracking-wider text-[#e6ca85]">
                    {ent.category}
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-sans text-[#c5a059] mb-1">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-[#c5a059]" />
                        {ent.rating}
                      </span>
                      <span>{ent.price}</span>
                    </div>

                    <h3 className="font-serif text-xl text-[#fbf8f3] tracking-wide mb-2">
                      {ent.name}
                    </h3>

                    <p className="text-xs text-[#e8e2d8]/65 font-sans leading-relaxed mb-4">
                      {ent.description}
                    </p>

                    <div className="text-[10px] font-sans text-[#e8e2d8]/50 space-y-1 mb-6">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#c5a059]" />
                        <span>{ent.floor} · {ent.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-[#c5a059]" />
                        <span>{ent.timing}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setBookedExperience(ent.id)}
                    className={`w-full py-3 rounded-full text-xs font-sans uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 ${
                      bookedExperience === ent.id
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-white/5 border border-white/15 text-[#fbf8f3] hover:border-[#c5a059] hover:bg-[#c5a059]/15'
                    }`}
                  >
                    {bookedExperience === ent.id ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span>Pass Reserved</span>
                      </>
                    ) : (
                      <>
                        <span>{ent.bookingStatus}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB 3: MALL SERVICES ── */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allServices.map((srv) => (
              <div
                key={srv.id}
                className="group rounded-3xl bg-[#0f0e15] border border-white/10 hover:border-[#c5a059]/40 overflow-hidden transition-all duration-700 flex flex-col justify-between"
              >
                <div className="relative h-52 w-full overflow-hidden bg-[#161420]">
                  <Image
                    src={srv.image}
                    alt={srv.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = '/aurelia/atelier.jpg'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0e15] via-transparent to-black/20" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-sans uppercase tracking-wider text-[#e6ca85]">
                    {srv.category}
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-sans text-[#c5a059] mb-1">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-[#c5a059]" />
                        {srv.rating}
                      </span>
                      <span>{srv.price}</span>
                    </div>

                    <h3 className="font-serif text-xl text-[#fbf8f3] tracking-wide mb-1">
                      {srv.name}
                    </h3>
                    <div className="text-[11px] text-[#e8e2d8]/50 font-sans mb-3">
                      Provider: {srv.provider}
                    </div>

                    <p className="text-xs text-[#e8e2d8]/70 font-sans leading-relaxed mb-4">
                      {srv.description}
                    </p>

                    <div className="text-[10px] font-sans text-[#e8e2d8]/50 space-y-1 mb-6">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#c5a059]" />
                        <span>{srv.floor}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-[#c5a059]" />
                        <span>{srv.openingHours}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setBookedService(srv.id)}
                    className={`w-full py-3 rounded-full text-xs font-sans uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 ${
                      bookedService === srv.id
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-white/5 border border-white/15 text-[#fbf8f3] hover:border-[#c5a059] hover:bg-[#c5a059]/15'
                    }`}
                  >
                    {bookedService === srv.id ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                        <span>Service Confirmed</span>
                      </>
                    ) : (
                      <>
                        <span>Request Service</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB 4: GALAS & CULTURE ── */}
        {activeTab === 'galas' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {galaExperiences.map((exp) => (
              <div
                key={exp.id}
                className="group relative rounded-3xl bg-[#0e0d14] border border-white/10 hover:border-[#c5a059]/50 overflow-hidden transition-all duration-700 flex flex-col justify-between shadow-2xl"
              >
                <div className="relative h-80 w-full overflow-hidden">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
                    onError={(e) => {
                      e.currentTarget.src = '/aurelia/hero.jpg'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0d14] via-[#0e0d14]/30 to-black/30" />
                  <div className="absolute top-5 left-5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-sans uppercase tracking-[0.25em] text-[#e6ca85]">
                    {exp.category}
                  </div>
                </div>

                <div className="p-8 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-sans text-[#c5a059] mb-2">
                      <Calendar className="h-3 w-3" />
                      <span>{exp.date}</span>
                      <span>·</span>
                      <Clock className="h-3 w-3" />
                      <span>{exp.time}</span>
                    </div>

                    <h3 className="font-serif text-2xl lg:text-3xl text-[#fbf8f3] font-light tracking-wide mb-3">
                      {exp.title}
                    </h3>

                    <p className="font-serif italic text-sm text-[#e8e2d8] mb-4">
                      “{exp.subtitle}”
                    </p>

                    <p className="text-xs text-[#e8e2d8]/65 font-sans font-light leading-relaxed mb-6">
                      {exp.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] font-sans text-[#e8e2d8]/50 mb-8">
                      <MapPin className="h-3 w-3 text-[#c5a059]" />
                      <span>{exp.location}</span>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => setBookedExperience(exp.id)}
                      className={`w-full py-3.5 rounded-full text-xs font-sans uppercase tracking-[0.22em] font-semibold transition-all flex items-center justify-center gap-2 ${
                        bookedExperience === exp.id
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-white/5 border border-white/15 text-[#fbf8f3] hover:border-[#c5a059] hover:bg-[#c5a059]/15 hover:text-[#e6ca85]'
                      }`}
                    >
                      {bookedExperience === exp.id ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                          <span>VIP Pass Reserved</span>
                        </>
                      ) : (
                        <>
                          <span>Book Experience</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cinema Booking Modal */}
      <CinemaBookingModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </section>
  )
}
