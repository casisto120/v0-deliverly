"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { MoreVertical, Trash2, Link2, Download } from "lucide-react"

interface File {
  id: string
  file_name: string
  file_size: number
  mime_type: string
  created_at: string
}

interface FileListProps {
  files: File[]
  shopId: string
}

export default function FileList({ files, shopId }: FileListProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!window.confirm(`Delete "${fileName}"? This action cannot be undone.`)) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Delete failed")
      }

      toast({
        title: "Success",
        description: "File deleted successfully",
      })

      window.location.reload()
    } catch (error) {
      console.error("[v0] Delete error:", error)
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  if (files.length === 0) {
    return (
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <p className="text-muted-foreground mb-4">No files uploaded yet</p>
          <Button asChild>
            <a href="/dashboard/files/upload">Upload your first file</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded Files ({files.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex-1">
                <p className="font-semibold text-sm">{file.file_name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(file.file_size)} •{" "}
                  {formatDistanceToNow(new Date(file.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={isLoading}>
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link2 className="h-4 w-4 mr-2" />
                    Link to Product
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDelete(file.id, file.file_name)} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
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
