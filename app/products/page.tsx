"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/products/ProductCard";
import { EnquiryCart } from "@/components/products/EnquiryCart";
import { products } from "@/lib/data";
import { Product } from "@/lib/types";

const PRODUCTS_PER_PAGE = 12;

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "all";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl);
  const [sortBy, setSortBy] = useState<string>("best-selling");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Update category when URL changes
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  // Simulate lazy loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, searchQuery, selectedCategory, sortBy]);

  const filteredProducts = useMemo(() => {
    let filtered: Product[] = [...products];

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === "best-selling") {
      // Keep original order for best-selling
    } else if (sortBy === "new-arrivals") {
      // Reverse order for new arrivals
      filtered = filtered.reverse();
    } else if (sortBy === "price") {
      filtered = filtered.sort((a, b) => {
        const aMinPrice = Math.min(...a.variants.map((v) => v.price));
        const bMinPrice = Math.min(...b.variants.map((v) => v.price));
        return aMinPrice - bMinPrice;
      });
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const categoryLabels: Record<string, string> = {
    all: "All Categories",
    "wall-clocks": "Wall Clocks",
    "desk-clocks": "Desk Clocks",
    "premium-gifting": "Premium Gifting",
    "personalized": "Personalized",
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
          {/* Top Controls */}
          <div className="mb-6 sm:mb-8 space-y-3 sm:space-y-4">
            <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
              {/* Search */}
              <div className="flex-1">
                <Input
                  placeholder="Search clocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:max-w-md"
                />
              </div>

              {/* Filters and Sort */}
              <div className="flex gap-2 sm:gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="flex-1 sm:w-[140px] md:w-[160px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="flex-1 sm:w-[140px] md:w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="best-selling">Best Selling</SelectItem>
                    <SelectItem value="new-arrivals">New Arrivals</SelectItem>
                    <SelectItem value="price">Price (Low to High)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results count */}
            {filteredProducts.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
              </div>
            )}
          </div>

          {/* Product Grid with Loading State */}
          {isLoading ? (
            <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-[400px] sm:h-[450px] md:h-[500px] w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} showAddToEnquiry />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 sm:mt-10 md:mt-12">
                  <Pagination>
                    <PaginationContent className="flex-wrap gap-1">
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        const showPage =
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1);

                        if (!showPage) {
                          // Show ellipsis
                          if (page === currentPage - 2 || page === currentPage + 2) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          return null;
                        }

                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          className={
                            currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 sm:py-16 md:py-20 text-center">
              <p className="text-base sm:text-lg text-muted-foreground">
                No products found matching your criteria.
              </p>
            </div>
          )}
        </main>

        {/* Enquiry Cart Sidebar */}
        <EnquiryCart />

        <Footer />
        </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
          <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[400px] sm:h-[450px] md:h-[500px] w-full rounded-lg" />
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

