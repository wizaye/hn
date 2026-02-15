"use client";

import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { toast } from "sonner";
import Link from "next/link";
import { ShoppingCart, Edit } from "lucide-react";
import { EnquiryCart, useCartOpen } from "@/components/products/EnquiryCart";

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
        <h3 className="text-[11px] font-bold uppercase tracking-widest">Personal Information</h3>
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
  const { items, clearCart } = useEnquiryCart();
  const { setIsOpen: setCartOpen } = useCartOpen();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState(5);
  const [needsCustomization, setNeedsCustomization] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    deliveryTimeline: "1-2 weeks",
    customizationNotes: "",
  });

  const totalValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Please add products to your enquiry cart first");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          companyName: formData.companyName,
          email: formData.email,
          phone: formData.phone,
          customizationNotes: needsCustomization ? formData.customizationNotes : '',
          deliveryTimeline: formData.deliveryTimeline,
          items: items,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Clear form and cart
        setFormData({
          name: "",
          email: "",
          phone: "",
          companyName: "",
          deliveryTimeline: "1-2 weeks",
          customizationNotes: "",
        });
        clearCart();
        setNeedsCustomization(false);

        // Show success screen
        setShowSuccess(true);

        // Start countdown timer
        const interval = setInterval(() => {
          setRedirectTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              window.location.href = '/';
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        toast.error(result.error || "Failed to submit enquiry. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      toast.error("Failed to submit enquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (showSuccess) {
    return (
      <div className="max-w-md mx-auto">
        <div className="rounded-sm border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-green-900 dark:text-green-100">Enquiry Submitted!</h2>
            <p className="text-green-700 dark:text-green-300">
              Thank you for your enquiry. We've sent a confirmation email with all the details.
            </p>
          </div>

          {/* Timer */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Redirecting to home in {redirectTimer} seconds...</span>
            </div>

            <Button
              onClick={() => window.location.href = '/'}
              className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
              size="lg"
            >
              Go to Home Now
            </Button>
          </div>

          {/* What's Next */}
          <div className="pt-4 border-t border-green-200 dark:border-green-800 text-sm text-left space-y-2">
            <p className="font-semibold text-green-900 dark:text-green-100">What happens next?</p>
            <ul className="space-y-1 text-green-700 dark:text-green-300">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Our team will review your enquiry within 24 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>You'll receive a detailed quotation via email</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>We'll contact you to discuss customization details</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-[11px] font-bold uppercase tracking-widest">Personal Information</h3>
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
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                required
                placeholder="Your company name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold uppercase tracking-widest">Products</h3>
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
            <div className="rounded-lg border overflow-hidden">
              {/* Invoice-style table */}
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Product</th>
                    <th className="text-left py-3 px-4 font-medium hidden sm:table-cell">Variant</th>
                    <th className="text-center py-3 px-4 font-medium">Qty</th>
                    <th className="text-right py-3 px-4 font-medium">Price</th>
                    <th className="text-right py-3 px-4 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item, idx) => {
                    const variantColor = item.colorCode;
                    return (
                      <tr key={`${item.productId}-${item.variantId}-${idx}`} className="hover:bg-muted/30">
                        <td className="py-3 px-4">
                          <div className="font-medium">{item.productName}</div>
                          <div className="text-xs text-muted-foreground sm:hidden">{item.variantName}</div>
                          {item.modelNumber && (
                            <div className="text-xs text-muted-foreground font-mono">{item.modelNumber}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 hidden sm:table-cell">
                          <div className="flex items-center gap-2">
                            {variantColor && (
                              <div
                                className="h-3 w-3 rounded-full border flex-shrink-0"
                                style={{ backgroundColor: variantColor || "#000" }}
                              />
                            )}
                            <span>{item.variantName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">{item.quantity}</td>
                        <td className="py-3 px-4 text-right">₹{item.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right font-medium">₹{(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-muted/30 border-t">
                  <tr>
                    <td colSpan={4} className="py-3 px-4 text-right font-semibold">Estimated Total:</td>
                    <td className="py-3 px-4 text-right font-bold text-lg">₹{totalValue.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-[11px] font-bold uppercase tracking-widest">Order Details</h3>

          <div className="space-y-2">
            <Label htmlFor="deliveryTimeline">Delivery Timeline *</Label>
            <select
              id="deliveryTimeline"
              required
              value={formData.deliveryTimeline}
              onChange={(e) => setFormData({ ...formData, deliveryTimeline: e.target.value })}
              className="flex h-10 w-full rounded-sm border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              <option value="urgent">Urgent (within 1 week)</option>
              <option value="1-2 weeks">1-2 weeks</option>
              <option value="2-4 weeks">2-4 weeks</option>
              <option value="1-2 months">1-2 months</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="needsCustomization"
                checked={needsCustomization}
                onChange={(e) => {
                  setNeedsCustomization(e.target.checked);
                  if (!e.target.checked) {
                    setFormData({ ...formData, customizationNotes: "" });
                  }
                }}
                className="h-4 w-4 rounded-sm border-gray-300 text-primary focus:ring-2 focus:ring-primary cursor-pointer"
              />
              <Label htmlFor="needsCustomization" className="font-medium cursor-pointer">
                Is customization needed?
              </Label>
            </div>

            {needsCustomization && (
              <div className="space-y-2 pl-6">
                <Label htmlFor="customizationNotes">Customization Details *</Label>
                <Textarea
                  id="customizationNotes"
                  rows={4}
                  required={needsCustomization}
                  placeholder="Please describe your customization requirements (logo details, special colors, text, etc.)..."
                  value={formData.customizationNotes}
                  onChange={(e) => setFormData({ ...formData, customizationNotes: e.target.value })}
                />
              </div>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full cursor-pointer" size="lg" disabled={items.length === 0 || isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Enquiry"}
        </Button>
      </form>
    </>
  );
}

export default function EnquirePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="px-6 md:px-10 lg:px-16 py-8 sm:py-10 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-muted-foreground tracking-tight mb-2">
              Product <span className="text-foreground">Enquiry</span>
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
    </div>
  );
}

