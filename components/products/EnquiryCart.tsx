"use client";

import { useState, useMemo, createContext, useContext, ReactNode, useEffect } from "react";
import { ShoppingCart, Trash2, ArrowUp, Trash, X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/product-helpers";
import { Separator } from "@/components/ui/separator";

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
    return { isOpen: false, setIsOpen: () => { } };
  }
  return context;
}

interface EnquiryCartProps {
  controlledOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EnquiryCart({ controlledOpen, onOpenChange }: EnquiryCartProps = {}) {
  const { items, removeFromCart, updateCartItem, clearCart, totalItems, uniqueProductsCount } = useEnquiryCart();
  const cartContext = useCartOpen();
  const [internalOpen, setInternalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [deletingItem, setDeletingItem] = useState<{ productId: string, variantId: string } | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [editingQuantities, setEditingQuantities] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const isOpen = controlledOpen !== undefined ? controlledOpen : (cartContext.isOpen ?? internalOpen);
  const setIsOpen = onOpenChange || cartContext.setIsOpen || setInternalOpen;

  const totalValue = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const handleQuantityChange = (productId: string, variantId: string, value: string) => {
    const key = `${productId}-${variantId}`;
    setEditingQuantities({ ...editingQuantities, [key]: value });
  };

  const updateQuantity = (productId: string, variantId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateCartItem(productId, variantId, newQuantity);
    }
  };

  const handleQuantityBlur = (productId: string, variantId: string, currentQty: number) => {
    const key = `${productId}-${variantId}`;
    if (key in editingQuantities) {
      const value = editingQuantities[key];
      const quantity = parseInt(value || "1");
      if (quantity >= 1) {
        updateCartItem(productId, variantId, quantity);
      } else {
        updateCartItem(productId, variantId, currentQty);
      }
      const newEditingQuantities = { ...editingQuantities };
      delete newEditingQuantities[key];
      setEditingQuantities(newEditingQuantities);
    }
  };

  const getQuantityValue = (productId: string, variantId: string, currentQty: number) => {
    const key = `${productId}-${variantId}`;
    if (key in editingQuantities) {
      return editingQuantities[key];
    }
    return currentQty.toString();
  };

  const handleDeleteItem = async (productId: string, variantId: string) => {
    setDeletingItem({ productId, variantId });
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      removeFromCart(productId, variantId);
    } finally {
      setDeletingItem(null);
    }
  };

  const handleClearCart = async () => {
    setIsClearing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      clearCart();
    } finally {
      setIsClearing(false);
      setShowClearDialog(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {/* CRITICAL CHANGE: max-w-[90vw] and md:max-w-6xl for TRUE desktop width */}
        <DialogContent className="max-w-[95vw] md:max-w-[1200px] h-[90vh] md:h-[85vh] p-0 gap-0 overflow-hidden flex flex-col rounded-md border-border shadow-2xl bg-background">
          <DialogHeader className="p-6 border-b shrink-0 flex flex-row items-center justify-between bg-muted/5 space-y-0">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-2xl font-bold tracking-tight">
                Shopping Cart
              </DialogTitle>
              <Badge variant="secondary" className="font-mono text-xs rounded-full px-2.5 h-6 flex items-center">
                {items.length} Items
              </Badge>
            </div>
          </DialogHeader>

          {/* Main Layout: Grid on Desktop, Flex Column on Mobile */}
          <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-[1fr_380px]">

            {/* Items Column */}
            <div className="h-full overflow-y-auto bg-background p-0 scrollbar-thin">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
                  <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center mb-6">
                    <ShoppingCart className="w-10 h-10 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
                  <p className="text-muted-foreground max-w-sm mb-6">
                    Browse our collection of premium corporate clocks and add items to your enquiry.
                  </p>
                  <Button asChild size="default" onClick={() => setIsOpen(false)} className="rounded-sm px-8">
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-muted/5 transition-colors">
                      {/* Product Image - Fixed Size */}
                      <div className="w-full sm:w-40 h-40 bg-white border border-border/60 rounded-sm flex items-center justify-center shrink-0 p-4 overflow-hidden relative">
                        {item.image ? (
                          <img src={item.image} alt={item.productName} className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted/10">
                            <div className="w-12 h-12 rounded-full" style={{ backgroundColor: item.colorCode || '#ddd' }} />
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <h4 className="font-bold text-xl text-foreground leading-tight">{item.productName}</h4>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-xs font-mono text-muted-foreground bg-muted/30 px-1.5 py-0.5 rounded-sm border border-border/50 uppercase tracking-widest">
                                {item.modelNumber}
                              </span>
                              <span className="text-sm font-medium text-foreground/80">
                                {item.variantName}
                              </span>
                              {item.colorCode && (
                                <div className="w-3.5 h-3.5 rounded-full border border-border/50 shadow-sm" style={{ backgroundColor: item.colorCode }} />
                              )}
                            </div>
                          </div>
                          <div className="text-right hidden sm:block">
                            <p className="font-bold text-xl font-mono tracking-tight">{formatCurrency(item.price * item.quantity, 'INR')}</p>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground hidden sm:block">Qty</label>
                              <div className="flex items-center border rounded-sm bg-background h-9 shadow-sm">
                                <button
                                  className="h-full w-9 flex items-center justify-center border-r hover:bg-muted disabled:opacity-50 transition-colors"
                                  onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <Input
                                  type="number"
                                  min="1"
                                  value={getQuantityValue(item.productId, item.variantId, item.quantity)}
                                  onChange={(e) => handleQuantityChange(item.productId, item.variantId, e.target.value)}
                                  onBlur={() => handleQuantityBlur(item.productId, item.variantId, item.quantity)}
                                  className="w-12 h-full border-none text-center focus-visible:ring-0 p-0 shadow-none rounded-none font-medium text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none"
                                />
                                <button
                                  className="h-full w-9 flex items-center justify-center border-l hover:bg-muted transition-colors"
                                  onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <div className="h-4 w-px bg-border/50 hidden sm:block"></div>

                            <button
                              onClick={() => handleDeleteItem(item.productId, item.variantId)}
                              className="text-sm font-medium text-muted-foreground hover:text-destructive hover:underline flex items-center gap-1.5 transition-colors"
                            >
                              {deletingItem?.productId === item.productId && deletingItem?.variantId === item.variantId ? <Spinner className="w-3.5 h-3.5" /> : "Remove"}
                            </button>
                          </div>

                          {/* Mobile Price Display */}
                          <div className="sm:hidden font-bold text-lg">
                            {formatCurrency(item.price * item.quantity, 'INR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary Column / Footer - Sticky on Desktop, Stacked on Mobile */}
            {items.length > 0 && (
              <div className="bg-muted/10 border-t md:border-t-0 md:border-l p-6 md:p-8 flex flex-col justify-between shrink-0 h-auto md:h-full overflow-y-auto">
                <div className="space-y-6">
                  <h3 className="font-bold text-xl">Order Summary</h3>

                  <div className="space-y-3 pb-6 border-b border-border/50">
                    <div className="flex justify-between text-base">
                      <span className="text-muted-foreground">Items</span>
                      <span className="font-medium">{items.length}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-muted-foreground">Total Quantity</span>
                      <span className="font-medium">{totalItems}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <span className="font-bold text-lg">Subtotal</span>
                    <span className="font-bold text-3xl text-primary">{formatCurrency(totalValue, 'INR')}</span>
                  </div>

                  <div className="p-4 bg-background border rounded-sm text-sm text-muted-foreground leading-relaxed shadow-sm">
                    <span className="font-bold block mb-1 text-foreground">Bulk Pricing Available</span>
                    Request a quote to receive exclusive corporate pricing and shipping estimates within 24 hours.
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <Button asChild size="lg" className="w-full h-12 text-base font-bold shadow-md rounded-sm">
                    <Link href="/enquire" onClick={() => setIsOpen(false)}>
                      Proceed to Enquiry
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-11 border-border/60 hover:bg-background"
                    onClick={() => setIsOpen(false)}
                  >
                    Continue Shopping
                  </Button>

                  <div className="pt-4 text-center">
                    <Button
                      variant="link"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive p-0"
                      onClick={() => setShowClearDialog(true)}
                    >
                      Clear Cart
                    </Button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </DialogContent>
      </Dialog>

      {/* Clear Cart Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Empty your cart?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove all {items.length} items?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClearing} className="rounded-sm">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearCart}
              disabled={isClearing}
              className="bg-destructive hover:bg-destructive/90 rounded-sm"
            >
              {isClearing ? <Spinner className="mr-2" /> : "Empty Cart"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
