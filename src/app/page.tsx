"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { TextShareContainer } from "@/components/text/text-share-container"
import { FileShareContainer } from "@/components/files/file-share-container"
import { RoomBanner } from "@/components/room/room-banner"
import { RoomSidebar } from "@/components/room/room-sidebar"
import { useTextMessages } from "@/hooks/use-text-messages"
import { useSharedFiles } from "@/hooks/use-shared-files"
import { FileText, UploadCloud } from "lucide-react"

export default function Home() {
  const { messages } = useTextMessages()
  const { files } = useSharedFiles()

  const textCount = messages.length
  const fileCount = files.length

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Header />

      <main className="flex-1 py-6 sm:py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[290px_1fr] gap-6 items-start">
            <aside className="w-full lg:sticky lg:top-20">
              <RoomSidebar />
            </aside>

            <div className="min-w-0 space-y-4">
              <RoomBanner />

              <Tabs defaultValue="text" className="w-full space-y-6">
                <div className="flex items-center justify-center border-b pb-4">
                  <TabsList className="grid w-full grid-cols-2 max-w-2xl">
                    <TabsTrigger
                      value="text"
                      className="gap-2 cursor-pointer"
                    >
                      <FileText className="size-4" />
                      <span>Text</span>
                      {textCount > 0 && (
                        <Badge
                          variant="secondary"
                          className="h-4.5 px-1.5 text-[10px] font-mono"
                        >
                          {textCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger
                      value="files"
                      className="gap-2 cursor-pointer"
                    >
                      <UploadCloud className="size-4" />
                      <span>Files</span>
                      {fileCount > 0 && (
                        <Badge
                          variant="secondary"
                          className="h-4.5 px-1.5 text-[10px] font-mono"
                        >
                          {fileCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="text" className="focus-visible:outline-none">
                  <TextShareContainer />
                </TabsContent>

                <TabsContent value="files" className="focus-visible:outline-none">
                  <FileShareContainer />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
