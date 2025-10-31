"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useSalon } from "@/context/SalonProvider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

export function WorkerPerformanceChart() {
  const { workers } = useSalon()

  const chartData = workers.map(worker => ({
    name: worker.name,
    sales: worker.sales,
  }))

  return (
    <Card>
        <CardHeader>
            <CardTitle>Worker Performance</CardTitle>
            <CardDescription>Total sales per portion.</CardDescription>
        </CardHeader>
        <CardContent>
             <ChartContainer config={{
                sales: {
                  label: "Sales",
                  color: "hsl(var(--primary))",
                },
             }} className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                        <YAxis tickFormatter={(value) => `$${value}`} tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                        <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                    </BarChart>
                </ResponsiveContainer>
             </ChartContainer>
        </CardContent>
    </Card>
  )
}
