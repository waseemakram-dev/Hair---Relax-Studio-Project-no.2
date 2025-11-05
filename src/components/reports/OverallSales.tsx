"use client"

import { useState } from "react"
import { addDays, format, startOfDay } from "date-fns"
import type { DateRange } from "react-day-picker"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { DollarSign, Users, Calendar as CalendarIcon, Loader2 } from "lucide-react"
import { SalesTrendChart } from "./SalesTrendChart"
import type { Sale } from "@/lib/types"
import type { Timestamp } from "firebase/firestore"

export function OverallSales({ sales }: { sales: Sale[] }) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(startOfDay(new Date()), -6),
    to: startOfDay(new Date()),
  })

  if (!dateRange || !dateRange.from || !dateRange.to) {
    return <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  }
  
  const filteredSales = sales.filter(sale => {
    const saleDate = sale.createdAt instanceof Date ? sale.createdAt : (sale.createdAt as Timestamp).toDate()
    const saleDayStart = startOfDay(saleDate);
    // Adjust range to be inclusive of the 'to' date
    const rangeEnd = dateRange.to ? new Date(dateRange.to.getTime() + 86399999) : new Date();
    return saleDayStart >= dateRange.from! && saleDayStart < rangeEnd
  })

  const totalRevenue = filteredSales.reduce((acc, sale) => acc + sale.total, 0)
  const totalClients = filteredSales.length

  const handlePresetChange = (value: string) => {
    const now = startOfDay(new Date())
    switch (value) {
      case "today":
        setDateRange({ from: now, to: now });
        break;
      case "yesterday":
        const yesterday = addDays(now, -1);
        setDateRange({ from: yesterday, to: yesterday });
        break;
      case "7":
        setDateRange({ from: addDays(now, -6), to: now })
        break
      case "30":
        setDateRange({ from: addDays(now, -29), to: now })
        break
      case "90":
        setDateRange({ from: addDays(now, -89), to: now })
        break
      default:
        break
    }
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
                <CardTitle className="text-xl">Overall Sales Performance</CardTitle>
            </div>
            <div className="flex items-center gap-2">
                <Select onValueChange={handlePresetChange} defaultValue="7">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="yesterday">Yesterday</SelectItem>
                        <SelectItem value="7">Last 7 Days</SelectItem>
                        <SelectItem value="30">Last 30 Days</SelectItem>
                        <SelectItem value="90">Last 90 Days</SelectItem>
                    </SelectContent>
                </Select>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className="w-[280px] justify-start text-left font-normal"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                        dateRange.to ? (
                            <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(dateRange.from, "LLL dd, y")
                        )
                        ) : (
                        <span>Pick a date</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                    />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs {totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Total revenue in the selected period.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{totalClients}</div>
              <p className="text-xs text-muted-foreground">
                Total clients served in the selected period.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6">
            <SalesTrendChart sales={filteredSales} from={dateRange.from} to={dateRange.to} />
        </div>
      </CardContent>
    </Card>
  )
}
