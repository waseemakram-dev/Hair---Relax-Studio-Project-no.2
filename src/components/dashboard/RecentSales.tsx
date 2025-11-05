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

export function RecentSales() {
  const { sales, workers } = useSalon()
  const recentSales = [...sales]
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
            {recentSales.length > 0 ? (
              recentSales.map((sale) => {
                const worker = workers.find(w => w.id === sale.workerId)
                const createdAt = sale.createdAt instanceof Date ? sale.createdAt : (sale.createdAt as Timestamp).toDate();
                return (
                  <TableRow key={sale.id}>
                    <TableCell>
                      <div className="font-medium">{sale.customerName}</div>
                      <div className="text-sm text-muted-foreground">{createdAt.toLocaleTimeString()}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{worker?.name || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell className="text-right">Rs {sale.total.toFixed(2)}</TableCell>
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
