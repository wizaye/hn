"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/lib/types";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { AddToEnquiryModal } from "./AddToEnquiryModal";
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency, getCategoryDisplayName } from "@/lib/product-helpers";

interface ProductCardProps {
  product: Product;
  showAddToEnquiry?: boolean;
}

export function ProductCard({ product, showAddToEnquiry = false }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { getProductCartItems, removeFromCart } = useEnquiryCart();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle grouped products with multiple images
  const images = (product as any).images || [{ url: product.image, color: (product as any).color, variantId: product.id }];
  const currentImage = images[currentImageIndex];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Get all variants in cart for this product
  const cartItems = getProductCartItems(product.id);
  const isInCart = cartItems.length > 0;

  // Show exact price of first variant (or minimum price)
  const displayPrice = product.variants[0]?.price || Math.min(...product.variants.map((v) => v.price));

  // Count total variants
  const variantCount = product.variants?.length || 1;

  const handleRemoveAll = () => {
    cartItems.forEach((item) => {
      removeFromCart(product.id, item.variantId);
    });
  };

  return (
    <>
      <div className="group border border-foreground/10 hover:border-foreground transition-colors flex flex-col p-2 sm:p-3 rounded-sm">
        {/* Product Image Section */}
        <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
          <DialogTrigger asChild>
            <div className="relative aspect-square mb-2 sm:mb-3 overflow-hidden bg-muted/30 cursor-pointer">
              {currentImage?.url && !imageError ? (
                <>
                  <img
                    src={currentImage.url}
                    alt={product.modelNumber}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    onError={() => setImageError(true)}
                  />

                  {/* Hover Overlay with Zoom Hint */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-background/90 text-foreground px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border border-foreground/10 shadow-sm flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 21-4.3-4.3" /><path d="M11 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6" /></svg>
                      Enlarge
                    </span>
                  </div>

                  {/* Image Navigation (Carousel) */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-1 top-1/2 -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 bg-white dark:bg-zinc-800 text-black dark:text-white border border-black/10 shadow-md flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10 rounded-full"
                      >
                        <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8 bg-white dark:bg-zinc-800 text-black dark:text-white border border-black/10 shadow-md flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10 rounded-full"
                      >
                        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      {/* Image Indicators */}
                      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
                        {images.map((_: any, idx: number) => (
                          <div
                            key={idx}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full transition-colors shadow-sm",
                              idx === currentImageIndex ? "bg-foreground" : "bg-foreground/20"
                            )}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <span className="text-4xl opacity-20">🕐</span>
                </div>
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-3xl w-[90vw] p-4 rounded-sm">
            <div className="relative w-full aspect-square bg-muted/20">
              {currentImage?.url && (
                <img
                  src={currentImage.url}
                  alt={product.modelNumber}
                  className="w-full h-full object-contain p-8"
                />
              )}
            </div>
            <div className="text-center mt-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                {getCategoryDisplayName(product.category)}
              </p>
              <h3 className="text-2xl font-bold">{product.modelNumber}</h3>
              <p className="text-lg font-bold uppercase mt-3">{formatCurrency(displayPrice, 'INR')}</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Product Info */}
        <div className="flex flex-col flex-1 gap-1">
          {/* Category Label */}
          <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground line-clamp-1">
            {getCategoryDisplayName(product.category)}
          </p>

          {/* Model Number */}
          <h3 className="text-base sm:text-lg font-bold truncate">
            {product.modelNumber}
          </h3>

          {/* Available Colors Text */}
          {images.length > 1 && (
            <p className="text-[9px] sm:text-[10px] text-muted-foreground/80 line-clamp-1 mb-1">
              {images.map((img: any) => img.color || 'Variant').join(', ')}
            </p>
          )}

          {/* Price & Actions */}
          <div className="mt-auto pt-2 border-t border-foreground/10">
            <div className="flex justify-between items-end mb-2 sm:mb-3">
              <div className="flex flex-col">
                <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-[0.15em] text-muted-foreground">B2B Price</span>
                <span className="text-xs sm:text-sm font-bold uppercase">{formatCurrency(displayPrice, 'INR')}</span>
              </div>
              {mounted && isInCart && (
                <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-[0.15em] text-green-600">
                  In Cart
                </span>
              )}

            </div>

            {/* Action Button */}
            {showAddToEnquiry && (
              <>
                {!mounted ? (
                  <button
                    disabled
                    className="w-full bg-foreground/50 text-background py-2 sm:py-3 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] cursor-not-allowed"
                  >
                    Loading...
                  </button>
                ) : isInCart ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex-1 bg-foreground text-background py-2 sm:py-3 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.15em] hover:bg-background hover:text-foreground border border-foreground transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={handleRemoveAll}
                      className="px-3 sm:px-4 border border-foreground text-foreground py-2 sm:py-3 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-foreground text-background py-2 sm:py-3 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] hover:bg-background hover:text-foreground border border-foreground transition-all cursor-pointer"
                  >
                    Add to Enquiry
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <AddToEnquiryModal
        product={product}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
