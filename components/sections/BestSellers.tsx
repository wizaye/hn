"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { transformProductFromDB, groupProductsByModel } from "@/lib/product-helpers";

export function BestSellers() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBestSellers() {
      try {
        const response = await fetch('/api/products?limit=1000');
        const data = await response.json();

        if (data.success) {
          // Transform products
          const transformedProducts = data.data
            .map((p: any) => transformProductFromDB(p, p.category));

          // Group by model number so same models with different colors show as one card
          const groupedProducts = groupProductsByModel(transformedProducts);

          // Filter for specific best seller models
          const bestSellerModels = ["PDS-397", "GF-3127", "MP-2827", "DS-157"];
          const filteredProducts = groupedProducts.filter(p =>
            bestSellerModels.includes(p.modelNumber)
          );

          // Sort according to the order in bestSellerModels
          filteredProducts.sort((a, b) => {
            return bestSellerModels.indexOf(a.modelNumber) - bestSellerModels.indexOf(b.modelNumber);
          });

          setProducts(filteredProducts);
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
          <div className="grid gap-4 sm:gap-5 md:gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[500px] w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-5 md:gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
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

