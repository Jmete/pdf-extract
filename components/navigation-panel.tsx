"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileText, Settings, Upload, Download, History, HelpCircle, LogOut } from "lucide-react"

export default function NavigationPanel() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center space-x-2">
        <FileText className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold">PDF Extract</h1>
      </div>

      <Separator />

      <div className="flex-1 py-4">
        <div className="px-3 mb-2">
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Documents</p>
        </div>
        <Button variant="ghost" className="w-full justify-start px-3 py-2 h-9">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
        <Button variant="ghost" className="w-full justify-start px-3 py-2 h-9">
          <History className="h-4 w-4 mr-2" />
          Recent Documents
        </Button>
        <Button variant="ghost" className="w-full justify-start px-3 py-2 h-9">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>

        <div className="px-3 mb-2 mt-6">
          <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Settings</p>
        </div>
        <Button variant="ghost" className="w-full justify-start px-3 py-2 h-9">
          <Settings className="h-4 w-4 mr-2" />
          Preferences
        </Button>
        <Button variant="ghost" className="w-full justify-start px-3 py-2 h-9">
          <HelpCircle className="h-4 w-4 mr-2" />
          Help & Support
        </Button>
      </div>

      <div className="p-4">
        <Button variant="outline" className="w-full justify-start">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}

