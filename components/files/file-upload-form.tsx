"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Upload, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FileUploadFormProps {
  shopId: string
}

export default function FileUploadForm({ shopId }: FileUploadFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = [...e.dataTransfer.files]
    if (files.length > 0) {
      setFile(files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("shopId", shopId)

      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: `File "${file.name}" uploaded successfully`,
      })

      // Redirect back to files page
      router.push("/dashboard/files")
      router.refresh()
    } catch (error) {
      console.error("[v0] Upload error:", error)
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fileSize = file ? (file.size / (1024 * 1024)).toFixed(2) : "0"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New File</CardTitle>
        <CardDescription>Select a file to upload. Supported formats: PDF, ZIP, Images, Documents</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
              dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <input type="file" onChange={handleFileChange} disabled={isLoading} className="hidden" id="file-input" />
            <label htmlFor="file-input" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="font-semibold text-foreground">{file ? file.name : "Drag and drop your file here"}</p>
                  <p className="text-sm text-muted-foreground mt-1">or click to browse from your computer</p>
                  {file && <p className="text-sm text-muted-foreground mt-2">Size: {fileSize} MB</p>}
                </div>
              </div>
            </label>
          </div>

          {/* File Info */}
          {file && (
            <Alert>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                File selected: <span className="font-semibold">{file.name}</span> ({fileSize} MB)
              </AlertDescription>
            </Alert>
          )}

          {/* Info Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Files are securely stored and will be delivered to customers after they complete their purchase.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFile(null)
                router.push("/dashboard/files")
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!file || isLoading}>
              {isLoading ? "Uploading..." : "Upload File"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
