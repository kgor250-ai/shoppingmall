'use server'

import prisma from '@/lib/prisma'
import { NavigationRoute } from '@/data/mall3dData'

// A basic A* implementation for indoor navigation
export async function calculateRoute(startNodeId: string, destStoreId: string): Promise<NavigationRoute | null> {
  // Try to find destination store
  const store = await prisma.store.findUnique({
    where: { id: destStoreId }
  })
  
  if (!store) return null

  // Fetch all nodes and edges for A* graph
  const nodes = await prisma.navigationNode.findMany()
  const edges = await prisma.navigationEdge.findMany({
    where: { status: 'ACTIVE' }
  })

  // If no graph data exists, return a mock/fallback route for demonstration
  if (nodes.length === 0 || edges.length === 0) {
    return mockRoute(startNodeId, store)
  }

  // Find start node (assuming startNodeId is a valid node ID or we find nearest)
  let startNode = nodes.find(n => n.id === startNodeId)
  if (!startNode) {
    // Just pick the first node as a fallback if not found
    startNode = nodes[0]
  }

  // Find destination node (node linked to store, or nearest to store coordinates)
  let destNode = nodes.find(n => n.refId === store.id)
  if (!destNode) {
    // Find closest node on the same floor
    const floorNodes = nodes.filter(n => n.floorId === store.floor)
    if (floorNodes.length > 0) {
      destNode = floorNodes.reduce((closest, curr) => {
        const d1 = Math.pow(curr.positionX - (store.positionX || 0), 2) + Math.pow(curr.positionZ! - (store.positionZ || 0), 2)
        const d2 = Math.pow(closest.positionX - (store.positionX || 0), 2) + Math.pow(closest.positionZ! - (store.positionZ || 0), 2)
        return d1 < d2 ? curr : closest
      }, floorNodes[0])
    } else {
      destNode = nodes[nodes.length - 1]
    }
  }

  // A* Algorithm
  const adjacencyList = new Map<string, any[]>()
  nodes.forEach(n => adjacencyList.set(n.id, []))
  edges.forEach(e => {
    adjacencyList.get(e.fromNodeId)?.push(e)
    adjacencyList.get(e.toNodeId)?.push({ ...e, fromNodeId: e.toNodeId, toNodeId: e.fromNodeId }) // assuming bidirectional unless specified
  })

  const heuristic = (n1: any, n2: any) => {
    return Math.sqrt(Math.pow(n1.positionX - n2.positionX, 2) + Math.pow((n1.positionZ || 0) - (n2.positionZ || 0), 2))
  }

  const openSet = new Set([startNode.id])
  const cameFrom = new Map<string, string>()
  
  const gScore = new Map<string, number>()
  nodes.forEach(n => gScore.set(n.id, Infinity))
  gScore.set(startNode.id, 0)

  const fScore = new Map<string, number>()
  nodes.forEach(n => fScore.set(n.id, Infinity))
  fScore.set(startNode.id, heuristic(startNode, destNode))

  while (openSet.size > 0) {
    let currentId = Array.from(openSet).reduce((a, b) => (fScore.get(a)! < fScore.get(b)! ? a : b))
    
    if (currentId === destNode.id) {
      // Reconstruct path
      const pathIds = [currentId]
      while (cameFrom.has(currentId)) {
        currentId = cameFrom.get(currentId)!
        pathIds.unshift(currentId)
      }
      
      const distance = gScore.get(destNode.id)!
      
      return {
        pathPoints: pathIds.map(id => {
            const node = nodes.find(n => n.id === id)
            return [node!.positionX, node!.positionY, node!.positionZ || 0] as [number, number, number]
        }),
        distance: `${distance.toFixed(0)} m`,
        walkTime: `${Math.ceil(distance / 80)} min`,
        routeSteps: [
          `Start from ${startNode.type}`,
          ...pathIds.map((id, i) => i === pathIds.length - 1 ? `Arrive at ${store.name}` : `Walk to next point`),
        ],
        floorTransition: null
      }
    }

    openSet.delete(currentId)
    const neighbors = adjacencyList.get(currentId) || []

    for (const edge of neighbors) {
      const neighborId = edge.toNodeId
      const tentative_gScore = gScore.get(currentId)! + edge.distance * edge.weight
      
      if (tentative_gScore < gScore.get(neighborId)!) {
        cameFrom.set(neighborId, currentId)
        gScore.set(neighborId, tentative_gScore)
        const neighborNode = nodes.find(n => n.id === neighborId)!
        fScore.set(neighborId, tentative_gScore + heuristic(neighborNode, destNode))
        openSet.add(neighborId)
      }
    }
  }

  // No path found
  return null
}

function mockRoute(startId: string, store: any): NavigationRoute {
  return {
    pathPoints: [[0,0,0], [1,0,1], [2,0,2]],
    distance: '180 m',
    walkTime: '4 min',
    routeSteps: [
      'Start from Main Entrance',
      `Head towards the Central Atrium`,
      `Your destination ${store.name} will be on your right`
    ],
    floorTransition: store.floor !== 'G' ? {
      fromFloor: 'G',
      toFloor: store.floor,
      type: 'escalator'
    } : null
  }
}
