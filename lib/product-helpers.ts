// Helper to transform D1 database products to UI-compatible format
export function transformProductFromDB(dbProduct: any, category: string): any {
  // Database schema: id, model_number, color, price, image_url, category_id
  const modelNumber = dbProduct.model_number || `Product-${dbProduct.id}`;
  const price = parseFloat(dbProduct.price || '0');
  const color = dbProduct.color || null;
  const imageUrl = dbProduct.image || dbProduct.image_url || null;
  
  return {
    id: dbProduct.id?.toString() || modelNumber,
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
        id: 'v1',
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
