"use client"

import { useState } from "react"
import { useSalon } from "@/context/SalonProvider"
import { PageHeader } from "@/components/PageHeader"
import { ReceiptForm } from "@/components/receipts/ReceiptForm"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function NewReceiptPage() {
  const { addReceipt } = useSalon()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (values: any) => {
    try {
        const newReceipt = await addReceipt(values)
        toast({
            title: "Receipt Created Successfully!",
            description: `Customer: ${values.customerName}`,
        })
        router.push(`/receipts/${newReceipt.id}`)
    } catch (error) {
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
          title="Create New Receipt"
          description="Fill out the details below to generate a new receipt for a customer."
        />
        <div className="max-h-[85vh] overflow-y-auto pr-4">
         <ReceiptForm onSubmit={handleSubmit} />
        </div>
    </>
  )
}
