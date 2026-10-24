'use client'

import React, { useState } from 'react'
import {
  ShoppingBag,
  Sparkles,
  Utensils,
  Laptop,
  Heart,
  Gamepad2,
  Gem,
  Store,
} from 'lucide-react'

interface ImageWithFallbackProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null
  alt: string
  category?: string
  className?: string
  fallbackText?: string
}

export function ImageWithFallback({
  src,
  alt,
  category = 'GENERAL',
  className = '',
  fallbackText,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const getCategoryIcon = (cat: string) => {
    const c = cat.toUpperCase()
    if (c.includes('FASHION') || c.includes('CLOTH')) return <ShoppingBag className="h-6 w-6 text-[#c5a059]" />
    if (c.includes('ELEC') || c.includes('TECH')) return <Laptop className="h-6 w-6 text-[#60a5fa]" />
    if (c.includes('BEAUTY') || c.includes('COSMETIC')) return <Heart className="h-6 w-6 text-[#f472b6]" />
    if (c.includes('JEWEL') || c.includes('LUX')) return <Gem className="h-6 w-6 text-[#f5d77f]" />
    if (c.includes('DIN') || c.includes('FOOD') || c.includes('CAFE')) return <Utensils className="h-6 w-6 text-[#fb7185]" />
    if (c.includes('ENTERTAIN') || c.includes('GAME') || c.includes('PLAY') || c.includes('KID') || c.includes('TOY')) return <Gamepad2 className="h-6 w-6 text-[#a855f7]" />
    return <Store className="h-6 w-6 text-[#c5a059]" />
  }

  // If source is missing or an error occurred during loading, render luxury placeholder
  if (!src || hasError) {
    return (
      <div
        className={`bg-gradient-to-br from-[#121118] via-[#0d0c12] to-[#07070a] border border-white/10 flex flex-col items-center justify-center p-3 text-center select-none ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2 shadow-inner">
          {getCategoryIcon(category)}
        </div>
        <span className="text-[10px] font-serif text-[#fbf8f3] font-medium tracking-wide line-clamp-1 max-w-full px-1">
          {fallbackText || alt || 'Aurelia Collection'}
        </span>
        <span className="text-[8px] font-sans text-white/40 uppercase tracking-widest mt-0.5">
          {category || 'Luxury'}
        </span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#0d0c12] animate-pulse flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-[#c5a059]/40 animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true)
          setIsLoading(false)
        }}
        loading="lazy"
        {...props}
      />
    </div>
  )
}
