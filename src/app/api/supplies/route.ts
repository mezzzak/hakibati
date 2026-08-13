import { NextRequest, NextResponse } from 'next/server';
import {
  getAllSupplyItems,
  getSupplyItemById,
  getSupplyItemsByCategory,
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const activeOnly = searchParams.get('activeOnly') !== 'false';

    if (id) {
      const item = await getSupplyItemById(id);
      if (!item) {
        return NextResponse.json(
          { success: false, error: 'Supply item not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: item });
    }

    if (category) {
      const items = await getSupplyItemsByCategory(category);
      return NextResponse.json({ success: true, data: items });
    }

    const items = await getAllSupplyItems({ activeOnly });
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('GET /api/supplies error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
