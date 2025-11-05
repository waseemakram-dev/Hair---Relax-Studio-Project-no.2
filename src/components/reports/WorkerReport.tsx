"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Worker } from "@/lib/types"

interface WorkerReportProps {
    workers: Worker[];
}

export function WorkerReport({ workers }: WorkerReportProps) {
    const activeWorkers = workers.filter(w => !w.archived)
    const archivedWorkers = workers.filter(w => w.archived)

    return (
        <div className="mt-4 space-y-6">
            <Card>
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
                <Card>
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
        </div>
    )
}