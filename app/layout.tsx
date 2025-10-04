import type React from "react"
import type { Metadata } from "next"
import { Noto_Serif_JP, Noto_Sans_JP } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"
import { Suspense } from "react"

const notoSerif = Noto_Serif_JP({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ["400", "600", "700"],
})

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "500", "700"],
})

export const metadata: Metadata = {
  title: "AI Guitar Tutor - Learn Guitar with AI",
  description: "Master guitar with AI-powered real-time feedback and hand tracking",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${notoSerif.variable} ${notoSans.variable} font-sans antialiased`}>
        <Suspense fallback={null}>
          {children}
          <Toaster />
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
