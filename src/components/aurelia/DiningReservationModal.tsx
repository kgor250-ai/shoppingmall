'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { RestaurantData } from './DiningExperience'
import { DiningReservation, saveOrUpdateReservation } from '@/data/diningReservations'
import {
  X,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  Sparkles,
  Utensils,
  Wine,
  Shield,
  ArrowRight,
  Edit3,
} from 'lucide-react'

interface DiningReservationModalProps {
  restaurant: RestaurantData | null
  initialReservation?: DiningReservation | null
  onClose: () => void
  onSaved?: (reservation: DiningReservation) => void
}

export function DiningReservationModal({
  restaurant,
  initialReservation,
  onClose,
  onSaved,
}: DiningReservationModalProps) {
  const [guests, setGuests] = useState('2 Guests')
  const [date, setDate] = useState('Today (Tonight)')
  const [timeSlot, setTimeSlot] = useState('20:00')
  const [dietary, setDietary] = useState('Grand Prestige Tasting with Rare Wine Pairing')
  const [confirmed, setConfirmed] = useState(false)
  const [reservationCode, setReservationCode] = useState('')

  const isEditing = Boolean(initialReservation)

  useEffect(() => {
    if (initialReservation) {
      setGuests(initialReservation.guests || '2 Guests')
      setDate(initialReservation.date || 'Today (Tonight)')
      setTimeSlot(initialReservation.timeSlot || '20:00')
      setDietary(initialReservation.dietary || 'Grand Prestige Tasting with Rare Wine Pairing')
      setReservationCode(initialReservation.reservationCode)
      setConfirmed(false)
    } else {
      setGuests('2 Guests')
      setDate('Today (Tonight)')
      setTimeSlot('20:00')
      setDietary('Grand Prestige Tasting with Rare Wine Pairing')
      setReservationCode('')
      setConfirmed(false)
    }
  }, [initialReservation, restaurant])

  if (!restaurant) return null

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    const code =
      initialReservation?.reservationCode ||
      'AUR-' + Math.floor(100000 + Math.random() * 900000)
    setReservationCode(code)

    const updatedRecord: DiningReservation = {
      id: initialReservation?.id || 'res-' + Date.now(),
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      restaurantFloor: restaurant.floor,
      restaurantChef: restaurant.chef,
      restaurantCuisine: restaurant.cuisine,
      restaurantImage: restaurant.image,
      guests,
      date,
      timeSlot,
      dietary,
      specialRequests:
        initialReservation?.specialRequests || 'Terrace Window overlooking Atrium',
      guestName: 'Gor Kishan',
      memberTier: 'AURELIA Black Member #8921',
      tablePlacement:
        initialReservation?.tablePlacement || 'Terrace Window overlooking Atrium',
      reservationCode: code,
      status: 'CONFIRMED',
      createdAt: initialReservation?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    saveOrUpdateReservation(updatedRecord)
    if (onSaved) onSaved(updatedRecord)
    setConfirmed(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0c0b11] border border-[#c5a059]/40 shadow-2xl p-6 md:p-10 overflow-hidden">
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#fae8c8] to-transparent opacity-80" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors z-20 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {!confirmed ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.28em] text-[#c5a059] mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isEditing ? 'Modify Reservation' : 'VIP Table Reservation'}</span>
            </div>

            <h3 className="font-serif text-3xl md:text-4xl text-[#fbf8f3] tracking-wide mb-1">
              {restaurant.name}
            </h3>
            <p className="text-xs text-[#e8e2d8]/60 font-sans mb-7">
              {restaurant.floor} · {restaurant.chef}
            </p>

            <form onSubmit={handleConfirm} className="space-y-6">
              {/* Number of Guests */}
              <div>
                <label className="text-xs font-sans uppercase tracking-widest text-[#e8e2d8]/80 block mb-2">
                  Number of Guests
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['1 Guest', '2 Guests', '4 Guests', '6+ Suite'].map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGuests(g)}
                      className={`py-3 rounded-xl text-xs font-sans transition-all cursor-pointer ${
                        guests === g
                          ? 'bg-[#c5a059] text-[#0a0a0c] font-bold shadow-md shadow-[#c5a059]/30'
                          : 'bg-white/[0.03] text-[#e8e2d8]/70 hover:bg-white/[0.08] border border-white/5'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seating Time Slots */}
              <div>
                <label className="text-xs font-sans uppercase tracking-widest text-[#e8e2d8]/80 block mb-2">
                  Seating Time
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['19:00', '19:45', '20:00', '20:30', '21:00', '21:15', '21:45', '22:00'].slice(0, 4).map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setTimeSlot(slot)}
                      className={`py-3 rounded-xl text-xs font-sans transition-all cursor-pointer ${
                        timeSlot === slot
                          ? 'bg-[#c5a059] text-[#0a0a0c] font-bold shadow-md shadow-[#c5a059]/30'
                          : 'bg-white/[0.03] text-[#e8e2d8]/70 hover:bg-white/[0.08] border border-white/5'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="text-xs font-sans uppercase tracking-widest text-[#e8e2d8]/80 block mb-2">
                  Date
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Today (Tonight)', 'Tomorrow Night', 'This Weekend'].map((d) => (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setDate(d)}
                      className={`py-2.5 rounded-xl text-xs font-sans transition-all cursor-pointer ${
                        date === d
                          ? 'bg-[#c5a059] text-[#0a0a0c] font-bold shadow-md shadow-[#c5a059]/30'
                          : 'bg-white/[0.03] text-[#e8e2d8]/70 hover:bg-white/[0.08] border border-white/5'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tasting Menu & Preferences */}
              <div>
                <label className="text-xs font-sans uppercase tracking-widest text-[#e8e2d8]/80 block mb-2">
                  Degustation & Sommelier Experience
                </label>
                <select
                  value={dietary}
                  onChange={(e) => setDietary(e.target.value)}
                  className="w-full bg-[#121018] border border-white/10 rounded-xl px-4 py-3 text-xs text-[#fbf8f3] font-sans focus:outline-none focus:border-[#c5a059] cursor-pointer"
                >
                  <option value="Grand Prestige Tasting with Rare Wine Pairing" className="bg-[#121018]">
                    Grand Prestige Tasting with Rare Wine Pairing (₹12,500 / guest)
                  </option>
                  <option value="Autumn Truffle & Blue Lobster Degustation" className="bg-[#121018]">
                    Autumn Truffle & Blue Lobster Degustation (₹9,800 / guest)
                  </option>
                  <option value="Plant-Forward Botanical Menu (Vegetarian)" className="bg-[#121018]">
                    Plant-Forward Botanical Menu (Vegetarian) (₹7,500 / guest)
                  </option>
                  <option value="Chef's Signature Omakase Counter" className="bg-[#121018]">
                    Chef&apos;s Signature Counter Degustation (₹14,000 / guest)
                  </option>
                </select>
              </div>

              {/* VIP Reservation Summary */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 text-xs font-sans space-y-1.5 text-[#e8e2d8]/75">
                <div className="flex justify-between">
                  <span>Guest of Honor</span>
                  <span className="text-[#fbf8f3] font-medium">Gor Kishan (Black Member #8921)</span>
                </div>
                <div className="flex justify-between">
                  <span>Table Placement</span>
                  <span className="text-[#c5a059]">Terrace Window overlooking Atrium</span>
                </div>
                <div className="flex justify-between">
                  <span>Cancellation Courtesy</span>
                  <span>Complimentary until 2 hours prior</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#9a7837] text-[#0a0a0c] text-xs font-sans uppercase tracking-[0.25em] font-bold hover:shadow-[0_0_25px_rgba(197,160,89,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isEditing ? (
                  <>
                    <Edit3 className="h-4 w-4" />
                    <span>Save & Update Reservation</span>
                  </>
                ) : (
                  <span>Confirm Priority Reservation</span>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation Success State */
          <div className="text-center py-6 animate-fade-in space-y-6">
            <div className="h-16 w-16 rounded-full bg-[#c5a059]/20 border border-[#c5a059] mx-auto flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-[#e6ca85]" />
            </div>

            <div>
              <span className="text-xs font-sans uppercase tracking-[0.3em] text-[#c5a059] block mb-2">
                {isEditing ? 'Reservation Updated' : 'Confirmed with Maître d’'}
              </span>
              <h3 className="font-serif text-3xl md:text-4xl text-[#fbf8f3] tracking-wide mb-2">
                {isEditing ? 'Your Table has been Updated' : 'Your Table is Reserved'}
              </h3>
              <p className="text-xs text-[#e8e2d8]/70 font-sans max-w-md mx-auto">
                We have notified Chef Laurent. Your table at <span className="text-white font-medium">{restaurant.name}</span> is confirmed for {date} at {timeSlot} ({guests}).
              </p>
            </div>

            {/* Digital Pass Voucher Box */}
            <div className="p-6 rounded-2xl bg-[#14121b] border border-[#c5a059]/40 max-w-md mx-auto space-y-3">
              <div className="text-[10px] uppercase tracking-widest text-[#c5a059] font-sans">
                VIP Reservation Token
              </div>
              <div className="font-mono text-2xl tracking-[0.2em] text-[#fbf8f3] font-bold">
                {reservationCode}
              </div>
              <div className="text-[11px] text-[#e8e2d8]/60 font-sans">
                Added automatically to your Confirmed Reservations & Digital Wallet.
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-[#c5a059] text-stone-950 font-bold text-xs font-sans uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer shadow-lg"
            >
              View Reservation Pass
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
