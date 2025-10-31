'use client'

import React from 'react'
import type { Receipt, Service, Product, Worker } from '@/lib/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Printer, Package } from 'lucide-react'

interface PrintableReceiptProps {
  receipt: Receipt
  services: Service[]
  products: Product[]
  worker: Worker | undefined
}

export const PrintableReceipt = React.forwardRef<HTMLDivElement, PrintableReceiptProps>(
  ({ receipt, services, products, worker }, ref) => {
    
    const receiptServices = receipt.serviceIds.map(id => services.find(s => s.id === id)).filter(Boolean) as Service[]
    const receiptProducts = receipt.productIds.map(item => {
        const product = products.find(p => p.id === item.id)
        return product ? { ...product, quantity: item.quantity } : null
    }).filter(Boolean) as (Product & {quantity: number})[]

    const subtotal = receiptServices.reduce((acc, s) => acc + s.price, 0) + receiptProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0)
    const discountAmount = subtotal * (receipt.discount / 100)

    return (
      <>
        <div ref={ref} className="p-8 bg-white text-black">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Package className="h-8 w-8 text-slate-800" />
                <h1 className="text-3xl font-bold">SalonFlow</h1>
              </div>
              <p className="text-slate-500">123 Beauty Lane, Glamour City, 12345</p>
            </div>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                    <h3 className="font-semibold mb-1">Billed To</h3>
                    <p>{receipt.customerName}</p>
                </div>
                <div className="text-right">
                    <h3 className="font-semibold mb-1">Receipt Details</h3>
                    <p>#{receipt.id.substring(0, 7)}</p>
                    <p>{new Date(receipt.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="text-sm">
                 <h3 className="font-semibold mb-2">Portion / Worker: {worker?.name || 'N/A'}</h3>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="font-semibold mb-2">Order Summary</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-semibold py-2">Item</th>
                    <th className="text-right font-semibold py-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptServices.map(service => (
                    <tr key={service.id} className="border-b">
                      <td className="py-2">{service.name}</td>
                      <td className="text-right py-2">${service.price.toFixed(2)}</td>
                    </tr>
                  ))}
                  {receiptProducts.map(product => (
                    <tr key={product.id} className="border-b">
                      <td className="py-2">{product.name} (x{product.quantity})</td>
                      <td className="text-right py-2">${(product.price * product.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-sm space-y-2">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                {receipt.discount > 0 && (
                    <div className="flex justify-between">
                        <span>Discount ({receipt.discount}%)</span>
                        <span className="text-green-600">-${discountAmount.toFixed(2)}</span>
                    </div>
                )}
                 <Separator className="my-2"/>
                 <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>${receipt.total.toFixed(2)}</span>
                </div>
            </div>
            
            <Separator className="my-6" />

            <div className="text-center text-xs text-slate-500">
                <p>Thank you for your visit!</p>
            </div>
          </div>
        </div>
      </>
    )
  }
)

PrintableReceipt.displayName = "PrintableReceipt"
