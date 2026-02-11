import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, getPaginatedProducts } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/products
 * Supports server-side pagination with query params:
 *   page (default: 1), limit (default: 12), category, search, sort
 * If no pagination params, returns paginated results (page 1, limit 12).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const sort = searchParams.get('sort') || undefined;

    const { products, total } = await getPaginatedProducts({
      page,
      limit,
      category,
      search,
      sort,
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
