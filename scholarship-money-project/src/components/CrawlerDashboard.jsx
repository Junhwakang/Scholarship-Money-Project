'use client';

import { useState } from 'react';

export default function CrawlerDashboard() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCrawl = async () => {
    if (!url) {
      setError('URL을 입력해주세요');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls: [url],
          selectors: {
            title: 'h1',
            content: 'p',
            links: 'a'
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || '크롤링 실패');
      }
    } catch (err) {
      setError('네트워크 오류: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          자동화 데이터 크롤링 시스템
        </h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            크롤링 대상 URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              onClick={handleCrawl}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '크롤링 중...' : '시작'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">오류 발생</p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {results && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                ✓ {results.count}개 데이터 수집 완료
              </p>
            </div>

            {results.data && results.data.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800">
                    수집된 데이터
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {results.data.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {item.title || '제목 없음'}
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>수집 시간: {new Date(item.timestamp).toLocaleString('ko-KR')}</p>
                        <p>컨텐츠: {item.content?.length || 0}개 항목</p>
                        <p>링크: {item.links?.length || 0}개</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.errors && results.errors.length > 0 && (
              <div className="border border-orange-200 rounded-lg overflow-hidden">
                <div className="bg-orange-50 px-4 py-3 border-b border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-800">
                    오류 로그 ({results.errors.length})
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  {results.errors.map((err, index) => (
                    <div
                      key={index}
                      className="text-sm text-orange-700 bg-orange-50 p-2 rounded"
                    >
                      {err.error} - {err.url}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">시스템 기능</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Cheerio 기반 HTML 파싱 및 오류 핸들링</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>데이터 품질 관리 (Quality Check)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>중복 제거 로직 (Firestore 연동)</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>Cron Jobs 자동 스케줄링 지원</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              <span>실시간 Firestore 데이터 적재</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
