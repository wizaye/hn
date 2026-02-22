"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Product, EnquiryItem } from "@/lib/types";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { Loader2, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/product-helpers";

interface AddToEnquiryModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddToEnquiryModal({
  product,
  open,
  onOpenChange,
}: AddToEnquiryModalProps) {
  const { addToCart, getCartItem, updateCartItem, getProductCartItems, removeFromCart } = useEnquiryCart();

  // Get all variants from grouped products - each database row is a unique variant
  const allVariants = (product as any).allVariants || product.variants;

  const [selectedVariant, setSelectedVariant] = useState(
    allVariants[0]?.id || ""
  );
  const [quantity, setQuantity] = useState<string>("1");
  const [isLoading, setIsLoading] = useState(false);
  const [editingVariantId, setEditingVariantId] = useState<string | undefined>();

  const cartItems = getProductCartItems(product.id);

  // Initialize form state when modal opens or editing changes
  useEffect(() => {
    if (!open) return;

    // Use a flag to batch state updates
    const updates = {
      variant: '',
      quantity: '1'
    };

    if (editingVariantId) {
      updates.variant = editingVariantId;
      const existingItem = getCartItem(product.id, editingVariantId);
      if (existingItem) {
        updates.quantity = existingItem.quantity.toString();
      }
    } else {
      updates.variant = allVariants[0]?.id || "";
      const existingItem = getCartItem(product.id, updates.variant);
      if (existingItem) {
        updates.quantity = existingItem.quantity.toString();
      }
    }

    // Batch updates
    setSelectedVariant(updates.variant);
    setQuantity(updates.quantity);
  }, [open, editingVariantId, product.id, allVariants, getCartItem]);

  const handleUpdateCart = async () => {
    const variant = allVariants.find((v: any) => v.id === selectedVariant);
    if (!variant) return;

    const quantityNum = parseInt(quantity) || 1;
    if (quantityNum < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    setIsLoading(true);

    // Simulate lazy loading check
    await new Promise((resolve) => setTimeout(resolve, 800));

    const existingItem = getCartItem(product.id, selectedVariant);
    const isEditing = !!existingItem;

    if (isEditing) {
      // Update existing item
      updateCartItem(product.id, selectedVariant, quantityNum);
      toast.success("Variant updated!");
    } else {
      // Add new item
      const item: EnquiryItem = {
        productId: product.id,
        productName: product.name,
        modelNumber: product.modelNumber,
        variantId: variant.id,
        variantName: variant.name,
        quantity: quantityNum,
        price: variant.price,
        colorCode: variant.colorCode,
        image: product.image,
      };
      addToCart(item);
      toast.success("Variant added!");
    }

    setIsLoading(false);
    setEditingVariantId(undefined);
    setSelectedVariant(product.variants[0]?.id || "");
    setQuantity("1");
    onOpenChange(false);
  };

  const handleEditVariant = (variantId: string) => {
    setEditingVariantId(variantId);
    const item = getCartItem(product.id, variantId);
    if (item) {
      setSelectedVariant(variantId);
      setQuantity(item.quantity.toString());
    }
  };

  const handleDeleteVariant = (variantId: string) => {
    removeFromCart(product.id, variantId);
    toast.success("Variant removed from enquiry list");
  };

  const selectedVariantData = allVariants.find((v: any) => v.id === selectedVariant);
  const existingItem = getCartItem(product.id, selectedVariant);
  const isEditing = !!existingItem || !!editingVariantId;
  const hasAnyVariantInCart = cartItems.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-sm border border-border p-4 sm:p-6">
        <DialogHeader className="space-y-1.5 sm:space-y-4">
          <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60 hidden sm:block">
            Manage Enquiry
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-wide">
            {product.modelNumber}
          </DialogTitle>
          <DialogDescription className="text-[10px] sm:text-[11px] uppercase tracking-widest text-foreground/60 hidden sm:block">
            Add, edit, or remove variants from your enquiry list
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:gap-6 py-2 sm:py-6">
          {/* Existing Variants in Cart */}
          {cartItems.length > 0 && (
            <>
              <div className="space-y-2 sm:space-y-3">
                <label className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em]">
                  Current Variants in Enquiry
                </label>
                <div className="border border-border rounded-sm divide-y divide-border">
                  {cartItems.map((item) => {
                    const variant = allVariants.find((v: any) => v.id === item.variantId);
                    return (
                      <div
                        key={item.variantId}
                        className="flex items-center justify-between p-3 hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          {variant?.color && (
                            <div
                              className="h-4 w-4 rounded-sm border border-border"
                              style={{
                                backgroundColor: variant.colorCode || "#000",
                              }}
                            />
                          )}
                          <div>
                            <div className="text-sm font-bold">{item.variantName}</div>
                            <div className="text-[10px] uppercase tracking-widest text-foreground/60">
                              {item.quantity} × {formatCurrency(item.price, 'INR')} = {formatCurrency(item.quantity * item.price, 'INR')}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => handleEditVariant(item.variantId)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-sm hover:bg-foreground hover:text-background cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteVariant(item.variantId)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-sm hover:bg-red-600 hover:text-white cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Separator className="bg-border" />
            </>
          )}

          {/* Add/Edit Variant Form */}
          <div className="space-y-3 sm:space-y-5">
            <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em]">
              {isEditing ? "Edit Variant" : hasAnyVariantInCart ? "Add Another Variant" : "Add Variant"}
            </label>

            <div className="space-y-2">
              <label htmlFor="variant" className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60">
                Variant (Color)
              </label>
              <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                <SelectTrigger id="variant" className="rounded-sm border-border focus:ring-0 w-full">
                  <SelectValue placeholder="Select variant" />
                </SelectTrigger>
                <SelectContent className="rounded-sm border-border">
                  {allVariants.map((variant: any) => (
                    <SelectItem key={variant.id} value={variant.id} className="rounded-sm">
                      {variant.color ? `${variant.color} - ${formatCurrency(variant.price, 'INR')}` : `${variant.name} - ${formatCurrency(variant.price, 'INR')}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="quantity" className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60">
                Quantity
              </label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d+$/.test(value)) {
                    setQuantity(value);
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value === "" || parseInt(e.target.value) < 1) {
                    setQuantity("1");
                  }
                }}
                className="rounded-sm border-border focus:ring-0"
              />
            </div>

            {selectedVariantData && (
              <div className="border border-border rounded-sm p-3 sm:p-4 bg-muted/30">
                <div className="text-[10px] sm:text-[11px] uppercase tracking-widest space-y-1.5 sm:space-y-2">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Price per unit</span>
                    <span className="font-bold">{formatCurrency(selectedVariantData.price, 'INR')}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-1.5 sm:pt-2">
                    <span className="text-foreground/60">{parseInt(quantity) || 1} × {formatCurrency(selectedVariantData.price, 'INR')}</span>
                    <span className="font-black text-sm sm:text-base">
                      {formatCurrency(selectedVariantData.price * (parseInt(quantity) || 1), 'INR')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleUpdateCart}
              disabled={isLoading}
              className="w-full rounded-sm bg-foreground text-background hover:bg-foreground/90 h-10 sm:h-12 text-[10px] sm:text-[11px] font-black uppercase tracking-widest cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  {hasAnyVariantInCart ? "Updating..." : "Adding..."}
                </>
              ) : (
                hasAnyVariantInCart ? "Update Enquiry Cart" : "Add to Enquiry Cart"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

