import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard/header"
import ProductLinkForm from "@/components/products/product-link-form"
import DeliveryConfigList from "@/components/products/delivery-config-list"

export default async function ProductsPage() {
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

  const [{ data: configs }, { data: files }] = await Promise.all([
    supabase.from("delivery_configs").select("*").eq("shop_id", shopId).order("created_at", { ascending: false }),
    supabase.from("uploaded_files").select("*").eq("shop_id", shopId),
  ])

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader shopName={shops?.[0]?.shop_name} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Product Links</h1>
          <p className="text-muted-foreground mt-1">Link digital files to your Shopify products</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProductLinkForm shopId={shopId} files={files || []} />
          </div>
          <div className="lg:col-span-2">
            <DeliveryConfigList configs={configs || []} shopId={shopId} />
          </div>
        </div>
      </main>
    </div>
  )
}
