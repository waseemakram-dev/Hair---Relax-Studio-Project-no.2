"use client"

import { useSalon } from "@/context/SalonProvider"
import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable"
import { getColumns } from "@/components/receipts/columns"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ReceiptsPage() {
  const { receipts, workers } = useSalon()
  const columns = getColumns({ workers })
  const router = useRouter()

  return (
    <>
      <PageHeader
        title="Receipts"
        description="Manage and create customer receipts."
      >
        <Button asChild>
          <Link href="/receipts/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Receipt
          </Link>
        </Button>
      </PageHeader>
      <DataTable columns={columns} data={receipts} noResultsMessage="No receipts yet." />
    </>
  )
}
