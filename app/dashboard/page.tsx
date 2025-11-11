import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard/header"
import DashboardStats from "@/components/dashboard/stats"
import RecentOrders from "@/components/dashboard/recent-orders"
import QuickActions from "@/components/dashboard/quick-actions"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get shop data for current session
  const { data: shops } = await supabase.from("shops").select("*").limit(1)

  const shopId = shops?.[0]?.id

  if (!shopId) {
    redirect("/setup")
  }

  // Get dashboard stats
  const [{ count: totalOrders }, { count: filesUploaded }, { data: recentOrders }] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("shop_id", shopId),
    supabase.from("uploaded_files").select("*", { count: "exact", head: true }).eq("shop_id", shopId),
    supabase.from("orders").select("*").eq("shop_id", shopId).order("created_at", { ascending: false }).limit(5),
  ])

  const deliveredCount = recentOrders?.filter((order) => order.delivery_status === "sent").length || 0

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader shopName={shops?.[0]?.shop_name} />

      <main className="container mx-auto px-4 py-8">
        <DashboardStats
          totalOrders={totalOrders || 0}
          filesUploaded={filesUploaded || 0}
          deliveredCount={deliveredCount}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2">
            <RecentOrders orders={recentOrders || []} />
          </div>
          <div>
            <QuickActions shopId={shopId} />
          </div>
        </div>
      </main>
    </div>
  )
}
