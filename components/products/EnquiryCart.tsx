"use client";

import { useState, useMemo, createContext, useContext, ReactNode } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { products } from "@/lib/data";
import Link from "next/link";

// Context for controlling cart open state
const CartOpenContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | undefined>(undefined);

export function CartOpenProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <CartOpenContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </CartOpenContext.Provider>
  );
}

export function useCartOpen() {
  const context = useContext(CartOpenContext);
  if (!context) {
    // Fallback if not in provider
    return { isOpen: false, setIsOpen: () => {} };
  }
  return context;
}

interface EnquiryCartProps {
  controlledOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EnquiryCart({ controlledOpen, onOpenChange }: EnquiryCartProps = {}) {
  const { items, removeFromCart, updateCartItem, totalItems } = useEnquiryCart();
  const cartContext = useCartOpen();
  const [internalOpen, setInternalOpen] = useState(false);
  
  // Use controlled state if provided, otherwise use context, otherwise use internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : (cartContext.isOpen ?? internalOpen);
  const setIsOpen = onOpenChange || cartContext.setIsOpen || setInternalOpen;
  const [editingQuantities, setEditingQuantities] = useState<Record<string, string>>({});

  // Group items by product
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

  // Calculate totals
  const totalValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const handleQuantityChange = (productId: string, variantId: string, value: string) => {
    const key = `${productId}-${variantId}`;
    setEditingQuantities({ ...editingQuantities, [key]: value });
  };

  const handleQuantityBlur = (productId: string, variantId: string) => {
    const key = `${productId}-${variantId}`;
    const value = editingQuantities[key];
    const quantity = parseInt(value || "1");
    if (quantity >= 1) {
      updateCartItem(productId, variantId, quantity);
    }
    setEditingQuantities({ ...editingQuantities, [key]: "" });
  };

  const getQuantityValue = (productId: string, variantId: string, currentQty: number) => {
    const key = `${productId}-${variantId}`;
    return editingQuantities[key] !== undefined ? editingQuantities[key] : currentQty.toString();
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            size="icon"
          >
            <ShoppingCart className="h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground animate-in zoom-in-50">
                {totalItems}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:w-[450px] flex flex-col">
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="text-2xl">Enquiry Cart</SheetTitle>
            <SheetDescription>
              Review your selected products and submit your enquiry
            </SheetDescription>
            {totalItems > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {items.length} {items.length === 1 ? "variant" : "variants"}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {totalItems} {totalItems === 1 ? "item" : "items"} total
                </Badge>
              </div>
            )}
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="relative mb-6">
                  <ShoppingCart className="h-16 w-16 text-muted-foreground/30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full bg-muted" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Your enquiry cart is empty</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Add products from the catalog to start building your enquiry
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedItems).map(([productId, productItems]) => {
                  const product = products.find((p) => p.id === productId);
                  return (
                    <div key={productId} className="space-y-3">
                      {/* Product Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-base">{product?.name || "Product"}</h3>
                          {product?.modelNumber && (
                            <p className="text-xs text-muted-foreground font-mono mt-0.5">
                              {product.modelNumber}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {productItems.length} {productItems.length === 1 ? "variant" : "variants"}
                        </Badge>
                      </div>

                      {/* Variants List - Table-like format */}
                      <div className="rounded-lg border divide-y">
                        {productItems.map((item, idx) => {
                          const variant = product?.variants.find((v) => v.id === item.variantId);
                          const itemTotal = item.quantity * item.price;
                          return (
                            <div
                              key={`${item.productId}-${item.variantId}-${idx}`}
                              className="p-3 hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                {/* Color Swatch */}
                                {variant?.color && (
                                  <div
                                    className="h-4 w-4 rounded-full border border-border flex-shrink-0"
                                    style={{
                                      backgroundColor: variant.colorCode || "#000",
                                    }}
                                  />
                                )}
                                
                                {/* Variant Name */}
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm">{item.variantName}</div>
                                  <div className="text-xs text-muted-foreground">
                                    ${item.price}/unit
                                  </div>
                                </div>

                                {/* Quantity Input */}
                                <div className="flex items-center gap-2">
                                  <label className="text-xs text-muted-foreground">Qty:</label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={getQuantityValue(item.productId, item.variantId, item.quantity)}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (value === "" || /^\d+$/.test(value)) {
                                        handleQuantityChange(item.productId, item.variantId, value);
                                      }
                                    }}
                                    onBlur={() => handleQuantityBlur(item.productId, item.variantId)}
                                    className="w-16 h-8 text-center text-sm"
                                  />
                                </div>

                                {/* Total */}
                                <div className="text-right min-w-[70px]">
                                  <div className="font-semibold text-sm">${itemTotal.toFixed(2)}</div>
                                </div>

                                {/* Remove Button */}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFromCart(item.productId, item.variantId)}
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <>
              <Separator />
              <div className="border-t bg-muted/30 p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Variants:</span>
                    <span className="font-medium">{items.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Quantity:</span>
                    <span className="font-medium">{totalItems}</span>
                  </div>
                  <div className="flex items-center justify-between text-base pt-2 border-t">
                    <span className="font-semibold">Estimated Value:</span>
                    <span className="font-bold text-lg">${totalValue.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  asChild
                  className="w-full"
                  size="lg"
                >
                  <Link href="/enquire" onClick={() => setIsOpen(false)}>
                    Fill in Details and Submit Enquiry
                  </Link>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
