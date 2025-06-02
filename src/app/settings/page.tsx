import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth-redirect?message=need-login&target=/settings');
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-10 text-[#1E2A38]">
      <h1 className="text-3xl font-bold">⚙️ 설정 페이지</h1>

      <section className="border border-[#CBD5E1] rounded-2xl p-6 shadow-card bg-white">
        <h2 className="text-xl font-semibold mb-3">👤 프로필 정보</h2>
        <div className="space-y-1">
          <p>
            <span className="font-medium">이름:</span> {session.user?.name}
          </p>
          <p>
            <span className="font-medium">이메일:</span> {session.user?.email}
          </p>
        </div>
      </section>

      <section className="border border-[#CBD5E1] rounded-2xl p-6 shadow-card bg-white">
        <h2 className="text-xl font-semibold mb-3">🔐 비밀번호 변경</h2>
        <button className="bg-[#4D90FE] hover:bg-[#3b7be0] text-white px-4 py-2 rounded-lg font-medium">
          비밀번호 변경
        </button>
      </section>

      <section className="border border-[#CBD5E1] rounded-2xl p-6 shadow-card bg-white">
        <h2 className="text-xl font-semibold mb-3">🌓 다크모드 설정</h2>
        <DarkModeToggle />
      </section>

      <section className="border border-[#CBD5E1] rounded-2xl p-6 shadow-card bg-white">
        <h2 className="text-xl font-semibold mb-3">🌐 언어 설정</h2>
        <LanguageSwitcher />
      </section>
    </div>
  );
}
