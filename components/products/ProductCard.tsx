"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { NoiseBackground } from "@/components/ui/noise-background";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product } from "@/lib/types";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";
import { AddToEnquiryModal } from "./AddToEnquiryModal";
import { Edit, Trash2, Maximize2 } from "lucide-react";

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
  const { getProductCartItems, removeFromCart } = useEnquiryCart();

  // Get unique colors from variants
  const availableColors = product.variants
    .filter((v) => v.color)
    .map((v) => ({
      name: v.color!,
      code: v.colorCode || "#000000",
    }));

  // Get all variants in cart for this product
  const cartItems = getProductCartItems(product.id);
  const isInCart = cartItems.length > 0;
  // Show exact price of first variant (or minimum price)
  const displayPrice = product.variants[0]?.price || Math.min(...product.variants.map((v) => v.price));

  // Generate gradient colors based on category for visual variety
  const getGradientColors = (category: string) => {
    const gradients: Record<string, string[]> = {
      "wall-clocks": ["rgb(100, 150, 255)", "rgb(150, 100, 255)", "rgb(255, 150, 100)"],
      "desk-clocks": ["rgb(255, 150, 100)", "rgb(100, 200, 255)", "rgb(255, 200, 100)"],
      "premium-gifting": ["rgb(255, 100, 150)", "rgb(100, 150, 255)", "rgb(255, 200, 100)"],
      "personalized": ["rgb(150, 255, 100)", "rgb(255, 150, 200)", "rgb(100, 200, 255)"],
    };
    return gradients[category] || gradients["premium-gifting"];
  };

  const handleRemoveAll = () => {
    cartItems.forEach((item) => {
      removeFromCart(product.id, item.variantId);
    });
  };

  return (
    <>
      <div className="mx-auto w-full">
        <NoiseBackground
          gradientColors={getGradientColors(product.category)}
          className="h-full"
        >
          <Card>
            {/* Product Image */}
            <div className="relative h-48 sm:h-52 md:h-56 lg:h-60 w-full overflow-hidden group">
              {product.image && product.image.includes('unsplash') && !imageError ? (
                <>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  
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
                        <div className="relative w-full aspect-square">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                        <div className="text-center mt-4">
                          <h3 className="text-lg font-semibold">{product.name}</h3>
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
                    ${displayPrice}
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
                      {availableColors.map((color, idx) => (
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
                  {isInCart ? (
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
