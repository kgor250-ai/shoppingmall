import React from 'react'
import { FloorPlanEditorClient } from './FloorPlanEditorClient'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function FloorPlanEditorPage() {
  const floors = await prisma.floor.findMany({
    orderBy: { number: 'asc' },
    include: {
      stores: true,
      facilities: true,
      nodes: {
        include: {
          edgesFrom: true,
          edgesTo: true
        }
      }
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Floor Plan Editor
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage mall floors, stores, facilities and navigation paths.
        </p>
      </div>

      <FloorPlanEditorClient initialFloors={floors} />
    </div>
  )
}
