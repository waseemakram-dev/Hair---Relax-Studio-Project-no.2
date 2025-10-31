"use client"

import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useSalon } from "@/context/SalonProvider"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
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
import { Separator } from "@/components/ui/separator"
import { useEffect } from "react"
import { Card, CardContent } from "../ui/card"

const formSchema = z.object({
  customerName: z.string().min(2, "Customer name is required."),
  workerId: z.string().min(1, "Please select a portion."),
  serviceIds: z.array(z.string()).default([]),
  productIds: z.array(z.object({ id: z.string(), quantity: z.number().min(1) })).default([]),
  discount: z.coerce.number().min(0).max(100).default(0),
})

interface ReceiptFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void
}

export function ReceiptForm({ onSubmit }: ReceiptFormProps) {
  const { services, products, workers } = useSalon()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      serviceIds: [],
      productIds: [],
      discount: 0,
    },
  })

  const watchServiceIds = useWatch({ control: form.control, name: 'serviceIds' });
  const watchProductIds = useWatch({ control: form.control, name: 'productIds' });
  const watchDiscount = useWatch({ control: form.control, name: 'discount' });
  
  const subtotal = (watchServiceIds || []).reduce((acc, id) => {
    const service = services.find(s => s.id === id);
    return acc + (service?.price || 0);
  }, 0) + (watchProductIds || []).reduce((acc, item) => {
    const product = products.find(p => p.id === item.id);
    return acc + (product?.price || 0) * item.quantity;
  }, 0);

  const total = subtotal - (subtotal * ((watchDiscount || 0) / 100));
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-8 md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
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
                      <FormLabel>Portion / Worker</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a portion" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {workers.map(worker => (
                            <SelectItem key={worker.id} value={worker.id}>{worker.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="serviceIds"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Services</FormLabel>
                        <FormDescription>
                          Select the services for this customer.
                        </FormDescription>
                      </div>
                      <div className="space-y-2">
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
                                      <span className="text-sm font-medium">${service.price.toFixed(2)}</span>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="productIds"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Products</FormLabel>
                        <FormDescription>
                          Select products to be used.
                        </FormDescription>
                      </div>
                      <div className="space-y-2">
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
                                      <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-6">
                <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Summary</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
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
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <Button type="submit" className="w-full">Create Receipt</Button>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  )
}
