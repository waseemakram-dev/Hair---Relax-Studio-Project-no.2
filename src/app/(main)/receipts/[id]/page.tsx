
"use client"

import { useRef } from 'react'
import { useSalon } from "@/context/SalonProvider"
import { PageHeader } from "@/components/PageHeader"
import { PrintableReceipt } from "@/components/receipts/PrintableReceipt"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'
import type { Timestamp } from 'firebase/firestore'

export default function ReceiptDetailsPage({ params }: { params: { id: string } }) {
  const { getReceiptById, services, products, workers, loading } = useSalon()
  const receipt = getReceiptById(params.id)
  
  const printRef = useRef<HTMLDivElement>(null)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!receipt) {
    notFound()
  }

  const worker = workers.find(w => w.id === receipt.workerId)
  
  const receiptDate = receipt.createdAt instanceof Date 
    ? receipt.createdAt 
    : (receipt.createdAt as Timestamp).toDate();

  const receiptForPrint = {
    ...receipt,
    createdAt: receiptDate
  }

  return (
    <>
      <PageHeader title={`Receipt #${receipt.id.substring(0, 6)}`} description={`Details for customer ${receipt.customerName}.`}>
      </PageHeader>
      <Card>
        <CardContent className="p-0">
          <PrintableReceipt ref={printRef} receipt={receiptForPrint} services={services} products={products} worker={worker} />
        </CardContent>
      </Card>
    </>
  )
}
