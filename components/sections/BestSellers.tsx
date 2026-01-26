"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { transformProductFromDB } from "@/lib/product-helpers";

export function BestSellers() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBestSellers() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (data.success) {
          // Transform and take first 8 products as best sellers
          const transformedProducts = data.data
            .slice(0, 8)
            .map((p: any) => transformProductFromDB(p, p.category));
          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Error fetching best sellers:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchBestSellers();
  }, []);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <div className="mb-8 sm:mb-10 md:mb-12 text-center">
          <h2 className="mb-2 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-muted-foreground tracking-tight">
            Best Sellers <span className="text-foreground">Across Categories</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[500px] w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={product.id || index} product={product} showAddToEnquiry />
            ))}
          </div>
        )}

        <div className="mt-8 sm:mt-10 md:mt-12 text-center">
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link href="/products">Explore Full Catalog</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

