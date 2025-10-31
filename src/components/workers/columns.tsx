"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Worker } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash2, Pencil } from "lucide-react"

interface WorkersColumnsProps {
  onEdit: (worker: Worker) => void
  onDelete: (id: string) => void
}

export const getColumns = ({ onEdit, onDelete }: WorkersColumnsProps): ColumnDef<Worker>[] => [
  {
    accessorKey: "name",
    header: "Worker Name",
  },
  {
    accessorKey: "customers",
    header: "Customers Served",
  },
  {
    accessorKey: "sales",
    header: "Individual Sales",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("sales"))
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
      const worker = row.original

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
                <DropdownMenuItem onClick={() => onEdit(worker)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(worker.id)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
      )
    },
  },
]
