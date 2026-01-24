export type ProductCategory = "wall-clocks" | "desk-clocks" | "premium-gifting" | "personalized";

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  color?: string; // Color name for display
  colorCode?: string; // Hex color code
}

export interface Product {
  id: string;
  name: string;
  modelNumber: string;
  category: ProductCategory;
  description: string;
  image: string;
  variants: ProductVariant[];
  pricePerUnit?: number; // Base price per unit
}

export interface EnquiryItem {
  productId: string;
  productName: string;
  variantId: string;
  variantName: string;
  quantity: number;
  price: number;
}

export interface EnquiryFormData {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  customizationNotes: string;
  expectedQuantity: number;
  deliveryTimeline: string;
  items: EnquiryItem[];
}

