"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, ChevronDown } from "lucide-react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { NoiseBackground } from "@/components/ui/noise-background";
import { cn } from "@/lib/utils";
import { getCategoryDisplayName } from "@/lib/product-helpers";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

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

  return (
    <header className="bg-background border-border/50 dark:border-border sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto flex h-16 items-center gap-2 px-4 sm:px-6 md:px-8 max-w-7xl w-full">
        {/* Mobile Menu Button + Logo */}


        {/* Logo - Desktop & Mobile */}
        <Link href="/" className="flex items-center gap-3 shrink-0 min-w-0 mr-4 lg:mr-0">
          <Image
            src="/hn_logo.png"
            alt="Hyderabad Network"
            width={40}
            height={40}
            className="size-10 object-contain"
            priority
          />
          <span className="text-lg font-bold truncate">
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
        <div className="ml-auto flex items-center gap-2 lg:flex-1 lg:justify-end">
          <NoiseBackground
            containerClassName="hidden lg:block p-1 rounded-full"
            gradientColors={[
              "rgb(255, 100, 150)",
              "rgb(100, 150, 255)",
              "rgb(255, 200, 100)",
            ]}
          >
            <Link
              href="/enquire"
              className="flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-neutral-100 via-neutral-100 to-white px-4 py-1.5 text-xs font-medium text-black shadow-[0px_2px_0px_0px_rgb(245,245,245)_inset,0px_0.5px_1px_0px_rgb(163,163,163)] transition-all duration-100 active:scale-[0.98] dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_rgb(10,10,10)_inset,0px_1px_0px_0px_rgb(38,38,38)] hover:shadow-md"
            >
              Enquire Now &rarr;
            </Link>
          </NoiseBackground>
        </div>

        {/* Mobile Menu Button - Moved to Right */}
        <div className="flex lg:hidden items-center gap-2 ml-auto">
          <Button
            variant="ghost"
            className="h-8 w-8 px-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 items-center justify-center gap-2.5"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="relative flex h-8 w-4 items-center justify-center">
              <div className="relative size-4">
                <span className={cn(
                  "bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100",
                  isOpen ? "top-2 rotate-45" : "top-1"
                )} />
                <span className={cn(
                  "bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100",
                  isOpen ? "opacity-0" : "top-2.5 opacity-100"
                )} />
                <span className={cn(
                  "bg-foreground absolute left-0 block h-0.5 w-4 transition-all duration-100",
                  isOpen ? "top-2 -rotate-45" : "top-4"
                )} />
              </div>
            </div>
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Overlays content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 z-50 border-b rounded-b-xl bg-background lg:hidden shadow-lg"
          >
            <nav className="container mx-auto px-4 py-4 space-y-1">
              {/* Products Collapsible */}
              <Collapsible open={isProductsOpen} onOpenChange={setIsProductsOpen}>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent text-left">
                  <span>Products</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isProductsOpen && "rotate-180"
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-0.5 pt-1 pb-2 pl-4">
                  <Link
                    href="/products"
                    className="flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                    onClick={() => setIsOpen(false)}
                  >
                    All Categories
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/products?category=${category}`}
                      className="flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      {getCategoryDisplayName(category)}
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              <Link
                href="/#custom-work"
                className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                onClick={() => setIsOpen(false)}
              >
                Custom Work
              </Link>
              <Link
                href="/contact"
                className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>

              <div className="pt-3 mt-3 border-t">
                <NoiseBackground
                  containerClassName="w-full p-1 rounded-full"
                  gradientColors={[
                    "rgb(255, 100, 150)",
                    "rgb(100, 150, 255)",
                    "rgb(255, 200, 100)",
                  ]}
                >
                  <Link
                    href="/enquire"
                    onClick={() => setIsOpen(false)}
                    className="flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-neutral-100 via-neutral-100 to-white px-6 py-2.5 text-sm font-medium text-black shadow-[0px_2px_0px_0px_rgb(245,245,245)_inset,0px_0.5px_1px_0px_rgb(163,163,163)] transition-all duration-100 active:scale-[0.98] dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_rgb(10,10,10)_inset,0px_1px_0px_0px_rgb(38,38,38)] hover:shadow-md"
                  >
                    Enquire Now &rarr;
                  </Link>
                </NoiseBackground>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

