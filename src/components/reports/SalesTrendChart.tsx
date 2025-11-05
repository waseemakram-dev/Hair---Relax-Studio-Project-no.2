"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import type { Sale } from "@/lib/types"
import type { Timestamp } from "firebase/firestore"
import { eachDayOfInterval, format, startOfDay } from "date-fns"

interface SalesTrendChartProps {
  sales: Sale[]
  from: Date
  to: Date
}

export function SalesTrendChart({ sales, from, to }: SalesTrendChartProps) {
  const salesByDay = sales.reduce((acc, sale) => {
    const saleDate = sale.createdAt instanceof Date ? sale.createdAt : (sale.createdAt as Timestamp).toDate();
    const day = format(saleDate, "MMM d")
    acc[day] = (acc[day] || 0) + sale.total
    return acc
  }, {} as Record<string, number>)

  const dateInterval = eachDayOfInterval({ start: from, end: to });
  
  const chartData = dateInterval.map(date => {
      const dayKey = format(date, "MMM d");
      return {
          date: dayKey,
          sales: salesByDay[dayKey] || 0
      }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            sales: {
              label: "Sales",
              color: "hsl(var(--primary))",
            },
          }}
          className="h-64 w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <YAxis
                tickFormatter={value => `Rs ${value}`}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
