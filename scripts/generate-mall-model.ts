import * as THREE from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import fs from 'fs'
import path from 'path'

// Polyfill FileReader for Node.js environment
class PolyfillFileReader {
  result: any = null
  onloadend: any = null
  readAsArrayBuffer(blob: Blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf
      if (this.onloadend) this.onloadend()
    })
  }
}
;(globalThis as any).FileReader = PolyfillFileReader

console.log('Generating AURELIA 4-Floor Architectural 3D Mall Model...')

const scene = new THREE.Scene()
scene.name = 'AureliaMallScene'

// --- Color Palette & Materials ---
const goldMat = new THREE.MeshStandardMaterial({
  color: 0xd4af37,
  metalness: 0.85,
  roughness: 0.22,
  name: 'Mat_GoldTrim'
})

const lightGoldMat = new THREE.MeshStandardMaterial({
  color: 0xf3e5ab,
  metalness: 0.75,
  roughness: 0.3,
  name: 'Mat_LightGold'
})

const darkMarbleMat = new THREE.MeshStandardMaterial({
  color: 0x14131a,
  metalness: 0.15,
  roughness: 0.2,
  name: 'Mat_NeroMarble'
})

const terrazzoFloorMat = new THREE.MeshStandardMaterial({
  color: 0xdfd9ce,
  metalness: 0.08,
  roughness: 0.25,
  name: 'Mat_TerrazzoWalkway'
})

const atriumFloorMat = new THREE.MeshStandardMaterial({
  color: 0x1f1d27,
  metalness: 0.2,
  roughness: 0.2,
  name: 'Mat_AtriumCenterFloor'
})

const wallMat = new THREE.MeshStandardMaterial({
  color: 0xf5f2ec,
  metalness: 0.05,
  roughness: 0.6,
  name: 'Mat_WallPlaster'
})

const darkFacadeMat = new THREE.MeshStandardMaterial({
  color: 0x22202a,
  metalness: 0.3,
  roughness: 0.4,
  name: 'Mat_DarkStorefrontFacade'
})

const warmInteriorMat = new THREE.MeshStandardMaterial({
  color: 0xfff5e6,
  emissive: 0xffe2b8,
  emissiveIntensity: 0.6,
  roughness: 0.5,
  name: 'Mat_WarmBoutiqueInterior'
})

const glassMat = new THREE.MeshStandardMaterial({
  color: 0xcbe4f9,
  metalness: 0.1,
  roughness: 0.05,
  transparent: true,
  opacity: 0.35,
  name: 'Mat_ClearGlass'
})

const balustradeGlassMat = new THREE.MeshStandardMaterial({
  color: 0xd6ecfa,
  metalness: 0.1,
  roughness: 0.08,
  transparent: true,
  opacity: 0.4,
  name: 'Mat_BalustradeGlass'
})

const goldGlowMat = new THREE.MeshStandardMaterial({
  color: 0xffdf78,
  emissive: 0xffcf48,
  emissiveIntensity: 2.2,
  roughness: 0.2,
  name: 'Mat_GoldCoveLight'
})

const signGlowMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0xfff6e5,
  emissiveIntensity: 1.8,
  roughness: 0.2,
  name: 'Mat_SignLetteringGlow'
})

const escalatorTrussMat = new THREE.MeshStandardMaterial({
  color: 0x2a2833,
  metalness: 0.7,
  roughness: 0.3,
  name: 'Mat_EscalatorTruss'
})

const escalatorStepMat = new THREE.MeshStandardMaterial({
  color: 0x85808f,
  metalness: 0.8,
  roughness: 0.4,
  name: 'Mat_EscalatorSteps'
})

const plantFoliageMat = new THREE.MeshStandardMaterial({
  color: 0x245529,
  roughness: 0.7,
  name: 'Mat_PlantGreenery'
})

const plantPotMat = new THREE.MeshStandardMaterial({
  color: 0xc5a059,
  metalness: 0.8,
  roughness: 0.25,
  name: 'Mat_PlanterGoldPot'
})

const benchLeatherMat = new THREE.MeshStandardMaterial({
  color: 0x3d352e,
  roughness: 0.4,
  name: 'Mat_BenchLeather'
})

// Dimensions
const MALL_WIDTH = 38
const MALL_DEPTH = 26
const FLOOR_HEIGHT = 4.2
const ATRIUM_RADIUS_X = 9.5
const ATRIUM_RADIUS_Z = 4.8

// Helper: Create rounded rectangle shape with optional atrium hole
function createFloorShape(width: number, depth: number, radius: number, hasHole: boolean) {
  const shape = new THREE.Shape()
  const w = width, d = depth, r = radius
  shape.moveTo(-w / 2 + r, -d / 2)
  shape.lineTo(w / 2 - r, -d / 2)
  shape.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r)
  shape.lineTo(w / 2, d / 2 - r)
  shape.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2)
  shape.lineTo(-w / 2 + r, d / 2)
  shape.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r)
  shape.lineTo(-w / 2, -d / 2 + r)
  shape.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2)

  if (hasHole) {
    const hole = new THREE.Path()
    // Elliptical atrium cutout
    hole.absellipse(0, 0, ATRIUM_RADIUS_X, ATRIUM_RADIUS_Z, 0, Math.PI * 2, false, 0)
    shape.holes.push(hole)
  }

  return shape
}

// Helper: Add glass balustrades along the atrium perimeter
function createAtriumBalustrade(floorY: number) {
  const balustradeGroup = new THREE.Group()
  balustradeGroup.name = `Atrium_Balustrade_Y${floorY.toFixed(1)}`

  const segments = 48
  const handrailPoints: THREE.Vector3[] = []

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2
    const x = Math.cos(theta) * ATRIUM_RADIUS_X
    const z = Math.sin(theta) * ATRIUM_RADIUS_Z
    handrailPoints.push(new THREE.Vector3(x, floorY + 1.05, z))

    // Vertical gold stanchion posts every 2 segments
    if (i % 2 === 0) {
      const postGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.05, 8)
      const postMesh = new THREE.Mesh(postGeo, goldMat)
      postMesh.position.set(x, floorY + 0.525, z)
      balustradeGroup.add(postMesh)
    }
  }

  // Curved glass curtain panels along the ellipse
  const glassGeo = new THREE.CylinderGeometry(
    ATRIUM_RADIUS_X,
    ATRIUM_RADIUS_X,
    1.0,
    segments,
    1,
    true
  )
  // Scale along Z to form ellipse
  glassGeo.scale(1, 1, ATRIUM_RADIUS_Z / ATRIUM_RADIUS_X)
  const glassMesh = new THREE.Mesh(glassGeo, balustradeGlassMat)
  glassMesh.position.set(0, floorY + 0.52, 0)
  balustradeGroup.add(glassMesh)

  // Continuous gold top handrail
  const handrailCurve = new THREE.CatmullRomCurve3(handrailPoints, true)
  const handrailGeo = new THREE.TubeGeometry(handrailCurve, 64, 0.04, 8, true)
  const handrailMesh = new THREE.Mesh(handrailGeo, goldMat)
  balustradeGroup.add(handrailMesh)

  // Gold base shoe mounting
  const baseShoeCurve = new THREE.CatmullRomCurve3(
    handrailPoints.map(p => new THREE.Vector3(p.x, floorY + 0.04, p.z)),
    true
  )
  const baseShoeGeo = new THREE.TubeGeometry(baseShoeCurve, 64, 0.03, 8, true)
  const baseShoeMesh = new THREE.Mesh(baseShoeGeo, goldMat)
  balustradeGroup.add(baseShoeMesh)

  // Cove light rim directly beneath the balcony edge
  const coveLightCurve = new THREE.CatmullRomCurve3(
    handrailPoints.map(p => new THREE.Vector3(p.x, floorY - 0.08, p.z)),
    true
  )
  const coveLightGeo = new THREE.TubeGeometry(coveLightCurve, 64, 0.035, 8, true)
  const coveLightMesh = new THREE.Mesh(coveLightGeo, goldGlowMat)
  balustradeGroup.add(coveLightMesh)

  return balustradeGroup
}

// Helper: Create fluted column
function createFlutedColumn(x: number, z: number, yBottom: number, height: number) {
  const colGroup = new THREE.Group()
  colGroup.position.set(x, yBottom, z)

  // Column base
  const baseGeo = new THREE.BoxGeometry(0.8, 0.25, 0.8)
  const baseMesh = new THREE.Mesh(baseGeo, goldMat)
  baseMesh.position.y = 0.125
  colGroup.add(baseMesh)

  // Fluted shaft
  const shaftGeo = new THREE.CylinderGeometry(0.32, 0.35, height - 0.5, 16)
  const shaftMesh = new THREE.Mesh(shaftGeo, wallMat)
  shaftMesh.position.y = height / 2
  colGroup.add(shaftMesh)

  // Decorative Capital with gold bands
  const capGeo = new THREE.BoxGeometry(0.85, 0.25, 0.85)
  const capMesh = new THREE.Mesh(capGeo, goldMat)
  capMesh.position.y = height - 0.125
  colGroup.add(capMesh)

  // Inset gold vertical flutes
  const ringGeo = new THREE.TorusGeometry(0.36, 0.025, 8, 16)
  ringGeo.rotateX(Math.PI / 2)
  const ring1 = new THREE.Mesh(ringGeo, goldMat)
  ring1.position.y = height * 0.3
  colGroup.add(ring1)
  const ring2 = ring1.clone()
  ring2.position.y = height * 0.7
  colGroup.add(ring2)

  return colGroup
}

// Helper: Create luxury storefront unit
interface StorefrontConfig {
  id: string
  name: string
  category: string
  wing: string
  shopNumber: string
  floor: string
  x: number
  y: number
  z: number
  rotationY: number
  width?: number
}

function createStorefront(cfg: StorefrontConfig) {
  const unitGroup = new THREE.Group()
  unitGroup.name = `Store_${cfg.id}`
  unitGroup.position.set(cfg.x, cfg.y, cfg.z)
  unitGroup.rotation.y = cfg.rotationY

  // Attach metadata for 3D selection & interactions
  unitGroup.userData = {
    storeId: cfg.id,
    storeName: cfg.name,
    category: cfg.category,
    wing: cfg.wing,
    shopNumber: cfg.shopNumber,
    floor: cfg.floor,
    isStorefront: true
  }

  const w = cfg.width || 4.2
  const h = 3.4
  const d = 2.0

  // 1. Boutique Room Shell (Walls & Ceiling)
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.1), warmInteriorMat)
  backWall.position.set(0, h / 2, -d / 2)
  unitGroup.add(backWall)

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, h, d), darkFacadeMat)
  leftWall.position.set(-w / 2, h / 2, 0)
  unitGroup.add(leftWall)

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, h, d), darkFacadeMat)
  rightWall.position.set(w / 2, h / 2, 0)
  unitGroup.add(rightWall)

  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, d), darkFacadeMat)
  ceiling.position.set(0, h, 0)
  unitGroup.add(ceiling)

  // 2. Facade Frame & Architrave (Portal)
  const portalArch = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 0.6, 0.3), darkFacadeMat)
  portalArch.position.set(0, h - 0.3, d / 2)
  unitGroup.add(portalArch)

  const portalGoldTrim = new THREE.Mesh(new THREE.BoxGeometry(w + 0.24, 0.06, 0.32), goldMat)
  portalGoldTrim.position.set(0, h - 0.6, d / 2)
  unitGroup.add(portalGoldTrim)

  const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(0.4, h, 0.3), darkFacadeMat)
  leftPillar.position.set(-w / 2 + 0.2, h / 2, d / 2)
  unitGroup.add(leftPillar)

  const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(0.4, h, 0.3), darkFacadeMat)
  rightPillar.position.set(w / 2 - 0.2, h / 2, d / 2)
  unitGroup.add(rightPillar)

  // 3. Glazed Display Window (Glass)
  const glassWindow = new THREE.Mesh(new THREE.BoxGeometry(w * 0.5, h * 0.7, 0.05), glassMat)
  glassWindow.position.set(-w * 0.2, h * 0.4, d / 2)
  unitGroup.add(glassWindow)

  // 4. Store Entrance Opening (Right side)
  const doorGoldFrame = new THREE.Mesh(new THREE.BoxGeometry(w * 0.38, 0.05, 0.08), goldMat)
  doorGoldFrame.position.set(w * 0.24, h * 0.72, d / 2)
  unitGroup.add(doorGoldFrame)

  // 5. Display Pedestal & Showcase Item Inside Window
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.7, 16), goldMat)
  pedestal.position.set(-w * 0.2, 0.35, 0)
  unitGroup.add(pedestal)

  const showcaseItem = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), lightGoldMat)
  showcaseItem.position.set(-w * 0.2, 0.9, 0)
  unitGroup.add(showcaseItem)

  // 6. Signage Fascia Board with Glowing Brand Name
  const signBoard = new THREE.Mesh(new THREE.BoxGeometry(w * 0.75, 0.45, 0.08), darkMarbleMat)
  signBoard.position.set(0, h - 0.28, d / 2 + 0.16)
  unitGroup.add(signBoard)

  // Gold Sign Border
  const signBorder = new THREE.Mesh(new THREE.BoxGeometry(w * 0.78, 0.49, 0.04), goldMat)
  signBorder.position.set(0, h - 0.28, d / 2 + 0.14)
  unitGroup.add(signBorder)

  // Glowing Sign Plate (emissive representation of brand identity)
  const signPlate = new THREE.Mesh(new THREE.BoxGeometry(w * 0.65, 0.28, 0.04), signGlowMat)
  signPlate.position.set(0, h - 0.28, d / 2 + 0.2)
  unitGroup.add(signPlate)

  // Subtle Spot Downlight on the storefront entrance
  const spotMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 8), goldGlowMat)
  spotMesh.position.set(w * 0.24, h - 0.05, d / 2)
  unitGroup.add(spotMesh)

  return unitGroup
}

// Helper: Create Escalator
function createEscalator(
  x1: number, y1: number, z1: number,
  x2: number, y2: number, z2: number,
  name: string
) {
  const escGroup = new THREE.Group()
  escGroup.name = name

  const p1 = new THREE.Vector3(x1, y1, z1)
  const p2 = new THREE.Vector3(x2, y2, z2)
  const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5)
  const len = p1.distanceTo(p2)
  const dir = new THREE.Vector3().subVectors(p2, p1).normalize()

  escGroup.position.copy(mid)
  escGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)

  const width = 1.4

  // Main diagonal metallic truss
  const trussGeo = new THREE.BoxGeometry(width, len, 0.7)
  const trussMesh = new THREE.Mesh(trussGeo, escalatorTrussMat)
  escGroup.add(trussMesh)

  // Tiered step run in center
  const stepGeo = new THREE.BoxGeometry(width * 0.75, len * 0.95, 0.3)
  const stepMesh = new THREE.Mesh(stepGeo, escalatorStepMat)
  stepMesh.position.z = 0.35
  escGroup.add(stepMesh)

  // Side glass balustrades
  const glassGeo = new THREE.BoxGeometry(0.04, len * 0.98, 0.9)
  const leftGlass = new THREE.Mesh(glassGeo, balustradeGlassMat)
  leftGlass.position.set(-width / 2 + 0.04, 0, 0.55)
  escGroup.add(leftGlass)

  const rightGlass = leftGlass.clone()
  rightGlass.position.x = width / 2 - 0.04
  escGroup.add(rightGlass)

  // Glowing golden moving handrails on top of glass
  const railGeo = new THREE.BoxGeometry(0.08, len, 0.08)
  const leftRail = new THREE.Mesh(railGeo, goldGlowMat)
  leftRail.position.set(-width / 2 + 0.04, 0, 1.02)
  escGroup.add(leftRail)

  const rightRail = leftRail.clone()
  rightRail.position.x = width / 2 - 0.04
  escGroup.add(rightRail)

  return escGroup
}

// Helper: Create Panoramic Glass Elevator Tower
function createPanoramicElevator(x: number, z: number, totalHeight: number) {
  const elevGroup = new THREE.Group()
  elevGroup.name = 'Scenic_Glass_Elevator'
  elevGroup.position.set(x, 0, z)

  // 4 Corner Gold Structural Pillars
  const colRadius = 0.08
  const pillarGeo = new THREE.CylinderGeometry(colRadius, colRadius, totalHeight, 12)
  const positions = [
    [-1.1, -1.1],
    [1.1, -1.1],
    [-1.1, 1.1],
    [1.1, 1.1]
  ]

  positions.forEach(([px, pz]) => {
    const pillar = new THREE.Mesh(pillarGeo, goldMat)
    pillar.position.set(px, totalHeight / 2, pz)
    elevGroup.add(pillar)
  })

  // Glass Shaft Wall Panels
  const glassShaftGeo = new THREE.CylinderGeometry(1.4, 1.4, totalHeight, 16, 1, true)
  const glassShaft = new THREE.Mesh(glassShaftGeo, glassMat)
  glassShaft.position.set(0, totalHeight / 2, 0)
  elevGroup.add(glassShaft)

  // Floor Ring Braces at each floor level
  for (let y = 0; y <= totalHeight; y += FLOOR_HEIGHT) {
    const ringGeo = new THREE.TorusGeometry(1.45, 0.05, 8, 24)
    ringGeo.rotateX(Math.PI / 2)
    const ringMesh = new THREE.Mesh(ringGeo, goldMat)
    ringMesh.position.y = y
    elevGroup.add(ringMesh)
  }

  // Futuristic Glass Elevator Cab (stationed at Level 1 mezzanine)
  const cabGroup = new THREE.Group()
  cabGroup.name = 'Elevator_Cab'
  cabGroup.position.set(0, FLOOR_HEIGHT * 1.5, 0)

  // Cab Floor & Ceiling (Gold & Marble)
  const cabFloor = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.15, 16), darkMarbleMat)
  cabGroup.add(cabFloor)

  const cabCeiling = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.2, 16), goldMat)
  cabCeiling.position.y = 2.4
  cabGroup.add(cabCeiling)

  // Cab Glass Body
  const cabGlass = new THREE.Mesh(new THREE.CylinderGeometry(1.18, 1.18, 2.2, 16, 1, true), balustradeGlassMat)
  cabGlass.position.y = 1.2
  cabGroup.add(cabGlass)

  // Cab Interior Warm Downlight
  const cabLight = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.05, 12), goldGlowMat)
  cabLight.position.y = 2.3
  cabGroup.add(cabLight)

  elevGroup.add(cabGroup)

  return elevGroup
}

// Helper: Create Lounge Seating & Planters
function createLoungeFurnishings(x: number, y: number, z: number, rotationY = 0) {
  const g = new THREE.Group()
  g.position.set(x, y, z)
  g.rotation.y = rotationY

  // Curved velvet leather bench
  const benchGeo = new THREE.BoxGeometry(2.4, 0.45, 0.9)
  const bench = new THREE.Mesh(benchGeo, benchLeatherMat)
  bench.position.y = 0.225
  g.add(bench)

  // Gold bench base frame
  const benchBase = new THREE.Mesh(new THREE.BoxGeometry(2.46, 0.06, 0.96), goldMat)
  benchBase.position.y = 0.03
  g.add(benchBase)

  // Planter Box adjacent
  const potGeo = new THREE.CylinderGeometry(0.45, 0.35, 0.75, 16)
  const pot = new THREE.Mesh(potGeo, plantPotMat)
  pot.position.set(1.8, 0.375, 0)
  g.add(pot)

  // Sculpted green ficus plant
  const plantGeo = new THREE.SphereGeometry(0.55, 12, 12)
  plantGeo.scale(1, 1.3, 1)
  const plant = new THREE.Mesh(plantGeo, plantFoliageMat)
  plant.position.set(1.8, 1.2, 0)
  g.add(plant)

  return g
}

// Helper: Create Ground Floor Concierge Circular Information Desk
function createConciergeDesk(x: number, y: number, z: number) {
  const deskGroup = new THREE.Group()
  deskGroup.name = 'Aurelia_Concierge_Desk'
  deskGroup.position.set(x, y, z)

  // Circular marble counter
  const counterGeo = new THREE.CylinderGeometry(2.2, 2.0, 1.05, 32)
  const counter = new THREE.Mesh(counterGeo, darkMarbleMat)
  counter.position.y = 0.525
  deskGroup.add(counter)

  // Gold countertop rim
  const rimGeo = new THREE.TorusGeometry(2.25, 0.06, 8, 32)
  rimGeo.rotateX(Math.PI / 2)
  const rim = new THREE.Mesh(rimGeo, goldMat)
  rim.position.y = 1.05
  deskGroup.add(rim)

  // Under-counter halo LED ring
  const haloGeo = new THREE.TorusGeometry(2.05, 0.05, 8, 32)
  haloGeo.rotateX(Math.PI / 2)
  const halo = new THREE.Mesh(haloGeo, goldGlowMat)
  halo.position.y = 0.1
  deskGroup.add(halo)

  // Golden AURELIA Crest Totem on desk center
  const crestGeo = new THREE.OctahedronGeometry(0.35, 0)
  const crest = new THREE.Mesh(crestGeo, lightGoldMat)
  crest.position.y = 1.55
  deskGroup.add(crest)

  return deskGroup
}

// Helper: Create Grand Atrium Kinetic Chandelier
function createAtriumChandelier(yTop: number) {
  const chanGroup = new THREE.Group()
  chanGroup.name = 'Atrium_Chandelier_Cascade'
  chanGroup.position.set(0, yTop, 0)

  // 4 Concentric floating gold rings tilted at graceful architectural angles
  const ringConfigs = [
    { radius: 4.8, y: -2.0, rotX: 0.15, rotZ: 0.1 },
    { radius: 3.6, y: -4.5, rotX: -0.12, rotZ: 0.18 },
    { radius: 2.6, y: -7.0, rotX: 0.18, rotZ: -0.1 },
    { radius: 1.6, y: -9.5, rotX: -0.08, rotZ: -0.15 }
  ]

  ringConfigs.forEach((cfg, idx) => {
    const ringGeo = new THREE.TorusGeometry(cfg.radius, 0.07, 12, 48)
    const ringMesh = new THREE.Mesh(ringGeo, goldMat)
    ringMesh.rotation.x = Math.PI / 2 + cfg.rotX
    ringMesh.rotation.z = cfg.rotZ
    ringMesh.position.y = cfg.y
    chanGroup.add(ringMesh)

    // Embedded warm glow light core
    const glowGeo = new THREE.TorusGeometry(cfg.radius, 0.04, 8, 48)
    const glowMesh = new THREE.Mesh(glowGeo, goldGlowMat)
    glowMesh.rotation.x = Math.PI / 2 + cfg.rotX
    glowMesh.rotation.z = cfg.rotZ
    glowMesh.position.y = cfg.y
    chanGroup.add(glowMesh)

    // Delicate vertical suspension cables from ceiling
    for (let c = 0; c < 4; c++) {
      const angle = (c / 4) * Math.PI * 2
      const cx = Math.cos(angle) * cfg.radius
      const cz = Math.sin(angle) * cfg.radius
      const cableLen = Math.abs(cfg.y)
      const cableGeo = new THREE.CylinderGeometry(0.015, 0.015, cableLen, 6)
      const cable = new THREE.Mesh(cableGeo, goldMat)
      cable.position.set(cx, cfg.y / 2, cz)
      chanGroup.add(cable)
    }
  })

  return chanGroup
}

// Helper: Create Grand Geodesic Skylight Roof
function createSkylightRoof(yLevel: number) {
  const roofGroup = new THREE.Group()
  roofGroup.name = 'Roof_Skylight_Canopy'
  roofGroup.position.set(0, yLevel, 0)

  // Arched Barrel Vault Framework over Atrium
  const archesCount = 7
  const archSpanX = ATRIUM_RADIUS_X * 2 + 3.0
  const archDepthZ = ATRIUM_RADIUS_Z * 2 + 2.5
  const archHeight = 3.5

  for (let i = 0; i < archesCount; i++) {
    const z = -archDepthZ / 2 + (i / (archesCount - 1)) * archDepthZ
    const archCurvePoints: THREE.Vector3[] = []

    const pts = 24
    for (let p = 0; p <= pts; p++) {
      const t = p / pts
      const x = -archSpanX / 2 + t * archSpanX
      const y = Math.sin(t * Math.PI) * archHeight
      archCurvePoints.push(new THREE.Vector3(x, y, z))
    }

    const archCurve = new THREE.CatmullRomCurve3(archCurvePoints)
    const archGeo = new THREE.TubeGeometry(archCurve, 32, 0.07, 8, false)
    const archMesh = new THREE.Mesh(archGeo, goldMat)
    roofGroup.add(archMesh)
  }

  // Longitudinal Gold Purlins
  const purlinLines = 5
  for (let p = 1; p < purlinLines; p++) {
    const t = p / purlinLines
    const x = -archSpanX / 2 + t * archSpanX
    const y = Math.sin(t * Math.PI) * archHeight
    const purlinGeo = new THREE.BoxGeometry(0.06, 0.06, archDepthZ)
    const purlin = new THREE.Mesh(purlinGeo, goldMat)
    purlin.position.set(x, y, 0)
    roofGroup.add(purlin)
  }

  // Semi-transparent Glass Skylight Canopy Dome
  const canopyGeo = new THREE.CylinderGeometry(
    archSpanX / 2,
    archSpanX / 2,
    archDepthZ,
    32,
    1,
    true,
    0,
    Math.PI
  )
  canopyGeo.rotateZ(Math.PI / 2)
  canopyGeo.scale(1, archHeight / (archSpanX / 2), 1)
  const canopy = new THREE.Mesh(canopyGeo, glassMat)
  canopy.position.set(0, 0, 0)
  roofGroup.add(canopy)

  return roofGroup
}

// ----------------------------------------------------
// BUILD THE 4 FLOORS & CIRCULATION
// ----------------------------------------------------

// Store configurations mapped to specific floors and wings
const storeConfigs: StorefrontConfig[] = [
  // === GROUND FLOOR (Level G) — Luxury Flagships & Grand Boutiques ===
  { id: 'zara-flagship', name: 'Zara Flagship', category: 'FASHION', wing: 'South Wing', shopNumber: 'G-101', floor: 'G', x: -11.0, y: 0, z: 9.8, rotationY: Math.PI },
  { id: 'hm-flagship', name: 'H&M Flagship', category: 'FASHION', wing: 'South Wing', shopNumber: 'G-102', floor: 'G', x: -5.5, y: 0, z: 9.8, rotationY: Math.PI },
  { id: 'rolex-boutique', name: 'Rolex Salon', category: 'JEWELLERY', wing: 'South Wing', shopNumber: 'G-103', floor: 'G', x: 0.0, y: 0, z: 9.8, rotationY: Math.PI },
  { id: 'cartier-maison', name: 'Cartier Maison', category: 'JEWELLERY', wing: 'South Wing', shopNumber: 'G-104', floor: 'G', x: 5.5, y: 0, z: 9.8, rotationY: Math.PI },
  { id: 'louis-vuitton', name: 'Louis Vuitton', category: 'FASHION', wing: 'South Wing', shopNumber: 'G-105', floor: 'G', x: 11.0, y: 0, z: 9.8, rotationY: Math.PI },

  { id: 'gucci-flagship', name: 'Gucci Gallery', category: 'FASHION', wing: 'North Wing', shopNumber: 'G-106', floor: 'G', x: -11.0, y: 0, z: -9.8, rotationY: 0 },
  { id: 'chanel-beaute', name: 'Chanel Haute Parfumerie', category: 'BEAUTY', wing: 'North Wing', shopNumber: 'G-107', floor: 'G', x: -5.5, y: 0, z: -9.8, rotationY: 0 },
  { id: 'apple-store-ground', name: 'Apple Flagship Entrance', category: 'ELECTRONICS', wing: 'North Wing', shopNumber: 'G-108', floor: 'G', x: 0.0, y: 0, z: -9.8, rotationY: 0 },
  { id: 'dior-boutique', name: 'Dior Couture', category: 'FASHION', wing: 'North Wing', shopNumber: 'G-109', floor: 'G', x: 5.5, y: 0, z: -9.8, rotationY: 0 },
  { id: 'hermes-paris', name: 'Hermès Paris', category: 'FASHION', wing: 'North Wing', shopNumber: 'G-110', floor: 'G', x: 11.0, y: 0, z: -9.8, rotationY: 0 },

  { id: 'tiffany-co', name: 'Tiffany & Co.', category: 'JEWELLERY', wing: 'West Wing', shopNumber: 'G-111', floor: 'G', x: -15.5, y: 0, z: -3.5, rotationY: Math.PI / 2 },
  { id: 'prada-boutique', name: 'Prada Milano', category: 'FASHION', wing: 'West Wing', shopNumber: 'G-112', floor: 'G', x: -15.5, y: 0, z: 3.5, rotationY: Math.PI / 2 },
  { id: 'saint-laurent', name: 'Saint Laurent', category: 'FASHION', wing: 'East Wing', shopNumber: 'G-113', floor: 'G', x: 15.5, y: 0, z: -3.5, rotationY: -Math.PI / 2 },
  { id: 'bottega-veneta', name: 'Btega Veneta', category: 'FASHION', wing: 'East Wing', shopNumber: 'G-114', floor: 'G', x: 15.5, y: 0, z: 3.5, rotationY: -Math.PI / 2 },

  // === LEVEL 01 (Fashion, Jewelry & Department Stores) ===
  { id: 'lifestyle-flagship', name: 'Lifestyle Department Store', category: 'FASHION', wing: 'South Wing', shopNumber: '1-201', floor: '1', x: -11.0, y: FLOOR_HEIGHT, z: 9.8, rotationY: Math.PI },
  { id: 'massimo-dutti', name: 'Massimo Dutti', category: 'FASHION', wing: 'South Wing', shopNumber: '1-202', floor: '1', x: -5.5, y: FLOOR_HEIGHT, z: 9.8, rotationY: Math.PI },
  { id: 'max-fashion', name: 'Max Fashion', category: 'FASHION', wing: 'South Wing', shopNumber: '1-203', floor: '1', x: 0.0, y: FLOOR_HEIGHT, z: 9.8, rotationY: Math.PI },
  { id: 'ralph-lauren', name: 'Ralph Lauren Purple Label', category: 'FASHION', wing: 'South Wing', shopNumber: '1-204', floor: '1', x: 5.5, y: FLOOR_HEIGHT, z: 9.8, rotationY: Math.PI },
  { id: 'burberry-london', name: 'Burberry London', category: 'FASHION', wing: 'South Wing', shopNumber: '1-205', floor: '1', x: 11.0, y: FLOOR_HEIGHT, z: 9.8, rotationY: Math.PI },

  { id: 'samsung-store', name: 'Samsung Experience Store', category: 'ELECTRONICS', wing: 'North Wing', shopNumber: '1-206', floor: '1', x: -11.0, y: FLOOR_HEIGHT, z: -9.8, rotationY: 0 },
  { id: 'sony-center', name: 'Sony Center', category: 'ELECTRONICS', wing: 'North Wing', shopNumber: '1-207', floor: '1', x: -5.5, y: FLOOR_HEIGHT, z: -9.8, rotationY: 0 },
  { id: 'tanishq-jewellery', name: 'Tanishq High Jewellery', category: 'JEWELLERY', wing: 'North Wing', shopNumber: '1-208', floor: '1', x: 0.0, y: FLOOR_HEIGHT, z: -9.8, rotationY: 0 },
  { id: 'malabar-gold', name: 'Malabar Gold & Diamonds', category: 'JEWELLERY', wing: 'North Wing', shopNumber: '1-209', floor: '1', x: 5.5, y: FLOOR_HEIGHT, z: -9.8, rotationY: 0 },
  { id: 'swarovski-crystal', name: 'Swarovski Atelier', category: 'JEWELLERY', wing: 'North Wing', shopNumber: '1-210', floor: '1', x: 11.0, y: FLOOR_HEIGHT, z: -9.8, rotationY: 0 },

  { id: 'hugo-boss', name: 'HUGO BOSS', category: 'FASHION', wing: 'West Wing', shopNumber: '1-211', floor: '1', x: -15.5, y: FLOOR_HEIGHT, z: 0.0, rotationY: Math.PI / 2 },
  { id: 'armani-exchange', name: 'Armani Exchange', category: 'FASHION', wing: 'East Wing', shopNumber: '1-212', floor: '1', x: 15.5, y: FLOOR_HEIGHT, z: 0.0, rotationY: -Math.PI / 2 },

  // === LEVEL 02 (Beauty, Electronics & Premium Lifestyle) ===
  { id: 'apple-flagship', name: 'Apple Aurelia', category: 'ELECTRONICS', wing: 'South Wing', shopNumber: '2-301', floor: '2', x: -11.0, y: FLOOR_HEIGHT * 2, z: 9.8, rotationY: Math.PI },
  { id: 'dyson-demo', name: 'Dyson Demo Store', category: 'ELECTRONICS', wing: 'South Wing', shopNumber: '2-302', floor: '2', x: -5.5, y: FLOOR_HEIGHT * 2, z: 9.8, rotationY: Math.PI },
  { id: 'bose-sound', name: 'Bose Acoustic Lounge', category: 'ELECTRONICS', wing: 'South Wing', shopNumber: '2-303', floor: '2', x: 0.0, y: FLOOR_HEIGHT * 2, z: 9.8, rotationY: Math.PI },
  { id: 'croma-megastore', name: 'Croma Luxury Collection', category: 'ELECTRONICS', wing: 'South Wing', shopNumber: '2-304', floor: '2', x: 5.5, y: FLOOR_HEIGHT * 2, z: 9.8, rotationY: Math.PI },
  { id: 'reliance-digital', name: 'Reliance Digital Select', category: 'ELECTRONICS', wing: 'South Wing', shopNumber: '2-305', floor: '2', x: 11.0, y: FLOOR_HEIGHT * 2, z: 9.8, rotationY: Math.PI },

  { id: 'sephora-flagship', name: 'Sephora Beauty Studio', category: 'BEAUTY', wing: 'North Wing', shopNumber: '2-306', floor: '2', x: -11.0, y: FLOOR_HEIGHT * 2, z: -9.8, rotationY: 0 },
  { id: 'mac-cosmetics', name: 'M·A·C Pro Atelier', category: 'BEAUTY', wing: 'North Wing', shopNumber: '2-307', floor: '2', x: -5.5, y: FLOOR_HEIGHT * 2, z: -9.8, rotationY: 0 },
  { id: 'kiehls-since-1851', name: "Kiehl's Pharmacy", category: 'BEAUTY', wing: 'North Wing', shopNumber: '2-308', floor: '2', x: 0.0, y: FLOOR_HEIGHT * 2, z: -9.8, rotationY: 0 },
  { id: 'jo-malone-london', name: 'Jo Malone London', category: 'BEAUTY', wing: 'North Wing', shopNumber: '2-309', floor: '2', x: 5.5, y: FLOOR_HEIGHT * 2, z: -9.8, rotationY: 0 },
  { id: 'loccitane-en-provence', name: "L'Occitane en Provence", category: 'BEAUTY', wing: 'North Wing', shopNumber: '2-310', floor: '2', x: 11.0, y: FLOOR_HEIGHT * 2, z: -9.8, rotationY: 0 },

  { id: 'levis-store', name: "Levi's Tailor Shop", category: 'FASHION', wing: 'West Wing', shopNumber: '2-311', floor: '2', x: -15.5, y: FLOOR_HEIGHT * 2, z: 0.0, rotationY: Math.PI / 2 },
  { id: 'pantaloons-store', name: 'Pantaloons Exclusive', category: 'FASHION', wing: 'East Wing', shopNumber: '2-312', floor: '2', x: 15.5, y: FLOOR_HEIGHT * 2, z: 0.0, rotationY: -Math.PI / 2 },

  // === LEVEL 03 (Fine Dining, Patisseries & Entertainment) ===
  { id: 'armani-ristorante', name: 'Armani / Ristorante', category: 'DINING', wing: 'South Wing', shopNumber: '3-401', floor: '3', x: -11.0, y: FLOOR_HEIGHT * 3, z: 9.8, rotationY: Math.PI },
  { id: 'nobu-tokyo', name: 'Nobu Japanese Dining', category: 'DINING', wing: 'South Wing', shopNumber: '3-402', floor: '3', x: -5.5, y: FLOOR_HEIGHT * 3, z: 9.8, rotationY: Math.PI },
  { id: 'laduree-paris', name: 'Ladurée Salon de Thé', category: 'DINING', wing: 'South Wing', shopNumber: '3-403', floor: '3', x: 0.0, y: FLOOR_HEIGHT * 3, z: 9.8, rotationY: Math.PI },
  { id: 'ce-la-vi-lounge', name: 'CÉ LA VI Sky Lounge', category: 'DINING', wing: 'South Wing', shopNumber: '3-404', floor: '3', x: 5.5, y: FLOOR_HEIGHT * 3, z: 9.8, rotationY: Math.PI },
  { id: 'artisan-patisserie', name: 'Pierre Hermé Paris', category: 'DINING', wing: 'South Wing', shopNumber: '3-405', floor: '3', x: 11.0, y: FLOOR_HEIGHT * 3, z: 9.8, rotationY: Math.PI },

  { id: 'inox-insignia', name: 'Aura VIP Cinema & IMAX', category: 'ENTERTAINMENT', wing: 'North Wing', shopNumber: '3-406', floor: '3', x: -11.0, y: FLOOR_HEIGHT * 3, z: -9.8, rotationY: 0 },
  { id: 'sushi-samba', name: 'SUSHISAMBA Terrace', category: 'DINING', wing: 'North Wing', shopNumber: '3-407', floor: '3', x: -5.5, y: FLOOR_HEIGHT * 3, z: -9.8, rotationY: 0 },
  { id: 'haute-boulangerie', name: 'Le Comptoir Bakery', category: 'DINING', wing: 'North Wing', shopNumber: '3-408', floor: '3', x: 0.0, y: FLOOR_HEIGHT * 3, z: -9.8, rotationY: 0 },
  { id: 'westside-store', name: 'Westside Lifestyle Terrace', category: 'FASHION', wing: 'North Wing', shopNumber: '3-409', floor: '3', x: 5.5, y: FLOOR_HEIGHT * 3, z: -9.8, rotationY: 0 },
  { id: 'aurora-observatory', name: 'Aurora Glass Observatory', category: 'ENTERTAINMENT', wing: 'North Wing', shopNumber: '3-410', floor: '3', x: 11.0, y: FLOOR_HEIGHT * 3, z: -9.8, rotationY: 0 },

  { id: 'the-grand-roastery', name: 'The Grand Reserve Roastery', category: 'DINING', wing: 'West Wing', shopNumber: '3-411', floor: '3', x: -15.5, y: FLOOR_HEIGHT * 3, z: 0.0, rotationY: Math.PI / 2 },
  { id: 'caviar-kaspia', name: 'Caviar Kaspia Lounge', category: 'DINING', wing: 'East Wing', shopNumber: '3-412', floor: '3', x: 15.5, y: FLOOR_HEIGHT * 3, z: 0.0, rotationY: -Math.PI / 2 }
]

// 1. FLOOR G (Ground Level)
const floorGGroup = new THREE.Group()
floorGGroup.name = 'Floor_G'
floorGGroup.userData = { floorLevel: 'G', baseHeight: 0 }

// Ground floor solid slab
const shapeG = createFloorShape(MALL_WIDTH, MALL_DEPTH, 2.5, false)
const extrudeG = new THREE.ExtrudeGeometry(shapeG, { depth: 0.35, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05 })
extrudeG.rotateX(-Math.PI / 2)
const slabGMesh = new THREE.Mesh(extrudeG, terrazzoFloorMat)
slabGMesh.position.y = -0.35
slabGMesh.receiveShadow = true
floorGGroup.add(slabGMesh)

// Central Atrium Radial Marble Inset Medallion
const atriumFloorGeo = new THREE.CylinderGeometry(ATRIUM_RADIUS_X * 0.95, ATRIUM_RADIUS_X * 0.95, 0.02, 48)
atriumFloorGeo.scale(1, 1, ATRIUM_RADIUS_Z / ATRIUM_RADIUS_X)
const atriumCenterMesh = new THREE.Mesh(atriumFloorGeo, atriumFloorMat)
atriumCenterMesh.position.set(0, 0.01, 0)
floorGGroup.add(atriumCenterMesh)

// Gold Inlay Edge Ring around the Atrium floor pattern
const goldInlayRing = new THREE.Mesh(
  new THREE.RingGeometry(ATRIUM_RADIUS_X * 0.93, ATRIUM_RADIUS_X * 0.96, 48),
  goldMat
)
goldInlayRing.rotateX(-Math.PI / 2)
goldInlayRing.scale.set(1, ATRIUM_RADIUS_Z / ATRIUM_RADIUS_X, 1)
goldInlayRing.position.set(0, 0.025, 0)
floorGGroup.add(goldInlayRing)

// Concierge Desk on Ground Floor
floorGGroup.add(createConciergeDesk(0, 0, -1.2))

// Ground Floor Lounge Furniture & Planters
floorGGroup.add(createLoungeFurnishings(-5.5, 0, 1.8, Math.PI / 4))
floorGGroup.add(createLoungeFurnishings(5.5, 0, 1.8, -Math.PI / 4))
floorGGroup.add(createLoungeFurnishings(-5.5, 0, -3.8, Math.PI * 0.75))
floorGGroup.add(createLoungeFurnishings(5.5, 0, -3.8, -Math.PI * 0.75))

// Ground Columns
const colGridX = [-11, -5.5, 5.5, 11]
const colGridZ = [-6.5, 6.5]
colGridX.forEach(x => {
  colGridZ.forEach(z => {
    floorGGroup.add(createFlutedColumn(x, z, 0, FLOOR_HEIGHT))
  })
})

// Storefronts on Ground Floor
storeConfigs.filter(s => s.floor === 'G').forEach(cfg => {
  floorGGroup.add(createStorefront(cfg))
})

scene.add(floorGGroup)

// Helper: Build upper floor (Level 1, 2, 3)
function buildUpperFloor(floorStr: string, floorIndex: number) {
  const floorY = FLOOR_HEIGHT * floorIndex
  const flGroup = new THREE.Group()
  flGroup.name = `Floor_${floorStr}`
  flGroup.userData = { floorLevel: floorStr, baseHeight: floorY }

  // Slab with Atrium Hole
  const flShape = createFloorShape(MALL_WIDTH, MALL_DEPTH, 2.5, true)
  const flExtrude = new THREE.ExtrudeGeometry(flShape, { depth: 0.35, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05 })
  flExtrude.rotateX(-Math.PI / 2)
  const slabMesh = new THREE.Mesh(flExtrude, terrazzoFloorMat)
  slabMesh.position.y = floorY - 0.35
  slabMesh.receiveShadow = true
  flGroup.add(slabMesh)

  // Under-slab Soffit Ceiling
  const soffitGeo = new THREE.BoxGeometry(MALL_WIDTH - 0.2, 0.08, MALL_DEPTH - 0.2)
  const soffitMesh = new THREE.Mesh(soffitGeo, darkFacadeMat)
  soffitMesh.position.set(0, floorY - 0.39, 0)
  flGroup.add(soffitMesh)

  // Glass Balustrades & Gold Handrails
  flGroup.add(createAtriumBalustrade(floorY))

  // Columns for this floor
  colGridX.forEach(x => {
    colGridZ.forEach(z => {
      flGroup.add(createFlutedColumn(x, z, floorY, FLOOR_HEIGHT))
    })
  })

  // Level 1 Sky Bridge across the central atrium
  if (floorStr === '1') {
    const bridgeGroup = new THREE.Group()
    bridgeGroup.name = 'Level1_SkyBridge'
    const bridgeGeo = new THREE.BoxGeometry(2.4, 0.2, ATRIUM_RADIUS_Z * 2 - 0.2)
    const bridgeMesh = new THREE.Mesh(bridgeGeo, terrazzoFloorMat)
    bridgeMesh.position.set(0, floorY - 0.1, 0)
    bridgeGroup.add(bridgeMesh)

    // Bridge Glass Railings
    const bRailGeo = new THREE.BoxGeometry(0.04, 1.05, ATRIUM_RADIUS_Z * 2 - 0.2)
    const bRailL = new THREE.Mesh(bRailGeo, balustradeGlassMat)
    bRailL.position.set(-1.18, floorY + 0.525, 0)
    bridgeGroup.add(bRailL)
    const bRailR = bRailL.clone()
    bRailR.position.x = 1.18
    bridgeGroup.add(bRailR)

    // Bridge Gold Handrails
    const bHandGeo = new THREE.BoxGeometry(0.08, 0.06, ATRIUM_RADIUS_Z * 2 - 0.2)
    const bHandL = new THREE.Mesh(bHandGeo, goldMat)
    bHandL.position.set(-1.18, floorY + 1.05, 0)
    bridgeGroup.add(bHandL)
    const bHandR = bHandL.clone()
    bHandR.position.x = 1.18
    bridgeGroup.add(bHandR)

    flGroup.add(bridgeGroup)
  }

  // Lounge Seating & Planters
  flGroup.add(createLoungeFurnishings(-7.0, floorY, 2.2, Math.PI / 4))
  flGroup.add(createLoungeFurnishings(7.0, floorY, 2.2, -Math.PI / 4))

  // Storefronts for this floor
  storeConfigs.filter(s => s.floor === floorStr).forEach(cfg => {
    flGroup.add(createStorefront(cfg))
  })

  return flGroup
}

const floor1Group = buildUpperFloor('1', 1)
scene.add(floor1Group)

const floor2Group = buildUpperFloor('2', 2)
scene.add(floor2Group)

const floor3Group = buildUpperFloor('3', 3)
scene.add(floor3Group)

// 2. VERTICAL CIRCULATION (Criss-Cross Escalators & Glass Elevator)
const circulationGroup = new THREE.Group()
circulationGroup.name = 'Vertical_Circulation'

// Escalator G -> 1 (Angled in Atrium)
circulationGroup.add(createEscalator(
  2.2, 0, -2.4,
  -2.2, FLOOR_HEIGHT, 2.4,
  'Escalator_G_to_1'
))

// Escalator 1 -> 2
circulationGroup.add(createEscalator(
  -2.2, FLOOR_HEIGHT, -2.4,
  2.2, FLOOR_HEIGHT * 2, 2.4,
  'Escalator_1_to_2'
))

// Escalator 2 -> 3
circulationGroup.add(createEscalator(
  2.2, FLOOR_HEIGHT * 2, -2.4,
  -2.2, FLOOR_HEIGHT * 3, 2.4,
  'Escalator_2_to_3'
))

// Scenic Glass Elevator Tower (at the western edge of the central atrium)
circulationGroup.add(createPanoramicElevator(-ATRIUM_RADIUS_X - 0.6, 0, FLOOR_HEIGHT * 3.6))

scene.add(circulationGroup)

// 3. ATRIUM CENTERPIECE (Cascading Gold Ring Chandelier)
const chandelier = createAtriumChandelier(FLOOR_HEIGHT * 3.8)
scene.add(chandelier)

// 4. ROOFTOP SKYLIGHT CANOPY
const skylightRoof = createSkylightRoof(FLOOR_HEIGHT * 4.0)
scene.add(skylightRoof)

console.log('Model graph assembled with', scene.children.length, 'root top-level structures.')

// Export Scene to GLB Binary
const outDir = path.resolve(process.cwd(), 'public/models')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}
const outPath = path.join(outDir, 'aurelia_mall.glb')

const exporter = new GLTFExporter()
exporter.parse(
  scene,
  (gltf) => {
    const buffer = Buffer.from(gltf as ArrayBuffer)
    fs.writeFileSync(outPath, buffer)
    console.log(`[SUCCESS] AURELIA Mall GLB exported to ${outPath}`)
    console.log(`File size: ${(buffer.length / (1024 * 1024)).toFixed(2)} MB (${buffer.length} bytes)`)
  },
  (err) => {
    console.error('Failed to export GLTF:', err)
  },
  {
    binary: true,
    embedImages: true
  }
)
