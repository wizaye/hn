"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { EnquiryItem } from "@/lib/types";

const CART_STORAGE_KEY = "enquiry-cart";

interface EnquiryCartContextType {
  items: EnquiryItem[];
  addToCart: (item: EnquiryItem) => void;
  removeFromCart: (productId: string, variantId: string) => void;
  updateCartItem: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  uniqueProductsCount: number;
  getCartItem: (productId: string, variantId: string) => EnquiryItem | undefined;
  getProductCartItems: (productId: string) => EnquiryItem[];
  isProductInCart: (productId: string) => boolean;
}

const EnquiryCartContext = createContext<EnquiryCartContextType | undefined>(undefined);

export function EnquiryCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<EnquiryItem[]>(() => {
    // Initialize from localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
      }
    }
    return [];
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Mark as initialized after mount
  useEffect(() => {
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
      }
    }
  }, [items, isInitialized]);

  const addToCart = (item: EnquiryItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && i.variantId === item.variantId
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId && i.variantId === item.variantId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (productId: string, variantId: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.variantId === variantId))
    );
  };

  const updateCartItem = (productId: string, variantId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.variantId === variantId
          ? { ...i, quantity }
          : i
      )
    );
  };

  const getCartItem = (productId: string, variantId: string) => {
    return items.find(
      (i) => i.productId === productId && i.variantId === variantId
    );
  };

  const getProductCartItems = (productId: string) => {
    return items.filter((i) => i.productId === productId);
  };

  const isProductInCart = (productId: string) => {
    return items.some((i) => i.productId === productId);
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Count unique products (distinct productIds)
  const uniqueProductsCount = new Set(items.map((item) => item.productId)).size;

  return (
    <EnquiryCartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        getCartItem,
        getProductCartItems,
        isProductInCart,
        totalItems,
        uniqueProductsCount,
      }}
    >
      {children}
    </EnquiryCartContext.Provider>
  );
}

export function useEnquiryCart() {
  const context = useContext(EnquiryCartContext);
  if (!context) {
    throw new Error("useEnquiryCart must be used within EnquiryCartProvider");
  }
  return context;
}

