"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ChevronDown, ShoppingCart, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCategoryDisplayName } from "@/lib/product-helpers";
import { useCartOpen } from "@/components/products/EnquiryCart";
import { useEnquiryCart } from "@/hooks/use-enquiry-cart";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const { setIsOpen: setIsCartOpen } = useCartOpen();
  const { uniqueProductsCount } = useEnquiryCart();

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

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <header className="bg-background border-border/50 dark:border-border sticky top-0 z-50 w-full border-b">
      <div className="flex h-16 items-center justify-between px-6 md:px-10 lg:px-16 w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 min-w-0 mr-4 lg:mr-0 z-50 relative">
          <Image
            src="/hn_logo.png"
            alt="Hyderabad Network"
            width={40}
            height={40}
            className="size-10 object-contain"
            priority
          />
          <span className="text-sm md:text-lg font-bold truncate">
            Hyderabad Network
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex ml-6">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-0.5 p-2 w-[240px]">
                  <NavigationMenuLink asChild>
                    <Link
                      href="/products"
                      className="block select-none space-y-0.5 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">All Categories</div>
                      <p className="line-clamp-1 text-xs leading-snug text-muted-foreground">
                        Browse our complete catalog
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  {categories.map((category) => (
                    <NavigationMenuLink key={category} asChild>
                      <Link
                        href={`/products?category=${category}`}
                        className="block select-none space-y-0.5 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          {getCategoryDisplayName(category)}
                        </div>
                        <p className="line-clamp-1 text-xs leading-snug text-muted-foreground">
                          Browse {getCategoryDisplayName(category).toLowerCase()}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/#custom-work">
                  Custom Work
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link href="/contact">
                  Contact
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop CTA Button */}
        <div className="ml-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {uniqueProductsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background animate-in zoom-in-50">
                {uniqueProductsCount}
              </span>
            )}
          </Button>

          <Link
            href="/enquire"
            className="hidden lg:flex h-10 items-center justify-center rounded-full bg-black px-6 text-xs font-bold text-white shadow-sm transition-all duration-200 active:scale-[0.98] hover:bg-black/80 uppercase tracking-wider"
          >
            Enquire Now
          </Link>
        </div>

        {/* Mobile - Menu Button on Right (Black Box) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden ml-4 z-50 flex flex-col items-center justify-center gap-[5px] active:scale-95 transition-all cursor-pointer relative p-2"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <X className="size-6 text-black" strokeWidth={2.5} />
          ) : (
            <>
              <div className="w-5 h-[2px] bg-black rounded-full" />
              <div className="w-5 h-[2px] bg-black rounded-full" />
            </>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown - Full Screen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute top-full left-0 right-0 z-40 bg-white flex flex-col p-6 shadow-2xl overflow-y-auto overflow-x-hidden max-w-[100vw] lg:hidden border-t border-black/5"
            style={{ height: 'calc(100vh - 64px)' }}
          >
            <div className="flex flex-col gap-6 mt-4">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="text-2xl font-bold text-black hover:text-[#C2F13C] transition-colors border-b border-black/10 pb-4"
              >
                Home
              </Link>

              {/* Products Accordion */}
              <div className="border-b border-black/10 pb-4">
                <button
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  className="flex w-full items-center justify-between text-2xl font-bold text-black hover:text-[#C2F13C] transition-colors"
                >
                  <span>Products</span>
                  <ChevronDown
                    className={cn(
                      "h-6 w-6 transition-transform duration-200",
                      isProductsOpen && "rotate-180"
                    )}
                  />
                </button>
                <AnimatePresence>
                  {isProductsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-4 pl-4 pt-4 pb-2">
                        <Link
                          href="/products"
                          className="text-lg font-medium text-black/70 hover:text-black transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          All Categories
                        </Link>
                        {categories.map((category) => (
                          <Link
                            key={category}
                            href={`/products?category=${category}`}
                            className="text-lg font-medium text-black/70 hover:text-black transition-colors"
                            onClick={() => setIsOpen(false)}
                          >
                            {getCategoryDisplayName(category)}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                href="/#custom-work"
                onClick={() => setIsOpen(false)}
                className="text-2xl font-bold text-black hover:text-[#C2F13C] transition-colors border-b border-black/10 pb-4"
              >
                Custom Work
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="text-2xl font-bold text-black hover:text-[#C2F13C] transition-colors border-b border-black/10 pb-4"
              >
                Contact
              </Link>

              <Link
                href="/enquire"
                onClick={() => setIsOpen(false)}
                className="text-2xl text-black hover:text-black/70 transition-colors pb-4 font-bold"
              >
                Enquire Now &rarr;
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

