"use client"

import { useState } from "react"
import { useSalon } from "@/context/SalonProvider"
import { PageHeader } from "@/components/PageHeader"
import { DataTable } from "@/components/DataTable"
import { getColumns } from "@/components/workers/columns"

export default function WorkersPage() {
  const { workers } = useSalon()

  const columns = getColumns()

  return (
    <>
        <PageHeader
          title="Workers"
          description="Manage your salon's workers/portions."
        />
        <DataTable
          columns={columns}
          data={workers}
          noResultsMessage="No workers found."
        />
    </>
  )
}
