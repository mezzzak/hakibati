import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { path, sessionId, referrer, wilaya } = await request.json();

    if (!path || !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get('user-agent') || '';
    const country = request.headers.get('cf-ipcountry') ||
                    request.headers.get('x-vercel-ip-country') ||
                    request.headers.get('cloudfront-viewer-country') ||
                    null;

    await prisma.pageView.create({
      data: {
        path,
        sessionId,
        userAgent,
        referrer: referrer || null,
        country: country || null,
        wilaya: wilaya || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track error:', error);
    return NextResponse.json(
      { success: false, error: 'Tracking failed' },
      { status: 500 }
    );
  }
}
