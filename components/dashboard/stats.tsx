import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, FileCheck, Package } from "lucide-react"

interface DashboardStatsProps {
  totalOrders: number
  filesUploaded: number
  deliveredCount: number
}

export default function DashboardStats({ totalOrders, filesUploaded, deliveredCount }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
          <p className="text-xs text-muted-foreground mt-1">{deliveredCount} delivered</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Files Uploaded</CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{filesUploaded}</div>
          <p className="text-xs text-muted-foreground mt-1">Ready for delivery</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delivery Success Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalOrders > 0 ? Math.round((deliveredCount / totalOrders) * 100) : 0}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
        </CardContent>
      </Card>
    </div>
  )
}
