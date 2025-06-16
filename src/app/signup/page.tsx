'use client';

import { useState } from 'react';

export default function SignupPage() {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [message, setMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (password: string, email: string) => {
    const errors = [];
    if (password.length < 8) errors.push('8자 이상');
    if (!/[a-zA-Z]/.test(password)) errors.push('영문자 포함');
    if (!/[0-9]/.test(password)) errors.push('숫자 포함');
    if (!/[^a-zA-Z0-9]/.test(password)) errors.push('특수문자 포함');
    if (password === email) errors.push('이메일과 동일하지 않아야 함');

    if (errors.length > 0) {
      setPasswordError(`비밀번호 조건 불충족: ${errors.join(', ')}`);
      return false;
    }

    setPasswordError('');
    return true;
  };

  const checkIdDuplicate = async () => {
    const res = await fetch(
      '/api/auth/signup?id=' + encodeURIComponent(id)
    );
    const data = await res.json();
    if (data.exists) {
      setMessage('이미 사용 중인 아이디입니다.');
    } else {
      setMessage('사용 가능한 아이디입니다.');
    }
  };

  const verifyEmail = async () => {
    const res = await fetch(
      '/api/auth/signup?email=' + encodeURIComponent(email)
    );
    const data = await res.json();
    if (data.exists) {
      setMessage('이미 등록된 이메일입니다.');
    } else {
      setMessage('사용 가능한 이메일입니다.');
    }
  };

  const handleSignup = async () => {
    if (password !== passwordCheck) {
      setMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!validatePassword(password, email)) {
      setMessage('비밀번호 조건을 확인해주세요.');
      return;
    }

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('회원가입 성공!');
    } else {
      setMessage(data.error || '회원가입 실패');
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-white border border-[#CBD5E1] shadow-card rounded-2xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-[#1E2A38]">회원가입</h2>

      <div className="flex gap-2 mb-4">
        <input
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="placeholder-black text-black border border-[#CBD5E1] p-2 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D90FE]"
        />
        <button
          onClick={checkIdDuplicate}
          className="bg-[#4D90FE] hover:bg-[#3b7be0] text-white px-4 rounded-lg"
        >
          중복확인
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="placeholder-black text-black border border-[#CBD5E1] p-2 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D90FE]"
        />
        <button
          onClick={verifyEmail}
          className="bg-[#4D90FE] hover:bg-[#3b7be0] text-white px-4 rounded-lg"
        >
          인증
        </button>
      </div>

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="placeholder-black text-black border border-[#CBD5E1] p-2 w-full mb-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D90FE]"
      />
      {passwordError && (
        <p className="text-red-600 text-sm font-medium mb-3">{passwordError}</p>
      )}

      <input
        type="password"
        placeholder="비밀번호 확인"
        value={passwordCheck}
        onChange={(e) => setPasswordCheck(e.target.value)}
        className="placeholder-black text-black border border-[#CBD5E1] p-2 w-full mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D90FE]"
      />

      <button
        onClick={handleSignup}
        className="bg-[#4D90FE] hover:bg-[#3b7be0] text-white py-2 px-4 rounded-lg w-full font-semibold"
      >
        가입하기
      </button>

      {message && (
        <p className="mt-4 text-black font-medium text-sm">{message}</p>
      )}
    </div>
  );
}
