"use client"

import { useSalon } from "@/context/SalonProvider"
import { PageHeader } from "@/components/PageHeader"
import { SaleForm } from "@/components/sales/SaleForm"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import type { Sale } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function EditSalePage() {
  const { services, products, workers, getSaleById, updateSale, loading } = useSalon()
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const id = params.id as string;

  const [sale, setSale] = useState<Sale | null>(null);

  useEffect(() => {
    if (!loading) {
      const saleData = getSaleById(id);
      if (saleData) {
        setSale(saleData);
      } else {
        // Handle case where sale is not found
        toast({
          variant: "destructive",
          title: "Sale Not Found",
        })
        router.push("/sales")
      }
    }
  }, [id, getSaleById, loading, router, toast])


  const handleSubmit = async (values: any) => {
    if (!sale) return;
    try {
        await updateSale(id, sale, values)
        toast({
            title: "Sale Updated Successfully!",
            description: `Customer: ${values.customerName}`,
        })
        router.push(`/sales`);

    } catch (error) {
        console.error("Error updating sale:", error);
        toast({
            variant: "destructive",
            title: "Error Updating Sale",
            description: "There was an error updating the sale. Please try again.",
        })
    }
  }

  if (loading || !sale) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
        <PageHeader
          title="Edit Sale"
          description={`Editing sale #${id.substring(0,6)}`}
        />
        <div className="max-w-xl">
          <SaleForm 
              onSubmit={handleSubmit}
              services={services}
              products={products}
              workers={workers}
              existingSale={sale}
          />
        </div>
    </>
  )
}
