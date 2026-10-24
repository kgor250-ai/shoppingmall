import React from 'react'

interface BrandLogoBadgeProps {
  name: string
  category?: string
  size?: 'sm' | 'md' | 'lg'
}

export function BrandLogoBadge({ name, category, size = 'md' }: BrandLogoBadgeProps) {
  const n = (name || '').toLowerCase()
  const dim = size === 'lg' ? 'w-12 h-12 text-base' : size === 'sm' ? 'w-8 h-8 text-[10px]' : 'w-10 h-10 text-xs'

  // Zara
  if (n.includes('zara')) {
    return (
      <div className={`${dim} rounded-xl bg-white text-black flex items-center justify-center font-serif font-black tracking-tighter shadow-sm border border-black/10 shrink-0 select-none`}>
        ZARA
      </div>
    )
  }

  // H&M
  if (n.includes('h&m') || n.includes('hm')) {
    return (
      <div className={`${dim} rounded-xl bg-white text-[#d11] flex items-center justify-center font-sans font-black italic tracking-tight shadow-sm border border-black/10 shrink-0 select-none`}>
        H&M
      </div>
    )
  }

  // Levi's
  if (n.includes('levi')) {
    return (
      <div className={`${dim} rounded-xl bg-[#c00] text-white flex items-center justify-center font-sans font-black tracking-tighter shadow-sm border border-white/20 shrink-0 select-none`}>
        Levi&apos;s
      </div>
    )
  }

  // Lifestyle
  if (n.includes('lifestyle')) {
    return (
      <div className={`${dim} rounded-xl bg-white text-[#111] flex items-center justify-center font-sans font-black text-[9px] tracking-tight uppercase shadow-sm border border-black/10 shrink-0 select-none`}>
        lifestyl
      </div>
    )
  }

  // Westside
  if (n.includes('westside')) {
    return (
      <div className={`${dim} rounded-xl bg-white text-[#111] flex items-center justify-center font-serif font-black tracking-tighter shadow-sm border border-black/10 shrink-0 select-none`}>
        W·S
      </div>
    )
  }

  // McDonald's
  if (n.includes('mcdonald')) {
    return (
      <div className={`${dim} rounded-xl bg-[#c00] text-[#ffc72c] flex items-center justify-center font-sans font-black text-lg shadow-sm border border-black/10 shrink-0 select-none`}>
        M
      </div>
    )
  }

  // Starbucks
  if (n.includes('starbucks')) {
    return (
      <div className={`${dim} rounded-xl bg-[#006241] text-white flex items-center justify-center font-serif text-base shadow-sm border border-black/10 shrink-0 select-none`}>
        ★
      </div>
    )
  }

  // Croma
  if (n.includes('croma')) {
    return (
      <div className={`${dim} rounded-xl bg-[#001e2b] text-[#00e5a3] flex items-center justify-center font-sans font-black text-[10px] tracking-tight shadow-sm border border-[#00e5a3]/30 shrink-0 select-none`}>
        crōma
      </div>
    )
  }

  // Apple
  if (n.includes('apple')) {
    return (
      <div className={`${dim} rounded-xl bg-white text-black flex items-center justify-center font-sans text-lg shadow-sm border border-black/10 shrink-0 select-none`}>
        
      </div>
    )
  }

  // Samsung
  if (n.includes('samsung')) {
    return (
      <div className={`${dim} rounded-xl bg-[#034ea2] text-white flex items-center justify-center font-sans font-black text-[8px] tracking-widest uppercase shadow-sm border border-white/20 shrink-0 select-none`}>
        SAMS
      </div>
    )
  }

  // Sephora
  if (n.includes('sephora')) {
    return (
      <div className={`${dim} rounded-xl bg-black text-white flex items-center justify-center font-serif font-bold text-[9px] tracking-widest uppercase shadow-sm border border-white/20 shrink-0 select-none`}>
        SEPH
      </div>
    )
  }

  // Tommy Hilfiger
  if (n.includes('tommy')) {
    return (
      <div className={`${dim} rounded-xl bg-[#001744] text-white flex items-center justify-center font-sans font-bold text-[9px] tracking-tighter uppercase shadow-sm border border-white/20 shrink-0 select-none`}>
        TOMMY
      </div>
    )
  }

  // PVR
  if (n.includes('pvr')) {
    return (
      <div className={`${dim} rounded-xl bg-black text-[#f5a623] flex items-center justify-center font-sans font-black text-xs tracking-tight shadow-sm border border-[#f5a623]/30 shrink-0 select-none`}>
        PVR
      </div>
    )
  }

  // Rolex
  if (n.includes('rolex')) {
    return (
      <div className={`${dim} rounded-xl bg-[#006039] text-[#d4af37] flex items-center justify-center font-serif font-bold text-xs shadow-sm border border-[#d4af37]/30 shrink-0 select-none`}>
        ♛
      </div>
    )
  }

  // Default fallback monogram
  return (
    <div className={`${dim} rounded-xl bg-white text-black flex items-center justify-center font-serif font-bold tracking-tight shadow-sm border border-black/10 shrink-0 select-none`}>
      {name ? name.slice(0, 2).toUpperCase() : 'AU'}
    </div>
  )
}
