import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function isValidPassword(password: string) {
  const hasMinLength = password.length >= 8;
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecials = /[^a-zA-Z0-9]/.test(password);
  return hasMinLength && hasLetters && hasNumbers && hasSpecials;
}

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  // 비밀번호 유효성 검사
  if (!isValidPassword(password)) {
    return NextResponse.json(
      {
        error:
          '비밀번호는 8자 이상이며 영어, 숫자, 특수문자를 포함해야 합니다.',
      },
      { status: 400 }
    );
  }

  // 이메일 중복 검사
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json(
      { error: '이미 등록된 이메일입니다.' },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { email, password: hashed, name } });

  return NextResponse.json({ message: '회원가입 성공' });
}
