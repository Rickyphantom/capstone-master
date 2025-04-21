import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: '이메일 누락' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  return NextResponse.json({ available: !user });
}
