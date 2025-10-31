"use client"

import { useSalon } from "@/context/SalonProvider"
import { PageHeader } from "@/components/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, DollarSign, Users } from "lucide-react"

export default function TopWorkerPage() {
  const { workers } = useSalon()

  const topWorker = workers.reduce((top, worker) => {
    return worker.sales > (top?.sales || 0) ? worker : top
  }, workers[0] || null)

  return (
    <>
      <PageHeader
        title="Top Worker"
        description="Highlighting the top performing portion of the month."
      />
      {topWorker ? (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <Award className="h-16 w-16 mx-auto text-yellow-500" />
            <CardTitle className="text-3xl mt-4">{topWorker.name}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-center">
            <div className="flex flex-col items-center">
              <DollarSign className="h-8 w-8 text-primary" />
              <p className="text-2xl font-bold mt-2">Rs {topWorker.sales.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total Sales</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="h-8 w-8 text-primary" />
              <p className="text-2xl font-bold mt-2">{topWorker.customers}</p>
              <p className="text-sm text-muted-foreground">Customers Served</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center text-muted-foreground">
          No worker data available to determine the top performer.
        </div>
      )}
    </>
  )
}
