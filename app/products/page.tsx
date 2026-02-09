"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/products/ProductCard";
import {
  FilterSidebarDesktop,
  FilterSidebarMobile,
  FilterState,
} from "@/components/products/FilterSidebar";
import { Product } from "@/lib/types";
import { transformProductFromDB, getCategoryDisplayName, groupProductsByModel } from "@/lib/product-helpers";

const PRODUCTS_PER_PAGE = 12;

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("best-selling");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    categories: categoryFromUrl ? [categoryFromUrl] : [],
    priceRange: null,
  });

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/products/categories');
        const data = await response.json();
        if (data.success) {
          setCategories(data.data.map((c: any) => c.category));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch all products once (we'll filter client-side for better UX)
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/products');
        const data = await response.json();

        if (data.success) {
          const transformedProducts = data.data.map((p: any) =>
            transformProductFromDB(p, p.category)
          );
          const groupedProducts = groupProductsByModel(transformedProducts);
          setProducts(groupedProducts);
        } else {
          setError(data.error || 'Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Update filters when URL changes
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedFilters(prev => ({
        ...prev,
        categories: [categoryFromUrl]
      }));
    }
  }, [categoryFromUrl]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedFilters, sortBy]);

  // Apply filters
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by categories
    if (selectedFilters.categories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedFilters.categories.includes(p.category)
      );
    }

    // Filter by price range
    if (selectedFilters.priceRange) {
      filtered = filtered.filter((p) => {
        const price = p.variants?.[0]?.price || 0;
        return (
          price >= selectedFilters.priceRange!.min &&
          price <= selectedFilters.priceRange!.max
        );
      });
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => {
        const modelNumber = p.modelNumber || p.model_number || '';
        const price = p.price || '';
        const color = p.color || '';
        return (
          modelNumber.toLowerCase().includes(query) ||
          price.toString().toLowerCase().includes(query) ||
          color.toLowerCase().includes(query)
        );
      });
    }

    // Sort
    if (sortBy === "new-arrivals") {
      filtered = filtered.reverse();
    } else if (sortBy === "price-low") {
      filtered = filtered.sort((a, b) => {
        const aPrice = a.variants?.[0]?.price || 0;
        const bPrice = b.variants?.[0]?.price || 0;
        return aPrice - bPrice;
      });
    } else if (sortBy === "price-high") {
      filtered = filtered.sort((a, b) => {
        const aPrice = a.variants?.[0]?.price || 0;
        const bPrice = b.variants?.[0]?.price || 0;
        return bPrice - aPrice;
      });
    }

    return filtered;
  }, [products, selectedFilters, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section - Premium Editorial Style */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden bg-black">
        <img
          src="https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=1200&h=400&fit=crop"
          alt="Premium clock collection"
          className="absolute inset-0 w-full h-full object-cover opacity-70 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 pb-12 max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex text-[10px] uppercase font-bold tracking-widest text-white/60 mb-4">
            <a className="hover:text-white transition-colors" href="/">Home</a>
            <span className="mx-2">/</span>
            <a className="hover:text-white transition-colors" href="/products">Collection</a>
            <span className="mx-2">/</span>
            <span className="text-white">
              {selectedFilters.categories.length === 1
                ? getCategoryDisplayName(selectedFilters.categories[0])
                : 'All Products'}
            </span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white italic tracking-wide">
            {selectedFilters.categories.length === 1
              ? getCategoryDisplayName(selectedFilters.categories[0])
              : 'Elegant Timepieces'}
          </h1>
          <p className="text-white/80 text-[10px] font-medium mt-3 max-w-xl uppercase tracking-[0.2em]">
            Official B2B Distributor for premium Ajanta and Orpat precision instruments.
          </p>
        </div>
      </div>

      <main className="flex flex-col lg:flex-row px-6 md:px-10 lg:px-16 py-6 gap-6 lg:gap-8">
        {/* Desktop Filter Sidebar */}
        <FilterSidebarDesktop
          categories={categories}
          selectedFilters={selectedFilters}
          onFilterChange={setSelectedFilters}
          productCount={filteredProducts.length}
        />

        {/* Main Content */}
        <div className="flex-1">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 border border-red-500/50 bg-red-50 dark:bg-red-900/20">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Top Controls */}
          <div className="flex flex-col gap-3 mb-6">
            {/* Mobile: Filters + Sort Row */}
            <div className="flex lg:hidden items-center justify-between">
              <FilterSidebarMobile
                categories={categories}
                selectedFilters={selectedFilters}
                onFilterChange={setSelectedFilters}
                productCount={filteredProducts.length}
              />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border border-foreground/30 rounded-none px-3 py-2 h-auto text-[10px] font-black uppercase w-auto">
                  <span className="text-foreground/50 mr-1">Sort:</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none border-foreground">
                  <SelectItem value="best-selling" className="rounded-none text-xs">Popularity</SelectItem>
                  <SelectItem value="new-arrivals" className="rounded-none text-xs">Newest</SelectItem>
                  <SelectItem value="price-low" className="rounded-none text-xs">Price: Low</SelectItem>
                  <SelectItem value="price-high" className="rounded-none text-xs">Price: High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mobile: Search Full Width */}
            <div className="flex lg:hidden border border-foreground/30 px-3 py-2 items-center gap-2">
              <Search className="h-4 w-4 text-foreground/40" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-none bg-transparent focus:ring-0 focus:outline-none text-[11px] uppercase font-medium flex-1 placeholder:text-foreground/30"
                placeholder="Search model..."
                type="text"
              />
              <span className="text-[10px] font-bold text-foreground/40">{filteredProducts.length}</span>
            </div>

            {/* Desktop: Single Row */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Search */}
              <div className="flex border border-foreground/30 px-3 py-2 items-center gap-2 w-64">
                <Search className="h-4 w-4 text-foreground/40" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-none bg-transparent focus:ring-0 focus:outline-none text-[11px] uppercase font-medium flex-1 placeholder:text-foreground/30"
                  placeholder="Search model..."
                  type="text"
                />
              </div>

              {/* Product Count */}
              <span className="text-[11px] font-bold uppercase tracking-wide text-foreground/50">
                {filteredProducts.length} products
              </span>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="border border-foreground/30 rounded-none px-3 py-2 h-auto text-[11px] font-bold uppercase w-auto">
                  <span className="text-foreground/50 mr-1">Sort:</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-none border-foreground">
                  <SelectItem value="best-selling" className="rounded-none text-xs">Popularity</SelectItem>
                  <SelectItem value="new-arrivals" className="rounded-none text-xs">Newest</SelectItem>
                  <SelectItem value="price-low" className="rounded-none text-xs">Price: Low</SelectItem>
                  <SelectItem value="price-high" className="rounded-none text-xs">Price: High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-12 gap-x-8">
              {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
                <div key={i} className="border border-foreground/10 p-4 animate-pulse">
                  <div className="aspect-square bg-muted/50 mb-6" />
                  <div className="h-3 bg-muted/50 w-1/3 mb-2" />
                  <div className="h-5 bg-muted/50 w-2/3 mb-4" />
                  <div className="h-10 bg-muted/50 mt-auto" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-12 gap-x-8">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} showAddToEnquiry />
                ))}
              </div>

              {/* Editorial Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 border-t border-foreground pt-10 flex justify-between items-center">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="text-sm">←</span> Previous
                  </button>

                  <div className="flex gap-4 font-black text-xs">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`${currentPage === pageNum ? 'underline underline-offset-4' : 'text-foreground/40 hover:text-foreground'}`}
                        >
                          {String(pageNum).padStart(2, '0')}
                        </button>
                      );
                    })}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="text-foreground/40">...</span>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className="text-foreground/40 hover:text-foreground"
                        >
                          {String(totalPages).padStart(2, '0')}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next <span className="text-sm">→</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>
      </main>



      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Navbar />
        {/* Hero skeleton */}
        <div className="h-64 md:h-80 bg-black/90 animate-pulse" />
        {/* Content skeleton */}
        <div className="flex flex-col md:flex-row px-6 md:px-16 py-10 gap-12 max-w-7xl mx-auto">
          {/* Sidebar skeleton */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="h-8 bg-muted/50 w-24 mb-6" />
            <div className="h-px bg-muted/30 mb-8" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-6 bg-muted/30 rounded" />
              ))}
            </div>
          </div>
          {/* Products skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-12 gap-x-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="border border-foreground/10 p-4 animate-pulse">
                  <div className="aspect-square bg-muted/50 mb-6" />
                  <div className="h-3 bg-muted/50 w-1/3 mb-2" />
                  <div className="h-5 bg-muted/50 w-2/3 mb-4" />
                  <div className="h-10 bg-muted/50 mt-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
