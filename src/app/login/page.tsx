'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/dashboard');
      } else {
        setError(data.error || '로그인 실패');
      }
    } catch (err) {
      console.error('로그인 요청 에러:', err);
      setError('서버 통신 오류가 발생했습니다.');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FAFB] p-6">
      <h1 className="text-3xl font-bold mb-8 text-[#1E2A38]">🔐 로그인</h1>

      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-6 w-full max-w-md bg-white border border-[#CBD5E1] p-8 rounded-2xl shadow-card"
      >
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-[#CBD5E1] p-3 rounded-lg text-[#1E2A38] focus:outline-none focus:ring-2 focus:ring-[#4D90FE]"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-[#CBD5E1] p-3 rounded-lg text-[#1E2A38] focus:outline-none focus:ring-2 focus:ring-[#4D90FE]"
        />
        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

        <button
          type="submit"
          className="bg-[#4D90FE] hover:bg-[#3b7be0] text-white py-3 font-bold rounded-lg transition"
        >
          로그인
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 mb-2">아직 계정이 없으신가요?</p>
        <Link
          href="/signup"
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          회원가입 하기
        </Link>
        <button
          onClick={() => {
            alert('테스트용 우회 로그인 (DB 미연결 상태)');
            window.location.href = '/dashboard?guest=true';
          }}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          우회 로그인
        </button>
      </div>
    </div>
  );
}
