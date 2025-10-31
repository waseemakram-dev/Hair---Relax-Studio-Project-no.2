'use client'

import React from 'react'
import type { Receipt, Service, Product, Worker } from '@/lib/types'
import { Separator } from '@/components/ui/separator'
import { Logo } from '../Logo'

interface PrintableReceiptProps {
  receipt?: Partial<Receipt>
  services?: Service[]
  products?: Product[]
  worker?: Worker | undefined
}

export const PrintableReceipt = React.forwardRef<HTMLDivElement, PrintableReceiptProps>(
  ({ receipt, services = [], products = [], worker }, ref) => {
    
    const receiptServices = (receipt?.serviceIds || []).map(id => services.find(s => s.id === id)).filter(Boolean) as Service[]
    const receiptProducts = (receipt?.productIds || []).map(item => {
        const product = products.find(p => p.id === item.id)
        return product ? { ...product, quantity: item.quantity } : null
    }).filter(Boolean) as (Product & {quantity: number})[]

    const subtotal = (receiptServices.reduce((acc, s) => acc + s.price, 0) + receiptProducts.reduce((acc, p) => acc + (p.price * p.quantity), 0))
    const discountAmount = subtotal * ((receipt?.discount || 0) / 100)
    const total = receipt?.total ?? (subtotal - discountAmount)

    const createdAt = receipt?.createdAt ? (receipt.createdAt instanceof Date ? receipt.createdAt : new Date()) : new Date();

    return (
      <div ref={ref} className="p-6 bg-white text-black print:p-0">
        <div className="max-w-md mx-auto print:max-w-none print:mx-0">
          <div className="text-center mb-6">
            <Logo className="w-64 h-auto mx-auto" />
            <p className="text-slate-500 text-xs mt-2">13/G Road, Gulshan-e-Batool Colony, Chishtian</p>
            <p className="text-slate-500 text-xs">+923230284330</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                  <h3 className="font-semibold mb-1">Billed To:</h3>
                  <p>{receipt?.customerName || 'Customer Name'}</p>
              </div>
              <div className="text-right">
                  <p><span className='font-semibold'>Date:</span> {createdAt.toLocaleDateString()}</p>
                  <p><span className='font-semibold'>Invoice #:</span> {(receipt?.id || '244381').substring(0,6)}</p>
              </div>
          </div>

          <div className="text-sm mb-4 text-right">
               <h3 className="font-semibold mb-2">Stylist: {worker?.name || 'Worker Name'}</h3>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-semibold py-2">Item</th>
                  <th className="text-right font-semibold py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {receiptServices.length === 0 && receiptProducts.length === 0 ? (
                    <tr>
                        <td colSpan={2} className="text-center py-4 text-slate-500">No items added</td>
                    </tr>
                ) : (
                    <>
                        {receiptServices.map(service => (
                            <tr key={service.id} className="border-b">
                            <td className="py-2">{service.name}</td>
                            <td className="text-right py-2">Rs {service.price.toFixed(2)}</td>
                            </tr>
                        ))}
                        {receiptProducts.map(product => (
                            <tr key={product.id} className="border-b">
                            <td className="py-2">{product.name} (x{product.quantity})</td>
                            <td className="text-right py-2">Rs {(product.price * product.quantity).toFixed(2)}</td>
                            </tr>
                        ))}
                    </>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-sm space-y-2">
              <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rs {subtotal.toFixed(2)}</span>
              </div>
              { (receipt?.discount || 0) > 0 && (
                  <div className="flex justify-between">
                      <span>Discount ({receipt?.discount || 0}%)</span>
                      <span className="text-green-600">-Rs {discountAmount.toFixed(2)}</span>
                  </div>
              )}
               <Separator className="my-2"/>
               <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>Rs {total.toFixed(2)}</span>
              </div>
          </div>
          
          <Separator className="my-6" />

          <div className="text-center text-xs text-slate-500">
              <p>Thank you for visiting HAIR & RELAX STUDIO!</p>
              <p className="mt-1">Developed by Waseem Akram</p>
              <p>+923230284330</p>
          </div>
        </div>
      </div>
    )
  }
)

PrintableReceipt.displayName = "PrintableReceipt"
