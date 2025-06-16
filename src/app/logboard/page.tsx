import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
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

  const userId = session.user?.name;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/logs`, {
    cache: 'no-store',
  });

  const allLogs: Log[] = await res.json();
  const logs = allLogs.filter((log) => log.userId === userId);

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-[#1E2A38]">
        📋 내 로그 기록
      </h2>
      <div className="overflow-x-auto bg-white border border-[#CBD5E1] rounded-2xl shadow-card">
        <table className="min-w-full text-sm text-[#1E2A38]">
          <thead>
            <tr className="bg-[#E8F0FE] text-left">
              <th className="p-3 font-medium">ID</th>
              <th className="p-3 font-medium">User ID</th>
              <th className="p-3 font-medium">Action</th>
              <th className="p-3 font-medium">Detail</th>
              <th className="p-3 font-medium">Created At</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-b border-[#E2E8F0] hover:bg-[#F1F5F9]"
              >
                <td className="p-3">{log.id}</td>
                <td className="p-3">{log.userId ?? '-'}</td>
                <td className="p-3">
                  <span className="bg-[#4D90FE] text-white px-2 py-1 rounded text-xs font-medium">
                    {log.action}
                  </span>
                </td>
                <td className="p-3">{log.detail}</td>
                <td className="p-3">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 p-4">
                  📭 내 계정에 해당하는 로그가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
