'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');
  const router = useRouter();

  const login = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pw }),
    });

    const data = await res.json();
    if (res.ok) {
      router.push('/dashboard'); // 로그인 성공 시 대시보드로 이동
    } else {
      setMsg(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1E1E2F]">
      <div className="bg-[#2A2A3C] p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">로그인</h2>

        <input
          placeholder="이메일"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-[#3B3B50] text-white placeholder-gray-400"
        />

        <input
          placeholder="비밀번호"
          type="password"
          onChange={(e) => setPw(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-[#3B3B50] text-white placeholder-gray-400"
        />

        <button
          onClick={login}
          className="w-full bg-[#BCA7FF] text-black py-3 rounded hover:bg-[#d6c9ff] transition"
        >
          로그인
        </button>

        {msg && <p className="text-red-400 text-sm mt-4 text-center">{msg}</p>}

        <div className="mt-6 text-center text-sm text-gray-400">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="text-[#BCA7FF] hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
