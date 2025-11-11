import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If user is authenticated and has a shop, redirect to dashboard
  if (session) {
    const { data: shops } = await supabase.from("shops").select("*").limit(1)

    if (shops && shops.length > 0) {
      redirect("/dashboard")
    } else {
      redirect("/setup")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-2xl mx-auto">
            D
          </div>
          <h1 className="text-4xl font-bold">Deliverly</h1>
          <p className="text-xl text-muted-foreground">Automated file delivery for your Shopify store</p>
        </div>

        <p className="text-muted-foreground">
          Automatically deliver digital files to customers after purchase. Perfect for ebooks, templates, software,
          music, and more.
        </p>

        <div className="space-y-3 pt-6">
          <Link href="/auth/login" className="block">
            <Button className="w-full" size="lg">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/sign-up" className="block">
            <Button variant="outline" className="w-full bg-transparent" size="lg">
              Create Account
            </Button>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground pt-4">No credit card required. Free plan available.</p>
      </div>
    </div>
  )
}
