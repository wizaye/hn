"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  return (
    <header className="bg-background border-border/50 dark:border-border sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto flex h-16 items-center gap-2 px-4 sm:px-6 md:px-8 max-w-7xl w-full">
        {/* Mobile Menu Button + Logo */}


        {/* Logo - Desktop & Mobile */}
        <Link href="/" className="flex items-center gap-2 shrink-0 min-w-0 mr-4 lg:mr-0">
          <span className="text-base md:text-lg font-bold truncate">
            Hyderabad Networks
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex ml-4">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all text-muted-foreground hover:text-foreground bg-transparent hover:bg-transparent h-8 rounded-md gap-1.5 px-3"
                >
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 w-[400px]">
                  <NavigationMenuLink asChild>
                    <Link
                      href="/products"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">All Categories</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Browse our complete catalog of clocks
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/products?category=wall-clocks"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Wall Clocks</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Premium wall clocks for offices
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/products?category=desk-clocks"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Desk Clocks</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Elegant desk clocks for executives
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/products?category=premium-gifting"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Premium Gifting</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Perfect for corporate gifting programs
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/products?category=personalized"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Personalized</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Customizable with your company logo
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/#custom-work"
                  className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all text-muted-foreground hover:text-foreground bg-transparent hover:bg-transparent h-8 rounded-md gap-1.5 px-3"
                >
                  Custom Work
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/#about"
                  className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all text-muted-foreground hover:text-foreground bg-transparent hover:bg-transparent h-8 rounded-md gap-1.5 px-3"
                >
                  About
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all text-muted-foreground hover:text-foreground bg-transparent hover:bg-transparent h-8 rounded-md gap-1.5 px-3"
                >
                  Contact
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop CTA Button */}
        <div className="ml-auto flex items-center gap-2 lg:flex-1 lg:justify-end">
          <Button
            asChild
            className="h-8 px-4 text-[13px] bg-linear-to-b from-[#2487EB] to-[#1D69DE] border border-[#1D69DE] hover:from-[#2487EB]/90 hover:to-[#1D69DE]/90 text-white hidden lg:flex"
          >
            <Link href="/enquire">Enquire Now</Link>
          </Button>
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

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b bg-background/95 backdrop-blur-sm lg:hidden overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4 space-y-1">
              <Link
                href="/"
                className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>

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
                  <Link
                    href="/products?category=wall-clocks"
                    className="flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                    onClick={() => setIsOpen(false)}
                  >
                    Wall Clocks
                  </Link>
                  <Link
                    href="/products?category=desk-clocks"
                    className="flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                    onClick={() => setIsOpen(false)}
                  >
                    Desk Clocks
                  </Link>
                  <Link
                    href="/products?category=premium-gifting"
                    className="flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                    onClick={() => setIsOpen(false)}
                  >
                    Premium Gifting
                  </Link>
                  <Link
                    href="/products?category=personalized"
                    className="flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                    onClick={() => setIsOpen(false)}
                  >
                    Personalized
                  </Link>
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
                href="/#about"
                className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>

              <div className="pt-3 mt-3 border-t">
                <Button asChild className="w-full bg-linear-to-b from-[#2487EB] to-[#1D69DE] border border-[#1D69DE] hover:from-[#2487EB]/90 hover:to-[#1D69DE]/90 text-white">
                  <Link href="/enquire" onClick={() => setIsOpen(false)}>
                    Enquire Now &rarr;
                  </Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

