import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const logs = await prisma.cloud.findMany({
      orderBy: {
        log_time: 'desc',
      },
      take: 100,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('[LOG_FETCH_ERROR]', error);
    return NextResponse.json({ error: '로그 가져오기 실패' }, { status: 500 });
  }
}
