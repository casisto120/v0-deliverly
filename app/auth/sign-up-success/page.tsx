import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle>Check Your Email</CardTitle>
            <CardDescription>We sent a confirmation link to your email address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click the link in your email to confirm your account and get started with Deliverly.
            </p>
            <p className="text-sm text-muted-foreground">If you don't see the email, check your spam folder.</p>
            <Link href="/auth/login" className="block">
              <Button variant="outline" className="w-full bg-transparent">
                Back to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
