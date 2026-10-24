export interface Point3D {
  x: number
  y: number
  z: number
}

export interface NavNode {
  id: string
  point: Point3D
  connections: string[] // IDs of connected nodes
}

// A simple Manhattan/Euclidean distance heuristic
function heuristic(a: Point3D, b: Point3D) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z)
}

// Simple A* Pathfinding implementation
export function findPath(startId: string, goalId: string, graph: Record<string, NavNode>): Point3D[] {
  if (!graph[startId] || !graph[goalId]) return []

  const openSet = new Set<string>([startId])
  const cameFrom = new Map<string, string>()

  const gScore = new Map<string, number>()
  gScore.set(startId, 0)

  const fScore = new Map<string, number>()
  fScore.set(startId, heuristic(graph[startId].point, graph[goalId].point))

  while (openSet.size > 0) {
    let current = ''
    let minF = Infinity
    
    // Find node in openSet with lowest fScore
    openSet.forEach(nodeId => {
      const score = fScore.get(nodeId) || Infinity
      if (score < minF) {
        minF = score
        current = nodeId
      }
    })

    if (current === goalId) {
      // Reconstruct path
      const path: Point3D[] = [graph[current].point]
      while (cameFrom.has(current)) {
        current = cameFrom.get(current)!
        path.unshift(graph[current].point)
      }
      return path
    }

    openSet.delete(current)

    const neighbors = graph[current].connections || []
    for (const neighbor of neighbors) {
      if (!graph[neighbor]) continue

      const tentativeGScore = (gScore.get(current) || Infinity) + heuristic(graph[current].point, graph[neighbor].point)

      if (tentativeGScore < (gScore.get(neighbor) || Infinity)) {
        cameFrom.set(neighbor, current)
        gScore.set(neighbor, tentativeGScore)
        fScore.set(neighbor, tentativeGScore + heuristic(graph[neighbor].point, graph[goalId].point))
        if (!openSet.has(neighbor)) {
          openSet.add(neighbor)
        }
      }
    }
  }

  // No path found
  return []
}

// Create a comprehensive navigation graph supporting all floors: P2, P1, G, L1, L2, L3
export const MOCK_NAV_GRAPH: Record<string, NavNode> = {
  // Basement 2 Parking (y=-7.0)
  'P2-Center': { id: 'P2-Center', point: { x: 0, y: -7.0, z: 0 }, connections: ['P2-West', 'P2-East', 'P2-Elevator'] },
  'P2-West': { id: 'P2-West', point: { x: -8, y: -7.0, z: 2 }, connections: ['P2-Center'] },
  'P2-East': { id: 'P2-East', point: { x: 8, y: -7.0, z: 2 }, connections: ['P2-Center'] },
  'P2-Elevator': { id: 'P2-Elevator', point: { x: 0, y: -7.0, z: -2 }, connections: ['P2-Center', 'P1-Elevator'] },

  // Basement 1 Parking & Valet (y=-3.5)
  'P1-Center': { id: 'P1-Center', point: { x: 0, y: -3.5, z: 0 }, connections: ['P1-West', 'P1-East', 'P1-Elevator'] },
  'P1-West': { id: 'P1-West', point: { x: -8, y: -3.5, z: 2 }, connections: ['P1-Center'] },
  'P1-East': { id: 'P1-East', point: { x: 8, y: -3.5, z: 2 }, connections: ['P1-Center'] },
  'P1-Elevator': { id: 'P1-Elevator', point: { x: 0, y: -3.5, z: -2 }, connections: ['P1-Center', 'P2-Elevator', 'G-Elevator'] },

  // Ground Floor Corridors (y=0.4)
  'G-Center': { id: 'G-Center', point: { x: 0, y: 0.4, z: 0 }, connections: ['G-West', 'G-East', 'G-Elevator', 'G-Escalator'] },
  'G-West': { id: 'G-West', point: { x: -10, y: 0.4, z: 0 }, connections: ['G-Center'] },
  'G-East': { id: 'G-East', point: { x: 10, y: 0.4, z: 0 }, connections: ['G-Center'] },
  'G-Elevator': { id: 'G-Elevator', point: { x: 0, y: 0.4, z: -2 }, connections: ['G-Center', 'P1-Elevator', 'L1-Elevator'] },
  'G-Escalator': { id: 'G-Escalator', point: { x: 2.2, y: 0.4, z: -2.4 }, connections: ['G-Center', 'L1-Escalator'] },

  // Level 1 Corridors (y=4.6)
  'L1-Center': { id: 'L1-Center', point: { x: 0, y: 4.6, z: 0 }, connections: ['L1-West', 'L1-East', 'L1-Elevator', 'L1-Escalator'] },
  'L1-West': { id: 'L1-West', point: { x: -10, y: 4.6, z: 0 }, connections: ['L1-Center'] },
  'L1-East': { id: 'L1-East', point: { x: 10, y: 4.6, z: 0 }, connections: ['L1-Center'] },
  'L1-Elevator': { id: 'L1-Elevator', point: { x: 0, y: 4.6, z: -2 }, connections: ['L1-Center', 'G-Elevator', 'L2-Elevator'] },
  'L1-Escalator': { id: 'L1-Escalator', point: { x: 2.2, y: 4.6, z: -2.4 }, connections: ['L1-Center', 'G-Escalator', 'L2-Escalator'] },

  // Level 2 Corridors (y=8.8)
  'L2-Center': { id: 'L2-Center', point: { x: 0, y: 8.8, z: 0 }, connections: ['L2-West', 'L2-East', 'L2-Elevator', 'L2-Escalator'] },
  'L2-West': { id: 'L2-West', point: { x: -10, y: 8.8, z: 0 }, connections: ['L2-Center'] },
  'L2-East': { id: 'L2-East', point: { x: 10, y: 8.8, z: 0 }, connections: ['L2-Center'] },
  'L2-Elevator': { id: 'L2-Elevator', point: { x: 0, y: 8.8, z: -2 }, connections: ['L2-Center', 'L1-Elevator', 'L3-Elevator'] },
  'L2-Escalator': { id: 'L2-Escalator', point: { x: 2.2, y: 8.8, z: -2.4 }, connections: ['L2-Center', 'L1-Escalator', 'L3-Escalator'] },

  // Level 3 Corridors (y=13.0)
  'L3-Center': { id: 'L3-Center', point: { x: 0, y: 13.0, z: 0 }, connections: ['L3-West', 'L3-East', 'L3-Elevator', 'L3-Escalator'] },
  'L3-West': { id: 'L3-West', point: { x: -10, y: 13.0, z: 0 }, connections: ['L3-Center'] },
  'L3-East': { id: 'L3-East', point: { x: 10, y: 13.0, z: 0 }, connections: ['L3-Center'] },
  'L3-Elevator': { id: 'L3-Elevator', point: { x: 0, y: 13.0, z: -2 }, connections: ['L3-Center', 'L2-Elevator'] },
  'L3-Escalator': { id: 'L3-Escalator', point: { x: 2.2, y: 13.0, z: -2.4 }, connections: ['L3-Center', 'L2-Escalator'] },
}
