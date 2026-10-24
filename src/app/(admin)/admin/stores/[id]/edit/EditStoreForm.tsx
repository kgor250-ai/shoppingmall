'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateStore } from '@/actions/admin'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EditStoreForm({ store, categories, owners }: { store: any, categories: any[], owners: any[] }) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    formData.append('storeId', store.id)
    const result = await updateStore(formData)
    
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push(`/admin/stores/${store.id}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Store Name</Label>
          <Input id="name" name="name" defaultValue={store.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="storeNumber">Store Number (e.g. A-101)</Label>
          <Input id="storeNumber" name="storeNumber" defaultValue={store.storeNumber} required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="floor">Floor</Label>
          <Input id="floor" name="floor" defaultValue={store.floor} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <select id="categoryId" name="categoryId" defaultValue={store.categoryId} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" required>
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={store.phone || ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={store.email || ''} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="monthlyRent">Monthly Rent (₹)</Label>
          <Input id="monthlyRent" name="monthlyRent" type="number" step="0.01" defaultValue={store.monthlyRent} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="openingDate">Opening Date</Label>
          <Input id="openingDate" name="openingDate" type="date" defaultValue={new Date(store.openingDate).toISOString().split('T')[0]} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ownerId">Assign Store Owner</Label>
        <select id="ownerId" name="ownerId" defaultValue={store.ownerId || ''} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
          <option value="">None (Unassigned)</option>
          {owners.map(o => (
            <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" defaultValue={store.description || ''} />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  )
}
