import { NextResponse } from 'next/server';
import { getProductsByCategory } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RouteParams {
  params: Promise<{
    category: string;
  }>;
}

/**
 * GET /api/products/[category]
 * Returns all products from a specific category table
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { category } = await params;
    
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category parameter is required',
        },
        { status: 400 }
      );
    }
    
    const products = await getProductsByCategory(category);
    
    return NextResponse.json({
      success: true,
      data: products,
      category,
      count: products.length,
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products for category',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
