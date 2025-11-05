"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "../ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import type { Product, Service, Worker } from "@/lib/types"

const formSchema = z.object({
  customerName: z.string().min(1, "Customer name is required."),
  workerId: z.string().min(1, "Please select a worker."),
  serviceIds: z.array(z.string()).default([]),
  productIds: z.array(z.object({ id: z.string(), quantity: z.number().min(1) })).default([]),
  discount: z.coerce.number().min(0).max(100).default(0),
})

interface SaleFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void
  services: Service[]
  products: Product[]
  workers: Worker[]
}

export function SaleForm({ onSubmit, services, products, workers }: SaleFormProps) {
    const [isServiceDialogOpen, setServiceDialogOpen] = React.useState(false)
    const [isProductDialogOpen, setProductDialogOpen] = React.useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customerName: "",
            serviceIds: [],
            productIds: [],
            discount: 0,
        },
    })

    const handleFinalSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        await onSubmit(values);
        setIsSubmitting(false);
    }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFinalSubmit)} className="space-y-6">
        <Card>
            <CardContent className="p-6 space-y-4">
            <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Customer Name</FormLabel>
                    <FormControl>
                    <Input placeholder="Enter customer's name" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="workerId"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a worker" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {workers.filter(w => !w.archived).map(worker => (
                        <SelectItem key={worker.id} value={worker.id}>{worker.name}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            </CardContent>
        </Card>

        <Card>
            <CardContent className="p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-medium">Items</h3>
                </div>
                <div className="flex gap-4">
                    <Dialog open={isProductDialogOpen} onOpenChange={setProductDialogOpen}>
                        <DialogTrigger asChild>
                            <Button type="button" variant="outline">Add Product</Button>
                        </DialogTrigger>
                        <DialogContent>
                             <DialogHeader>
                                <DialogTitle>Select Products</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                            {products.filter(p => p.stock > 0).map((product) => (
                                <FormField
                                    key={product.id}
                                    control={form.control}
                                    name="productIds"
                                    render={({ field }) => {
                                        const isChecked = field.value?.some(p => p.id === product.id);
                                        return (
                                        <FormItem
                                            key={product.id}
                                            className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"
                                        >
                                            <div>
                                            <FormLabel className="font-normal">
                                                {product.name}
                                            </FormLabel>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm font-medium">Rs {product.price.toFixed(2)}</span>
                                                <FormControl>
                                                <Checkbox
                                                    checked={isChecked}
                                                    onCheckedChange={(checked) => {
                                                    const newValue = checked
                                                        ? [...(field.value || []), {id: product.id, quantity: 1}]
                                                        : (field.value || []).filter((p) => p.id !== product.id);
                                                    field.onChange(newValue);
                                                    }}
                                                />
                                                </FormControl>
                                            </div>
                                        </FormItem>
                                        )
                                    }}
                                />
                                ))}
                            </div>
                            <Button type="button" onClick={() => setProductDialogOpen(false)}>Done</Button>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isServiceDialogOpen} onOpenChange={setServiceDialogOpen}>
                         <DialogTrigger asChild>
                            <Button type="button" variant="outline">Add Service</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Select Services</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2 max-h-80 overflow-y-auto">
                            {services.map((service) => (
                                <FormField
                                    key={service.id}
                                    control={form.control}
                                    name="serviceIds"
                                    render={({ field }) => {
                                    return (
                                        <FormItem
                                        key={service.id}
                                        className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"
                                        >
                                        <div>
                                            <FormLabel className="font-normal">
                                            {service.name}
                                            </FormLabel>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-medium">Rs {service.price.toFixed(2)}</span>
                                            <FormControl>
                                                <Checkbox
                                                checked={field.value?.includes(service.id)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                    ? field.onChange([...(field.value || []), service.id])
                                                    : field.onChange(
                                                        (field.value || []).filter(
                                                            (value) => value !== service.id
                                                        )
                                                        )
                                                }}
                                                />
                                            </FormControl>
                                        </div>
                                        </FormItem>
                                    )
                                    }}
                                />
                            ))}
                            </div>
                             <Button type="button" onClick={() => setServiceDialogOpen(false)}>Done</Button>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
        
        <Card>
            <CardContent className="p-6 space-y-4">
                <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Discount (%)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>

        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white !mt-8 text-lg py-6" disabled={isSubmitting}>
             {isSubmitting ? (
                <Loader2 className="animate-spin" />
            ) : (
                'Finalize Sale'
            )}
        </Button>
      </form>
    </Form>
  )
}
