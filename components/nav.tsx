"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Music, Home, MessageSquare, BarChart3 } from "lucide-react"
import { ThemeSwitcher } from "./theme-switcher"
import { Button } from "./ui/button"

export function Nav() {
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/practice", label: "Practice", icon: Music },
    { href: "/tutor", label: "AI Tutor", icon: MessageSquare },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  ]

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Music className="h-6 w-6" />
          <span>AI Guitar Tutor</span>
        </Link>

        <div className="flex items-center gap-6">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
          <ThemeSwitcher />
          <form action="/auth/signout" method="post">
            <Button variant="ghost" size="sm" type="submit">
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </nav>
  )
}
