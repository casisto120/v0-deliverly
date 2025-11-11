"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface File {
  id: string
  file_name: string
}

interface ProductLinkFormProps {
  shopId: string
  files: File[]
}

export default function ProductLinkForm({ shopId, files }: ProductLinkFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [productId, setProductId] = useState("")
  const [selectedFile, setSelectedFile] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!productId || !selectedFile) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/products/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shopId,
          productId,
          fileId: selectedFile,
        }),
      })

      if (!response.ok) {
        throw new Error("Link failed")
      }

      toast({
        title: "Success",
        description: "File linked to product successfully",
      })

      setProductId("")
      setSelectedFile("")
      router.refresh()
    } catch (error) {
      console.error("[v0] Link error:", error)
      toast({
        title: "Error",
        description: "Failed to link file to product",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Link File to Product</CardTitle>
        <CardDescription>Select a file and product to link together</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Shopify Product ID</label>
            <Input
              placeholder="e.g., 123456789"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground mt-1">Find this in your Shopify product settings</p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Select File</label>
            <Select value={selectedFile} onValueChange={setSelectedFile} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a file..." />
              </SelectTrigger>
              <SelectContent>
                {files.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No files available
                  </SelectItem>
                ) : (
                  files.map((file) => (
                    <SelectItem key={file.id} value={file.id}>
                      {file.file_name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" disabled={!productId || !selectedFile || isLoading} className="w-full">
            {isLoading ? "Linking..." : "Link File"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
