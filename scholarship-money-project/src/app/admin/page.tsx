"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const triggerCrawl = async (type: 'scholarships' | 'jobs') => {
    try {
      setLoading(true);
      setMessage(`${type === 'scholarships' ? '장학금' : '채용'} 크롤링 중...`);

      const response = await fetch(`/api/crawl-${type}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer your-secret-key`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ ${data.count}개 ${type === 'scholarships' ? '장학금' : '채용 공고'} 크롤링 완료!`);
      } else {
        setMessage(`❌ 에러: ${data.error}`);
      }
    } catch (error: any) {
      setMessage(`❌ 에러: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 pb-12 max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8">관리자 패널</h1>
        
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">수동 크롤링 트리거</h2>
          
          <div className="space-y-4">
            <button
              onClick={() => triggerCrawl('scholarships')}
              disabled={loading}
              className="w-full px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-lg font-semibold"
            >
              {loading ? '크롤링 중...' : '🎓 장학금 크롤링 실행'}
            </button>
            
            <button
              onClick={() => triggerCrawl('jobs')}
              disabled={loading}
              className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 text-lg font-semibold"
            >
              {loading ? '크롤링 중...' : '💼 채용 공고 크롤링 실행'}
            </button>
          </div>

          {message && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-800">{message}</p>
            </div>
          )}

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">💡 안내</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• 크롤링은 약 10~30초 소요됩니다</li>
              <li>• 실제 운영 시에는 Vercel Cron으로 자동화됩니다</li>
              <li>• 데이터는 Firestore에 저장됩니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
