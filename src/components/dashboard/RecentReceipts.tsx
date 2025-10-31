"use client"

import { useSalon } from "@/context/SalonProvider"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import type { Timestamp } from "firebase/firestore"

export function RecentReceipts() {
  const { receipts, workers } = useSalon()
  const recentReceipts = [...receipts]
    .sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : (a.createdAt as Timestamp).toMillis();
        const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : (b.createdAt as Timestamp).toMillis();
        return dateB - dateA;
    })
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>An overview of the most recent transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Portion</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentReceipts.length > 0 ? (
              recentReceipts.map((receipt) => {
                const worker = workers.find(w => w.id === receipt.workerId)
                const createdAt = receipt.createdAt instanceof Date ? receipt.createdAt : (receipt.createdAt as Timestamp).toDate();
                return (
                  <TableRow key={receipt.id}>
                    <TableCell>
                      <div className="font-medium">{receipt.customerName}</div>
                      <div className="text-sm text-muted-foreground">{createdAt.toLocaleTimeString()}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{worker?.name || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell className="text-right">Rs {receipt.total.toFixed(2)}</TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No recent sales.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
