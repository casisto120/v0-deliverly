"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: string
  shopify_order_id: string
  customer_name: string
  customer_email: string
  delivery_status: string
  created_at: string
  error_message?: string
}

interface OrdersTableProps {
  orders: Order[]
  shopId: string
}

export default function OrdersTable({ orders, shopId }: OrdersTableProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleRetryDelivery = async (orderId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/delivery/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      })

      if (!response.ok) {
        throw new Error("Retry failed")
      }

      toast({
        title: "Success",
        description: "Delivery retry initiated",
      })

      window.location.reload()
    } catch (error) {
      console.error("[v0] Retry error:", error)
      toast({
        title: "Error",
        description: "Failed to retry delivery",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <p className="text-muted-foreground">No orders yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders ({orders.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold text-sm">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Order ID</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-accent transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-semibold text-sm">{order.customer_name}</p>
                      <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{order.shopify_order_id}</td>
                  <td className="py-3 px-4">
                    <Badge className={getStatusColor(order.delivery_status)}>{order.delivery_status}</Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(order.created_at), {
                      addSuffix: true,
                    })}
                  </td>
                  <td className="py-3 px-4">
                    {order.delivery_status === "failed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRetryDelivery(order.id)}
                        disabled={isLoading}
                      >
                        Retry
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
