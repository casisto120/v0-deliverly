import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import SignUpForm from "@/components/auth/sign-up-form"

export default async function SignUpPage() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <SignUpForm />
      </div>
    </div>
  )
}
