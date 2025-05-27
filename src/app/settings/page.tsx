import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // 경고 메시지 띄우기 위해 중간 auth-redirect 경유
    redirect('/auth-redirect?message=need-login&target=/settings');
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-8 text-black dark:text-white">
      <h1 className="text-3xl font-bold">⚙️ 설정 페이지</h1>

      <section className="border rounded-xl p-6 shadow-md bg-white dark:bg-[#1a1a1a]">
        <h2 className="text-xl font-semibold mb-2">👤 프로필 정보</h2>
        <p>이름: {session.user?.name}</p>
        <p>이메일: {session.user?.email}</p>
      </section>

      <section className="border rounded-xl p-6 shadow-md bg-white dark:bg-[#1a1a1a]">
        <h2 className="text-xl font-semibold mb-2">🔐 비밀번호 변경</h2>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          비밀번호 변경
        </button>
      </section>

      <section className="border rounded-xl p-6 shadow-md bg-white dark:bg-[#1a1a1a]">
        <h2 className="text-xl font-semibold mb-2">🌓 다크모드 설정</h2>
        <DarkModeToggle />
      </section>

      <section className="border rounded-xl p-6 shadow-md bg-white dark:bg-[#1a1a1a]">
        <h2 className="text-xl font-semibold mb-2">🌐 언어 설정</h2>
        <LanguageSwitcher />
      </section>
    </div>
  );
}
