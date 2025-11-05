"use client"

import { useState } from "react"
import { useSalon } from "@/context/SalonProvider"
import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable"
import { getColumns } from "@/components/sales/columns"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

export default function SalesPage() {
  const { sales, workers, deleteSale } = useSalon()
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDeleteRequest = (id: string) => {
    setSaleToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (saleToDelete) {
      await deleteSale(saleToDelete)
      toast({
        title: "Sale Deleted",
        description: "The sale has been successfully deleted.",
      })
      setSaleToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const columns = getColumns({ workers, onDelete: handleDeleteRequest })

  return (
    <>
      <PageHeader
        title="Sales"
        description="Manage and create customer sales."
      >
        <Button asChild>
          <Link href="/sales/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Sale
          </Link>
        </Button>
      </PageHeader>
      <DataTable columns={columns} data={sales} noResultsMessage="No sales yet." />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the sale
              and restock any products that were part of it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
