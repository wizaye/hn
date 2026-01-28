import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/products
 * Returns all products from all category tables in the D1 database
 */
export async function GET() {
  try {
    const products = await getAllProducts();
    
    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    console.error('Error fetching all products:', error);
    
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
