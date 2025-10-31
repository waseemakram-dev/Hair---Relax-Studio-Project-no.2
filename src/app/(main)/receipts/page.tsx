"use client"

import { useState } from "react"
import { useSalon } from "@/context/SalonProvider"
import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable"
import { getColumns } from "@/components/receipts/columns"
import { PlusCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ReceiptForm } from "@/components/receipts/ReceiptForm"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function ReceiptsPage() {
  const { receipts, workers, addReceipt } = useSalon()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const columns = getColumns({ workers })
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = (values: any) => {
    const newReceipt = addReceipt(values)
    toast({
        title: "Receipt Created Successfully!",
        description: `Customer: ${values.customerName}`,
    })
    setDialogOpen(false)
    router.push(`/receipts/${newReceipt.id}`)
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <PageHeader
          title="Receipts"
          description="Manage and create customer receipts."
        >
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Receipt
            </Button>
          </DialogTrigger>
        </PageHeader>
        <DataTable columns={columns} data={receipts} noResultsMessage="No receipts yet." />
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Receipt</DialogTitle>
            <DialogDescription>
                Fill out the details below to generate a new receipt for a customer.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[75vh] overflow-y-auto p-1 pr-4">
            <ReceiptForm onSubmit={handleSubmit} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
