'use client'

import React, { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { addShopToLayout } from '@/actions/mallLayout'
import { Store, Save, X, Info } from 'lucide-react'
import Link from 'next/link'

interface AddShopFormProps {
  floors: any[]
  categories: any[]
}

export default function AddShopForm({ floors, categories }: AddShopFormProps) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    if (formRef.current) {
      const formData = new FormData(formRef.current)
      const res = await addShopToLayout(formData)
      if (res.error) {
        setError(res.error)
      } else {
        router.push('/admin/layout-management')
        router.refresh()
      }
    }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Store className="h-6 w-6 text-blue-600" />
          Add Shop to Layout
        </h1>
        <Link href="/admin/layout-management" className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-sm font-medium">
          <X className="h-4 w-4" /> Cancel
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2 text-sm">
          <Info className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {floors.length === 0 ? (
        <div className="p-8 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-center">
          <h3 className="font-semibold mb-2">No Active Floors Found</h3>
          <p className="text-sm">You must create at least one active floor before adding a shop.</p>
          <Link href="/admin/layout-management/add-floor" className="mt-4 inline-block px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg">
            Create a Floor
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Basic Info */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-semibold text-slate-700">Shop Name <span className="text-red-500">*</span></label>
                  <input type="text" id="name" name="name" required placeholder="e.g. Gucci Boutique" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="brandName" className="text-sm font-semibold text-slate-700">Brand Name</label>
                  <input type="text" id="brandName" name="brandName" placeholder="e.g. Gucci" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="storeNumber" className="text-sm font-semibold text-slate-700">Shop ID / Number <span className="text-red-500">*</span></label>
                  <input type="text" id="storeNumber" name="storeNumber" required placeholder="e.g. G-101" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="categoryId" className="text-sm font-semibold text-slate-700">Category <span className="text-red-500">*</span></label>
                  <select id="categoryId" name="categoryId" required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Select a category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Placement Info */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">3D Mall Placement</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="floorId" className="text-sm font-semibold text-slate-700">Floor <span className="text-red-500">*</span></label>
                  <select id="floorId" name="floorId" required className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Select Floor</option>
                    {floors.map(f => (
                      <option key={f.id} value={f.id}>{f.name} (Code: {f.code})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="wing" className="text-sm font-semibold text-slate-700">Wing / Zone</label>
                  <select id="wing" name="wing" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="Central Atrium">Central Atrium</option>
                    <option value="North Wing">North Wing</option>
                    <option value="South Wing">South Wing</option>
                    <option value="East Wing">East Wing</option>
                    <option value="West Wing">West Wing</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="positionX" className="text-sm font-semibold text-slate-700">X Coordinate (3D Model)</label>
                  <input type="number" step="0.1" id="positionX" name="positionX" defaultValue="0" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="positionZ" className="text-sm font-semibold text-slate-700">Z Coordinate (3D Model)</label>
                  <input type="number" step="0.1" id="positionZ" name="positionZ" defaultValue="0" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-semibold text-slate-700">Description</label>
              <textarea id="description" name="description" rows={3} placeholder="Brief description of the shop..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="shopSize" className="text-sm font-semibold text-slate-700">Shop Size (sq.m)</label>
                <input type="number" id="shopSize" name="shopSize" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-semibold text-slate-700">Status</label>
                <select id="status" name="status" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="ACTIVE">Open</option>
                  <option value="MAINTENANCE">Under Maintenance</option>
                  <option value="CLOSED">Closed / Upcoming</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <Link href="/admin/layout-management" className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
                Cancel
              </Link>
              <button type="submit" disabled={loading} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2">
                {loading ? (
                  <>Saving...</>
                ) : (
                  <><Save className="h-4 w-4" /> Save Shop</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
