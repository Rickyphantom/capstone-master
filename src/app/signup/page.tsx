'use client';

import { useState, useEffect } from 'react';

export default function SignupPage() {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [message, setMessage] = useState('');
  const [idMessage, setIdMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  const validatePassword = (pw: string) => {
    const errors = [];
    if (pw.length < 8) errors.push('8자 이상');
    if (!/[a-zA-Z]/.test(pw)) errors.push('영문자 포함');
    if (!/[0-9]/.test(pw)) errors.push('숫자 포함');
    if (!/[^a-zA-Z0-9]/.test(pw)) errors.push('특수문자 포함');
    setPasswordError(errors.length > 0 ? `조건: ${errors.join(', ')}` : '');
  };

  const checkIdDuplicate = async () => {
    const res = await fetch(`/api/auth/signup?id=${encodeURIComponent(id)}`);
    const data = await res.json();
    setIdMessage(data.exists ? '❌ 이미 사용 중인 아이디입니다.' : '✅ 사용 가능한 아이디입니다.');
  };

  const verifyEmail = async () => {
    const res = await fetch(`/api/auth/signup?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    setEmailMessage(data.exists ? '❌ 이미 등록된 이메일입니다.' : '✅ 사용 가능한 이메일입니다.');
  };

  const handleSignup = async () => {
    if (password !== passwordCheck) {
      setMessage('❌ 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (passwordError) {
      setMessage('❌ 비밀번호 조건을 확인해주세요.');
      return;
    }

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, email, password }),
    });

    const data = await res.json();
    setMessage(res.ok ? '✅ 회원가입 성공!' : data.error || '❌ 회원가입 실패');
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-white border border-gray-300 shadow-md rounded-xl mt-10 text-black">
      <h2 className="text-2xl font-bold mb-6">회원가입</h2>

      {/* 아이디 입력 */}
      <div className="flex gap-2 mb-2">
        <input
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="text-black border border-gray-300 p-2 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={checkIdDuplicate}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-lg"
        >
          중복확인
        </button>
      </div>
      {idMessage && <p className="text-sm mb-3">{idMessage}</p>}

      {/* 이메일 입력 */}
      <div className="flex gap-2 mb-2">
        <input
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-black border border-gray-300 p-2 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={verifyEmail}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-lg"
        >
          인증
        </button>
      </div>
      {emailMessage && <p className="text-sm mb-3">{emailMessage}</p>}

      {/* 비밀번호 */}
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="text-black border border-gray-300 p-2 w-full mb-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {passwordError && (
        <p className="text-red-600 text-sm mb-3">{passwordError}</p>
      )}

      {/* 비밀번호 확인 */}
      <input
        type="password"
        placeholder="비밀번호 확인"
        value={passwordCheck}
        onChange={(e) => setPasswordCheck(e.target.value)}
        className="text-black border border-gray-300 p-2 w-full mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={handleSignup}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-full font-semibold"
      >
        가입하기
      </button>

      {message && (
        <p className="mt-4 text-sm">{message}</p>
      )}
    </div>
  );
}
