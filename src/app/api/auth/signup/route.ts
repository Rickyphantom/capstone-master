import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@/generated/user';

const userPrisma = new PrismaClient();

// 비밀번호 조건 검사
function isValidPassword(password: string) {
  const hasMinLength = password.length >= 8;
  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecials = /[^a-zA-Z0-9]/.test(password);
  return hasMinLength && hasLetters && hasNumbers && hasSpecials;
}

// 중복 확인 API
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    if (email) {
      const exists = await userPrisma.cloud.findFirst({ where: { ip: email } });
      return NextResponse.json({ exists: !!exists });
    }

    if (id) {
      const exists = await userPrisma.cloud.findFirst({ where: { filename: id } });
      return NextResponse.json({ exists: !!exists });
    }

    return NextResponse.json(
      { error: 'email 또는 id 쿼리를 제공해야 합니다.' },
      { status: 400 }
    );
  }catch (err) {
  console.error(err); // 최소한의 사용
  return NextResponse.json(
    { error: '중복 확인 중 오류가 발생했습니다.' },
    { status: 500 }
  );
}
}

// 회원가입 API
export async function POST(req: Request) {
  try {
    const { email, password, id } = await req.json();

    if (!email || !password || !id) {
      return NextResponse.json(
        { error: '모든 항목을 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: '비밀번호는 8자 이상, 영어/숫자/특수문자를 포함해야 합니다.' },
        { status: 400 }
      );
    }

    // 중복 확인 로직도 방어적으로 포함
    const emailExists = await userPrisma.cloud.findFirst({ where: { ip: email } });
    if (emailExists) {
      return NextResponse.json({ error: '이미 등록된 이메일입니다.' }, { status: 400 });
    }

    const idExists = await userPrisma.cloud.findFirst({ where: { filename: id } });
    if (idExists) {
      return NextResponse.json({ error: '이미 사용 중인 아이디입니다.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userPrisma.cloud.create({
      data: {
        ip: email,
        filename: id,
        message: hashedPassword,
        log_time: new Date(),
        data: null,
      },
    });

    return NextResponse.json({ message: '회원가입 성공!' });
  } catch (error) {
    console.error('회원가입 에러:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
