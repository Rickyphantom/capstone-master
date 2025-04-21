import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 });
  }

  cookies().set('session', JSON.stringify({ id: user.id, email: user.email }), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ message: '로그인 성공' });
}
