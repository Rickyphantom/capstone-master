'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthRedirectPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const message = searchParams.get('message');
  const target = searchParams.get('target') || '/';

  useEffect(() => {
    if (message === 'need-login') {
      alert('로그인 후 이용할 수 있습니다.');
      router.replace(`/login?callback=${target}`);
    }
  }, [message, target, router]);

  return null;
}
