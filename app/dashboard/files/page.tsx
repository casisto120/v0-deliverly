import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard/header"
import FileList from "@/components/files/file-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Upload } from "lucide-react"

export default async function FilesPage() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: shops } = await supabase.from("shops").select("*").limit(1)

  const shopId = shops?.[0]?.id

  if (!shopId) {
    redirect("/setup")
  }

  const { data: files, error } = await supabase
    .from("uploaded_files")
    .select("*")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader shopName={shops?.[0]?.shop_name} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">File Management</h1>
            <p className="text-muted-foreground mt-1">Upload and manage digital files for delivery</p>
          </div>
          <Link href="/dashboard/files/upload">
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </Link>
        </div>

        <FileList files={files || []} shopId={shopId} />
      </main>
    </div>
  )
}
