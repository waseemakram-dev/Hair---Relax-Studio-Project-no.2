"use client"

import { useState } from "react"
import { useSalon } from "@/context/SalonProvider"
import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable"
import { getColumns } from "@/components/services/columns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ServiceForm } from "@/components/services/ServiceForm"
import { PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Service } from "@/lib/types"

export default function ServicesPage() {
  const { services, addService, updateService, deleteService } = useSalon()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const { toast } = useToast()

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteService(id)
    toast({
      title: "Service Deleted",
      description: "The service has been successfully deleted.",
    })
  }
  
  const columns = getColumns({ onEdit: handleEdit, onDelete: handleDelete })

  const handleSubmit = (values: { name: string; price: number }) => {
    if (editingService) {
      updateService({ ...editingService, ...values })
      toast({ title: "Service Updated" })
    } else {
      addService(values)
      toast({ title: "Service Created" })
    }
    setDialogOpen(false)
    setEditingService(null)
  }

  return (
    <>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingService(null)
        }}
      >
        <PageHeader
          title="Services"
          description="Manage your salon's services."
        >
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </DialogTrigger>
        </PageHeader>
        <DataTable
          columns={columns}
          data={services}
          noResultsMessage="No services found. Add one to get started."
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Add a New Service"}
            </DialogTitle>
          </DialogHeader>
          <ServiceForm onSubmit={handleSubmit} service={editingService} />
        </DialogContent>
      </Dialog>
    </>
  )
}
