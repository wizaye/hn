"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { toast } from "sonner";

export function EnquirySection() {
  const { items, clearCart } = useEnquiryCart();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    phone: "",
    customizationNotes: "",
    expectedQuantity: "",
    deliveryTimeline: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const enquiryData = {
      ...formData,
      items,
    };

    console.log("Enquiry submitted:", enquiryData);
    
    toast.success("Enquiry submitted successfully! We'll contact you soon.");
    clearCart();
    setIsOpen(false);
    setFormData({
      name: "",
      companyName: "",
      email: "",
      phone: "",
      customizationNotes: "",
      expectedQuantity: "",
      deliveryTimeline: "",
    });
  };

  return (
    <section id="enquiry-section" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Ready to Place an Order?
          </h2>
          <p className="mb-6 sm:mb-8 text-sm sm:text-base md:text-lg text-muted-foreground px-4">
            Submit your enquiry and our team will get back to you with pricing and customization options.
          </p>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="text-lg px-8">
                Submit Enquiry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Submit Your Enquiry</DialogTitle>
                <DialogDescription>
                  Fill out the form below and we'll contact you within 24 hours.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customizationNotes">Customization Notes</Label>
                  <Textarea
                    id="customizationNotes"
                    rows={4}
                    value={formData.customizationNotes}
                    onChange={(e) => setFormData({ ...formData, customizationNotes: e.target.value })}
                    placeholder="Tell us about your customization requirements..."
                  />
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="expectedQuantity">Expected Quantity</Label>
                    <Input
                      id="expectedQuantity"
                      type="number"
                      min="1"
                      value={formData.expectedQuantity}
                      onChange={(e) => setFormData({ ...formData, expectedQuantity: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryTimeline">Delivery Timeline</Label>
                    <Input
                      id="deliveryTimeline"
                      value={formData.deliveryTimeline}
                      onChange={(e) => setFormData({ ...formData, deliveryTimeline: e.target.value })}
                      placeholder="e.g., 4-6 weeks"
                    />
                  </div>
                </div>
                
                {items.length > 0 && (
                  <div className="space-y-2">
                    <Label>Items in Enquiry ({items.length})</Label>
                    <div className="rounded-lg border p-4 space-y-2 max-h-40 overflow-y-auto">
                      {items.map((item, idx) => (
                        <div key={idx} className="text-sm">
                          {item.productName} - {item.variantName} (Qty: {item.quantity})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <Button type="submit" className="w-full">
                  Submit Enquiry
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}

