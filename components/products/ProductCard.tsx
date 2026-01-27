"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { NoiseBackground } from "@/components/ui/noise-background";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/lib/types";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { AddToEnquiryModal } from "./AddToEnquiryModal";
import { Edit, Trash2, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency, getCategoryGradient } from "@/lib/product-helpers";

interface ProductCardProps {
  product: Product;
  showAddToEnquiry?: boolean;
}

const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "flex h-[420px] sm:h-[450px] md:h-[480px] lg:h-[500px] flex-col overflow-hidden rounded-lg bg-white text-center dark:bg-neutral-800",
        className,
      )}
    >
      {children}
    </div>
  );
};

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

  // Get unique colors from all variants (for grouped products)
  const allVariants = (product as any).allVariants || product.variants;
  const availableColors = Array.from(
    new Map(
      allVariants
        .filter((v: any) => v.color)
        .map((v: any) => [v.color, { name: v.color!, code: v.colorCode || "#000000" }])
    ).values()
  );

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

  // Use imported gradient helper
  const gradientColors = getCategoryGradient(product.category);

  const handleRemoveAll = () => {
    cartItems.forEach((item) => {
      removeFromCart(product.id, item.variantId);
    });
  };

  return (
    <>
      <div className="mx-auto w-full">
        <NoiseBackground
          gradientColors={gradientColors}
          className="h-full"
        >
          <Card>
            {/* Product Image with Carousel */}
            <div className="relative h-48 sm:h-52 md:h-56 lg:h-60 w-full overflow-hidden group">
              {currentImage.url && !imageError ? (
                <>
                  <img
                    src={currentImage.url}
                    alt={`${product.name} - ${currentImage.color || ''}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
                  {/* Image Navigation Buttons */}
                  {images.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white text-black opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        onClick={handlePrevImage}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/90 hover:bg-white text-black opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        onClick={handleNextImage}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      {/* Image Indicator */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                        {images.map((_: any, idx: number) => (
                          <div
                            key={idx}
                            className={cn(
                              "h-1.5 w-1.5 rounded-full transition-all",
                              idx === currentImageIndex
                                ? "bg-white w-4"
                                : "bg-white/50"
                            )}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  
                  {/* Hover Overlay with Enlarge Button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="bg-white/90 hover:bg-white text-black"
                        >
                          <Maximize2 className="mr-2 h-4 w-4" />
                          Enlarge
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl w-[90vw] p-2">
                        <DialogTitle className="sr-only">
                          {product.name} {currentImage.color && `- ${currentImage.color}`}
                        </DialogTitle>
                        <div className="relative w-full aspect-square">
                          <img
                            src={currentImage.url}
                            alt={`${product.name} - ${currentImage.color || ''}`}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                        <div className="text-center mt-4">
                          <h3 className="text-lg font-semibold">{product.name} {currentImage.color && `- ${currentImage.color}`}</h3>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-full w-full bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl sm:text-4xl">🕐</span>
                  </div>
                </>
              )}
            </div>

            {/* Product Content - Fixed height container */}
            <div className="flex flex-1 flex-col px-3 sm:px-4 py-3 sm:py-4 min-h-0">
              <div className="mb-2 sm:mb-3 flex items-center justify-between flex-shrink-0">
                <span className="text-[10px] sm:text-xs font-mono text-muted-foreground">
                  {product.modelNumber}
                </span>
                <div className="text-right">
                  <div className="text-xs sm:text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    {formatCurrency(displayPrice, 'INR')}
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground">per unit</div>
                </div>
              </div>

              {/* Available Colors - Fixed height with scroll */}
              {availableColors.length > 0 && (
                <div className="mb-3 sm:mb-4 flex-shrink-0">
                  <Label className="text-left text-[10px] sm:text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 sm:mb-2 block">
                    Colors Available:
                  </Label>
                  <div className="max-h-16 sm:max-h-20 overflow-y-auto">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {availableColors.map((color: any, idx: number) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1"
                        >
                          <div
                            className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full border border-neutral-300"
                            style={{ backgroundColor: color.code }}
                          />
                          <span className="text-[10px] sm:text-xs">{color.name}</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button - Fixed at bottom */}
              {showAddToEnquiry && (
                <div className="mt-auto flex-shrink-0">
                  {!mounted ? (
                    <Button
                      className="w-full"
                      size="sm"
                      disabled
                    >
                      Loading...
                    </Button>
                  ) : isInCart ? (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setIsModalOpen(true)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        onClick={handleRemoveAll}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full"
                      size="sm"
                    >
                      Add to Enquiry List
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
        </NoiseBackground>
      </div>

      <AddToEnquiryModal
        product={product}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
