import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ShopifySetupForm from "@/components/setup/shopify-setup-form"

export default async function SetupPage() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/auth/login")
  }

  const { data: shops } = await supabase.from("shops").select("*").limit(1)

  if (shops && shops.length > 0) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <ShopifySetupForm />
      </div>
    </div>
  )
}
