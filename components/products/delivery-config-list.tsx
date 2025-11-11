"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Trash2, Copy } from "lucide-react"

interface Config {
  id: string
  product_id: string
  file_name: string
  delivery_method: string
  created_at: string
}

interface DeliveryConfigListProps {
  configs: Config[]
  shopId: string
}

export default function DeliveryConfigList({ configs, shopId }: DeliveryConfigListProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async (configId: string) => {
    if (!window.confirm("Delete this product link?")) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/products/link/${configId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Delete failed")
      }

      toast({
        title: "Success",
        description: "Product link deleted",
      })

      window.location.reload()
    } catch (error) {
      console.error("[v0] Delete error:", error)
      toast({
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyProductId = (productId: string) => {
    navigator.clipboard.writeText(productId)
    toast({
      title: "Copied",
      description: "Product ID copied to clipboard",
    })
  }

  if (configs.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <p className="text-muted-foreground">No product links yet</p>
          <p className="text-sm text-muted-foreground mt-2">Add files to products using the form on the left</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Product Links ({configs.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {configs.map((config) => (
            <div
              key={config.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex-1">
                <p className="font-semibold text-sm">Product {config.product_id}</p>
                <p className="text-sm text-muted-foreground mt-1">File: {config.file_name}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {config.delivery_method}
                  </Badge>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={isLoading}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleCopyProductId(config.product_id)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Product ID
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(config.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
