"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { ChevronLeft, ChevronRight, Plus, Minus, Upload, List, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import NavigationPanel from "@/components/navigation-panel"
import MetadataForm from "@/components/metadata-form"
import LineItemsTable from "@/components/line-items-table"

// Import the PDFViewer component
import PDFViewer from "@/components/pdf-viewer";

// Mock data for extraction
const mockExtractedData = {
  metadata: {
    document_name: "RFQ-2023-0042",
    customer_name: "Acme Corporation",
    buyer_name: "John Smith",
    currency: "USD",
    rfq_date: "2023-05-15",
    due_date: "2023-06-15",
  },
  lineItems: [
    {
      line_item_number: "1",
      material_number: "MT-10045",
      part_number: "P-78923",
      description: "High-pressure valve",
      full_description: "Industrial high-pressure valve with stainless steel construction",
      quantity: "10",
      unit_of_measure: "EA",
      requested_delivery_date: "2023-07-01",
      delivery_point: "Main Warehouse",
      manufacturer_name: "ValveTech Industries",
      pdfPosition: { page: 1, top: 250, left: 100, width: 400, height: 20 },
    },
    {
      line_item_number: "2",
      material_number: "MT-10046",
      part_number: "P-78924",
      description: "Pressure gauge",
      full_description: "Digital pressure gauge with LCD display",
      quantity: "5",
      unit_of_measure: "EA",
      requested_delivery_date: "2023-07-15",
      delivery_point: "Main Warehouse",
      manufacturer_name: "MeasureTech",
      pdfPosition: { page: 1, top: 300, left: 100, width: 400, height: 20 },
    },
    {
      line_item_number: "3",
      material_number: "MT-10047",
      part_number: "P-78925",
      description: "Control unit",
      full_description: "Electronic control unit for valve system",
      quantity: "2",
      unit_of_measure: "EA",
      requested_delivery_date: "2023-08-01",
      delivery_point: "Assembly Plant",
      manufacturer_name: "ControlSys Inc.",
      pdfPosition: { page: 2, top: 150, left: 100, width: 400, height: 20 },
    },
  ],
}

export default function PDFExtractor() {
  const [file, setFile] = useState<File | null>(null)
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.2)
  const [extractedData, setExtractedData] = useState(mockExtractedData)
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [highlightPosition, setHighlightPosition] = useState<any>(null)

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0])
      // In a real app, this is where you would trigger the OCR process
      setExtractedData(mockExtractedData)
    },
  })

  function onDocumentLoadSuccess(numPages: number) {
    setNumPages(numPages)
    setPageNumber(1)
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => Math.min(Math.max(prevPageNumber + offset, 1), numPages || 1))
  }

  function handleItemClick(itemId: string, position: any) {
    setActiveItem(itemId)
    setHighlightPosition(position)
    setPageNumber(position.page)
  }

  function handlePdfClick(event: React.MouseEvent<HTMLDivElement>) {
    // In a real app, this would identify the clicked area and find the corresponding data
    console.log("PDF clicked at:", event.clientX, event.clientY)
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Panel - Navigation and Settings */}
      <div className="w-64 flex-shrink-0 border-r border-border bg-card">
        <NavigationPanel />
      </div>

      {/* Middle Panel - PDF Viewer */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-border">
        <PDFViewer className="flex-1 min-h-0" />
      </div>

      {/* Right Panel - Extracted Data Form */}
      <div className="w-96 flex-shrink-0 flex flex-col bg-card">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-medium">Extracted Data</h2>
          <p className="text-sm text-muted-foreground">Review and edit the extracted information</p>
        </div>

        <Tabs defaultValue="metadata" className="flex-1 flex flex-col">
          <div className="px-4 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="metadata" className="flex-1">
                <Info className="h-4 w-4 mr-2" />
                Metadata
              </TabsTrigger>
              <TabsTrigger value="lineItems" className="flex-1">
                <List className="h-4 w-4 mr-2" />
                Line Items
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1">
            <TabsContent value="metadata" className="p-4 mt-0">
              <MetadataForm
                metadata={extractedData.metadata}
                onUpdate={(newMetadata) => {
                  setExtractedData({ ...extractedData, metadata: newMetadata })
                }}
              />
            </TabsContent>

            <TabsContent value="lineItems" className="p-4 mt-0">
              <LineItemsTable
                lineItems={extractedData.lineItems}
                activeItem={activeItem}
                onItemClick={handleItemClick}
                onUpdate={(newLineItems) => {
                  setExtractedData({ ...extractedData, lineItems: newLineItems })
                }}
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  )
}

