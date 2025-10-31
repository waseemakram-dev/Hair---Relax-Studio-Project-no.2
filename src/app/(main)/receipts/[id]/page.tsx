"use client"

import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { useSalon } from "@/context/SalonProvider"
import { PageHeader } from "@/components/PageHeader"
import { PrintableReceipt } from "@/components/receipts/PrintableReceipt"
import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Printer, Loader2 } from 'lucide-react'
import type { Timestamp } from 'firebase/firestore'

export default function ReceiptDetailsPage({ params }: { params: { id: string } }) {
  const { getReceiptById, services, products, workers, loading } = useSalon()
  const receipt = getReceiptById(params.id)
  
  const printRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
      content: () => printRef.current,
  })

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

  return (
    <>
      <PageHeader title={`Receipt #${receipt.id.substring(0, 7)}`} description={`Details for customer ${receipt.customerName}.`}>
          <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
          </Button>
      </PageHeader>
      <Card>
        <CardContent className="p-0">
          <PrintableReceipt ref={printRef} receipt={{...receipt, createdAt: receiptDate}} services={services} products={products} worker={worker} />
        </CardContent>
      </Card>
    </>
  )
}
