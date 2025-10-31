"use client"

import { useState } from "react"
import { useSalon } from "@/context/SalonProvider"
import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable"
import { getColumns } from "@/components/products/columns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ProductForm } from "@/components/products/ProductForm"
import { PlusCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useSalon()
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteProduct(id)
    toast({
      title: "Product Deleted",
      description: "The product has been successfully deleted.",
    })
  }
  
  const columns = getColumns({ onEdit: handleEdit, onDelete: handleDelete })

  const handleSubmit = (values: { name: string; price: number, stock: number }) => {
    if (editingProduct) {
      updateProduct({ ...editingProduct, ...values })
      toast({ title: "Product Updated" })
    } else {
      addProduct(values)
      toast({ title: "Product Created" })
    }
    setDialogOpen(false)
    setEditingProduct(null)
  }

  return (
    <>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingProduct(null)
        }}
      >
        <PageHeader
          title="Inventory"
          description="Manage your salon's product inventory."
        >
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
        </PageHeader>
        <DataTable
          columns={columns}
          data={products}
          noResultsMessage="No products found. Add one to get started."
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add a New Product"}
            </DialogTitle>
          </DialogHeader>
          <ProductForm onSubmit={handleSubmit} product={editingProduct} />
        </DialogContent>
      </Dialog>
    </>
  )
}
