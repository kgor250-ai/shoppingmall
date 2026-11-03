'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { saveProduct } from '@/actions/store'
import { ImageIcon, Sparkles } from 'lucide-react'

const sampleImages = [
  { name: 'Luxury Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
  { name: 'Designer Bag', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80' },
  { name: 'Perfume', url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&q=80' },
  { name: 'Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
  { name: 'Smartphone', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80' },
  { name: 'Sunglasses', url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80' },
]

function parseInitialImage(desc: string | null | undefined): string {
  if (!desc) return ''
  const match = desc.match(/\[IMG:(.*?)\]/)
  if (match) return match[1]
  if (desc.startsWith('http://') || desc.startsWith('https://')) {
    return desc.split(' ')[0]
  }
  return ''
}

function parseInitialDescription(desc: string | null | undefined): string {
  if (!desc) return ''
  return desc.replace(/\[IMG:.*?\]\s*/, '').trim()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProductForm({ categories, storeId, initialData = null }: { categories: any[], storeId: string, initialData?: any }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(parseInitialImage(initialData?.description))

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    if (initialData) formData.append('id', initialData.id)
    formData.append('storeId', storeId)
    formData.append('imageUrl', imageUrl.trim())

    const result = await saveProduct(formData)
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push('/store/products')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" name="name" required defaultValue={initialData?.name} placeholder="e.g. Classic Chronograph Gold Watch" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU Code</Label>
          <Input id="sku" name="sku" required defaultValue={initialData?.sku} placeholder="e.g. WATCH-GLD-01" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <select id="categoryId" name="categoryId" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" required defaultValue={initialData?.categoryId}>
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">Unit (e.g. pcs, kg, box)</Label>
          <Input id="unit" name="unit" required defaultValue={initialData?.unit || 'pcs'} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="costPrice">Cost Price (₹)</Label>
          <Input id="costPrice" name="costPrice" type="number" step="0.01" required defaultValue={initialData?.costPrice} placeholder="1500" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sellingPrice">Selling Price (₹)</Label>
          <Input id="sellingPrice" name="sellingPrice" type="number" step="0.01" required defaultValue={initialData?.sellingPrice} placeholder="2499" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="currentStock">Current Stock</Label>
          <Input id="currentStock" name="currentStock" type="number" required defaultValue={initialData?.currentStock || 0} disabled={!!initialData} title={initialData ? "Use Stock System to adjust existing stock" : ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minimumStock">Minimum Stock Alert Level</Label>
          <Input id="minimumStock" name="minimumStock" type="number" required defaultValue={initialData?.minimumStock || 5} />
        </div>
      </div>

      {/* Product Image / Photo URL & Preview */}
      <div className="space-y-2 p-3.5 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/50">
        <div className="flex items-center justify-between">
          <Label htmlFor="imageUrl" className="text-xs font-semibold flex items-center gap-1.5 text-stone-700 dark:text-stone-300">
            <ImageIcon className="h-4 w-4 text-[#d4af37]" />
            <span>Product Photo / Image URL</span>
          </Label>
          <span className="text-[11px] text-stone-500">Paste image URL or pick preset below</span>
        </div>

        <div className="flex gap-3 items-center">
          <Input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/... or paste product photo link"
            className="flex-1 text-xs"
          />
          {imageUrl && (
            <div className="h-12 w-12 rounded-lg border border-stone-300 dark:border-stone-700 overflow-hidden flex-shrink-0 bg-stone-100 dark:bg-stone-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        {/* Quick Sample Presets */}
        <div className="pt-1.5 flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] text-stone-400 font-medium flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-[#d4af37]" />
            <span>Sample Presets:</span>
          </span>
          {sampleImages.map((s) => (
            <button
              key={s.name}
              type="button"
              onClick={() => setImageUrl(s.url)}
              className="text-[10px] py-0.5 px-2 rounded-full border border-stone-200 dark:border-stone-700 hover:border-[#d4af37] bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Product Description</Label>
        <Input id="description" name="description" defaultValue={parseInitialDescription(initialData?.description)} placeholder="Enter details, material, dimensions, warranty, etc." />
      </div>
      
      {initialData && (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" defaultValue={initialData.status}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
      
      <Button type="submit" className="w-full font-semibold" disabled={loading}>
        {loading ? 'Saving Product...' : initialData ? 'Update Product' : 'Create Product with Picture'}
      </Button>
    </form>
  )
}
