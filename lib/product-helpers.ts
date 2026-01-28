// Helper to transform D1 database products to UI-compatible format
export function transformProductFromDB(dbProduct: any, category: string): any {
  // Database schema: id, model_number, color, price, image_url, category_id
  const modelNumber = dbProduct.model || dbProduct.id?.toString() || 'N/A';
  const price = parseFloat(dbProduct.price || '0');
  const color = dbProduct.color || null;
  const imageUrl = dbProduct.image || dbProduct.image_url || null;
  // Create unique ID by combining model number and color
  const uniqueId = color 
    ? `${modelNumber}-${color.replace(/\s+/g, '-')}`
    : dbProduct.id?.toString() || Math.random().toString(36).substr(2, 9);
  
  return {
    id: uniqueId, // Use unique ID that includes color
    name: modelNumber,
    modelNumber: modelNumber,
    category: category,
    description: `${modelNumber} - Premium quality clock`,
    image: imageUrl,
    pricePerUnit: price,
    price: price,
    color: color,
    // Create a simple variant structure for compatibility
    variants: [
      {
        id: uniqueId, // Use unique ID that includes color
        name: color || 'Standard',
        price: price,
        color: color,
        colorCode: getColorCode(color),
      }
    ],
  };
}

// Helper to get color codes
function getColorCode(colorName: string | null): string {
  const colorMap: Record<string, string> = {
    'white': '#FFFFFF',
    'ivory': '#FFFFF0',
    'golden': '#FFD700',
    'gold': '#FFD700',
    'black': '#000000',
    'silver': '#C0C0C0',
    'red': '#DC143C',
    'blue': '#4169E1',
    'green': '#228B22',
    'brown': '#8B4513',
  };
  
  if (!colorName) return '#808080';
  
  const normalized = colorName.toLowerCase();
  return colorMap[normalized] || '#808080';
}

// Helper to get category display name
export function getCategoryDisplayName(categoryName: string): string {
  return categoryName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper to get gradient colors based on category
export function getCategoryGradient(categoryName: string): string[] {
  const categoryLower = categoryName.toLowerCase();
  
  if (categoryLower.includes('cukoo') || categoryLower.includes('cuckoo')) {
    return ["rgb(100, 150, 255)", "rgb(150, 100, 255)", "rgb(255, 150, 100)"];
  } else if (categoryLower.includes('plain') || categoryLower.includes('musical')) {
    return ["rgb(255, 150, 100)", "rgb(100, 200, 255)", "rgb(255, 200, 100)"];
  } else if (categoryLower.includes('wall')) {
    return ["rgb(100, 150, 255)", "rgb(150, 100, 255)", "rgb(255, 150, 100)"];
  } else if (categoryLower.includes('desk')) {
    return ["rgb(255, 150, 100)", "rgb(100, 200, 255)", "rgb(255, 200, 100)"];
  }
  
  return ["rgb(255, 100, 150)", "rgb(100, 150, 255)", "rgb(255, 200, 100)"];
}

// Helper to format currency (defaults to Indian Rupees)
export function formatCurrency(amount: number | string, currency: 'INR' | 'USD' = 'INR'): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (currency === 'INR') {
    return `₹${numAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  } else {
    return `$${numAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

// Helper to group products by model number
export function groupProductsByModel(products: any[]): any[] {
  const groupedMap = new Map<string, any>();
  let counter = 0;
  
  products.forEach((product) => {
    const modelNumber = product.modelNumber;
    
    if (!groupedMap.has(modelNumber)) {
      // First product with this model number - create the grouped product
      counter++;
      // Create unique ID by appending first color to model number
      const uniqueId = product.color 
        ? `${modelNumber}-${product.color.replace(/\s+/g, '-')}`
        : modelNumber;
      
      groupedMap.set(modelNumber, {
        ...product,
        // Store all variants with their images
        images: [{ url: product.image, color: product.color, variantId: product.variants[0]?.id || product.id }],
        allVariants: [...product.variants], // Clone the array
        // Use unique ID that includes color for React mapping
        id: uniqueId,
        modelNumber: modelNumber, // Keep original model number
      });
    } else {
      // Add this variant's image and merge variants
      const existing = groupedMap.get(modelNumber)!;
      existing.images.push({ url: product.image, color: product.color, variantId: product.variants[0]?.id || product.id });
      // Merge variants with unique IDs
      existing.allVariants = [...existing.allVariants, ...product.variants];
    }
  });
  
  return Array.from(groupedMap.values());
}
