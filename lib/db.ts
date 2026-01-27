// Cloudflare D1 Database Client
// This module provides a client for interacting with Cloudflare D1 database

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const D1_DATABASE_ID = process.env.D1_DATABASE_ID;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN || !D1_DATABASE_ID) {
  console.error('Missing required environment variables for D1 database connection');
}

const D1_API_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${D1_DATABASE_ID}/query`;

interface D1Response<T = any> {
  success: boolean;
  errors: any[];
  messages: any[];
  result: Array<{
    results: T[];
    success: boolean;
    meta: {
      changed_db: boolean;
      changes: number;
      duration: number;
      last_row_id: number;
      rows_read: number;
      rows_written: number;
    };
  }>;
}

/**
 * Execute a SQL query against the D1 database
 */
export async function queryD1<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const response = await fetch(D1_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql,
        params,
      }),
      cache: 'no-store', // Disable caching for real-time data
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`D1 API Error: ${response.status} - ${errorText}`);
    }

    const data: D1Response<T> = await response.json();

    if (!data.success || data.errors.length > 0) {
      throw new Error(`D1 Query Error: ${JSON.stringify(data.errors)}`);
    }

    return data.result[0]?.results || [];
  } catch (error) {
    console.error('Error querying D1 database:', error);
    throw error;
  }
}

/**
 * Get all categories from the products table
 */
export async function getCategories(): Promise<Array<{ category: string }>> {
  return queryD1<{ category: string }>('SELECT category FROM products');
}

/**
 * Get products from a specific category table
 */
export async function getProductsByCategory(categoryName: string) {
  // Convert category name to table name: lowercase and replace spaces with underscores
  const tableName = categoryName.toLowerCase().replace(/\s+/g, '_');
  
  try {
    const products = await queryD1(`SELECT * FROM ${tableName}`);
    
    // Transform products to include image URLs from R2
    return products.map((product: any) => ({
      ...product,
      // Handle both image_url (from upload script) and image_path (legacy)
      image: product.image_url || (product.image_path 
        ? `${R2_PUBLIC_URL}/${product.image_path}` 
        : null),
      category: categoryName,
      // Use model_number as unique identifier instead of id
      id: product.model || product.id,
    }));
  } catch (error) {
    console.error(`Error fetching products from category ${categoryName}:`, error);
    throw error;
  }
}

/**
 * Get all products from all category tables
 */
export async function getAllProducts() {
  try {
    // First, get all categories
    const categories = await getCategories();
    
    // Then, fetch products from each category table
    const allProductsPromises = categories.map(({ category }) =>
      getProductsByCategory(category).catch(error => {
        console.error(`Failed to fetch products from ${category}:`, error);
        return []; // Return empty array if a category fails
      })
    );
    
    const productsArrays = await Promise.all(allProductsPromises);
    
    // Flatten the array of arrays into a single array
    return productsArrays.flat();
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
}

/**
 * Get a single product by ID from a specific category
 */
export async function getProductById(categoryName: string, productId: string) {
  // Convert category name to table name: lowercase and replace spaces with underscores
  const tableName = categoryName.toLowerCase().replace(/\s+/g, '_');
  
  try {
    const products = await queryD1(
      `SELECT * FROM ${tableName} WHERE id = ? OR model_number = ? LIMIT 1`,
      [productId, productId]
    );
    
    if (products.length === 0) {
      return null;
    }
    
    const product = products[0];
    return {
      ...product,
      // Handle both image_url (from upload script) and image_path (legacy)
      image: product.image_url || (product.image_path 
        ? `${R2_PUBLIC_URL}/${product.image_path}` 
        : null),
      category: categoryName,
      // Use model_number as primary identifier
      id: product.model_number || product.id,
    };
  } catch (error) {
    console.error(`Error fetching product ${productId} from ${categoryName}:`, error);
    throw error;
  }
}
