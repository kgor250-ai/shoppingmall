'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  X,
  Send,
  Compass,
  Utensils,
  Gift,
  Calendar,
  Clock,
  ArrowRight,
  Shield,
  Bot,
  User,
} from 'lucide-react'

interface Message {
  id: string
  sender: 'user' | 'aura'
  text: string
  actionLabel?: string
  actionLink?: string
  time: string
}

let messageCounter = 0
function createMessageId(sender: string) {
  messageCounter += 1
  return `${sender}-${messageCounter}`
}

interface AuraConciergeModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigateMap: (target: string) => void
}

export function AuraConciergeModal({
  isOpen,
  onClose,
  onNavigateMap,
}: AuraConciergeModalProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const getTimeWord = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'morning'
    if (hour < 18) return 'afternoon'
    return 'evening'
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'aura',
      text: `${getGreeting()}, Gor Kishan. I am AURA, your personal AURELIA luxury concierge. How may I orchestrate your visit this ${getTimeWord()}? I can reserve private salon appointments, curate exclusive gifts, or guide your route through the mall.`,
      time: 'Just now',
    },
  ])
  const [inputVal, setInputVal] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal
    if (!text.trim()) return

    const userMsg: Message = {
      id: createMessageId('user'),
      sender: 'user',
      text,
      time: 'Just now',
    }

    setMessages((prev) => [...prev, userMsg])
    setInputVal('')
    setIsTyping(true)

    // Concierge AI Response Engine
    setTimeout(() => {
      let responseText = ''
      let actionLabel = undefined
      let actionLink = undefined

      const lower = text.toLowerCase()

      if (lower.includes('birthday') || lower.includes('gift') || lower.includes('5000') || lower.includes('5,000')) {
        responseText =
          'For an exquisite gift under ₹5,000, I recommend the Maison Francis Kurkdjian Scented Candle Coffret (₹4,800 at Parfumerie Row), Fossil Derrick RFID Leather Wallet (₹3,295), or the Jo Malone London Home Scenting Set (₹4,500). All include complimentary AURELIA silk gift wrapping and gold wax seal presentation.'
        actionLabel = 'Locate Beauty Row on 3D Map'
        actionLink = '#map'
      } else if (lower.includes('vegetarian') || lower.includes('dining') || lower.includes('food') || lower.includes('restaurant')) {
        responseText =
          "For exceptional vegetarian gastronomy, 'The Green Table' on Level 03 offers 100% organic pure vegetarian farm-to-fork dining, while 'The Saffron Conservatory' (Level 02) presents royal Awadhi slow-simmered dum pukht vegetarian banquets."
        actionLabel = 'View Dining Directory'
        actionLink = '#dining'
      } else if (lower.includes('iphone') || lower.includes('apple') || lower.includes('laptop') || lower.includes('electronics')) {
        responseText =
          "You will find the latest iPhone 16 Pro, M3 MacBooks, and Apple Watch Ultra 2 at the Apple Flagship (Level 01, Suite 101). For multi-brand electronics, Croma and Reliance Digital on Level 02 carry the Samsung S24 Ultra, Sony WH-1000XM5 headphones, and ROG laptops."
        actionLabel = 'Explore Electronics in Stores'
        actionLink = '#stores'
      } else if (lower.includes('sneaker') || lower.includes('nike') || lower.includes('shoes') || lower.includes('sports')) {
        responseText =
          "We have the Nike Flagship Store on Level 01 (Suite 122) featuring the Pegasus 41 and Air Max 90 with free treadmill gait analysis. Decathlon Sports on Level 02 also carries complete football, cricket, and gym gear."
        actionLabel = 'Guide Me to Level 01 Nike Flagship'
        actionLink = '#map'
      } else if (lower.includes('gold') || lower.includes('jewellery') || lower.includes('diamond') || lower.includes('ring')) {
        responseText =
          "For fine jewellery, Tanishq (Salon 102) and Malabar Gold (Suite 106) offer 22KT certified temple and bridal sets. For modern everyday diamond solitaires, CaratLane is on Suite 114, and Boucheron Paris is in Salon 104."
        actionLabel = 'Explore Jewellery Salons'
        actionLink = '#stores'
      } else if (lower.includes('movie') || lower.includes('cinema') || lower.includes('imax') || lower.includes('interstellar')) {
        responseText =
          "PVR INOX Insignia Megaplex on Level 03 is currently screening 'Interstellar' in IMAX Laser Dual 4K (11:30 AM, 2:45 PM, 6:30 PM, 9:45 PM) and 'Dune: Part Two' in Dolby Cinema Atmos. 64 seats are available for tonight."
        actionLabel = 'Book IMAX Tickets Now'
        actionLink = '#experiences'
      } else if (lower.includes('service') || lower.includes('car wash') || lower.includes('tailor') || lower.includes('salon')) {
        responseText =
          "Our premium services include: 360° Express Eco Car Spa (Level P2 Valet Bay), Urban Glow Luxury Hair Studio (Level 01 Suite 142), QuickStitch Master Tailoring (Level 02 Suite 245), and Apple Authorized Repair Clinic."
        actionLabel = 'View All Mall Services'
        actionLink = '#experiences'
      } else if (lower.includes('plan') || lower.includes('visit')) {
        responseText =
          "Here is an evening itinerary crafted for your Black Tier preferences: \n1. 18:30 — Private champagne fitting at Luxe Atelier (Level 02)\n2. 19:45 — Aperitivo & Jazz at the Grand Atrium\n3. 20:30 — Confirmed table at L'Écrin Céleste with view of the water fountains\n4. 22:00 — Chauffeur ready at P2 Valet with your vehicle ceramic washed."
        actionLabel = 'Add Itinerary to Aurelia Pass'
        actionLink = '#personalized'
      } else if (lower.includes('route') || lower.includes('zara') || lower.includes('luxe atelier') || lower.includes('direction')) {
        responseText =
          'Luxe Atelier is located on Level 02, Suite 210. From your current location at the Grand Atrium, take Central Escalator upward and proceed past Boucheron. Estimated walking time is 3 minutes (180 meters).'
        actionLabel = 'Start Glowing 3D Navigation'
        actionLink = '#map'
      } else {
        responseText =
          `Certainly, Gor Kishan. I have logged your request: "${text}". I have notified our Guest Relations desk, and your personal shopper will prepare options for your review in the Black Member Lounge.`
      }

      const auraMsg: Message = {
        id: createMessageId('aura'),
        sender: 'aura',
        text: responseText,
        actionLabel,
        actionLink,
        time: 'Just now',
      }

      setMessages((prev) => [...prev, auraMsg])
      setIsTyping(false)
    }, 1000)
  }

  const quickPrompts = [
    'Find a luxury gift under ₹5,000',
    'Show me premium vegetarian restaurants',
    'Where is Apple Flagship for iPhone 16?',
    'What movies are playing in IMAX tonight?',
    'Where can I find designer sneakers?',
    'Plan my shopping visit for tonight',
    'Find fastest route to Luxe Atelier',
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-2xl h-[680px] rounded-3xl bg-[#0d0c11] border border-[#c5a059]/40 shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden">
        {/* Concierge Header with Golden Orb Glow */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#17141f] via-[#0d0c11] to-[#1a1512]">
          <div className="flex items-center gap-4">
            {/* Glowing Orb */}
            <div className="relative flex items-center justify-center">
              <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-[#c5a059] to-[#f3e7cf] p-[1.5px] animate-pulse-gold">
                <div className="h-full w-full rounded-full bg-[#0a0a0c] flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-[#e6ca85]" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#0a0a0c]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-2xl text-[#fbf8f3] tracking-wide">
                  AURA
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#c5a059]/15 border border-[#c5a059]/30 text-[9px] font-sans tracking-widest text-[#e6ca85] uppercase">
                  Luxury AI Concierge
                </span>
              </div>
              <p className="text-[11px] font-sans text-[#e8e2d8]/60 mt-0.5">
                Your personal AURELIA concierge · Black Tier Priority
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-dark-scrollbar bg-[#0a090e]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'aura' && (
                <div className="h-7 w-7 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="h-3.5 w-3.5 text-[#e6ca85]" />
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl p-4 text-sm font-sans leading-relaxed tracking-wide ${
                  m.sender === 'user'
                    ? 'bg-gradient-to-r from-[#c5a059] to-[#d4af37] text-[#0a0a0c] font-medium rounded-tr-none'
                    : 'bg-[#15131b] border border-white/10 text-[#fbf8f3] font-light rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {m.actionLabel && (
                  <button
                    onClick={() => {
                      onClose()
                      if (m.actionLink) {
                        window.location.hash = m.actionLink
                      }
                    }}
                    className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 text-[#e6ca85] text-xs font-sans font-medium hover:bg-[#c5a059]/30 transition-colors"
                  >
                    <span>{m.actionLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="h-7 w-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 text-[11px] font-serif text-white mt-1">
                  H
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center text-xs text-[#e8e2d8]/50 font-sans italic">
              <div className="h-7 w-7 rounded-full bg-[#c5a059]/20 border border-[#c5a059]/40 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-3.5 w-3.5 text-[#e6ca85] animate-spin" />
              </div>
              <span>AURA is consulting the luxury database...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions Pills */}
        <div className="px-6 py-2.5 bg-[#0e0d14] border-t border-white/5 overflow-x-auto flex gap-2 scrollbar-none">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1 rounded-full bg-white/[0.04] hover:bg-[#c5a059]/20 border border-white/10 hover:border-[#c5a059]/40 text-[11px] font-sans tracking-wide text-[#e8e2d8]/75 hover:text-[#fbf8f3] whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-[#111017] border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask AURA anything (e.g. Find route, reserve table, gift ideas)..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-white/[0.04] border border-white/10 rounded-full px-5 py-3 text-sm text-[#fbf8f3] placeholder-[#e8e2d8]/40 focus:outline-none focus:border-[#c5a059] font-sans tracking-wide"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="h-11 w-11 rounded-full bg-[#c5a059] text-[#0a0a0c] flex items-center justify-center hover:bg-[#e6ca85] disabled:opacity-40 transition-colors flex-shrink-0"
              aria-label="Send query"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
