"use client";

import { useState, useMemo, createContext, useContext, ReactNode, useEffect } from "react";
import { ShoppingCart, Trash2, ArrowUp, Trash } from "lucide-react";
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
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Hook to detect mobile screen
function useIsMobile(breakpoint: number = 640) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return isMobile;
}

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
  const { items, removeFromCart, updateCartItem, clearCart, totalItems, uniqueProductsCount } = useEnquiryCart();
  const cartContext = useCartOpen();
  const [internalOpen, setInternalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [deletingItem, setDeletingItem] = useState<{productId: string, variantId: string} | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{productId: string, variantId: string} | null>(null);

  // Prevent hydration mismatch by only rendering cart content after mount
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Check if we're on the products page
  const isProductsPage = pathname === "/products" || pathname.startsWith("/products");
  
  // Track scroll position for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
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

  const handleQuantityBlur = (productId: string, variantId: string, currentQty: number) => {
    const key = `${productId}-${variantId}`;
    
    // Only update if the key exists in editingQuantities (user actually edited)
    if (key in editingQuantities) {
      const value = editingQuantities[key];
      const quantity = parseInt(value || "1");
      if (quantity >= 1) {
        updateCartItem(productId, variantId, quantity);
      } else {
        // If invalid, reset to current quantity
        updateCartItem(productId, variantId, currentQty);
      }
      // Remove the key
      const newEditingQuantities = { ...editingQuantities };
      delete newEditingQuantities[key];
      setEditingQuantities(newEditingQuantities);
    }
  };

  const getQuantityValue = (productId: string, variantId: string, currentQty: number) => {
    const key = `${productId}-${variantId}`;
    // Only use editing value if it exists and is not undefined
    if (key in editingQuantities) {
      return editingQuantities[key];
    }
    return currentQty.toString();
  };

  const handleDeleteItem = async (productId: string, variantId: string) => {
    setDeletingItem({productId, variantId});
    try {
      // Simulate a brief delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      removeFromCart(productId, variantId);
    } finally {
      setDeletingItem(null);
      setPendingDelete(null);
    }
  };

  const handleClearCart = async () => {
    setIsClearing(true);
    try {
      // Simulate a brief delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      clearCart();
    } finally {
      setIsClearing(false);
      setShowClearDialog(false);
    }
  };

  return (
    <>
      {/* Scroll to Top Button - Show when NOT on products page and scrolled down */}
      {!isProductsPage && showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all"
          size="icon"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}
      
      {/* Cart Button & Drawer - Only show on products page */}
      {isProductsPage && (
        <Drawer open={isOpen} onOpenChange={setIsOpen} direction={isMobile ? "bottom" : "right"}>
          <DrawerTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
              size="icon"
            >
              <ShoppingCart className="h-6 w-6" />
              {uniqueProductsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground animate-in zoom-in-50">
                  {uniqueProductsCount}
                </span>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent className={isMobile 
          ? "h-[85vh] flex flex-col p-0 overflow-x-hidden rounded-t-2xl" 
          : "h-full w-full sm:w-[450px] sm:max-w-[450px] flex flex-col p-0 overflow-x-hidden rounded-l-2xl"
        }>
          <DrawerHeader className="border-b p-5 pb-4 bg-gradient-to-r from-background to-muted/30">
            <DrawerTitle className="text-2xl">Enquiry Cart</DrawerTitle>
            <DrawerDescription>
              Review your selected products and submit your enquiry
            </DrawerDescription>
            {uniqueProductsCount > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary" className="text-xs rounded-full px-3">
                  {uniqueProductsCount} {uniqueProductsCount === 1 ? "product" : "products"}
                </Badge>
                <Badge variant="secondary" className="text-xs rounded-full px-3">
                  {items.length} {items.length === 1 ? "variant" : "variants"}
                </Badge>
              </div>
            )}
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4 py-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mb-6" />
                <h3 className="text-lg font-semibold mb-2">Your enquiry cart is empty</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Add products from the catalog to start building your enquiry
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedItems).map(([productId, productItems]) => {
                  // Get product info from first item (all items have same product info)
                  const firstItem = productItems[0];
                  return (
                    <div key={productId} className="space-y-3">
                      {/* Product Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-base">{firstItem.productName}</h3>
                          {firstItem.modelNumber && (
                            <p className="text-xs text-muted-foreground font-mono mt-0.5">
                              {firstItem.modelNumber}
                            </p>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {productItems.length} {productItems.length === 1 ? "variant" : "variants"}
                        </Badge>
                      </div>

                      {/* Variants List - Table-like format */}
                      <div className="rounded-xl border bg-card/50 divide-y overflow-hidden">
                        {productItems.map((item, idx) => {
                          const itemTotal = item.quantity * item.price;
                          return (
                            <div
                              key={`${item.productId}-${item.variantId}-${idx}`}
                              className="p-3 hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                {/* Color Swatch */}
                                {item.colorCode && (
                                  <div
                                    className="h-4 w-4 rounded-full border border-border flex-shrink-0"
                                    style={{
                                      backgroundColor: item.colorCode || "#000",
                                    }}
                                  />
                                )}
                                
                                {/* Variant Name */}
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm">{item.variantName}</div>
                                  <div className="text-xs text-muted-foreground">
                                    ₹{item.price}/unit
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
                                    onBlur={() => handleQuantityBlur(item.productId, item.variantId, item.quantity)}
                                    className="w-16 h-8 text-center text-sm"
                                  />
                                </div>

                                {/* Total */}
                                <div className="text-right min-w-[70px]">
                                  <div className="font-semibold text-sm">₹{itemTotal.toFixed(2)}</div>
                                </div>

                                {/* Remove Button */}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setPendingDelete({productId: item.productId, variantId: item.variantId})}
                                  disabled={deletingItem?.productId === item.productId && deletingItem?.variantId === item.variantId}
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive flex-shrink-0"
                                >
                                  {deletingItem?.productId === item.productId && deletingItem?.variantId === item.variantId ? (
                                    <Spinner size="sm" className="text-muted-foreground" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
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
              <div className="border-t bg-gradient-to-t from-muted/50 to-background p-5 space-y-4">
                <div className="space-y-2 rounded-xl bg-card/80 p-4 border">
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
                    <span className="font-bold text-lg">₹{totalValue.toFixed(2)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button
                    asChild
                    className="w-full rounded-xl"
                    size="lg"
                  >
                    <Link href="/enquire" onClick={() => setIsOpen(false)}>
                      Fill in Details and Submit Enquiry
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setShowClearDialog(true)}
                    disabled={isClearing}
                  >
                    {isClearing ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Clearing Cart...
                      </>
                    ) : (
                      <>
                        <Trash className="h-4 w-4 mr-2" />
                        Clear Cart
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
      )}
      
      {/* Delete Item Confirmation Dialog */}
      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this item from your enquiry cart? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingItem !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && handleDeleteItem(pendingDelete.productId, pendingDelete.variantId)}
              disabled={deletingItem !== null}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deletingItem ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear Cart Confirmation Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Entire Cart?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove all {items.length} item{items.length !== 1 ? 's' : ''} from your cart? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearCart}
              disabled={isClearing}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isClearing ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Clearing...
                </>
              ) : (
                "Clear Cart"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
