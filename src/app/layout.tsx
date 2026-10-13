import type { Metadata } from "next"
import { Geist, Geist_Mono, DM_Sans } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryProvider } from "@/components/providers/query-provider"
import { RoomProvider } from "@/components/providers/room-provider"
import { ThemeProvider } from "@/components/theme-provider"

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" })

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "ZapShare - Instant Text & File Sharing Anywhere",
  description:
    "Upload and download text notes, images, and files instantly from any device, anywhere. No accounts required.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        dmSans.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-primary/20">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <RoomProvider>
              <TooltipProvider>
                {children}
                <Toaster position="bottom-right" />
              </TooltipProvider>
            </RoomProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
