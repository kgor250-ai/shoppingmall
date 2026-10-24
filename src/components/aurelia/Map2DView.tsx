import React, { useMemo } from 'react'
import { Store3DData, NavigationRoute } from '@/data/mall3dData'

interface Map2DViewProps {
  selectedFloor: string
  combinedStores: Store3DData[]
  dbFloors: any[]
  selectedStore: Store3DData | null
  onSelectStore: (store: Store3DData) => void
  currentRoute: NavigationRoute | null
  startLandmarkId: string
}

export function Map2DView({
  selectedFloor,
  combinedStores,
  dbFloors,
  selectedStore,
  onSelectStore,
  currentRoute,
  startLandmarkId,
}: Map2DViewProps) {
  const mapWidth = 1000
  const mapHeight = 800

  const floorStores = useMemo(() => {
    return combinedStores.filter(s => s.floorId === selectedFloor)
  }, [combinedStores, selectedFloor])

  // Get color based on category but adapted for dark theme
  const getCategoryColor = (category: string) => {
    switch(category.toUpperCase()) {
      case 'FASHION': return { fill: 'rgba(230,202,133,0.15)', stroke: 'rgba(230,202,133,0.5)', text: '#e6ca85' } // Gold variant
      case 'JEWELLERY': return { fill: 'rgba(255,255,255,0.05)', stroke: 'rgba(255,255,255,0.3)', text: '#ffffff' } // White/Silver
      case 'DINING': return { fill: 'rgba(212,175,55,0.1)', stroke: 'rgba(212,175,55,0.3)', text: '#d4af37' } // Darker gold
      case 'ELECTRONICS': return { fill: 'rgba(255,255,255,0.02)', stroke: 'rgba(255,255,255,0.15)', text: '#e8e2d8' } // Off-white
      case 'BEAUTY': return { fill: 'rgba(197,160,89,0.1)', stroke: 'rgba(197,160,89,0.4)', text: '#c5a059' } // Main gold
      default: return { fill: 'rgba(255,255,255,0.02)', stroke: 'rgba(255,255,255,0.1)', text: '#8c8c8c' } 
    }
  }

  return (
    <div className="w-full h-full bg-transparent rounded-xl relative flex items-center justify-center overflow-hidden">
      <svg
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        className="w-full h-full max-h-[700px] object-contain p-4"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Map Base Outline */}
        <rect
          x="0" y="0" width={mapWidth} height={mapHeight}
          rx="30" fill="#0d0c12" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="2"
        />
        
        {/* Mall Corridors (Dark inner path) */}
        <path 
          d="M 200 200 L 800 200 L 800 600 L 200 600 Z" 
          fill="none" stroke="#16151c" strokeWidth="120" strokeLinejoin="round" 
        />

        {/* Central Atrium */}
        <circle cx={mapWidth/2} cy={mapHeight/2} r="140" fill="#0d0c12" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="2" />
        <circle cx={mapWidth/2} cy={mapHeight/2} r="80" fill="#16151c" stroke="#c5a059" strokeOpacity="0.3" strokeWidth="1" />
        <text x={mapWidth/2} y={mapHeight/2} textAnchor="middle" alignmentBaseline="middle" fill="#c5a059" fontSize="14" letterSpacing="2" fontWeight="light" fontFamily="serif">CENTRAL ATRIUM</text>
        
        {/* Entrances / Exits / Facilities */}
        <rect x="50" y={mapHeight/2 - 40} width="60" height="80" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" />
        <text x="80" y={mapHeight/2} textAnchor="middle" alignmentBaseline="middle" fill="#8c8c8c" fontSize="11" letterSpacing="1">EXIT</text>

        <rect x={mapWidth - 110} y={mapHeight/2 - 40} width="60" height="80" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" />
        <text x={mapWidth - 80} y={mapHeight/2} textAnchor="middle" alignmentBaseline="middle" fill="#8c8c8c" fontSize="11" letterSpacing="1">ENTRY</text>

        {/* Render Stores */}
        {floorStores.map((store, i) => {
          const colors = getCategoryColor(store.category)
          const isSelected = selectedStore?.id === store.id

          const wingOffset = store.wing.includes('North') ? { x: 300, y: 100 } :
                             store.wing.includes('South') ? { x: 300, y: 700 } :
                             store.wing.includes('East') ? { x: 800, y: 300 } :
                             store.wing.includes('West') ? { x: 200, y: 300 } : { x: 500, y: 300 }
          
          const x = wingOffset.x + (i % 3) * 140 - 100
          const y = wingOffset.y + (Math.floor(i / 3) * 100) - 50

          const w = 120
          const h = 90

          return (
            <g 
              key={store.id} 
              transform={`translate(${x}, ${y})`}
              onClick={() => onSelectStore(store)}
              className="cursor-pointer"
            >
              <rect
                width={w} height={h} rx="6"
                fill={isSelected ? 'rgba(197,160,89,0.2)' : colors.fill}
                stroke={isSelected ? '#c5a059' : colors.stroke}
                strokeWidth={isSelected ? '2' : '1'}
                className="transition-all duration-300 hover:opacity-80"
              />
              <text x="10" y="22" fill={colors.text} fontSize="10" letterSpacing="1">{store.shopNumber}</text>
              <text x={w/2} y={h/2 + 5} textAnchor="middle" fill="#fbf8f3" fontSize="14" fontFamily="serif" letterSpacing="1">{store.name.split(' ')[0]}</text>
              <text x={w/2} y={h/2 + 25} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9" letterSpacing="2" style={{ textTransform: 'uppercase' }}>{store.category}</text>
              
              {isSelected && (
                <g transform={`translate(${w/2}, -20)`}>
                   <path d="M 0 0 L -10 -15 A 15 15 0 1 1 10 -15 Z" fill="#c5a059" />
                   <circle cx="0" cy="-18" r="4" fill="#0a0a0c" />
                </g>
              )}
            </g>
          )
        })}

        {/* Route Line (Gold Dotted) */}
        {currentRoute && selectedStore && (
          <path
            d={`M 110 ${mapHeight/2} Q 300 ${mapHeight/2} 500 500 Q 600 600 800 300`} 
            fill="none" stroke="#c5a059" strokeWidth="4" strokeDasharray="8 6" strokeLinecap="round"
            className="animate-[dash_1.5s_linear_infinite]"
          />
        )}
        
        {/* User Start Marker */}
        {currentRoute && (
          <g transform={`translate(110, ${mapHeight/2})`}>
            <circle cx="0" cy="0" r="12" fill="rgba(197,160,89,0.3)" />
            <circle cx="0" cy="0" r="5" fill="#c5a059" />
          </g>
        )}
      </svg>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to { stroke-dashoffset: -28; }
        }
      `}} />
    </div>
  )
}
