"use client"

import { useState } from "react"
import { PageHeader } from "@/components/PageHeader"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useSalon } from "@/context/SalonProvider"
import { OverallSales } from "@/components/reports/OverallSales"
import { WorkerReport } from "@/components/reports/WorkerReport"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsPage() {
  const { workers, sales } = useSalon()

  const downloadReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,Portion/Worker,Total Sales,Total Customers\n"
    const activeWorkers = workers.filter(w => !w.archived)
    activeWorkers.forEach(worker => {
      csvContent += `${worker.name},${worker.sales.toFixed(2)},${worker.customers}\n`
    })
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute(
      "download",
      `salonflow_report_${new Date().toISOString().split("T")[0]}.csv`
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <PageHeader
        title="Sales Report"
        description="Analyze your sales and worker performance."
      >
        <Button onClick={downloadReport} className="bg-red-600 text-white hover:bg-red-700">
          <Download className="mr-2 h-4 w-4" />
          Download Reports
        </Button>
      </PageHeader>
      <Tabs defaultValue="overall">
        <TabsList>
          <TabsTrigger value="overall">Overall Sales</TabsTrigger>
          <TabsTrigger value="workers">Worker Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overall">
          <OverallSales sales={sales} />
        </TabsContent>
        <TabsContent value="workers">
          <WorkerReport workers={workers} />
        </TabsContent>
      </Tabs>
    </>
  )
}
