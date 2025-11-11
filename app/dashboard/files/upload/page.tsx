import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard/header"
import FileUploadForm from "@/components/files/file-upload-form"

export default async function UploadFilePage() {
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

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader shopName={shops?.[0]?.shop_name} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Upload File</h1>
            <p className="text-muted-foreground mt-1">Upload a digital file to deliver to customers</p>
          </div>

          <FileUploadForm shopId={shopId} />
        </div>
      </main>
    </div>
  )
}
