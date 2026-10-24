import React, { useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, MeshReflectorMaterial, Text, Float, Line } from '@react-three/drei'
import { Store3DData, FLOOR_ELEVATIONS } from '@/data/mall3dData'
import { Point3D } from '@/utils/pathfinding'

const GOLD = '#c5a059'
const GLASS = '#e8f0f8'
const PATH_COLOR = '#ffda75'

export function PremiumMallModel({
  selectedStore,
  onSelectStore,
  combinedStores = [],
  navigationPath = [],
  visibleFloor = 'ALL'
}: {
  selectedFloor: string
  isExplodedView: boolean
  selectedStore: Store3DData | null
  onSelectStore: (store: Store3DData) => void
  combinedStores?: Store3DData[]
  navigationPath?: Point3D[]
  visibleFloor?: string
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Very subtle breathing animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1 - 2
    }
  })

  // Full floor configurations including parking
  const floors = [
    { id: 'P2', y: -8, color: '#111116', name: 'Parking Level 2' },
    { id: 'P1', y: -4, color: '#111116', name: 'Parking Level 1' },
    { id: 'G', y: FLOOR_ELEVATIONS['G'], color: '#1a1a24', name: 'Ground Floor' },
    { id: '1', y: FLOOR_ELEVATIONS['1'], color: '#1a1a24', name: 'Level 1' },
    { id: '2', y: FLOOR_ELEVATIONS['2'], color: '#1a1a24', name: 'Level 2' },
    { id: '3', y: FLOOR_ELEVATIONS['3'], color: '#1a1a24', name: 'Level 3' },
  ]

  // Filter visible floors based on UI selection
  const activeFloors = floors.filter(f => visibleFloor === 'ALL' || f.id === visibleFloor)

  // Convert navigation path points to an array of [x,y,z] arrays for the Line component
  const linePoints = navigationPath.map(p => [p.x, p.y + 0.5, p.z] as [number, number, number])

  return (
    <group ref={groupRef}>
      
      {/* Draw Navigation Path Line if active */}
      {linePoints.length > 1 && (
        <Line
          points={linePoints}
          color={PATH_COLOR}
          lineWidth={4}
          dashed={false}
          toneMapped={false}
        />
      )}
      
      {/* Floor Slabs */}
      {activeFloors.map((floor) => (
        <group key={floor.id} position={[0, floor.y, 0]}>
          {/* Main Floor Slab */}
          <RoundedBox args={[38, 0.5, 26]} radius={1} smoothness={4} position={[0, -0.25, 0]} receiveShadow>
            <MeshReflectorMaterial
              blur={[300, 100]}
              resolution={1024}
              mixBlur={1}
              mixStrength={40}
              roughness={0.25}
              depthScale={1.2}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color={floor.color}
              metalness={0.6}
              mirror={0.5}
            />
          </RoundedBox>
          
          {/* Gold Trim around the floor edge */}
          <RoundedBox args={[38.2, 0.1, 26.2]} radius={1} smoothness={4} position={[0, 0, 0]}>
            <meshStandardMaterial color={GOLD} metalness={1} roughness={0.2} />
          </RoundedBox>

          {/* Floor Name Label on the edge */}
          <Text position={[-18, 0.2, 13.5]} rotation={[-Math.PI/2, 0, 0]} fontSize={0.6} color={GOLD} anchorX="left">
            {floor.name}
          </Text>

          {/* Render Parking Lines if it's a parking floor */}
          {floor.id.startsWith('P') && (
            <gridHelper args={[34, 10, '#333', '#222']} position={[0, 0.01, 0]} />
          )}
        </group>
      ))}

      {/* Central Glass Elevator Pillar (only show if ALL or multiple floors visible to avoid clipping) */}
      {visibleFloor === 'ALL' && (
        <group>
          <mesh position={[0, 4, 0]} castShadow receiveShadow>
            <boxGeometry args={[3, 26, 3]} />
            <meshPhysicalMaterial color="#0f0f15" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 4, 1.6]} castShadow>
            <boxGeometry args={[2.5, 26, 0.2]} />
            <meshPhysicalMaterial color={GLASS} transmission={0.9} transparent opacity={0.6} roughness={0.1} />
          </mesh>
        </group>
      )}

      {/* Stores */}
      {combinedStores
        .filter(store => visibleFloor === 'ALL' || store.floorId === visibleFloor)
        .map((store) => {
        const [x, y, z] = store.modelPosition || [0, 0, 0]
        const isSelected = selectedStore?.id === store.id

        return (
          <group 
            key={store.id} 
            position={[x, y + 1.25, z]} 
            onClick={(e) => { e.stopPropagation(); onSelectStore(store); }}
            onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
            onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
          >
            {/* Store Structure */}
            <RoundedBox args={[4.5, 2.5, 4.5]} radius={0.1} castShadow receiveShadow>
              <meshStandardMaterial color={isSelected ? '#222' : '#111'} metalness={0.4} roughness={0.6} />
            </RoundedBox>

            {/* Store Glass Window */}
            <mesh position={[0, 0, 2.3]} castShadow>
              <boxGeometry args={[4.2, 2.2, 0.1]} />
              <meshPhysicalMaterial color={GLASS} transmission={0.8} transparent opacity={0.5} roughness={0.1} />
            </mesh>

            {/* Hover/Select Highlight */}
            {isSelected && (
              <mesh position={[0, -1.24, 0]} rotation={[-Math.PI/2, 0, 0]}>
                <planeGeometry args={[5.5, 5.5]} />
                <meshBasicMaterial color={GOLD} transparent opacity={0.4} toneMapped={false} />
              </mesh>
            )}

            {/* Glowing Brand Name */}
            {(visibleFloor === 'ALL' || isSelected) ? (
              <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
                <Text
                  position={[0, 1.8, 2.4]}
                  fontSize={0.4}
                  color={isSelected ? '#ffffff' : GOLD}
                  anchorX="center"
                  anchorY="middle"
                  outlineWidth={0.01}
                  outlineColor="#000000"
                >
                  {store.name}
                  <meshBasicMaterial color={isSelected ? '#ffffff' : GOLD} toneMapped={false} />
                </Text>
              </Float>
            ) : null}
            
            {/* Interior Ambient Lighting */}
            {isSelected && (
              <pointLight position={[0, 0, 1]} intensity={3} color={GOLD} distance={8} />
            )}
          </group>
        )
      })}
    </group>
  )
}
