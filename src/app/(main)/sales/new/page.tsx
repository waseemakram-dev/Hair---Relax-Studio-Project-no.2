"use client"

import { useSalon } from "@/context/SalonProvider"
import { PageHeader } from "@/components/PageHeader"
import { SaleForm } from "@/components/sales/SaleForm"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function NewSalePage() {
  const { services, products, workers, addSale } = useSalon()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (values: any) => {
    try {
        const newSale = await addSale(values)
        toast({
            title: "Sale Created Successfully!",
            description: `Customer: ${values.customerName}`,
        })
        router.push(`/sales`);

    } catch (error) {
        console.error("Error creating sale:", error);
        toast({
            variant: "destructive",
            title: "Error Creating Sale",
            description: "There was an error creating the sale. Please try again.",
        })
    }
  }

  return (
    <>
        <PageHeader
          title="New Sale"
          description="Generate a new sale for a customer."
        />
        <div className="max-w-xl">
          <SaleForm 
              onSubmit={handleSubmit}
              services={services}
              products={products}
              workers={workers}
          />
        </div>
    </>
  )
}
