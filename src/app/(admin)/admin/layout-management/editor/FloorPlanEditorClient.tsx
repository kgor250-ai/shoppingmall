'use client'

import React, { useState } from 'react'
import { Map, Store, Layers, Navigation, Eye, Upload, Save, Send, Image as ImageIcon, Box } from 'lucide-react'

export function FloorPlanEditorClient({ initialFloors }: { initialFloors: any[] }) {
  const [activeTab, setActiveTab] = useState('floor')
  const [selectedFloorId, setSelectedFloorId] = useState(
    initialFloors.length > 0 ? initialFloors[0].id : null
  )
  const [isActive, setIsActive] = useState(true)

  const activeFloor = initialFloors.find(f => f.id === selectedFloorId)

  const tabs = [
    { id: 'floor', name: 'Floor Details' },
    { id: 'stores', name: 'Stores' },
    { id: 'facilities', name: 'Facilities' },
    { id: 'navigation', name: 'Navigation' },
    { id: 'preview', name: 'Preview' },
  ]

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm min-h-[700px] flex flex-col font-sans">
      {/* Editor Header / Tabs */}
      <div className="border-b border-slate-200 bg-white rounded-t-2xl px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex gap-1 w-full md:w-auto overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="p-8 flex-grow bg-white rounded-b-2xl">
        {!activeFloor ? (
          <div className="text-center text-slate-500 py-12">No floor selected.</div>
        ) : (
          <div className="h-full max-w-5xl mx-auto">
            {activeTab === 'floor' && (
              <div className="space-y-8">
                
                {/* Text Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Floor Name *</label>
                    <input 
                      type="text" 
                      defaultValue={activeFloor.name} 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-slate-900 outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Floor Number *</label>
                    <input 
                      type="number" 
                      defaultValue={activeFloor.number} 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium text-slate-900 outline-none transition-all" 
                    />
                  </div>
                </div>

                {/* Status Toggle */}
                <div>
                   <label className="block text-sm font-bold text-slate-900 mb-3">Status</label>
                   <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-xl w-fit">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                           <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-semibold text-slate-700">Active</span>
                      </div>
                      <button 
                        onClick={() => setIsActive(!isActive)}
                        className={`ml-6 w-12 h-6 rounded-full p-1 transition-colors relative ${isActive ? 'bg-green-500' : 'bg-slate-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${isActive ? 'translate-x-6 left-1' : 'left-1'}`}></div>
                      </button>
                   </div>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  {/* Map Image */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-bold text-slate-900">Map Image</label>
                      <button className="text-xs font-semibold text-blue-600 hover:underline">Change image</button>
                    </div>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-2 bg-slate-50 overflow-hidden relative group">
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                          <button className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold shadow-md">
                            <Upload className="w-4 h-4" /> Upload Map
                          </button>
                       </div>
                       <img src="https://images.unsplash.com/photo-1541888086925-ebde89634e06?auto=format&fit=crop&w=600&q=80" alt="Map Preview" className="w-full h-48 object-cover rounded-xl" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 font-medium">Recommended size: 1920 x 1080<br/>Supported formats: PNG, JPG, SVG</p>
                  </div>

                  {/* 3D Model */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-bold text-slate-900">3D Model (Optional)</label>
                      <button className="text-xs font-semibold text-blue-600 hover:underline">Change Model</button>
                    </div>
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-2 bg-slate-50 overflow-hidden relative group">
                       <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                          <button className="flex items-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold shadow-md">
                            <Box className="w-4 h-4" /> Upload .glb
                          </button>
                       </div>
                       <img src="https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=600&q=80" alt="3D Preview" className="w-full h-48 object-cover rounded-xl" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 font-medium">Supported formats: GLB, GLTF, FBX<br/>Max size: 50MB</p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-end gap-4 pt-8 border-t border-slate-100">
                  <button className="px-6 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-all">
                    Save Draft
                  </button>
                  <button className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all">
                    Publish
                  </button>
                </div>
              </div>
            )}
            
            {/* Other Tabs Placeholders */}
            {activeTab !== 'floor' && (
              <div className="flex flex-col items-center justify-center h-[500px] bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                 <h2 className="text-xl font-bold text-slate-700 mb-2">{tabs.find(t=>t.id===activeTab)?.name} Configuration</h2>
                 <p className="text-sm text-slate-500">Visual editor workspace goes here.</p>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}
