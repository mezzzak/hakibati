import { NextRequest, NextResponse } from 'next/server';
import { getAllPacks, getPackById, getPacksByGradeLevel } from '@/lib/db';
import { GradeLevel } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const gradeLevel = searchParams.get('gradeLevel');
    const activeOnly = searchParams.get('activeOnly') !== 'false';

    if (id) {
      const pack = await getPackById(id);
      if (!pack) {
        return NextResponse.json(
          { success: false, error: 'Pack not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: pack });
    }

    if (gradeLevel) {
      if (!Object.values(GradeLevel).includes(gradeLevel as GradeLevel)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid gradeLevel. Must be one of: ${Object.values(GradeLevel).join(', ')}`,
          },
          { status: 400 }
        );
      }
      const packs = await getPacksByGradeLevel(gradeLevel);
      return NextResponse.json({ success: true, data: packs });
    }

    const packs = await getAllPacks({ activeOnly });
    return NextResponse.json({ success: true, data: packs });
  } catch (error) {
    console.error('GET /api/packs error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
