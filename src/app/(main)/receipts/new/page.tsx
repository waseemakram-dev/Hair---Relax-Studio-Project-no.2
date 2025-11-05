
"use client"

import { useSalon } from "@/context/SalonProvider"
import { PageHeader } from "@/components/PageHeader"
import { ReceiptForm } from "@/components/receipts/ReceiptForm"
import { PrintableReceipt } from "@/components/receipts/PrintableReceipt"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"

export default function NewReceiptPage() {
  const { services, products, workers, addReceipt } = useSalon()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (values: any) => {
    try {
        const newReceipt = await addReceipt(values)
        toast({
            title: "Receipt Created Successfully!",
            description: `Customer: ${values.customerName}`,
        })
        router.push(`/receipts/${newReceipt.id}`);

    } catch (error) {
        console.error("Error creating receipt:", error);
        toast({
            variant: "destructive",
            title: "Error Creating Receipt",
            description: "There was an error creating the receipt. Please try again.",
        })
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
                />
            </div>
            <div className="lg:col-span-2">
                 <Card className="sticky top-0">
                    <CardContent className="p-0">
                        <div id="receipt-preview">
                            <PrintableReceipt />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </>
  )
}
