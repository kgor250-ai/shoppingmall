'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Movie } from '@/data/types'
import {
  X,
  Clock,
  Star,
  Film,
  Sparkles,
  CheckCircle,
  Ticket,
  Calendar,
  Users,
  Shield,
  QrCode,
} from 'lucide-react'

interface CinemaBookingModalProps {
  movie: Movie | null
  onClose: () => void
}

export function CinemaBookingModal({ movie, onClose }: CinemaBookingModalProps) {
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedTier, setSelectedTier] = useState('Insignia VIP Recliner (₹650)')
  const [ticketCount, setTicketCount] = useState(2)
  const [confirmed, setConfirmed] = useState(false)
  const [ticketCode, setTicketCode] = useState('')

  if (!movie) return null

  const currentTime = selectedTime || movie.showtimes[0] || '06:30 PM'

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault()
    setTicketCode('PVR-' + Math.floor(100000 + Math.random() * 900000))
    setConfirmed(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0c0b11] border border-[#c5a059]/40 shadow-2xl p-6 md:p-10 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {!confirmed ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.28em] text-[#c5a059] mb-2">
              <Film className="h-3.5 w-3.5" />
              <span>Cinema Box Office · PVR INOX Insignia</span>
            </div>

            <h3 className="font-serif text-3xl md:text-4xl text-[#fbf8f3] tracking-wide mb-1">
              {movie.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#e8e2d8]/60 font-sans mb-6">
              <span>{movie.genre}</span>
              <span>·</span>
              <span>{movie.language}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-[#e6ca85]">
                <Clock className="h-3 w-3" />
                {movie.duration}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-[#e6ca85]">
                <Star className="h-3 w-3 fill-[#e6ca85]" />
                {movie.rating} IMDb
              </span>
            </div>

            <form onSubmit={handleBooking} className="space-y-6">
              {/* Screen Info */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-sans flex items-center justify-between text-[#e8e2d8]">
                <span>Screen: <strong className="text-[#fbf8f3]">{movie.screen}</strong></span>
                <span className="text-[#c5a059] font-medium">{movie.availableSeats} Seats Available</span>
              </div>

              {/* Showtimes Selection */}
              <div>
                <label className="text-xs font-sans uppercase tracking-widest text-[#e8e2d8]/80 block mb-2">
                  Select Showtime (Today)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {movie.showtimes.map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setSelectedTime(st)}
                      className={`py-3 rounded-xl text-xs font-sans transition-all ${
                        currentTime === st
                          ? 'bg-[#c5a059] text-[#0a0a0c] font-bold shadow-md shadow-[#c5a059]/30'
                          : 'bg-white/[0.03] text-[#e8e2d8]/70 hover:bg-white/[0.08] border border-white/5'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seating Tier */}
              <div>
                <label className="text-xs font-sans uppercase tracking-widest text-[#e8e2d8]/80 block mb-2">
                  Seating Experience Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    'Insignia VIP Recliner (₹650)',
                    'Club Balcony (₹450)',
                    'Classic Premiere (₹300)',
                  ].map((tier) => (
                    <button
                      type="button"
                      key={tier}
                      onClick={() => setSelectedTier(tier)}
                      className={`p-3 rounded-xl text-left text-xs font-sans transition-all border ${
                        selectedTier === tier
                          ? 'bg-[#c5a059]/15 border-[#c5a059] text-[#fbf8f3]'
                          : 'bg-white/[0.02] border-white/5 text-[#e8e2d8]/70 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="font-medium text-[#fbf8f3]">{tier.split('(')[0]}</div>
                      <div className="text-[10px] text-[#c5a059] mt-0.5">({tier.split('(')[1]}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Tickets */}
              <div>
                <label className="text-xs font-sans uppercase tracking-widest text-[#e8e2d8]/80 block mb-2">
                  Number of Tickets
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 6].map((count) => (
                    <button
                      type="button"
                      key={count}
                      onClick={() => setTicketCount(count)}
                      className={`h-10 w-12 rounded-xl text-xs font-sans font-semibold transition-all ${
                        ticketCount === count
                          ? 'bg-[#c5a059] text-[#0a0a0c]'
                          : 'bg-white/[0.03] text-[#e8e2d8]/70 hover:bg-white/[0.08] border border-white/5'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs font-sans space-y-1.5 text-[#e8e2d8]/75">
                <div className="flex justify-between">
                  <span>Guest Patron</span>
                  <span className="text-[#fbf8f3] font-medium">Gor Kishan (Black Member #8921)</span>
                </div>
                <div className="flex justify-between">
                  <span>Special Cinema Privilege</span>
                  <span className="text-[#c5a059]">{movie.offers}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#9a7837] text-[#0a0a0c] text-xs font-sans uppercase tracking-[0.25em] font-bold hover:shadow-[0_0_25px_rgba(197,160,89,0.5)] transition-all flex items-center justify-center gap-2"
              >
                <Ticket className="h-4 w-4" />
                <span>Confirm VIP Booking ({ticketCount} Seats)</span>
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="text-center py-6 animate-fade-in space-y-6">
            <div className="h-16 w-16 rounded-full bg-[#c5a059]/20 border border-[#c5a059] mx-auto flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-[#e6ca85]" />
            </div>

            <div>
              <span className="text-xs font-sans uppercase tracking-[0.3em] text-[#c5a059] block mb-2">
                Tickets Confirmed
              </span>
              <h3 className="font-serif text-3xl md:text-4xl text-[#fbf8f3] tracking-wide mb-2">
                Enjoy the Film
              </h3>
              <p className="text-xs text-[#e8e2d8]/70 font-sans max-w-md mx-auto">
                Your seats for <span className="text-white font-medium">{movie.title}</span> at {currentTime} have been confirmed.
              </p>
            </div>

            {/* Pass QR Box */}
            <div className="p-6 rounded-2xl bg-[#14121b] border border-[#c5a059]/40 max-w-md mx-auto space-y-3">
              <div className="text-[10px] uppercase tracking-widest text-[#c5a059] font-sans">
                Digital Cinema Ticket Pass
              </div>
              <div className="font-mono text-2xl tracking-[0.2em] text-[#fbf8f3] font-bold">
                {ticketCode}
              </div>
              <div className="text-[11px] text-[#e8e2d8]/60 font-sans">
                {ticketCount} Seats · {movie.screen} · Level 03
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full border border-white/20 text-xs font-sans uppercase tracking-widest text-[#fbf8f3] hover:border-[#c5a059] transition-all"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
