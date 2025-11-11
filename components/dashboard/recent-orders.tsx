import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface Order {
  id: string
  shopify_order_id: string
  customer_name: string
  customer_email: string
  delivery_status: string
  created_at: string
}

export default function RecentOrders({ orders }: { orders: Order[] }) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <p className="font-semibold text-sm">{order.customer_name}</p>
                  <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(order.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <Badge className={getStatusColor(order.delivery_status)}>{order.delivery_status}</Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
