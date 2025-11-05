"use client"

import {
  LayoutDashboard,
  Package,
  Users,
  BarChart,
  Settings,
  Scissors,
  Receipt
} from "lucide-react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/firebase"
import { signOut } from "firebase/auth"
import { Logo } from "./Logo"

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/receipts", label: "Sales", icon: Receipt },
  { href: "/products", label: "Inventory", icon: Package },
  { href: "/services", label: "Services", icon: Scissors },
  { href: "/workers", label: "Workers", icon: Users },
  { href: "/reports", label: "Sales Report", icon: BarChart },
]

export function AppSidebar() {
  const pathname = usePathname()
  const auth = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut(auth)
    router.push('/login')
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="py-6 border-b border-sidebar-border flex justify-center">
          <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-4">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
                className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground font-medium text-base h-12 text-muted-foreground hover:text-foreground data-[active=true]:hover:text-sidebar-accent-foreground"
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-2 border-t border-sidebar-border">
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton className="font-medium text-base h-12 text-muted-foreground hover:text-foreground">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
