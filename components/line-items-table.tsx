"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight, Edit, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface LineItem {
  line_item_number: string
  material_number: string
  part_number: string
  description: string
  full_description: string
  quantity: string
  unit_of_measure: string
  requested_delivery_date: string
  delivery_point: string
  manufacturer_name: string
  pdfPosition: {
    page: number
    top: number
    left: number
    width: number
    height: number
  }
}

interface LineItemsTableProps {
  lineItems: LineItem[]
  activeItem: string | null
  onItemClick: (itemId: string, position: any) => void
  onUpdate: (lineItems: LineItem[]) => void
}

export default function LineItemsTable({ lineItems, activeItem, onItemClick, onUpdate }: LineItemsTableProps) {
  const [editingItem, setEditingItem] = useState<LineItem | null>(null)

  const handleEditSave = (updatedItem: LineItem) => {
    const newLineItems = lineItems.map((item) =>
      item.line_item_number === updatedItem.line_item_number ? updatedItem : item,
    )
    onUpdate(newLineItems)
    setEditingItem(null)
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">{lineItems.length} line items found</div>

      <div className="space-y-2">
        {lineItems.map((item) => (
          <Collapsible
            key={item.line_item_number}
            className={cn(
              "border rounded-md overflow-hidden transition-colors",
              activeItem === item.line_item_number ? "border-primary bg-primary/5" : "border-border",
            )}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left">
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 mr-2 transition-transform duration-200 [&[data-state=open]>svg]:rotate-90" />
                <span className="font-medium">
                  Item {item.line_item_number}: {item.description}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onItemClick(item.line_item_number, item.pdfPosition)
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingItem(item)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Edit Line Item {item.line_item_number}</DialogTitle>
                    </DialogHeader>
                    {editingItem && <LineItemEditForm item={editingItem} onSave={handleEditSave} />}
                  </DialogContent>
                </Dialog>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="p-3 pt-0 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Material Number:</span>
                  <div>{item.material_number}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Part Number:</span>
                  <div>{item.part_number}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Quantity:</span>
                  <div>
                    {item.quantity} {item.unit_of_measure}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Delivery Date:</span>
                  <div>{item.requested_delivery_date}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Delivery Point:</span>
                  <div>{item.delivery_point}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Manufacturer:</span>
                  <div>{item.manufacturer_name}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Full Description:</span>
                  <div>{item.full_description}</div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  )
}

interface LineItemEditFormProps {
  item: LineItem
  onSave: (item: LineItem) => void
}

function LineItemEditForm({ item, onSave }: LineItemEditFormProps) {
  const [formData, setFormData] = useState<LineItem>({ ...item })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="line_item_number">Line Item Number</Label>
          <Input
            id="line_item_number"
            name="line_item_number"
            value={formData.line_item_number}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="material_number">Material Number</Label>
          <Input
            id="material_number"
            name="material_number"
            value={formData.material_number}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="part_number">Part Number</Label>
          <Input id="part_number" name="part_number" value={formData.part_number} onChange={handleInputChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" name="description" value={formData.description} onChange={handleInputChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" name="quantity" value={formData.quantity} onChange={handleInputChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit_of_measure">Unit of Measure</Label>
          <Input
            id="unit_of_measure"
            name="unit_of_measure"
            value={formData.unit_of_measure}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="requested_delivery_date">Requested Delivery Date</Label>
          <Input
            id="requested_delivery_date"
            name="requested_delivery_date"
            value={formData.requested_delivery_date}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="delivery_point">Delivery Point</Label>
          <Input
            id="delivery_point"
            name="delivery_point"
            value={formData.delivery_point}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="manufacturer_name">Manufacturer Name</Label>
          <Input
            id="manufacturer_name"
            name="manufacturer_name"
            value={formData.manufacturer_name}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2 col-span-2">
          <Label htmlFor="full_description">Full Description</Label>
          <Textarea
            id="full_description"
            name="full_description"
            value={formData.full_description}
            onChange={handleInputChange}
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => onSave(item)}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

