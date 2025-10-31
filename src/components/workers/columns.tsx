"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Worker } from "@/lib/types"

export const getColumns = (): ColumnDef<Worker>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "customers",
    header: "Customers Served",
  },
  {
    accessorKey: "sales",
    header: () => <div className="text-right">Total Sales</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("sales"))
      const formatted = new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
]
