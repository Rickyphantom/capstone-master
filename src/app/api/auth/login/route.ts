import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@/generated/user'; // ✅ user_db용 Prisma Client

const userPrisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 모두 입력하세요.' },
        { status: 400 }
      );
    }

    // 1. 이메일로 user_db의 cloud 테이블 조회
    const user = await userPrisma.cloud.findFirst({
      where: {
        ip: email, // cloud 테이블의 ip 칼럼에 이메일 저장됨
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: '등록되지 않은 이메일입니다.' },
        { status: 400 }
      );
    }

    // 2. 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.message ?? '');

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '비밀번호가 일치하지 않습니다.' },
        { status: 400 }
      );
    }

    // 3. 닉네임 가져오기
    const nickname = user.filename ?? '사용자';

    // 4. 쿠키에 닉네임 저장
    const response = NextResponse.json({
      message: '로그인 성공',
    });

    response.cookies.set('nickname', nickname, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('로그인 에러:', error);
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
