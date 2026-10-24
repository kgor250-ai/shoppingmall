'use client'

import React, { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { addFloor } from '@/actions/mallLayout'
import { Building2, Save, X, Info } from 'lucide-react'
import Link from 'next/link'

export default function AddFloorPage() {
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
      const res = await addFloor(formData)
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
    <div className="max-w-2xl mx-auto mt-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Building2 className="h-6 w-6 text-blue-600" />
          Add New Floor
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

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-slate-700">Floor Name <span className="text-red-500">*</span></label>
              <input type="text" id="name" name="name" required placeholder="e.g. Ground Floor" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-semibold text-slate-700">Floor Code <span className="text-red-500">*</span></label>
              <input type="text" id="code" name="code" required placeholder="e.g. G, 1, 2" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="space-y-2">
              <label htmlFor="number" className="text-sm font-semibold text-slate-700">Level Number <span className="text-red-500">*</span></label>
              <input type="number" id="number" name="number" required placeholder="e.g. 0, 1, 2" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-semibold text-slate-700">Primary Purpose</label>
              <select id="category" name="category" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="Luxury Fashion">Luxury Fashion</option>
                <option value="Dining & Culinary">Dining & Culinary</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Mixed Use">Mixed Use</option>
                <option value="Parking">Parking</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-semibold text-slate-700">Description</label>
            <textarea id="description" name="description" rows={3} placeholder="Brief description of the floor..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-semibold text-slate-700">Status</label>
            <select id="status" name="status" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="ACTIVE">Active (Visible in 3D Mall)</option>
              <option value="INACTIVE">Inactive (Under Construction)</option>
            </select>
            <p className="text-xs text-slate-500">Active floors will automatically be added to the 3D mall structural layout.</p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Link href="/admin/layout-management" className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2">
              {loading ? (
                <>Saving...</>
              ) : (
                <><Save className="h-4 w-4" /> Save Floor</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
