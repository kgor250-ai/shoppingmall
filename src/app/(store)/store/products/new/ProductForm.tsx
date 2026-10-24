'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { saveProduct } from '@/actions/store'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProductForm({ categories, storeId, initialData = null }: { categories: any[], storeId: string, initialData?: any }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    if (initialData) formData.append('id', initialData.id)
    formData.append('storeId', storeId)

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
          <Input id="name" name="name" required defaultValue={initialData?.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" name="sku" required defaultValue={initialData?.sku} />
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
          <Label htmlFor="unit">Unit (e.g. pcs, kg, ltr)</Label>
          <Input id="unit" name="unit" required defaultValue={initialData?.unit || 'pcs'} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="costPrice">Cost Price</Label>
          <Input id="costPrice" name="costPrice" type="number" step="0.01" required defaultValue={initialData?.costPrice} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sellingPrice">Selling Price</Label>
          <Input id="sellingPrice" name="sellingPrice" type="number" step="0.01" required defaultValue={initialData?.sellingPrice} />
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

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" defaultValue={initialData?.description} />
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
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Saving...' : initialData ? 'Update Product' : 'Create Product'}
      </Button>
    </form>
  )
}
