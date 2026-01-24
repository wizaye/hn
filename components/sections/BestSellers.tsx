"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { bestSellingProducts } from "@/lib/data";
import { ProductCard } from "@/components/products/ProductCard";

export function BestSellers() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <div className="mb-8 sm:mb-10 md:mb-12 text-center">
          <h2 className="mb-2 sm:mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-muted-foreground tracking-tight">
            Best Sellers <span className="text-foreground">Across Categories</span>
          </h2>
        </div>

        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bestSellingProducts.map((product) => (
            <ProductCard key={product.id} product={product} showAddToEnquiry />
          ))}
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 text-center">
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
            <Link href="/products">Explore Full Catalog</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

