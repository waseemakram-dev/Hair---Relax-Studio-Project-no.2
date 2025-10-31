"use client"

import { useSalon } from "@/context/SalonProvider"
import { PageHeader } from "@/components/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function ReportsPage() {
  const { workers } = useSalon()

  const activeWorkers = workers.filter(w => !w.archived)
  const archivedWorkers = workers.filter(w => w.archived)

  const totalSales = activeWorkers.reduce((sum, worker) => sum + worker.sales, 0)
  const totalCustomers = activeWorkers.reduce((sum, worker) => sum + worker.customers, 0)

  const downloadReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,Portion/Worker,Total Sales,Total Customers\n"
    activeWorkers.forEach(worker => {
        csvContent += `${worker.name},${worker.sales.toFixed(2)},${worker.customers}\n`
    })
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `salonflow_report_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <PageHeader title="Sales Reports" description="An overview of your salon's performance.">
          <Button onClick={downloadReport}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
      </PageHeader>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Salon Sales</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">Rs {totalSales.toFixed(2)}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalCustomers}</div>
            </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
            <CardTitle>Active Worker Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Portion / Worker</TableHead>
                        <TableHead>Customers Served</TableHead>
                        <TableHead className="text-right">Total Sales</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {activeWorkers.map(worker => (
                        <TableRow key={worker.id}>
                            <TableCell className="font-medium">{worker.name}</TableCell>
                            <TableCell>{worker.customers}</TableCell>
                            <TableCell className="text-right">Rs {worker.sales.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

      {archivedWorkers.length > 0 && (
        <Card className="mt-6">
            <CardHeader>
                <CardTitle>Archived Worker Report</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Portion / Worker</TableHead>
                            <TableHead>Customers Served</TableHead>
                            <TableHead className="text-right">Total Sales</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {archivedWorkers.map(worker => (
                            <TableRow key={worker.id}>
                                <TableCell className="font-medium">{worker.name}</TableCell>
                                <TableCell>{worker.customers}</TableCell>
                                <TableCell className="text-right">Rs {worker.sales.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      )}
    </>
  )
}
