"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import type { MemeTemplate } from "@/lib/types"

interface MemeTemplateGridProps {
  templates: MemeTemplate[]
  onSelect: (template: MemeTemplate) => void
}

export default function MemeTemplateGrid({ templates, onSelect }: MemeTemplateGridProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
        <Input
          type="search"
          placeholder="Search templates..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="cursor-pointer group" onClick={() => onSelect(template)}>
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-200">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={template.url || "/placeholder.svg"}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              </div>
              <p className="mt-2 text-sm text-center text-gray-700 dark:text-gray-300 truncate">{template.name}</p>
            </div>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No templates found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
