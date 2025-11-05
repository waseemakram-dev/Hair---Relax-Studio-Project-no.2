"use client"

import { useSalon } from "@/context/SalonProvider"
import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable"
import { getColumns } from "@/components/sales/columns"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function SalesPage() {
  const { sales, workers } = useSalon()
  const columns = getColumns({ workers })

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
    </>
  )
}
