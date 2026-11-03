'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  X,
  Calendar,
  Clock,
  Users,
  Utensils,
  MapPin,
  CheckCircle2,
  Sparkles,
  QrCode,
  Edit3,
  Trash2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'
import { DiningReservation } from '@/data/diningReservations'

interface ConfirmedReservationsModalProps {
  isOpen: boolean
  onClose: () => void
  reservations: DiningReservation[]
  onEditReservation: (reservation: DiningReservation) => void
  onCancelReservation: (reservationId: string) => void
  onBrowseDining: () => void
}

export function ConfirmedReservationsModal({
  isOpen,
  onClose,
  reservations,
  onEditReservation,
  onCancelReservation,
  onBrowseDining,
}: ConfirmedReservationsModalProps) {
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  if (!isOpen) return null

  const activeReservations = reservations.filter((r) => r.status === 'CONFIRMED')
  const cancelledReservations = reservations.filter((r) => r.status === 'CANCELLED')

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code)
    setCopiedToken(code)
    setTimeout(() => setCopiedToken(null), 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/85 backdrop-blur-2xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0c0b11] border border-[#c5a059]/40 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_35px_-5px_rgba(212,175,55,0.2)] p-5 sm:p-7 md:p-9 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#fae8c8] to-transparent opacity-80" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors z-20 cursor-pointer"
          aria-label="Close Reservations"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="pb-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2 text-[11px] font-sans uppercase tracking-[0.28em] text-[#c5a059] mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AURELIA Haute Gastronomy</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#fbf8f3] tracking-wide">
            Confirmed Dining Reservations
          </h2>
          <p className="text-xs text-[#e8e2d8]/65 font-sans mt-1">
            Your active table reservations and private culinary experiences across AURELIA.
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto custom-dark-scrollbar flex-1 py-5 space-y-6">
          {activeReservations.length === 0 ? (
            /* Empty State */
            <div className="py-12 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center text-[#c5a059]">
                <Utensils className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-[#fbf8f3]">No Active Reservations</h3>
                <p className="text-xs text-[#e8e2d8]/60 font-sans max-w-sm mx-auto mt-1">
                  You currently have no confirmed dining reservations. Explore our Michelin-starred and signature culinary venues to reserve your table.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose()
                  onBrowseDining()
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#9a7837] text-stone-950 text-xs font-sans font-bold uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer shadow-lg"
              >
                <span>Explore Dining Venues</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            /* List of Active Reservations */
            <div className="space-y-6">
              {activeReservations.map((res) => (
                <div
                  key={res.id}
                  className="rounded-3xl bg-gradient-to-br from-[#161420] via-[#110f17] to-[#0c0a10] border border-[#c5a059]/40 p-5 sm:p-7 relative overflow-hidden shadow-xl"
                >
                  {/* Digital Boarding Pass Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-sans font-bold tracking-widest uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>TABLE CONFIRMED</span>
                      </span>
                      <span className="text-[11px] font-mono text-[#c5a059] tracking-wider font-semibold">
                        {res.reservationCode}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyCode(res.reservationCode)}
                      className="text-[11px] font-sans text-stone-400 hover:text-[#e6ca85] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <QrCode className="h-3.5 w-3.5 text-[#c5a059]" />
                      <span>{copiedToken === res.reservationCode ? 'Pass Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>

                  {/* Main Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
                    {/* Restaurant Info */}
                    <div className="md:col-span-2 space-y-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-[#c5a059] font-sans font-medium">
                          {res.restaurantCuisine}
                        </div>
                        <h3 className="font-serif text-2xl sm:text-3xl text-[#fbf8f3] tracking-wide mt-0.5">
                          {res.restaurantName}
                        </h3>
                        <p className="text-xs text-[#e8e2d8]/70 font-sans mt-0.5 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[#c5a059] flex-shrink-0" />
                          <span>{res.restaurantFloor}</span>
                        </p>
                        <p className="text-[11px] text-[#c5a059]/90 font-serif italic mt-0.5">
                          {res.restaurantChef}
                        </p>
                      </div>

                      {/* Reservation Key Specs */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                          <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-sans">
                            Seating Time
                          </span>
                          <span className="text-sm font-semibold text-white font-mono flex items-center gap-1 mt-0.5">
                            <Clock className="h-3.5 w-3.5 text-[#c5a059]" />
                            {res.timeSlot}
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                          <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-sans">
                            Party Size
                          </span>
                          <span className="text-sm font-semibold text-white font-sans flex items-center gap-1 mt-0.5">
                            <Users className="h-3.5 w-3.5 text-[#c5a059]" />
                            {res.guests}
                          </span>
                        </div>

                        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 col-span-2 sm:col-span-1">
                          <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-sans">
                            Date
                          </span>
                          <span className="text-xs font-semibold text-[#e6ca85] font-sans flex items-center gap-1 mt-1">
                            <Calendar className="h-3.5 w-3.5 text-[#c5a059]" />
                            {res.date}
                          </span>
                        </div>
                      </div>

                      {/* Degustation Menu & Table Note */}
                      <div className="p-3.5 rounded-2xl bg-[#09080c] border border-white/5 space-y-1.5 text-xs font-sans">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-stone-400 flex items-center gap-1 text-[11px]">
                            <Utensils className="h-3 w-3 text-[#c5a059]" />
                            <span>Curated Menu:</span>
                          </span>
                          <span className="text-right text-[#fbf8f3] font-medium text-[11px]">
                            {res.dietary}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-stone-400">Table Placement:</span>
                          <span className="text-[#c5a059] font-medium">{res.tablePlacement}</span>
                        </div>

                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-stone-400">Guest of Honor:</span>
                          <span className="text-stone-300">{res.guestName} ({res.memberTier})</span>
                        </div>
                      </div>
                    </div>

                    {/* QR Pass & Actions Column */}
                    <div className="flex flex-col justify-between items-center md:items-end border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 space-y-4">
                      {/* Stylized Digital Pass Token Box */}
                      <div className="w-full text-center p-4 rounded-2xl bg-[#0a090e] border border-[#c5a059]/30">
                        <div className="text-[9px] uppercase tracking-widest text-[#c5a059] font-sans">
                          VIP Digital Pass
                        </div>
                        <div className="font-mono text-xl text-[#fbf8f3] font-bold tracking-widest my-1">
                          {res.reservationCode}
                        </div>
                        <div className="text-[10px] text-emerald-400 flex items-center justify-center gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          <span>Maître d&apos; Notified</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="w-full space-y-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => onEditReservation(res)}
                          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#9a7837] text-[#0a0a0c] text-xs font-sans uppercase tracking-wider font-bold hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Update Reservation</span>
                        </button>

                        {/* Cancel Button */}
                        {cancellingId === res.id ? (
                          <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-center space-y-2">
                            <p className="text-[11px] text-rose-300">Confirm cancellation?</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  onCancelReservation(res.id)
                                  setCancellingId(null)
                                }}
                                className="flex-1 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-semibold hover:bg-rose-700 transition-colors"
                              >
                                Yes, Cancel
                              </button>
                              <button
                                onClick={() => setCancellingId(null)}
                                className="flex-1 py-1 rounded-lg bg-white/10 text-stone-300 text-[11px] hover:bg-white/20 transition-colors"
                              >
                                Keep
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setCancellingId(res.id)}
                            className="w-full py-2 px-3 rounded-xl border border-white/10 text-stone-400 hover:text-rose-400 hover:border-rose-500/30 text-xs font-sans transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Cancel Reservation</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cancelled History (if any) */}
          {cancelledReservations.length > 0 && (
            <div className="pt-4 border-t border-white/10">
              <span className="text-[10px] font-sans uppercase tracking-widest text-stone-500 block mb-3">
                Cancelled History ({cancelledReservations.length})
              </span>
              <div className="space-y-2">
                {cancelledReservations.map((cr) => (
                  <div
                    key={cr.id}
                    className="p-3 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between text-xs text-stone-500"
                  >
                    <div>
                      <span className="text-stone-300 font-medium">{cr.restaurantName}</span>
                      <span className="mx-2">·</span>
                      <span>{cr.date} at {cr.timeSlot}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-rose-400/80">
                      Cancelled
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <button
            onClick={() => {
              onClose()
              onBrowseDining()
            }}
            className="text-xs text-[#c5a059] hover:underline flex items-center gap-1 cursor-pointer order-2 sm:order-1"
          >
            <span>Reserve Another Restaurant Table</span>
            <ChevronRight className="h-3 w-3" />
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-white/20 text-xs font-sans uppercase tracking-widest text-[#fbf8f3] hover:border-[#c5a059] transition-all cursor-pointer order-1 sm:order-2"
          >
            Close Pass
          </button>
        </div>
      </div>
    </div>
  )
}

