import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import Link from 'next/link';
import './globals.css';
import { LanguageProvider } from '../components/LanguageContext';

export const metadata = {
  title: '흰둥단(보안 관제 시스템)',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="ko">
      <body className="antialiased bg-[#F5F7FA] text-[#1E2A38]">
        <LanguageProvider>
          <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-72 bg-[#1E2A38] text-white p-6 flex flex-col shadow-lg rounded-r-3xl">
              <div className="flex items-center gap-3 mb-10">
                <img src="/favicon.ico" alt="logo" className="w-8 h-8" />
                <h1 className="text-2xl font-bold tracking-tight">흰둥단</h1>
              </div>
              <nav className="flex flex-col gap-2 text-sm">
                {[
                  { href: '/', label: '홈' },
                  { href: '/logboard', label: '로그' },
                  { href: '/settings', label: '설정' },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="px-4 py-2 rounded-lg hover:bg-[#314050] transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-10 bg-[#F9FAFB] relative">
              {/* 우측 상단 유저 정보 영역 */}
              <div className="absolute top-4 right-10 flex items-center gap-4">
                {session ? (
                  <>
                    <span className="text-sm font-semibold">
                      {session.user?.name}
                    </span>
                    <img
                      src={session.user?.image || '/default-profile.png'}
                      alt="profile"
                      className="w-8 h-8 rounded-full border"
                    />
                    <form action="/api/auth/signout" method="POST">
                      <button
                        type="submit"
                        className="bg-gray-300 hover:bg-gray-400 text-sm px-3 py-1 rounded"
                      >
                        로그아웃
                      </button>
                    </form>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-[#4D90FE] text-white rounded-lg text-sm"
                  >
                    로그인
                  </Link>
                )}
              </div>

              {children}
            </main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
