// src/middleware.ts 또는 app/middleware.ts

import { withAuth } from 'next-auth/middleware'

export default withAuth({
  // 인증이 필요한 경로 설정
  pages: {
    signIn: '/login', // 로그인 페이지 경로
  },
})

// 보호할 경로 설정
export const config = {
  matcher: ['/logs', '/settings'],
}
