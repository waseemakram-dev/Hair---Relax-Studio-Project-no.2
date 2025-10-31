"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Receipt, Worker } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface ReceiptsColumnsProps {
  workers: Worker[]
}

export const getColumns = ({ workers }: ReceiptsColumnsProps): ColumnDef<Receipt>[] => [
  {
    accessorKey: "customerName",
    header: "Customer",
  },
  {
    accessorKey: "workerId",
    header: "Portion / Worker",
    cell: ({ row }) => {
      const workerId = row.getValue("workerId")
      const worker = workers.find(w => w.id === workerId)
      return <Badge variant="outline">{worker?.name || "N/A"}</Badge>
    }
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return <div>{date.toLocaleDateString()}</div>
    }
  },
  {
    accessorKey: "total",
    header: () => <div className="text-right">Total Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const receipt = row.original

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/receipts/${receipt.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View & Print
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
