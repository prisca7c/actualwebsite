"use client"

import { useState, useEffect } from "react"
import { Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const themes = [
  { id: "japanese", name: "Japanese Spa", icon: "🎋" },
  { id: "kids", name: "Kids Fun", icon: "🎨" },
  { id: "gothic", name: "Gothic", icon: "🦇" },
  { id: "nature", name: "Nature", icon: "🌿" },
  { id: "princess", name: "Princess", icon: "👑" },
  { id: "adventure", name: "Adventure", icon: "🚗" },
]

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState("japanese")

  useEffect(() => {
    const saved = localStorage.getItem("guitar-tutor-theme") || "japanese"
    setCurrentTheme(saved)
    document.documentElement.setAttribute("data-theme", saved)
  }, [])

  const changeTheme = (themeId: string) => {
    setCurrentTheme(themeId)
    localStorage.setItem("guitar-tutor-theme", themeId)
    document.documentElement.setAttribute("data-theme", themeId)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((theme) => (
          <DropdownMenuItem key={theme.id} onClick={() => changeTheme(theme.id)} className="cursor-pointer">
            <span className="mr-2">{theme.icon}</span>
            {theme.name}
            {currentTheme === theme.id && " ✓"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
