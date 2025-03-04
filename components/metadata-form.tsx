"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface MetadataFormProps {
  metadata: {
    document_name: string
    customer_name: string
    buyer_name: string
    currency: string
    rfq_date: string
    due_date: string
  }
  onUpdate: (metadata: any) => void
}

export default function MetadataForm({ metadata, onUpdate }: MetadataFormProps) {
  const [formData, setFormData] = useState(metadata)
  const [rfqDate, setRfqDate] = useState<Date | undefined>(metadata.rfq_date ? new Date(metadata.rfq_date) : undefined)
  const [dueDate, setDueDate] = useState<Date | undefined>(metadata.due_date ? new Date(metadata.due_date) : undefined)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newFormData = { ...formData, [name]: value }
    setFormData(newFormData)
    onUpdate(newFormData)
  }

  const handleRfqDateChange = (date: Date | undefined) => {
    setRfqDate(date)
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd")
      const newFormData = { ...formData, rfq_date: dateStr }
      setFormData(newFormData)
      onUpdate(newFormData)
    }
  }

  const handleDueDateChange = (date: Date | undefined) => {
    setDueDate(date)
    if (date) {
      const dateStr = format(date, "yyyy-MM-dd")
      const newFormData = { ...formData, due_date: dateStr }
      setFormData(newFormData)
      onUpdate(newFormData)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="document_name">Document Name</Label>
        <Input id="document_name" name="document_name" value={formData.document_name} onChange={handleInputChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="customer_name">Customer Name</Label>
        <Input id="customer_name" name="customer_name" value={formData.customer_name} onChange={handleInputChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="buyer_name">Buyer Name</Label>
        <Input id="buyer_name" name="buyer_name" value={formData.buyer_name} onChange={handleInputChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>
        <Input id="currency" name="currency" value={formData.currency} onChange={handleInputChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rfq_date">RFQ Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !rfqDate && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {rfqDate ? format(rfqDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={rfqDate} onSelect={handleRfqDateChange} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="due_date">Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={dueDate} onSelect={handleDueDateChange} initialFocus />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

