'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Search, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react'
import { createSale } from '@/actions/billing'
import { formatINR } from '@/lib/utils'

export default function BillingClient({ initialProducts, storeId }: { initialProducts: any[], storeId: string }) {
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<any[]>([])
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CASH')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const filteredProducts = initialProducts.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.id === product.id)
    if (existing) {
      if (existing.quantity + 1 > product.currentStock) {
        alert('Insufficient stock available.')
        return
      }
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      if (product.currentStock < 1) {
        alert('Out of stock.')
        return
      }
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta
        if (newQuantity < 1) return item
        if (newQuantity > item.currentStock) {
          alert('Insufficient stock available.')
          return item
        }
        return { ...item, quantity: newQuantity }
      }
      return item
    }))
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.sellingPrice * item.quantity), 0)
  const discount = 0
  const tax = subtotal * 0.1 // 10% tax for example
  const total = subtotal - discount + tax

  const handleCheckout = async () => {
    if (cart.length === 0) return
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    const result = await createSale({
      storeId,
      cart: cart.map(c => ({ id: c.id, quantity: c.quantity, unitPrice: c.sellingPrice })),
      customerName,
      customerPhone,
      paymentMethod,
      subtotal,
      discount,
      tax,
      total
    })

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess(`Sale successful! Invoice: ${result.invoiceNumber}`)
      setCart([])
      setCustomerName('')
      setCustomerPhone('')
    }
    setIsSubmitting(false)
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Search Products</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or SKU..." 
                className="pl-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.slice(0, 12).map(product => (
                <div key={product.id} className="p-4 border rounded-lg flex flex-col justify-between hover:border-blue-500 transition-colors">
                  <div>
                    <h3 className="font-semibold truncate" title={product.name}>{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.sku}</p>
                    <p className="font-medium mt-2">{formatINR(product.sellingPrice)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Stock: {product.currentStock}</p>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    variant={product.currentStock > 0 ? 'default' : 'secondary'}
                    disabled={product.currentStock < 1}
                    onClick={() => addToCart(product)}
                  >
                    Add
                  </Button>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-8 text-center text-muted-foreground">
                  No products found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Current Bill
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground border-dashed border-2 rounded-lg">
                Cart is empty
              </div>
            ) : (
              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-start border-b pb-4">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-muted-foreground text-xs">{formatINR(item.sellingPrice)} x {item.quantity}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 ml-4">
                      <div className="font-medium">{formatINR(item.sellingPrice * item.quantity)}</div>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, -1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-xs w-4 text-center">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 ml-1" onClick={() => removeFromCart(item.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span>{formatINR(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{formatINR(total)}</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div>
                <Input placeholder="Customer Name (Optional)" value={customerName} onChange={e => setCustomerName(e.target.value)} className="h-9" />
              </div>
              <div>
                <Input placeholder="Customer Phone (Optional)" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="h-9" />
              </div>
              <div className="flex gap-2">
                <Button variant={paymentMethod === 'CASH' ? 'default' : 'outline'} className="flex-1" onClick={() => setPaymentMethod('CASH')}>Cash</Button>
                <Button variant={paymentMethod === 'CARD' ? 'default' : 'outline'} className="flex-1" onClick={() => setPaymentMethod('CARD')}>Card</Button>
              </div>
            </div>

            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}
            {success && <div className="p-3 bg-green-50 text-green-600 text-sm rounded-md">{success}</div>}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white" 
              onClick={handleCheckout} 
              disabled={cart.length === 0 || isSubmitting}
            >
              {isSubmitting ? 'Processing...' : `Checkout - ${formatINR(total)}`}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
