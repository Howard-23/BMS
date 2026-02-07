"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Users,
  FileText,
  AlertTriangle,
  BookOpen,
  Wallet,
  Megaphone,
  BarChart3,
  Settings,
  UserCog,
  LogOut,
  ChevronLeft,
  Menu,
  MessageSquare,
  Eye
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

interface SidebarProps {
  user: {
    firstName: string
    lastName: string
    role: string
    position?: string | null
  }
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
]

const managementItems = [
  { href: "/residents", label: "Residents", icon: Users },
  { href: "/clearances", label: "Clearances", icon: FileText },
  { href: "/incidents", label: "Incidents", icon: AlertTriangle },
  { href: "/blotter", label: "Blotter", icon: BookOpen },
  { href: "/financial", label: "Financial", icon: Wallet },
]

const communicationItems = [
  { href: "/announcements", label: "Announcements", icon: Megaphone },
  { href: "/forum", label: "Forum", icon: MessageSquare },
]

const reportItems = [
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/transparency", label: "Transparency", icon: Eye },
]

const adminItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/users", label: "Users", icon: UserCog },
]

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const isAdmin = user.role === "ADMIN"

  const fullName = `${user.firstName} ${user.lastName}`
  const displayRole = user.position || user.role

  const NavLink = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`)
    
    return (
      <Link
        href={href}
        onClick={() => setIsOpen(false)}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    )
  }

  const NavSection = ({ title, items }: { title: string; items: typeof managementItems }) => (
    <div className="py-2">
      <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {title}
      </h3>
      <div className="space-y-1">
        {items.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </div>
    </div>
  )

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* User Info -->
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <span className="text-sm font-semibold text-primary">
              {user.firstName[0]}{user.lastName[0]}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{fullName}</p>
            <span className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              isAdmin 
                ? "bg-primary/10 text-primary" 
                : "bg-secondary text-secondary-foreground"
            )}>
              {displayRole}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-2">
        <div className="px-2">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </div>
        
        <Separator className="my-2" />
        <NavSection title="Management" items={managementItems} />
        
        <Separator className="my-2" />
        <NavSection title="Communications" items={communicationItems} />
        
        <Separator className="my-2" />
        <NavSection title="Reports" items={reportItems} />
        
        {isAdmin && (
          <>
            <Separator className="my-2" />
            <NavSection title="Administration" items={adminItems} />
          </>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-card fixed h-full z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed left-4 top-3 z-50"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
