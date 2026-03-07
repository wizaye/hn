import { NextResponse } from 'next/server';
import { getActiveBanners } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * GET /api/banners
 * Public endpoint — returns active banners for the website
 */
export async function GET() {
    try {
        const banners = await getActiveBanners();
        return NextResponse.json({ success: true, data: banners });
    } catch (error) {
        console.error('Error fetching banners:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch banners' },
            { status: 500 }
        );
    }
}
