import Link from "next/link"
import UserMenu from "./user-menu"

export default async function DashboardHeader({
  shopName,
}: {
  shopName?: string
}) {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
              D
            </div>
            <span className="font-bold text-lg hidden sm:inline">Deliverly</span>
          </Link>
          {shopName && (
            <div className="hidden md:block">
              <p className="text-sm text-muted-foreground">Shop</p>
              <p className="font-semibold">{shopName}</p>
            </div>
          )}
        </div>

        <nav className="flex items-center gap-1 absolute left-1/2 transform -translate-x-1/2 hidden lg:flex">
          <Link href="/dashboard" className="px-4 py-2 text-sm font-medium rounded-md hover:bg-accent text-foreground">
            Dashboard
          </Link>
          <Link
            href="/dashboard/files"
            className="px-4 py-2 text-sm font-medium rounded-md hover:bg-accent text-foreground"
          >
            Files
          </Link>
          <Link
            href="/dashboard/products"
            className="px-4 py-2 text-sm font-medium rounded-md hover:bg-accent text-foreground"
          >
            Products
          </Link>
          <Link
            href="/dashboard/orders"
            className="px-4 py-2 text-sm font-medium rounded-md hover:bg-accent text-foreground"
          >
            Orders
          </Link>
        </nav>

        <UserMenu />
      </div>
    </header>
  )
}
