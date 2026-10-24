import React from 'react'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Building2, Plus, Store, Settings, Trash2, Map, CheckCircle2, XCircle } from 'lucide-react'
import { deleteFloor, deleteShop } from '@/actions/mallLayout'

export const dynamic = 'force-dynamic'

export default async function LayoutManagementPage() {
  const floors = await prisma.floor.findMany({
    orderBy: { number: 'asc' },
    include: { _count: { select: { stores: true } } }
  })
  
  const shops = await prisma.store.findMany({
    orderBy: { storeNumber: 'asc' },
    include: { category: true }
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Map className="h-6 w-6 text-blue-600" />
            Mall Layout Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage the 3D mall architectural layout, floors, and physical store placements.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/layout-management/editor"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Map className="h-4 w-4" />
            Floor Plan Editor
          </Link>
          <Link
            href="/admin/layout-management/add-floor"
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Building2 className="h-4 w-4" />
            Add Floor
          </Link>
          <Link
            href="/admin/layout-management/add-shop"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            <Store className="h-4 w-4" />
            Add Shop
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Floors Section */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Mall Floors</h2>
            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
              {floors.length} Total
            </span>
          </div>

          <div className="space-y-3">
            {floors.length === 0 ? (
              <div className="p-6 bg-white border border-slate-200 border-dashed rounded-xl text-center text-slate-500 text-sm">
                No floors added yet. Create a floor to start building the mall.
              </div>
            ) : (
              floors.map((floor: any) => (
                <div key={floor.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow relative group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                        <span className="text-sm font-bold text-blue-700">{floor.code}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm">{floor.name}</h3>
                        <p className="text-xs text-slate-500">Level {floor.number}</p>
                      </div>
                    </div>
                    {floor.status === 'ACTIVE' ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        <XCircle className="h-3 w-3" /> Inactive
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-xs text-slate-500">
                      <span className="font-medium text-slate-700">{floor._count.stores}</span> shops located here
                    </div>
                    
                    <form action={async () => {
                      'use server'
                      await deleteFloor(floor.id)
                    }}>
                      <button 
                        type="submit"
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        disabled={floor._count.stores > 0}
                        title={floor._count.stores > 0 ? "Cannot delete floor with active shops" : "Delete Floor"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Shops Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">Shop Placements</h2>
            <div className="flex gap-2">
              <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
                {shops.length} Total
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {shops.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No shops added yet. Add a floor first, then create a shop.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Store ID</th>
                      <th className="px-4 py-3 font-semibold">Name / Brand</th>
                      <th className="px-4 py-3 font-semibold">Floor & Pos</th>
                      <th className="px-4 py-3 font-semibold">Category</th>
                      <th className="px-4 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {shops.map((shop: any) => (
                      <tr key={shop.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                            {shop.storeNumber}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">{shop.name}</div>
                          {shop.brandName && (
                            <div className="text-xs text-slate-500">{shop.brandName}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-slate-900 font-medium text-xs">{shop.floor}</div>
                          <div className="text-xs text-slate-400">
                            X:{shop.positionX} Z:{shop.positionZ}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-slate-600 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                            {shop.category?.name || 'General'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <form action={async () => {
                            'use server'
                            await deleteShop(shop.id)
                          }}>
                            <button type="submit" className="p-1.5 text-slate-400 hover:text-red-500 rounded transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </form>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
