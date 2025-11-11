import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard/header"
import OrdersTable from "@/components/orders/orders-table"

export default async function OrdersPage() {
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

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader shopName={shops?.[0]?.shop_name} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground mt-1">View and manage all customer orders</p>
        </div>

        <OrdersTable orders={orders || []} shopId={shopId} />
      </main>
    </div>
  )
}
