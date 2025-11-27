"use client";

import { useState } from "react";

export default function TestPage() {
  const [scholarshipData, setScholarshipData] = useState<any>(null);
  const [scholarshipError, setScholarshipError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // 장학금 API 테스트
  const testScholarship = async () => {
    setLoading(true);
    setScholarshipError("");
    setScholarshipData(null);
    
    try {
      console.log("장학금 API 테스트 시작...");
      const response = await fetch('/api/scholarship?numOfRows=10&pageNo=1');
      console.log("장학금 응답 상태:", response.status);
      console.log("장학금 응답 헤더:", Object.fromEntries(response.headers));
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '장학금 API 실패');
      }
      
      const contentType = response.headers.get('content-type');
      console.log("Content-Type:", contentType);

      if (contentType?.includes('application/xml')) {
        const xmlText = await response.text();
        console.log("장학금 XML:", xmlText.substring(0, 1000));
        
        // XML 파싱
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
          throw new Error('XML 파싱 에러: ' + parseError.textContent);
        }
        
        const items = xmlDoc.querySelectorAll('item');
        const scholarships: any[] = [];
        
        items.forEach(item => {
          scholarships.push({
            UNIV_NM: item.querySelector('UNIV_NM')?.textContent || '',
            CTPV_NM: item.querySelector('CTPV_NM')?.textContent || '',
            SCHLSHIP: item.querySelector('SCHLSHIP')?.textContent || '',
            SCHLSHIP_TYPE_SE_NM: item.querySelector('SCHLSHIP_TYPE_SE_NM')?.textContent || '',
          });
        });
        
        setScholarshipData({ scholarships, count: scholarships.length });
        console.log("장학금 XML 파싱 성공:", scholarships.length, "개");
        
      } else {
        const data = await response.json();
        console.log("장학금 JSON:", data);
        setScholarshipData(data);
        console.log("장학금 데이터 설정 완료");
      }
      
    } catch (error: any) {
      console.error("장학금 에러:", error);
      setScholarshipError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">장학금 API 테스트</h1>
        
        {/* 장학금 테스트 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">장학금 API 테스트</h2>
          <button
            onClick={testScholarship}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? '테스트 중...' : '장학금 API 호출'}
          </button>
          
          {scholarshipError && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              <strong>에러:</strong> {scholarshipError}
            </div>
          )}
          
          {scholarshipData && (
            <div className="mt-4">
              {scholarshipData.scholarships ? (
                <div className="space-y-2">
                  <p className="font-semibold">총 {scholarshipData.count}개</p>
                  {scholarshipData.scholarships.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded">
                      <p className="font-medium">{item.UNIV_NM}</p>
                      <p className="text-sm text-gray-600">
                        {item.CTPV_NM} | {item.SCHLSHIP_TYPE_SE_NM} | {item.SCHLSHIP}원
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <pre className="p-4 bg-gray-50 rounded overflow-auto max-h-96 text-xs">
                  {JSON.stringify(scholarshipData, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded">
          <p className="text-sm">
            <strong>사용법:</strong> 버튼을 클릭하면 장학금 API를 테스트합니다. 
            브라우저 개발자 도구(F12)의 콘솔과 네트워크 탭을 열어서 자세한 로그를 확인하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
