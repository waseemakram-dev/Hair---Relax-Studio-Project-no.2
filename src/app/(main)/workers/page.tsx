"use client"

import { useState } from "react"
import { useSalon } from "@/context/SalonProvider"
import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable"
import { getColumns } from "@/components/workers/columns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { WorkerForm } from "@/components/workers/WorkerForm"
import { PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Worker } from "@/lib/types"

export default function WorkersPage() {
  const { workers, addWorker, updateWorker, archiveWorker } = useSalon()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null)
  const { toast } = useToast()

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    archiveWorker(id)
    toast({
      title: "Worker Archived",
      description: "The worker has been moved to the archived reports.",
    })
  }
  
  const columns = getColumns({ onEdit: handleEdit, onDelete: handleDelete })

  const handleSubmit = (values: { name: string }) => {
    if (editingWorker) {
      updateWorker({ ...editingWorker, ...values })
      toast({ title: "Worker Updated" })
    } else {
      addWorker({ ...values, customers: 0, sales: 0 })
      toast({ title: "Worker Created" })
    }
    setDialogOpen(false)
    setEditingWorker(null)
  }

  const activeWorkers = workers.filter(w => !w.archived)

  return (
    <>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingWorker(null)
        }}
      >
        <PageHeader
          title="Workers"
          description="Manage your workers."
        >
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Worker
            </Button>
          </DialogTrigger>
        </PageHeader>
        <DataTable
          columns={columns}
          data={activeWorkers}
          filterColumn="name"
          filterPlaceholder="Filter workers..."
          noResultsMessage="No workers found."
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingWorker ? "Edit Worker" : "Add a New Worker"}
            </DialogTitle>
          </DialogHeader>
          <WorkerForm onSubmit={handleSubmit} worker={editingWorker} />
        </DialogContent>
      </Dialog>
    </>
  )
}
