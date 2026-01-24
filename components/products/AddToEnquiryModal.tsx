"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants[0]?.id || ""
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
      updates.variant = product.variants[0]?.id || "";
      const existingItem = getCartItem(product.id, updates.variant);
      if (existingItem) {
        updates.quantity = existingItem.quantity.toString();
      }
    }
    
    // Batch updates
    setSelectedVariant(updates.variant);
    setQuantity(updates.quantity);
  }, [open, editingVariantId, product.id, product.variants, getCartItem]);

  const handleUpdateCart = async () => {
    const variant = product.variants.find((v) => v.id === selectedVariant);
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
        variantId: variant.id,
        variantName: variant.name,
        quantity: quantityNum,
        price: variant.price,
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

  const selectedVariantData = product.variants.find((v) => v.id === selectedVariant);
  const existingItem = getCartItem(product.id, selectedVariant);
  const isEditing = !!existingItem || !!editingVariantId;
  const hasAnyVariantInCart = cartItems.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Enquiry - {product.modelNumber}</DialogTitle>
          <DialogDescription>
            Add, edit, or remove variants from your enquiry list
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Existing Variants in Cart */}
          {cartItems.length > 0 && (
            <>
              <div className="space-y-2">
                <Label>Current Variants in Enquiry List</Label>
                <div className="rounded-lg border divide-y">
                  {cartItems.map((item) => {
                    const variant = product.variants.find((v) => v.id === item.variantId);
                    return (
                      <div
                        key={item.variantId}
                        className="flex items-center justify-between p-3 hover:bg-muted/50"
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
                              Quantity: {item.quantity} × ${item.price} = ${(item.quantity * item.price).toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditVariant(item.variantId)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteVariant(item.variantId)}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Add/Edit Variant Form */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">
                {isEditing ? "Edit Variant" : hasAnyVariantInCart ? "Add Another Variant" : "Add Variant"}
              </Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="variant">Variant (Color)</Label>
              <Select value={selectedVariant} onValueChange={setSelectedVariant}>
                <SelectTrigger id="variant">
                  <SelectValue placeholder="Select variant" />
                </SelectTrigger>
                <SelectContent>
                  {product.variants.map((variant) => (
                    <SelectItem key={variant.id} value={variant.id}>
                      <div className="flex items-center gap-2">
                        {variant.color && (
                          <div
                            className="h-4 w-4 rounded-full border"
                            style={{
                              backgroundColor: variant.colorCode || "#000",
                            }}
                          />
                        )}
                        <span>
                          {variant.name} - ${variant.price}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty string for clearing
                  if (value === "" || /^\d+$/.test(value)) {
                    setQuantity(value);
                  }
                }}
                onBlur={(e) => {
                  // If empty on blur, set to 1
                  if (e.target.value === "" || parseInt(e.target.value) < 1) {
                    setQuantity("1");
                  }
                }}
              />
            </div>

            {selectedVariantData && (
              <div className="rounded-lg border p-3 bg-muted/50">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price per unit:</span>
                    <span className="font-medium">${selectedVariantData.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-semibold">
                      ${(selectedVariantData.price * (parseInt(quantity) || 1)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleUpdateCart}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

