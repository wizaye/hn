"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { products } from "@/lib/data";
import { EnquiryCartProvider } from "@/hooks/use-enquiry-cart";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Link from "next/link";
import { ShoppingCart, Edit } from "lucide-react";
import { EnquiryCart, CartOpenProvider, useCartOpen } from "@/components/products/EnquiryCart";

function GeneralEnquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("General Enquiry:", formData);
    toast.success("Enquiry submitted successfully! We'll contact you soon.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Personal Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              required
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              type="tel"
              required
              placeholder="+91 XXXX XXXX XX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              placeholder="Your company name"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Enquiry Message *</Label>
        <Textarea
          id="message"
          required
          rows={6}
          placeholder="Any additional information or requirements..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full" size="lg">
        Submit Enquiry
      </Button>
    </form>
  );
}

function DetailedProductEnquiryForm() {
  const { items } = useEnquiryCart();
  const { setIsOpen: setCartOpen } = useCartOpen();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    purpose: "",
    needsCustomization: false,
    additionalMessage: "",
  });

  const groupedItems = useMemo(() => {
    const grouped: Record<string, typeof items> = {};
    items.forEach((item) => {
      if (!grouped[item.productId]) {
        grouped[item.productId] = [];
      }
      grouped[item.productId].push(item);
    });
    return grouped;
  }, [items]);

  const totalValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Please add products to your enquiry cart first");
      return;
    }
    console.log("Detailed Product Enquiry:", { ...formData, items });
    toast.success("Enquiry submitted successfully! We'll contact you soon.");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Personal Information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                required
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                required
                placeholder="+91 XXXX XXXX XX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="Your company name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Products</h3>
            {items.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCartOpen(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Products
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No products added to enquiry</p>
              <Button asChild variant="outline">
                <Link href="/products">Add Products</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedItems).map(([productId, productItems]) => {
                const product = products.find((p) => p.id === productId);
                return (
                  <div key={productId} className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{product?.name || "Product"}</h4>
                        {product?.modelNumber && (
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">
                            {product.modelNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {productItems.map((item, idx) => {
                        const variant = product?.variants.find((v) => v.id === item.variantId);
                        return (
                          <div
                            key={`${item.productId}-${item.variantId}-${idx}`}
                            className="flex items-center justify-between py-2 border-b last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              {variant?.color && (
                                <div
                                  className="h-4 w-4 rounded-full border"
                                  style={{
                                    backgroundColor: variant.colorCode || "#000",
                                  }}
                                />
                              )}
                              <div>
                                <div className="text-sm font-medium">{item.variantName}</div>
                                <div className="text-xs text-muted-foreground">
                                  Quantity: {item.quantity} × ${item.price}
                                </div>
                              </div>
                            </div>
                            <div className="font-semibold">
                              ${(item.quantity * item.price).toFixed(2)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              <div className="rounded-lg border p-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Total Estimated Value:</span>
                  <span className="font-bold text-lg">${totalValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose *</Label>
            <select
              id="purpose"
              required
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select purpose</option>
              <option value="corporate-gifting">Corporate Gifting</option>
              <option value="bulk-order">Bulk Order</option>
              <option value="custom-branding">Custom Branding</option>
              <option value="retail">Retail</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="needsCustomization"
              checked={formData.needsCustomization}
              onChange={(e) => setFormData({ ...formData, needsCustomization: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="needsCustomization" className="cursor-pointer">
              Do you need customization?
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalMessage">Additional Message</Label>
            <Textarea
              id="additionalMessage"
              rows={4}
              placeholder="Any additional information or requirements..."
              value={formData.additionalMessage}
              onChange={(e) => setFormData({ ...formData, additionalMessage: e.target.value })}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={items.length === 0}>
          Submit Enquiry
        </Button>
      </form>
    </>
  );
}

export default function EnquirePage() {
  return (
    <EnquiryCartProvider>
      <CartOpenProvider>
        <div className="min-h-screen">
          <Navbar />
          <main className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-2">
                  Product Enquiry
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Fill out the form below with your details and selected products
                </p>
              </div>

              <DetailedProductEnquiryForm />
            </div>
          </main>
          <Footer />
          <EnquiryCart />
          <Toaster />
        </div>
      </CartOpenProvider>
    </EnquiryCartProvider>
  );
}

