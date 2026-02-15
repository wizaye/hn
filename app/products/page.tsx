"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
// import { Navbar } from "@/components/layout/Navbar";

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
import { Navbar } from "@/components/layout/Navbar";

const PRODUCTS_PER_PAGE = 12;

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("best-selling");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false); // for page transitions
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Fetch products from API with pagination
  const fetchProducts = useCallback(async (page: number, isPageChange = false) => {
    if (isPageChange) {
      setIsPageLoading(true);
    } else {
      setIsLoading(true);
    }


    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(PRODUCTS_PER_PAGE));

      if (selectedFilters.categories.length === 1) {
        params.set('category', selectedFilters.categories[0]);
      }
      if (selectedFilters.priceRange) {
        params.set('minPrice', String(selectedFilters.priceRange.min));
        if (selectedFilters.priceRange.max !== Infinity) {
          params.set('maxPrice', String(selectedFilters.priceRange.max));
        }
      }

      if (searchQuery.trim()) {
        params.set('search', searchQuery.trim());
      }
      if (sortBy && sortBy !== 'best-selling') {
        params.set('sort', sortBy);
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        // Group by model for display
        const grouped = groupProductsByModel(
          data.data.map((p: any) => transformProductFromDB(p, p.category))
        );
        setProducts(grouped);
        setTotalProducts(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      } else {
        toast.error(data.error || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('Failed to fetch products. Please try again.');
    } finally {
      setIsLoading(false);
      setIsPageLoading(false);
    }
  }, [selectedFilters, searchQuery, sortBy]);

  // Update filters when URL changes
  useEffect(() => {
    setSelectedFilters(prev => ({
      ...prev,
      categories: categoryFromUrl ? [categoryFromUrl] : []
    }));
  }, [categoryFromUrl]);

  // Fetch when filters/sort change (reset to page 1)
  useEffect(() => {
    setCurrentPage(1);
    fetchProducts(1);
  }, [selectedFilters, sortBy]);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts(1);
    }, 300);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  // Fetch when page changes (not on initial load)
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchProducts(page, true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fetchProducts]);

  // Use products directly (server-side filtered)
  const displayProducts = products;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Pagination logic
  const maxVisiblePages = isMobile ? 3 : 5;
  const halfVisible = Math.floor(maxVisiblePages / 2);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">

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
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-bold tracking-wide">
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
            productCount={totalProducts}
          />

          {/* Main Content */}
          <div className="flex-1">

            {/* Top Controls - Sticky */}
            <div className="sticky top-16 z-30 bg-background py-4 -mx-6 px-6 md:-mx-10 md:px-10 lg:-mx-0 lg:px-0 lg:py-0 lg:mb-6 border-b lg:border-none border-foreground/10 mb-6 transition-all">
              <div className="flex flex-col gap-3">
                {/* Mobile: Filters + Sort Row */}
                <div className="flex lg:hidden items-center justify-between">
                  <FilterSidebarMobile
                    categories={categories}
                    selectedFilters={selectedFilters}
                    onFilterChange={setSelectedFilters}
                    productCount={totalProducts}
                  />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border border-foreground/30 rounded-sm px-3 py-2 h-auto text-[10px] font-black uppercase w-auto bg-background">
                      <span className="text-foreground/50 mr-1">Sort:</span>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-sm border-border">
                      <SelectItem value="best-selling" className="rounded-sm text-xs">Popularity</SelectItem>
                      <SelectItem value="new-arrivals" className="rounded-sm text-xs">Newest</SelectItem>
                      <SelectItem value="price-low" className="rounded-sm text-xs">Price: Low</SelectItem>
                      <SelectItem value="price-high" className="rounded-sm text-xs">Price: High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobile: Search Full Width */}
                <div className="flex lg:hidden border border-input rounded-sm px-3 py-2 items-center gap-2 bg-background">
                  <Search className="h-4 w-4 text-foreground/40" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-none bg-transparent focus:ring-0 focus:outline-none text-[11px] uppercase font-medium flex-1 placeholder:text-foreground/30"
                    placeholder="Search model..."
                    type="text"
                  />
                  <span className="text-[10px] font-bold text-foreground/40">{totalProducts}</span>
                </div>

                {/* Desktop: Single Row */}
                <div className="hidden lg:flex items-center gap-4 bg-background pt-2 pb-4">
                  {/* Search */}
                  <div className="flex border border-input rounded-sm px-3 py-2 items-center gap-2 w-64 bg-background">
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
                    {totalProducts} products
                  </span>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border border-foreground/30 rounded-sm px-3 py-2 h-auto text-[11px] font-bold uppercase w-auto bg-background">
                      <span className="text-foreground/50 mr-1">Sort:</span>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-sm border-border">
                      <SelectItem value="best-selling" className="rounded-sm text-xs">Popularity</SelectItem>
                      <SelectItem value="new-arrivals" className="rounded-sm text-xs">Newest</SelectItem>
                      <SelectItem value="price-low" className="rounded-sm text-xs">Price: Low</SelectItem>
                      <SelectItem value="price-high" className="rounded-sm text-xs">Price: High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Loading Skeleton */}
            {isLoading ? (
              <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
                  <div key={i} className="border border-foreground/10 p-4 animate-pulse rounded-sm">
                    <div className="aspect-square bg-muted/50 mb-6" />
                    <div className="h-3 bg-muted/50 w-1/3 mb-2" />
                    <div className="h-5 bg-muted/50 w-2/3 mb-4" />
                    <div className="h-10 bg-muted/50 mt-auto" />
                  </div>
                ))}
              </div>
            ) : displayProducts.length > 0 ? (
              <>
                {/* Product Grid / Skeleton Loading */}
                {isPageLoading ? (
                  <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                    {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
                      <div key={i} className="border border-foreground/10 p-4 animate-pulse rounded-sm">
                        <div className="aspect-square bg-muted/50 mb-6" />
                        <div className="h-3 bg-muted/50 w-1/3 mb-2" />
                        <div className="h-5 bg-muted/50 w-2/3 mb-4" />
                        <div className="h-10 bg-muted/50 mt-auto" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                    {displayProducts.map((product: any) => (
                      <ProductCard key={product.id} product={product} showAddToEnquiry />
                    ))}
                  </div>
                )}

                {/* Editorial Pagination */}
                {totalPages > 1 && (
                  <div className="mt-16 border-t border-foreground pt-10 flex justify-between items-center bg-background sticky bottom-0 z-10 pb-4 sm:static sm:pb-0 sm:bg-transparent">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1 || isPageLoading}
                      className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:underline disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <span className="text-sm">←</span> <span className={`${isMobile ? 'hidden' : 'inline'}`}>Previous</span>
                    </button>

                    <div className="flex gap-2 sm:gap-4 font-black text-xs">
                      {Array.from({ length: Math.min(maxVisiblePages, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= maxVisiblePages) {
                          pageNum = i + 1;
                        } else if (currentPage <= halfVisible + 1) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - halfVisible) {
                          pageNum = totalPages - maxVisiblePages + 1 + i;
                        } else {
                          pageNum = currentPage - halfVisible + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            disabled={isPageLoading}
                            className={`${currentPage === pageNum ? 'underline underline-offset-4' : 'text-foreground/40 hover:text-foreground'} px-1 disabled:cursor-not-allowed`}
                          >
                            {String(pageNum).padStart(2, '0')}
                          </button>
                        );
                      })}
                      {totalPages > maxVisiblePages && currentPage < totalPages - halfVisible && (
                        <>
                          <span className="text-foreground/40">...</span>
                          <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={isPageLoading}
                            className="text-foreground/40 hover:text-foreground px-1 disabled:cursor-not-allowed"
                          >
                            {String(totalPages).padStart(2, '0')}
                          </button>
                        </>
                      )}
                    </div>

                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages || isPageLoading}
                      className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:underline disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <span className={`${isMobile ? 'hidden' : 'inline'}`}>Next</span> <span className="text-sm">→</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="min-h-[50vh] flex flex-col items-center justify-center text-center">
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



      </main>
      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          {/* Hero skeleton */}
          <div className="h-64 md:h-80 bg-black/90 animate-pulse" />
          {/* Skeleton grid */}
          <div className="px-6 md:px-10 lg:px-16 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-12 gap-x-8 max-w-7xl mx-auto">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="border border-foreground/10 p-4 animate-pulse">
                  <div className="aspect-square bg-muted/50 mb-6" />
                  <div className="h-3 bg-muted/50 w-1/3 mb-2" />
                  <div className="h-5 bg-muted/50 w-2/3 mb-4" />
                  <div className="h-10 bg-muted/50 mt-auto" />
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
