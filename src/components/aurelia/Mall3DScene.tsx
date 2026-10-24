'use client'

import React, { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Environment,
  ContactShadows,
  OrbitControls,
  useGLTF,
  Html,
  Float,
} from '@react-three/drei'
import * as THREE from 'three'
import {
  Store3DData,
  mall3DStores,
  FLOOR_ELEVATIONS,
  FLOOR_METADATA,
  calculateMallRoute,
  NavigationRoute,
} from '@/data/mall3dData'
import { StoreInteriorScene } from './StoreInteriorScene'
import { PremiumMallModel } from './PremiumMallModel'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

export interface Mall3DSceneProps {
  selectedFloor: string
  selectedStore: Store3DData | null
  onSelectStore: (store: Store3DData) => void
  isExplodedView: boolean
  isNavigating: boolean
  startLandmarkId: string
  cameraPreset?: 'isometric' | 'top' | 'front' | 'reset'
  onResetCameraPreset?: () => void
  combinedStores?: Store3DData[]
  dbFloors?: any[]
  enteredStore?: Store3DData | null
  onExitStore?: () => void
}

// ----------------------------------------------------
// 3D MODEL INTEGRATION COMPONENT
// ----------------------------------------------------
function AureliaMallModel({
  selectedFloor,
  isExplodedView,
  selectedStore,
  onSelectStore,
  combinedStores,
  dbFloors = []
}: {
  selectedFloor: string
  isExplodedView: boolean
  selectedStore: Store3DData | null
  onSelectStore: (store: Store3DData) => void
  combinedStores?: Store3DData[]
  dbFloors?: any[]
}) {
  const { scene: rawScene } = useGLTF('/models/aurelia_mall.glb')

  // Clone scene so multiple mounts or re-renders don't corrupt the Three.js graph
  const model = useMemo(() => {
    const clone = rawScene.clone(true)
    // Enable shadows and tweak materials for luxury PBR look
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.castShadow = true
        mesh.receiveShadow = true
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial
          mat.envMapIntensity = 1.2
        }
      }
    })
    return clone
  }, [rawScene])

  // Extract floor groups for animation
  const floorGroupsRef = useRef<{
    G?: THREE.Group
    '1'?: THREE.Group
    '2'?: THREE.Group
    '3'?: THREE.Group
    roof?: THREE.Group
    circulation?: THREE.Group
    chandelier?: THREE.Group
  }>({})

  useEffect(() => {
    floorGroupsRef.current = {
      G: model.getObjectByName('Floor_G') as THREE.Group | undefined,
      '1': model.getObjectByName('Floor_1') as THREE.Group | undefined,
      '2': model.getObjectByName('Floor_2') as THREE.Group | undefined,
      '3': model.getObjectByName('Floor_3') as THREE.Group | undefined,
      roof: model.getObjectByName('Roof_Skylight_Canopy') as THREE.Group | undefined,
      circulation: model.getObjectByName('Vertical_Circulation') as THREE.Group | undefined,
      chandelier: model.getObjectByName('Atrium_Chandelier_Cascade') as THREE.Group | undefined,
    }
  }, [model])

  // Click on storefronts in 3D scene
  const handlePointerDown = (event: any) => {
    event.stopPropagation()
    let current = event.object
    while (current && current !== model) {
      if (current.userData && current.userData.isStorefront) {
        const storeId = current.userData.storeId
        const found = (combinedStores || mall3DStores).find((s) => s.id === storeId)
        if (found) {
          onSelectStore(found)
          return
        }
      }
      current = current.parent
    }
  }

  // Smooth Exploded View & Floor Highlighting Animations
  useFrame(() => {
    const floorGroups = floorGroupsRef.current
    const targetHeights = isExplodedView
      ? { G: 0, '1': 6.2, '2': 12.4, '3': 18.6, roof: 25.0 }
      : { G: 0, '1': 0, '2': 0, '3': 0, roof: 0 }

    // Animate Floor G
    if (floorGroups.G) {
      floorGroups.G.position.setY(THREE.MathUtils.lerp(
        floorGroups.G.position.y,
        targetHeights.G,
        0.08
      ))
    }

    // Animate Floor 1
    if (floorGroups['1']) {
      floorGroups['1'].position.setY(THREE.MathUtils.lerp(
        floorGroups['1'].position.y,
        targetHeights['1'],
        0.08
      ))
    }

    // Animate Floor 2
    if (floorGroups['2']) {
      floorGroups['2'].position.setY(THREE.MathUtils.lerp(
        floorGroups['2'].position.y,
        targetHeights['2'],
        0.08
      ))
    }

    // Animate Floor 3
    if (floorGroups['3']) {
      floorGroups['3'].position.setY(THREE.MathUtils.lerp(
        floorGroups['3'].position.y,
        targetHeights['3'],
        0.08
      ))
    }

    // Animate Roof
    if (floorGroups.roof) {
      floorGroups.roof.position.setY(THREE.MathUtils.lerp(
        floorGroups.roof.position.y,
        targetHeights.roof,
        0.08
      ))
      // Hide roof slightly if specific floor is selected to give clear interior view
      floorGroups.roof.visible = selectedFloor === 'ALL'
    }

    // Fade or highlight floors based on selectedFloor
    const floors: ('G' | '1' | '2' | '3')[] = ['G', '1', '2', '3']
    floors.forEach((fl) => {
      const group = floorGroups[fl]
      if (group) {
        const isTarget = selectedFloor === 'ALL' || selectedFloor === fl
        const targetOpacity = isTarget ? 1.0 : 0.2

        group.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial
              if (mat.opacity !== undefined) {
                mat.transparent = targetOpacity < 1.0
                mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1)
              }
            }
          }
        })
      }
    })

    // Hide escalators/chandelier during exploded view to avoid diagonal stretch
    if (floorGroups.circulation) {
      floorGroups.circulation.visible = !isExplodedView
    }
    if (floorGroups.chandelier) {
      floorGroups.chandelier.visible = !isExplodedView
    }
  })

  return (
    <group>
      <primitive
        object={model}
        onPointerDown={handlePointerDown}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      />
        
      {/* Procedural Floors for dbFloors not in GLB */}
      {dbFloors.filter(f => !['G', '1', '2', '3'].includes(f.code)).map((f, idx) => {
        const isTarget = selectedFloor === 'ALL' || selectedFloor === f.code
        const targetOpacity = isTarget ? 0.9 : 0.2
        const yPos = isExplodedView ? 25 + (idx + 1) * 6.2 : f.elevation || 25
        
        return (
          <group key={f.code} position={[0, yPos, 0]}>
            {/* Simple Floor Slab */}
            <mesh position={[0, -0.2, 0]} receiveShadow castShadow>
              <boxGeometry args={[48, 0.4, 48]} />
              <meshStandardMaterial color="#1a1a1a" transparent opacity={targetOpacity} metalness={0.5} roughness={0.2} />
            </mesh>
            {/* Glass Railing */}
            <mesh position={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[47, 1, 47]} />
              <meshPhysicalMaterial color="#ffffff" transmission={0.9} opacity={targetOpacity} transparent roughness={0} thickness={0.1} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// ----------------------------------------------------
// 3D STORE BEACON & INTERACTIVE PIN MARKER
// ----------------------------------------------------
function StoreBeacon({
  store,
  isSelected,
  isDimmed,
  isExplodedView,
  onClick,
}: {
  store: Store3DData
  isSelected: boolean
  isDimmed: boolean
  isExplodedView: boolean
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  // Height offset in exploded view
  const getExplodedOffset = (fId: string) => {
    if (!isExplodedView) return 0
    if (fId === 'G') return 0
    if (fId === '1') return 6.2
    if (fId === '2') return 12.4
    if (fId === '3') return 18.6
    // Custom dynamic floors
    return 24.8
  }
  const explodedOffset = getExplodedOffset(store.floorId)

  const basePos = [
    store.modelPosition[0],
    store.modelPosition[1] + explodedOffset + 1.2,
    store.modelPosition[2],
  ] as [number, number, number]

  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.rotation.y += 0.04
        meshRef.current.position.y =
          basePos[1] + Math.sin(state.clock.elapsedTime * 4) * 0.25 + 0.3
      } else {
        meshRef.current.rotation.y += 0.015
        meshRef.current.position.y =
          basePos[1] + Math.sin(state.clock.elapsedTime * 2 + store.modelPosition[0]) * 0.1
      }
    }

    if (ringRef.current && isSelected) {
      ringRef.current.rotation.z += 0.02
      const s = 1.0 + Math.sin(state.clock.elapsedTime * 4) * 0.2
      ringRef.current.scale.set(s, s, s)
    }
  })

  if (isDimmed) return null

  const categoryColor =
    store.category === 'FASHION'
      ? '#d4af37'
      : store.category === 'JEWELLERY'
      ? '#f5d77f'
      : store.category === 'ELECTRONICS'
      ? '#60a5fa'
      : store.category === 'BEAUTY'
      ? '#f472b6'
      : store.category === 'DINING'
      ? '#fb7185'
      : '#fbbf24'

  return (
    <group position={[basePos[0], basePos[1], basePos[2]]}>
      {/* 3D Floating Gem Pin */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <octahedronGeometry args={[isSelected ? 0.45 : 0.28, 0]} />
        <meshStandardMaterial
          color={categoryColor}
          emissive={categoryColor}
          emissiveIntensity={isSelected ? 2.2 : 0.8}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Gold Halo Ground Ring */}
      <mesh
        ref={ringRef}
        position={[0, -0.6, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.35, 0.48, 24]} />
        <meshBasicMaterial
          color={categoryColor}
          transparent
          opacity={isSelected ? 0.8 : 0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating Interactive Luxury HTML Card */}
      {isSelected && (
        <Html position={[0, 1.4, 0]} center className="pointer-events-none select-none">
          <div className="bg-[#0b0a0f]/95 border-2 border-[#c5a059] px-4 py-2.5 rounded-2xl text-white whitespace-nowrap shadow-[0_0_30px_rgba(197,160,89,0.5)] backdrop-blur-xl animate-fade-in flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-[#c5a059]/20 text-[#e6ca85] text-[9px] font-sans uppercase font-bold tracking-wider">
                {store.shopNumber}
              </span>
              <span className="text-[10px] text-white/60 font-sans">
                Level {store.floorId} · {store.wing}
              </span>
            </div>
            <div className="text-sm font-serif font-bold text-[#fbf8f3] tracking-wide">
              {store.name}
            </div>
            <div className="text-[10px] text-[#c5a059] font-sans font-medium mt-0.5">
              ★ {store.rating} ({store.reviewCount} reviews)
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

// ----------------------------------------------------
// 3D ANIMATED NAVIGATION PATHWAY
// ----------------------------------------------------
function AnimatedNavigationPath({
  route,
  isExplodedView,
}: {
  route: NavigationRoute | null
  isExplodedView: boolean
}) {
  const pulseOrbRef = useRef<THREE.Mesh>(null)

  // Conditional return handled gracefully below
  if (!route || route.pathPoints.length < 2 || isExplodedView) return null

  return <AnimatedNavigationPathInner route={route} />
}

function AnimatedNavigationPathInner({ route }: { route: NavigationRoute }) {
  const pulseOrbRef = useRef<THREE.Mesh>(null)

  // Build 3D curve through waypoints
  const points = route.pathPoints.map(
    (p) => new THREE.Vector3(p[0], p[1] + 0.15, p[2])
  )
  const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.2)
  const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.08, 8, false)

  // Animate light pulse travelling along the path
  useFrame((state) => {
    if (pulseOrbRef.current) {
      const t = (state.clock.elapsedTime * 0.4) % 1
      const pos = curve.getPointAt(t)
      pulseOrbRef.current.position.copy(pos)
    }
  })

  const startPt = points[0]
  const endPt = points[points.length - 1]

  return (
    <group>
      {/* Glowing Path Tube */}
      <mesh geometry={tubeGeo}>
        <meshStandardMaterial
          color="#ffd700"
          emissive="#c5a059"
          emissiveIntensity={2.5}
          transparent
          opacity={0.85}
          roughness={0.2}
        />
      </mesh>

      {/* Traveling Light Pulse Orb */}
      <mesh ref={pulseOrbRef}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Start Waypoint Beacon */}
      <group position={[startPt.x, startPt.y, startPt.z]}>
        <mesh>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 24]} />
          <meshBasicMaterial color="#60a5fa" />
        </mesh>
        <Html position={[0, 0.8, 0]} center className="pointer-events-none">
          <div className="bg-blue-900/90 border border-blue-400 text-blue-100 text-[10px] px-2.5 py-1 rounded-full shadow-lg font-sans font-bold whitespace-nowrap">
            START
          </div>
        </Html>
      </group>

      {/* Destination Beacon */}
      <group position={[endPt.x, endPt.y, endPt.z]}>
        <mesh>
          <cylinderGeometry args={[0.45, 0.45, 0.06, 24]} />
          <meshBasicMaterial color="#d4af37" />
        </mesh>
        <Html position={[0, 0.9, 0]} center className="pointer-events-none">
          <div className="bg-[#c5a059] text-[#0a0a0c] text-[10px] px-2.5 py-1 rounded-full shadow-lg font-sans font-bold whitespace-nowrap">
            DESTINATION
          </div>
        </Html>
      </group>
    </group>
  )
}

// ----------------------------------------------------
// INTELLIGENT CAMERA CONTROLLER
// ----------------------------------------------------
function CameraController({
  selectedFloor,
  selectedStore,
  isExplodedView,
  cameraPreset,
  onResetCameraPreset,
}: {
  selectedFloor: string
  selectedStore: Store3DData | null
  isExplodedView: boolean
  cameraPreset?: 'isometric' | 'top' | 'front' | 'reset'
  onResetCameraPreset?: () => void
}) {
  const { camera, controls } = useThree()
  const lastPreset = useRef<string | undefined>(undefined)

  useFrame(() => {
    if (!controls) return

    const currentTarget = (controls as any).target as THREE.Vector3
    const currentCamPos = camera.position

    // Handle explicit camera presets
    if (cameraPreset && cameraPreset !== lastPreset.current) {
      lastPreset.current = cameraPreset

      if (cameraPreset === 'top') {
        currentTarget.set(0, 8, 0)
        currentCamPos.set(0.01, 42, 0)
      } else if (cameraPreset === 'front') {
        currentTarget.set(0, 8, 0)
        currentCamPos.set(0, 14, 38)
      } else if (cameraPreset === 'isometric' || cameraPreset === 'reset') {
        currentTarget.set(0, 8, 0)
        currentCamPos.set(28, 26, 28)
      }

      camera.lookAt(currentTarget)
      ;(controls as any).update()
      if (onResetCameraPreset) onResetCameraPreset()
      return
    }

    // Determine target focus point
    let targetX = 0
    let targetY = 8.0
    let targetZ = 0
    let targetDistance = 34

    if (isExplodedView) {
      targetY = 12.0
      targetDistance = 42
    } else if (selectedStore && selectedFloor !== 'ALL') {
      // Focus on selected store
      targetX = selectedStore.modelPosition[0]
      targetY = selectedStore.modelPosition[1] + 1.2
      targetZ = selectedStore.modelPosition[2]
      targetDistance = 14
    } else if (selectedFloor !== 'ALL') {
      // Focus on specific floor
      targetY = (FLOOR_ELEVATIONS as any)[selectedFloor] ? (FLOOR_ELEVATIONS as any)[selectedFloor] + 1.2 : 25 + 1.2
      targetDistance = 22
    }

    // Smoothly interpolate target
    currentTarget.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.06)

    // Smoothly adjust camera distance while preserving angle
    const dx = currentCamPos.x - currentTarget.x
    const dz = currentCamPos.z - currentTarget.z
    const currentRadius = Math.hypot(dx, dz)
    const angle = Math.atan2(dz, dx)

    const newRadius = THREE.MathUtils.lerp(currentRadius, targetDistance, 0.05)
    const targetCamY = targetY + (isExplodedView ? 24 : selectedFloor === 'ALL' ? 22 : 12)

    camera.position.set(
      currentTarget.x + Math.cos(angle) * newRadius,
      THREE.MathUtils.lerp(currentCamPos.y, targetCamY, 0.05),
      currentTarget.z + Math.sin(angle) * newRadius
    )

    camera.lookAt(currentTarget)
    ;(controls as any).update()
  })

  return null
}

// ----------------------------------------------------
// MAIN 3D SCENE COMPONENT
// ----------------------------------------------------
export default function Mall3DScene(props: Mall3DSceneProps) {
  const {
    selectedFloor,
    selectedStore,
    onSelectStore,
    isExplodedView,
    isNavigating,
    startLandmarkId,
    cameraPreset,
    onResetCameraPreset,
    // fallback handling for legacy props
    combinedStores,
    dbFloors,
    enteredStore,
    onExitStore,
  } = props

  // Map legacy props to new typed stores if needed
  const activeStore = useMemo(() => {
    if (selectedStore) return selectedStore
    return null
  }, [selectedStore])

  const handleSelect = (store: Store3DData) => {
    onSelectStore(store)
  }

  // Active navigation route
  const activeRoute = useMemo(() => {
    if (!isNavigating || !activeStore) return null
    return calculateMallRoute(startLandmarkId, activeStore)
  }, [isNavigating, startLandmarkId, activeStore])

  const [hasWebGL, setHasWebGL] = useState(true)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (!gl) setHasWebGL(false)
    } catch {
      setHasWebGL(false)
    }
  }, [])

  if (!hasWebGL) {
    return (
      <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center p-8 bg-[#0b0a0f] text-center border border-white/10 rounded-2xl">
        <div className="text-base font-serif text-[#c5a059] mb-2 uppercase tracking-widest">
          Hardware Acceleration Notice
        </div>
        <p className="text-xs text-white/60 max-w-md font-sans">
          WebGL is not enabled in this browser window. Please enable hardware acceleration in your browser settings to explore the AURELIA 3D Architectural Model.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[520px] relative select-none">
      <Canvas
        shadows
        camera={{ position: [0, 0, 25], fov: 45, near: 0.5, far: 150 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true,
        }}
      >
        <color attach="background" args={['#08080c']} />

        {/* If enteredStore is true, render interior scene. Else, render mall */}
        {enteredStore ? (
          <StoreInteriorScene store={enteredStore} onExit={() => onExitStore && onExitStore()} />
        ) : (
          <>
            {/* Ambient & Key Architectural Lighting */}
            <ambientLight intensity={0.65} color="#fcf8f2" />

            {/* Sun Directional Key Light */}
            <directionalLight
              position={[24, 38, 20]}
              intensity={1.8}
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-camera-left={-25}
              shadow-camera-right={25}
              shadow-camera-top={25}
              shadow-camera-bottom={-25}
              shadow-bias={-0.0001}
              color="#fff8e7"
            />

            {/* Opposite Rim Light */}
            <directionalLight
              position={[-20, 24, -20]}
              intensity={0.8}
              color="#d2e3fc"
            />

            {/* Central Skylight Warm Downlight */}
            <pointLight
              position={[0, 18, 0]}
              intensity={2.8}
              color="#ffe2a3"
              distance={40}
            />

            {/* HDRI Environment for realistic gold and glass reflections */}
            <Environment preset="city" />

            <React.Suspense
              fallback={
                <Html center>
                  <div className="flex flex-col items-center gap-3 bg-[#0b0a0f]/90 border border-[#c5a059]/40 px-6 py-4 rounded-2xl backdrop-blur-md shadow-2xl">
                    <div className="h-6 w-6 border-2 border-[#c5a059] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-sans text-[#e6ca85] tracking-widest uppercase font-semibold">
                      Loading 4-Floor Architecture...
                    </span>
                  </div>
                </Html>
              }
            >
              <PremiumMallModel
                selectedFloor={selectedFloor}
                isExplodedView={isExplodedView}
                selectedStore={activeStore}
                onSelectStore={handleSelect}
                combinedStores={combinedStores}
              />

              {/* Render 3D Store Markers */}
              {(combinedStores || mall3DStores).map((store) => {
                const isFloorActive =
                  selectedFloor === 'ALL' || selectedFloor === store.floorId
                const isDimmed = !isFloorActive
                const isSelected = activeStore?.id === store.id

                return (
                  <StoreBeacon
                    key={store.id}
                    store={store}
                    isSelected={isSelected}
                    isDimmed={isDimmed}
                    isExplodedView={isExplodedView}
                    onClick={() => handleSelect(store)}
                  />
                )
              })}

              {/* Animated 3D Navigation Path */}
              <AnimatedNavigationPath
                route={activeRoute}
                isExplodedView={isExplodedView}
              />
            </React.Suspense>

            {/* Soft Contact Shadows on Floor */}
            <ContactShadows
              position={[0, -0.4, 0]}
              opacity={0.65}
              scale={55}
              blur={2.4}
              far={15}
              color="#000000"
            />

            {/* Map Camera Controls */}
            <OrbitControls
              makeDefault
              enableRotate={false}
              maxDistance={35}
              minDistance={10}
              dampingFactor={0.06}
              enablePan={true}
            />

            <CameraController
              selectedFloor={selectedFloor}
              selectedStore={activeStore}
              isExplodedView={isExplodedView}
              cameraPreset={cameraPreset}
              onResetCameraPreset={onResetCameraPreset}
            />
          </>
        )}
        
        {/* Universal Post-Processing for Premium Look */}
        <EffectComposer>
          <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
          <Vignette eskil={false} offset={0.1} darkness={0.8} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

// Preload the GLB model asset for instant rendering
useGLTF.preload('/models/aurelia_mall.glb')
