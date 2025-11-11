"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Upload, Settings, FileText, BarChart3 } from "lucide-react"

export default function QuickActions({ shopId }: { shopId: string }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link href="/dashboard/files/upload" className="w-full">
          <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
        </Link>

        <Link href="/dashboard/products" className="w-full">
          <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
            <FileText className="h-4 w-4" />
            Link Products
          </Button>
        </Link>

        <Link href="/dashboard/orders" className="w-full">
          <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
            <BarChart3 className="h-4 w-4" />
            View All Orders
          </Button>
        </Link>

        <Link href="/dashboard/settings" className="w-full">
          <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
