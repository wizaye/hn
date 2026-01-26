import { NextResponse } from 'next/server';
import { getProductById } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RouteParams {
  params: Promise<{
    category: string;
    id: string;
  }>;
}

/**
 * GET /api/products/[category]/[id]
 * Returns a specific product from a category table by ID
 */
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { category, id } = await params;
    
    if (!category || !id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category and product ID are required',
        },
        { status: 400 }
      );
    }
    
    const product = await getProductById(category, id);
    
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
