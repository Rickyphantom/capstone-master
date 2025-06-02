'use client';

import { useEffect, useState } from 'react';

interface Log {
  id: number;
  userId: number | null;
  action: string;
  detail: string;
  createdAt: string;
}

export default function Home() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [monthlyCount, setMonthlyCount] = useState(0);

  useEffect(() => {
    fetch('/api/logs')
      .then((res) => res.json())
      .then((data: Log[]) => {
        setLogs(data);

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const filtered = data.filter((log) => {
          const logDate = new Date(log.createdAt);
          return (
            logDate.getMonth() === currentMonth &&
            logDate.getFullYear() === currentYear
          );
        });

        setMonthlyCount(filtered.length);
      });
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-[#1E2A38] mb-4">🏠 홈</h2>

      <section className="bg-white border border-[#CBD5E1] rounded-2xl p-6 shadow-md max-w-6xl mx-auto">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-[#1E2A38]">
            🦠 이번 달 랜섬웨어 침입 시도:{' '}
            <span className="text-[#4D90FE] font-bold">{monthlyCount}</span>건
          </h3>
        </div>

        <div className="overflow-x-auto mt-6">
          <table className="min-w-full text-sm text-[#1E2A38]">
            <thead>
              <tr className="bg-[#E8F0FE] text-left">
                <th className="p-3 font-medium">날짜</th>
                <th className="p-3 font-medium">유저 ID</th>
                <th className="p-3 font-medium">행동</th>
                <th className="p-3 font-medium">설명</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-[#E2E8F0] hover:bg-[#F1F5F9]"
                >
                  <td className="p-3">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3">{log.userId ?? '-'}</td>
                  <td className="p-3">
                    <span className="bg-[#FF6B6B] text-white px-2 py-1 rounded text-xs font-medium">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3">{log.detail}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center p-4 text-gray-400">
                    📭 이번 달 탐지된 랜섬웨어 침입이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
