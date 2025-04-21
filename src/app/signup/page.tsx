'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const router = useRouter();

  // ✅ 이메일 중복 확인 API 호출
  const checkEmailDuplicate = async () => {
    const res = await fetch(`/api/auth/check-email?email=${email}`);
    const data = await res.json();
    if (res.ok && data.available) {
      setEmailValid(true);
      setMsg('✅ 사용 가능한 이메일입니다.');
    } else {
      setEmailValid(false);
      setMsg('❌ 이미 등록된 이메일입니다.');
    }
  };

  const isPasswordValid = (pw: string) => {
    return (
      pw.length >= 8 &&
      /[a-zA-Z]/.test(pw) &&
      /[0-9]/.test(pw) &&
      /[^a-zA-Z0-9]/.test(pw)
    );
  };

  const submit = async () => {
    if (!emailValid) {
      setMsg('이메일 중복 확인이 필요합니다.');
      return;
    }

    if (pw !== pwCheck) {
      setMsg('비밀번호가 일치하지 않습니다.');
      return;
    }

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pw, name }),
    });

    const data = await res.json();
    if (res.ok) router.push('/login');
    else setMsg(data.error);
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">회원가입</h2>

      {/* 이름 */}
      <input
        placeholder="이름"
        onChange={(e) => setName(e.target.value)}
        className="block mb-2 border p-2 w-full"
      />

      {/* 이메일 + 중복확인 */}
      <div className="flex gap-2 mb-2">
        <input
          placeholder="이메일"
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailValid(false); // 이메일 바꾸면 다시 체크해야 함
          }}
          className="border p-2 flex-1"
        />
        <button
          onClick={checkEmailDuplicate}
          className="bg-gray-700 text-white px-3 rounded"
        >
          중복확인
        </button>
      </div>

      {/* 비밀번호 */}
      <input
        placeholder="비밀번호"
        type="password"
        onChange={(e) => setPw(e.target.value)}
        className="block mb-2 border p-2 w-full"
      />

      {/* 비밀번호 확인 */}
      <input
        placeholder="비밀번호 확인"
        type="password"
        onChange={(e) => setPwCheck(e.target.value)}
        className="block mb-4 border p-2 w-full"
      />

      <button
        onClick={submit}
        disabled={!isPasswordValid(pw) || pw !== pwCheck || !emailValid}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed w-full"
      >
        가입하기
      </button>

      {msg && <p className="mt-2 text-red-400 text-sm">{msg}</p>}
    </div>
  );
}
