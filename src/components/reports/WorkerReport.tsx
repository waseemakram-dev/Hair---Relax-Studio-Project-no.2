"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Worker, Sale } from "@/lib/types"
import { DollarSign, Users, CalendarDays } from "lucide-react"
import type { Timestamp } from "firebase/firestore"
import { format, startOfDay, parse } from "date-fns"

interface WorkerReportProps {
    workers: Worker[];
    sales: Sale[];
}

export function WorkerReport({ workers, sales }: WorkerReportProps) {
    const activeWorkers = useMemo(() => workers.filter(w => !w.archived), [workers])
    const [selectedWorkerId, setSelectedWorkerId] = useState<string | undefined>(activeWorkers[0]?.id);
    const [isDetailOpen, setDetailOpen] = useState(false);
    const [selectedDaySales, setSelectedDaySales] = useState<Sale[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');


    const selectedWorker = useMemo(() => {
        return activeWorkers.find(w => w.id === selectedWorkerId);
    }, [selectedWorkerId, activeWorkers])

    const workerSales = useMemo(() => {
        if (!selectedWorkerId) return [];
        return sales.filter(s => s.workerId === selectedWorkerId);
    }, [selectedWorkerId, sales])

    const daysWorked = useMemo(() => {
        const uniqueDays = new Set<string>();
        workerSales.forEach(sale => {
            const saleDate = sale.createdAt instanceof Date ? sale.createdAt : (sale.createdAt as Timestamp).toDate();
            uniqueDays.add(startOfDay(saleDate).toISOString());
        });
        return uniqueDays.size;
    }, [workerSales])

    const dailyBreakdown = useMemo(() => {
        const breakdown: Record<string, { customers: number, sales: number }> = {};
        workerSales.forEach(sale => {
            const saleDate = sale.createdAt instanceof Date ? sale.createdAt : (sale.createdAt as Timestamp).toDate();
            const day = format(saleDate, "MMMM dd, yyyy");
            if (!breakdown[day]) {
                breakdown[day] = { customers: 0, sales: 0 };
            }
            breakdown[day].customers += 1;
            breakdown[day].sales += sale.total;
        });

        return Object.entries(breakdown).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());

    }, [workerSales]);

    const handleRowClick = (dateString: string) => {
        const clickedDate = parse(dateString, "MMMM dd, yyyy", new Date());
        const daySales = workerSales.filter(sale => {
            const saleDate = sale.createdAt instanceof Date ? sale.createdAt : (sale.createdAt as Timestamp).toDate();
            return startOfDay(saleDate).getTime() === startOfDay(clickedDate).getTime();
        });
        setSelectedDaySales(daySales);
        setSelectedDate(dateString);
        setDetailOpen(true);
    };


    return (
        <Card className="mt-4">
            <CardHeader>
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <CardTitle className="text-xl">Worker Performance Details</CardTitle>
                    </div>
                    <Select onValueChange={setSelectedWorkerId} value={selectedWorkerId}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a Worker" />
                        </SelectTrigger>
                        <SelectContent>
                            {activeWorkers.map(worker => (
                                <SelectItem key={worker.id} value={worker.id}>
                                    {worker.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                {selectedWorker ? (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarFallback className="text-xl bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
                                    {selectedWorker.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-2xl font-bold">{selectedWorker.name}</h3>
                                <p className="text-muted-foreground">All-time performance summary</p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Lifetime Revenue</CardTitle>
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">Rs {selectedWorker.sales.toFixed(2)}</div>
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Lifetime Clients</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">+{selectedWorker.customers}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Days Worked</CardTitle>
                                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{daysWorked}</div>
                                </CardContent>
                            </Card>
                        </div>
                        
                        <div>
                            <h4 className="text-lg font-medium mb-2">Daily Breakdown</h4>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Customers</TableHead>
                                        <TableHead className="text-right">Sales</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {dailyBreakdown.length > 0 ? dailyBreakdown.map(([date, data]) => (
                                        <TableRow key={date} onClick={() => handleRowClick(date)} className="cursor-pointer">
                                            <TableCell className="font-medium">{date}</TableCell>
                                            <TableCell>{data.customers}</TableCell>
                                            <TableCell className="text-right">Rs {data.sales.toFixed(2)}</TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center h-24">No sales data for this worker.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-muted-foreground">Select a worker to see their performance details.</p>
                    </div>
                )}
            </CardContent>
             <Dialog open={isDetailOpen} onOpenChange={setDetailOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Sales Details for {selectedDate}</DialogTitle>
                    </DialogHeader>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {selectedDaySales.length > 0 ? selectedDaySales.map(sale => (
                                <TableRow key={sale.id}>
                                    <TableCell className="font-medium">{sale.customerName}</TableCell>
                                    <TableCell className="text-right">Rs {sale.total.toFixed(2)}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center h-24">No sales found for this day.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
        </Card>
    )
}
