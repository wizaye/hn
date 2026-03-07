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
    return products.map((product: any) => {
      const model = product.model || product.id;
      const color = product.color || '';
      // Create unique ID by combining model and color (for products with same model but different colors)
      const uniqueId = color ? `${model}-${color.replace(/\s+/g, '-')}` : model;

      return {
        ...product,
        // Handle both image_url (from upload script) and image_path (legacy)
        image: product.image_url || (product.image_path
          ? `${R2_PUBLIC_URL}/${product.image_path}`
          : null),
        category: categoryName,
        // Use unique ID that includes color to avoid duplicate keys
        id: uniqueId,
        // Keep original model number for display
        model: model,
      };
    });
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
 * Get paginated products with optional category filter, search, and sorting.
 * Avoids UNION ALL (D1 has compound SELECT limits) by fetching per-table.
 */
export async function getPaginatedProducts(options: {
  page: number;
  limit: number;
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const { page, limit, category, search, sort, minPrice, maxPrice } = options;
  const offset = (page - 1) * limit;

  try {
    // Get the categories we need to query
    let categoriesToQuery: string[];
    if (category) {
      categoriesToQuery = [category];
    } else {
      const allCategories = await getCategories();
      categoriesToQuery = allCategories.map(c => c.category);
    }

    if (categoriesToQuery.length === 0) {
      return { products: [], total: 0 };
    }

    // Build WHERE clause (shared across queries)
    const buildWhere = () => {
      const conditions: string[] = [];
      const params: any[] = [];

      if (search) {
        const searchPattern = `%${search}%`;
        conditions.push(`(model LIKE ? OR model_number LIKE ? OR color LIKE ?)`);
        params.push(searchPattern, searchPattern, searchPattern);
      }

      if (minPrice !== undefined) {
        conditions.push(`CAST(price AS REAL) >= ?`);
        params.push(minPrice);
      }

      if (maxPrice !== undefined && maxPrice !== Infinity) {
        conditions.push(`CAST(price AS REAL) <= ?`);
        params.push(maxPrice);
      }

      if (conditions.length === 0) return { clause: '', params: [] };
      return {
        clause: ` WHERE ${conditions.join(' AND ')}`,
        params,
      };
    };
    const { clause: whereClause, params: searchParams } = buildWhere();

    // For a single category, use simple LIMIT/OFFSET on that table
    if (categoriesToQuery.length === 1) {
      const cat = categoriesToQuery[0];
      const tableName = cat.toLowerCase().replace(/\s+/g, '_');

      // Build ORDER BY
      let orderBy = '';
      if (sort === 'price-low') orderBy = ' ORDER BY CAST(price AS REAL) ASC';
      else if (sort === 'price-high') orderBy = ' ORDER BY CAST(price AS REAL) DESC';
      else if (sort === 'new-arrivals') orderBy = ' ORDER BY rowid DESC';

      const countSql = `SELECT COUNT(*) as total FROM ${tableName}${whereClause}`;
      const dataSql = `SELECT * FROM ${tableName}${whereClause}${orderBy} LIMIT ? OFFSET ?`;

      const [countResult, products] = await Promise.all([
        queryD1<{ total: number }>(countSql, [...searchParams]),
        queryD1(dataSql, [...searchParams, limit, offset]),
      ]);

      const total = countResult[0]?.total || 0;

      const transformedProducts = products.map((product: any) => {
        const model = product.model || product.id;
        const color = product.color || '';
        const uniqueId = color ? `${model}-${color.replace(/\s+/g, '-')}` : model;
        return {
          ...product,
          image: product.image_url || (product.image_path
            ? `${R2_PUBLIC_URL}/${product.image_path}`
            : null),
          category: cat,
          id: uniqueId,
          model: model,
        };
      });

      return { products: transformedProducts, total };
    }

    // For multiple categories: get per-table counts, then determine which tables to fetch from
    const countPromises = categoriesToQuery.map(async (cat) => {
      const tableName = cat.toLowerCase().replace(/\s+/g, '_');
      try {
        const result = await queryD1<{ total: number }>(
          `SELECT COUNT(*) as total FROM ${tableName}${whereClause}`,
          [...searchParams]
        );
        return { category: cat, tableName, count: result[0]?.total || 0 };
      } catch {
        return { category: cat, tableName, count: 0 };
      }
    });

    const tableCounts = await Promise.all(countPromises);
    const total = tableCounts.reduce((sum, t) => sum + t.count, 0);

    if (total === 0) {
      return { products: [], total: 0 };
    }

    // Determine which tables contribute rows for this page window [offset, offset+limit)
    let skipped = 0;
    const fetchTasks: Array<{ category: string; tableName: string; tableOffset: number; tableLimit: number }> = [];

    for (const tc of tableCounts) {
      if (tc.count === 0) continue;

      const tableEnd = skipped + tc.count;

      if (tableEnd <= offset) {
        // This entire table is before our page window
        skipped += tc.count;
        continue;
      }

      if (skipped >= offset + limit) {
        // We've already collected enough
        break;
      }

      // This table overlaps with our page window
      const tableOffset = Math.max(0, offset - skipped);
      const remaining = limit - fetchTasks.reduce((s, f) => s + f.tableLimit, 0);
      const tableLimit = Math.min(remaining, tc.count - tableOffset);

      if (tableLimit > 0) {
        fetchTasks.push({
          category: tc.category,
          tableName: tc.tableName,
          tableOffset,
          tableLimit,
        });
      }

      skipped += tc.count;
    }

    // Build ORDER BY for individual queries
    let orderBy = '';
    if (sort === 'price-low') orderBy = ' ORDER BY CAST(price AS REAL) ASC';
    else if (sort === 'price-high') orderBy = ' ORDER BY CAST(price AS REAL) DESC';
    else if (sort === 'new-arrivals') orderBy = ' ORDER BY rowid DESC';

    // Fetch from calculated tables
    const dataPromises = fetchTasks.map(async (task) => {
      const sql = `SELECT * FROM ${task.tableName}${whereClause}${orderBy} LIMIT ? OFFSET ?`;
      const products = await queryD1(sql, [...searchParams, task.tableLimit, task.tableOffset]);
      return products.map((product: any) => {
        const model = product.model || product.id;
        const color = product.color || '';
        const uniqueId = color ? `${model}-${color.replace(/\s+/g, '-')}` : model;
        return {
          ...product,
          image: product.image_url || (product.image_path
            ? `${R2_PUBLIC_URL}/${product.image_path}`
            : null),
          category: task.category,
          id: uniqueId,
          model: model,
        };
      });
    });

    const resultsArrays = await Promise.all(dataPromises);
    const allProducts = resultsArrays.flat();

    return { products: allProducts, total };
  } catch (error) {
    console.error('Error fetching paginated products:', error);
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

/**
 * Get active banners for the public frontend
 */
export async function getActiveBanners(): Promise<Array<{
  id: number;
  title: string;
  description: string | null;
  discount_text: string | null;
  link: string | null;
  bg_color: string;
  text_color: string;
  end_date: string | null;
}>> {
  try {
    return await queryD1(
      `SELECT id, title, description, discount_text, link, bg_color, text_color, end_date
       FROM banners
       WHERE active = 1
       ORDER BY created_at DESC`
    );
  } catch (error) {
    console.error('Error fetching active banners:', error);
    return [];
  }
}
