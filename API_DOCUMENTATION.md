# API Documentation

This document describes the API endpoints for fetching product data from the Cloudflare D1 database.

## Architecture

The application uses a **Cloudflare D1** database with the following structure:

### Database Schema

1. **products** table - Contains all product categories
   - Fields: `id`, `category`, `created_at`

2. **Category tables** - Each category has its own table (e.g., `Cukoo`, `Plain_Musical`)
   - Fields: `id`, `model_number`, `color`, `price`, `image_url`, `category_id`, `created_at`, `updated_at`

### Environment Variables

Required environment variables (configured in `.env`):
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
- `CLOUDFLARE_API_TOKEN` - API token with D1 database permissions
- `D1_DATABASE_ID` - The D1 database ID
- `R2_PUBLIC_URL` - Public URL for R2 bucket (for product images)

## API Endpoints

### 1. Get All Categories

**Endpoint:** `GET /api/products/categories`

**Description:** Fetches all available product categories from the `products` table.

**Response:**
```json
{
  "success": true,
  "data": [
    { "category": "Cukoo" },
    { "category": "Plain_Musical" }
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to fetch categories",
  "message": "Error details..."
}
```

---

### 2. Get All Products

**Endpoint:** `GET /api/products`

**Description:** Fetches all products from all category tables.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "model_number": "CU-007",
      "color": null,
      "price": "9800",
      "image_url": "https://pub-xxx.r2.dev/CU/CU-007.jpg",
      "image": "https://pub-xxx.r2.dev/CU/CU-007.jpg",
      "category": "Cukoo"
    },
    {
      "id": 2,
      "model_number": "PM-257",
      "color": "White",
      "price": "980",
      "image_url": "https://pub-xxx.r2.dev/PM/PM-257-White.jpg",
      "image": "https://pub-xxx.r2.dev/PM/PM-257-White.jpg",
      "category": "Plain_Musical"
    }
  ],
  "count": 2
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to fetch products",
  "message": "Error details..."
}
```

---

### 3. Get Products by Category

**Endpoint:** `GET /api/products/[category]`

**Description:** Fetches all products from a specific category table.

**Example:** `GET /api/products/Cukoo`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "model_number": "CU-007",
      "color": null,
      "price": "9800",
      "image_url": "https://pub-xxx.r2.dev/CU/CU-007.jpg",
      "image": "https://pub-xxx.r2.dev/CU/CU-007.jpg",
      "category": "Cukoo"
    }
  ],
  "category": "Cukoo",
  "count": 1
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to fetch products for category",
  "message": "Error details..."
}
```

---

### 4. Get Product by ID

**Endpoint:** `GET /api/products/[category]/[id]`

**Description:** Fetches a specific product from a category table by its ID or model name.

**Example:** `GET /api/products/Cukoo/CU-007`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "model_number": "CU-007",
    "color": null,
    "price": "9800",
    "image_url": "https://pub-xxx.r2.dev/CU/CU-007.jpg",
    "image": "https://pub-xxx.r2.dev/CU/CU-007.jpg",
    "category": "Cukoo"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Product not found"
}
```

---

## Data Transformation

The API includes helper functions in `/lib/product-helpers.ts` to transform database records into UI-compatible format:

```typescript
transformProductFromDB(dbProduct, category)
```

This function:
- Normalizes field names (`model_name` vs `model`)
- Converts price to number
- Constructs full image URLs using R2_PUBLIC_URL
- Creates variant objects for compatibility with the UI
- Adds color codes based on color names

## Client Usage

### Fetching Products in Components

```typescript
import { transformProductFromDB } from '@/lib/product-helpers';

async function fetchProducts() {
  const response = await fetch('/api/products');
  const data = await response.json();
  
  if (data.success) {
    const products = data.data.map(p => 
      transformProductFromDB(p, p.category)
    );
    // Use products...
  }
}
```

### Fetching by Category

```typescript
async function fetchByCategory(category: string) {
  const response = await fetch(`/api/products/${category}`);
  const data = await response.json();
  
  if (data.success) {
    return data.data;
  }
}
```

## Database Client

The database client is located in `/lib/db.ts` and provides:

- `queryD1<T>(sql, params)` - Execute raw SQL queries
- `getCategories()` - Get all categories
- `getProductsByCategory(categoryName)` - Get products from a category
- `getAllProducts()` - Get all products from all categories
- `getProductById(categoryName, productId)` - Get a single product

## Caching

API routes use:
```typescript
export const dynamic = 'force-dynamic';
export const revalidate = 0;
```

This ensures real-time data fetching without caching. Adjust these settings based on your needs:
- For better performance with less frequent updates, set `revalidate = 3600` (1 hour)
- For completely static data, remove these exports

## Error Handling

All API endpoints include comprehensive error handling:
- Network errors
- D1 API errors
- Query errors
- Missing parameters
- Not found errors

Errors are logged to the console and returned in a consistent format.

## Security Notes

1. **SQL Injection Prevention**: Table names are sanitized using regex
2. **Environment Variables**: Never expose credentials in client-side code
3. **API Token**: Ensure your Cloudflare API token has minimal required permissions
4. **CORS**: Endpoints are Next.js API routes, so they inherit your app's CORS policy

## Development

To test the API locally:

```bash
# Start the development server
npm run dev

# Test endpoints
curl http://localhost:3000/api/products/categories
curl http://localhost:3000/api/products
curl http://localhost:3000/api/products/Cukoo
curl http://localhost:3000/api/products/Cukoo/CU-007
```

## Production Deployment

1. Ensure all environment variables are set in your production environment
2. Test the D1 connection
3. Verify R2 bucket public access
4. Monitor API performance and adjust caching as needed
