import React from 'react'

export function AureliaMonogram({ className = 'h-8 w-8', withText = false }: { className?: string; withText?: boolean }) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer select-none">
      <div className={`relative flex items-center justify-center ${className}`}>
        {/* Subtle glowing halo */}
        <div className="absolute inset-0 rounded-full bg-[#c5a059]/10 blur-sm group-hover:bg-[#c5a059]/25 transition-all duration-700" />
        
        {/* Monogram SVG */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 transition-transform duration-700 group-hover:scale-105"
        >
          {/* Outer Octagonal / Architectural Luxury Border */}
          <circle
            cx="50"
            cy="50"
            r="46"
            stroke="url(#aureliaGoldGrad)"
            strokeWidth="1.2"
            strokeDasharray="4 2"
            opacity="0.6"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="#c5a059"
            strokeWidth="0.8"
            opacity="0.8"
          />

          {/* Central Architectural A Monogram */}
          {/* Left Stem */}
          <path
            d="M 28 76 L 47 24 L 53 24 L 72 76 L 64 76 L 58.5 61 L 41.5 61 L 36 76 Z"
            fill="url(#aureliaGoldFill)"
          />
          {/* Horizontal Golden Crossbar with Diamond Cutout */}
          <line
            x1="38"
            y1="57"
            x2="62"
            y2="57"
            stroke="#12100e"
            strokeWidth="2.5"
          />
          {/* Inner Counter Triangle */}
          <polygon
            points="50,34 43.5,52 56.5,52"
            fill="#08080a"
          />
          {/* Subtle Top Diamond Finial */}
          <polygon
            points="50,18 52,21 50,24 48,21"
            fill="#e6ca85"
          />

          <defs>
            <linearGradient id="aureliaGoldGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f3e7cf" />
              <stop offset="50%" stopColor="#c5a059" />
              <stop offset="100%" stopColor="#8d6f30" />
            </linearGradient>
            <linearGradient id="aureliaGoldFill" x1="28" y1="24" x2="72" y2="76" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f8f1e2" />
              <stop offset="45%" stopColor="#c5a059" />
              <stop offset="100%" stopColor="#a37e36" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {withText && (
        <div className="flex flex-col">
          <span className="font-serif tracking-[0.28em] text-lg font-light text-[#fbf8f3] uppercase leading-none">
            AURELIA
          </span>
          <span className="text-[9px] tracking-[0.32em] text-[#c5a059] uppercase font-sans font-medium mt-1">
            HAUTE DESTINATION
          </span>
        </div>
      )}
    </div>
  )
}
