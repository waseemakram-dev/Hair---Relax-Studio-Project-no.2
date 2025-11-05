"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Sale, Worker } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Timestamp } from "firebase/firestore"
import Link from "next/link"

interface SalesColumnsProps {
  workers: Worker[]
  onDelete: (id: string) => void
}

export const getColumns = ({ workers, onDelete }: SalesColumnsProps): ColumnDef<Sale>[] => [
    {
    accessorKey: "id",
    header: "Invoice #",
    cell: ({ row }) => {
        return <span>#{(row.getValue("id") as string).substring(0,6)}</span>
    }
  },
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
      const ts = row.getValue("createdAt") as Timestamp | Date;
      const date = ts instanceof Date ? ts : ts.toDate();
      return <div>{date.toLocaleDateString()}</div>
    }
  },
  {
    accessorKey: "total",
    header: () => <div className="text-right">Total Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"))
      const formatted = new Intl.NumberFormat("en-PK", {
        style: "currency",
        currency: "PKR",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const sale = row.original

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
                <Link href={`/sales/${sale.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Sale
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(sale.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Sale
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
