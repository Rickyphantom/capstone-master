import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

interface Log {
  id: number;
  userId: number | null;
  action: string;
  detail: string;
  createdAt: string;
}

export default async function LogBoardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth-redirect?message=need-login&target=/logboard');
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logs`, {
    cache: 'no-store',
    headers: {
      Cookie: '', // getServerSession을 썼으므로 자동으로 쿠키 포함됨 (Next.js 서버 실행 중일 경우)
    },
  });

  const logs: Log[] = await res.json();

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6 text-white">로그 기록</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-white">
          <thead>
            <tr className="bg-[#2A2A3C] text-left">
              <th className="p-3">ID</th>
              <th className="p-3">User ID</th>
              <th className="p-3">Action</th>
              <th className="p-3">Detail</th>
              <th className="p-3">Created At</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-[#3B3B50] hover:bg-[#2a2a2a]"
              >
                <td className="p-3">{log.id}</td>
                <td className="p-3">{log.userId ?? '-'}</td>
                <td className="p-3">{log.action}</td>
                <td className="p-3">{log.detail}</td>
                <td className="p-3">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
