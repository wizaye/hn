import { Product } from "./types";

export const products: Product[] = [
  {
    id: "1",
    name: "Executive Wall Clock",
    modelNumber: "EWC-2024-001",
    category: "wall-clocks",
    description: "Premium wall clock perfect for corporate offices",
    image: "/api/placeholder/400/400",
    pricePerUnit: 45,
    variants: [
      { id: "v1", name: "Small (12\")", price: 45, color: "Black", colorCode: "#000000" },
      { id: "v2", name: "Medium (16\")", price: 65, color: "Silver", colorCode: "#C0C0C0" },
      { id: "v3", name: "Large (20\")", price: 85, color: "Gold", colorCode: "#FFD700" },
    ],
  },
  {
    id: "2",
    name: "Luxury Desk Clock",
    modelNumber: "LDC-2024-002",
    category: "desk-clocks",
    description: "Elegant desk clock for executive desks",
    image: "/api/placeholder/400/400",
    pricePerUnit: 120,
    variants: [
      { id: "v1", name: "Wood", price: 120, color: "Walnut", colorCode: "#5C4033" },
      { id: "v2", name: "Metal", price: 150, color: "Brass", colorCode: "#B87333" },
      { id: "v3", name: "Premium", price: 200, color: "Rose Gold", colorCode: "#E8B4B8" },
    ],
  },
  {
    id: "3",
    name: "Corporate Gift Clock",
    modelNumber: "CGC-2024-003",
    category: "premium-gifting",
    description: "Perfect for corporate gifting programs",
    image: "/api/placeholder/400/400",
    pricePerUnit: 35,
    variants: [
      { id: "v1", name: "Standard", price: 35, color: "White", colorCode: "#FFFFFF" },
      { id: "v2", name: "Deluxe", price: 55, color: "Navy Blue", colorCode: "#000080" },
    ],
  },
  {
    id: "4",
    name: "Custom Branded Clock",
    modelNumber: "CBC-2024-004",
    category: "personalized",
    description: "Fully customizable with your company logo",
    image: "/api/placeholder/400/400",
    pricePerUnit: 75,
    variants: [
      { id: "v1", name: "Laser Engraved", price: 75, color: "Black", colorCode: "#000000" },
      { id: "v2", name: "Logo Printed", price: 90, color: "Silver", colorCode: "#C0C0C0" },
      { id: "v3", name: "Premium Package", price: 150, color: "Gold", colorCode: "#FFD700" },
    ],
  },
  {
    id: "5",
    name: "Modern Wall Clock",
    modelNumber: "MWC-2024-005",
    category: "wall-clocks",
    description: "Contemporary design for modern offices",
    image: "/api/placeholder/400/400",
    pricePerUnit: 50,
    variants: [
      { id: "v1", name: "Small (12\")", price: 50, color: "Charcoal", colorCode: "#36454F" },
      { id: "v2", name: "Medium (16\")", price: 70, color: "White", colorCode: "#FFFFFF" },
      { id: "v3", name: "Large (20\")", price: 90, color: "Gray", colorCode: "#808080" },
    ],
  },
  {
    id: "6",
    name: "Classic Desk Clock",
    modelNumber: "CDC-2024-006",
    category: "desk-clocks",
    description: "Timeless design for traditional offices",
    image: "/api/placeholder/400/400",
    pricePerUnit: 100,
    variants: [
      { id: "v1", name: "Wood", price: 100, color: "Mahogany", colorCode: "#C04000" },
      { id: "v2", name: "Brass", price: 130, color: "Antique Brass", colorCode: "#CD9575" },
    ],
  },
];

export const bestSellingProducts = products.slice(0, 4);

