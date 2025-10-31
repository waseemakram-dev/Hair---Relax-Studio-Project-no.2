"use client"

import { PageHeader } from "@/components/PageHeader"
import { StatCard } from "@/components/dashboard/StatCard"
import { useSalon } from "@/context/SalonProvider"
import { DollarSign, Package, Users } from "lucide-react"
import { WorkerPerformanceChart } from "@/components/dashboard/WorkerPerformanceChart"
import { RecentReceipts } from "@/components/dashboard/RecentReceipts"

export default function DashboardPage() {
  const { products, getTodaysSales, getTodaysCustomers } = useSalon()

  const lowStockCount = products.filter(p => p.stock < 10).length
  const todaysSales = getTodaysSales()
  const todaysCustomers = getTodaysCustomers()

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Welcome to your SalonFlow dashboard."
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Today's Revenue"
          value={`$${todaysSales.toFixed(2)}`}
          icon={DollarSign}
          description="Total revenue generated today."
        />
        <StatCard
          title="Today's Customers"
          value={todaysCustomers}
          icon={Users}
          description="Total customers served today."
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockCount}
          icon={Package}
          description="Products with stock less than 10."
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <WorkerPerformanceChart />
        </div>
        <div className="lg:col-span-2">
            <RecentReceipts />
        </div>
      </div>
    </>
  )
}
