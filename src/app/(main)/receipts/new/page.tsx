
"use client"

import { useRef, useState } from "react"
import { useReactToPrint } from 'react-to-print'
import { useSalon } from "@/context/SalonProvider"
import { PageHeader } from "@/components/PageHeader"
import { ReceiptForm } from "@/components/receipts/ReceiptForm"
import { PrintableReceipt } from "@/components/receipts/PrintableReceipt"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import type { Receipt } from "@/lib/types"
import { Button } from "@/components/ui/button"

export default function NewReceiptPage() {
  const { services, products, workers, addReceipt } = useSalon()
  const { toast } = useToast()
  const router = useRouter()
  const printRef = useRef<HTMLDivElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [printTrigger, setPrintTrigger] = useState<(() => void) | null>(null)

  const handlePrint = useReactToPrint({
      content: () => printRef.current,
      onAfterPrint: () => {
        // This is where we will navigate after printing
      },
  })

  const handleSubmit = async (values: any, previewData: Omit<Receipt, 'id' | 'createdAt'>) => {
    setIsSubmitting(true)
    try {
        const newReceipt = await addReceipt(values)
        toast({
            title: "Receipt Created Successfully!",
            description: `Customer: ${values.customerName}`,
        })
        
        // After saving, trigger the print and then navigate
        const printAndNavigate = () => {
            handlePrint();
            router.push(`/receipts/${newReceipt.id}`);
        };
        
        // A small delay to ensure state updates before printing
        setTimeout(() => {
            printAndNavigate();
            setIsSubmitting(false)
        }, 100);

    } catch (error) {
        console.error("Error creating receipt:", error);
        toast({
            variant: "destructive",
            title: "Error Creating Receipt",
            description: "There was an error creating the receipt. Please try again.",
        })
        setIsSubmitting(false)
    }
  }

  return (
    <>
        <PageHeader
          title="New Receipt"
          description="Generate a new receipt for a customer."
        />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 max-h-[85vh] overflow-y-auto pr-4">
                <ReceiptForm 
                    onSubmit={handleSubmit}
                    services={services}
                    products={products}
                    workers={workers}
                    isSubmitting={isSubmitting}
                    PrintableReceipt={
                        <PrintableReceipt ref={printRef} />
                    }
                />
            </div>
            <div className="lg:col-span-2">
                 <Card className="sticky top-0">
                    <CardContent className="p-0">
                        <div id="receipt-preview">
                            <PrintableReceipt ref={printRef} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </>
  )
}
