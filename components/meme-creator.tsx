"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Download, Share2, RefreshCw, Settings, CheckCircle2 } from "lucide-react"
import MemeTemplateGrid from "@/components/meme-template-grid"
import AdminPanel from "@/components/admin-panel"
import { getMemeTemplates, generateMeme } from "@/lib/meme-service"
import type { MemeTemplate, GeneratedMeme } from "@/lib/types"

export default function MemeCreator() {
  const { toast } = useToast()
  const [templates, setTemplates] = useState<MemeTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [textFields, setTextFields] = useState<string[]>([])
  const [generatedMeme, setGeneratedMeme] = useState<GeneratedMeme | null>(null)
  const [activeTab, setActiveTab] = useState("create")
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getMemeTemplates()
        setTemplates(data)
        setLoading(false)
      } catch (error) {
        toast({
          title: "Error fetching templates",
          description: "Please try again later",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [toast])

  useEffect(() => {
    if (selectedTemplate) {
      setTextFields(Array(selectedTemplate.box_count).fill(""))
      setGeneratedMeme(null)
    }
  }, [selectedTemplate])

  const handleTemplateSelect = (template: MemeTemplate) => {
    setSelectedTemplate(template)
    setActiveTab("customize")
  }

  const handleTextChange = (index: number, value: string) => {
    const newTextFields = [...textFields]
    newTextFields[index] = value
    setTextFields(newTextFields)
  }

  const handleGenerateMeme = async () => {
    if (!selectedTemplate) return

    setGenerating(true)
    try {
      const result = await generateMeme({
        template_id: selectedTemplate.id,
        text_lines: textFields,
      })

      setGeneratedMeme(result)
      setActiveTab("share")
      toast({
        title: "Meme generated!",
        description: "Your meme is ready to share",
      })
    } catch (error) {
      toast({
        title: "Error generating meme",
        description: "Please try again or contact support",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedMeme) return

    try {
      const response = await fetch(generatedMeme.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `meme-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Download started",
        description: "Your meme is being downloaded",
      })
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again later",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    if (!generatedMeme) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out my meme!",
          text: "I created this meme with the Meme Creator app",
          url: generatedMeme.url,
        })

        toast({
          title: "Sharing initiated",
          description: "Share your meme with friends",
        })
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          toast({
            title: "Sharing failed",
            description: "Please try another method",
            variant: "destructive",
          })
        }
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      try {
        await navigator.clipboard.writeText(generatedMeme.url)
        toast({
          title: "URL copied to clipboard",
          description: "Now you can paste and share it anywhere",
        })
      } catch (error) {
        toast({
          title: "Couldn't copy URL",
          description: "Please copy it manually",
          variant: "destructive",
        })
      }
    }
  }

  const handleReset = () => {
    setSelectedTemplate(null)
    setTextFields([])
    setGeneratedMeme(null)
    setActiveTab("create")
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="create">Choose Template</TabsTrigger>
          <TabsTrigger value="customize" disabled={!selectedTemplate}>
            Customize
          </TabsTrigger>
          <TabsTrigger value="share" disabled={!generatedMeme}>
            Share
          </TabsTrigger>
        </TabsList>

        <Button variant="outline" size="sm" onClick={() => setIsAdmin(!isAdmin)} className="flex items-center gap-1">
          {isAdmin ? <CheckCircle2 className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
          {isAdmin ? "Admin Mode" : "Admin"}
        </Button>
      </div>

      <TabsContent value="create" className="mt-4">
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex flex-col space-y-2">
                      <Skeleton className="h-40 w-full rounded-md" />
                      <Skeleton className="h-4 w-full rounded-md" />
                    </div>
                  ))}
              </div>
            ) : (
              <MemeTemplateGrid templates={templates} onSelect={handleTemplateSelect} />
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="customize" className="mt-4">
        {selectedTemplate && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md mb-4">
                <img
                  src={selectedTemplate.url || "/placeholder.svg"}
                  alt={selectedTemplate.name}
                  className="w-full h-auto"
                />
              </div>
              <h3 className="text-lg font-medium text-center mb-2">{selectedTemplate.name}</h3>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Add Your Text</h3>

              {textFields.map((text, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`text-${index}`}>Text Box {index + 1}</Label>
                  <Input
                    id={`text-${index}`}
                    value={text}
                    onChange={(e) => handleTextChange(index, e.target.value)}
                    placeholder={`Enter text for box ${index + 1}`}
                  />
                </div>
              ))}

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleGenerateMeme}
                  disabled={generating || textFields.some((t) => !t.trim())}
                  className="flex-1"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Meme"
                  )}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="share" className="mt-4">
        {generatedMeme && (
          <div className="flex flex-col items-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md mb-6 max-w-md">
              <img src={generatedMeme.url || "/placeholder.svg"} alt="Generated meme" className="w-full h-auto" />
            </div>

            <div className="flex gap-4 mb-6">
              <Button onClick={handleDownload} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button onClick={handleShare} variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            <Button variant="secondary" onClick={handleReset}>
              Create Another Meme
            </Button>
          </div>
        )}
      </TabsContent>

      {isAdmin && (
        <div className="mt-8 border-t pt-6">
          <AdminPanel />
        </div>
      )}
    </Tabs>
  )
}
