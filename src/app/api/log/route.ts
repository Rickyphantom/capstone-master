import { NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/log';  // set_db용 Prisma Client

const logPrisma = new PrismaClient();

export async function GET() {
  try {
    const logs = await logPrisma.log.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error('로그 조회 오류:', error);
    return NextResponse.json({ error: '로그 조회 실패' }, { status: 500 });
  }
}
