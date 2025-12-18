"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ScholarshipCard } from "@/components/ScholarshipCard";
import { JobCard } from "@/components/JobCard";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";

export default function AIRecommendContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, userProfile } = useAuth();
  
  const type = searchParams.get('type') as 'scholarship' | 'job';
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!userProfile) {
      return;
    }

    fetchRecommendation();
  }, [user, userProfile]);

  const fetchRecommendation = async () => {
    try {
      setLoading(true);
      setError("");
      setData(null);

      const userInfo = type === 'scholarship' 
        ? userProfile?.scholarshipInfo 
        : userProfile?.jobInfo;

      if (!userInfo) {
        setError("추가 정보가 입력되지 않았습니다.");
        setLoading(false);
        return;
      }

      console.log('AI 추천 요청:', { type, userInfo });

      const response = await fetch('/api/ai-recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          userInfo,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'AI 추천 실패');
      }

      console.log('AI 추천 응답:', result);
      setData(result.data);

    } catch (err: any) {
      console.error('AI 추천 에러:', err);
      setError(err.message || 'AI 추천을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const scholarships = data?.scholarships || [];
  const jobs = data?.jobs || [];
  const items = type === 'scholarship' ? scholarships : jobs;
  const itemCount = items.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
              AI 맞춤 추천
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            {type === 'scholarship' ? '장학금' : '채용'} 정보를 분석하여 맞춤 추천을 제공합니다
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-8 pb-24">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 text-lg">AI가 최적의 정보를 찾고 있습니다...</p>
            <p className="text-gray-500 text-sm mt-2">잠시만 기다려주세요 (약 10~20초 소요)</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 font-semibold mb-2 text-lg">오류가 발생했습니다</p>
              <p className="text-red-700 mb-4">{error}</p>
              
              {error.includes('과부하') || error.includes('서버') ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-900 mb-2">
                    <strong>🔄 잠시 후 다시 시도해주세요</strong>
                  </p>
                  <p className="text-xs text-yellow-800">
                    AI 서버가 일시적으로 불안정한 상태입니다. 1-2분 후에 다시 시도하시면 정상적으로 작동합니다.
                  </p>
                </div>
              ) : null}
              
              <div className="flex gap-3">
                <button
                  onClick={fetchRecommendation}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  다시 시도
                </button>
                <button
                  onClick={() => router.push('/additional-info')}
                  className="px-6 py-2.5 bg-white border-2 border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-semibold"
                >
                  정보 수정하기
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && itemCount > 0 && (
          <>
            {/* 결과 헤더 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                총 {itemCount}개의 추천 결과
              </h2>
              <p className="text-gray-600">
                현재 신청 가능한 최신 정보만 엄선했습니다
              </p>
            </div>

            {/* 카드 리스트 (세로 1열) */}
            <div className="space-y-6">
              {type === 'scholarship' ? (
                scholarships.map((scholarship: any, index: number) => (
                  <ScholarshipCard 
                    key={index}
                    scholarship={scholarship}
                    index={index}
                  />
                ))
              ) : (
                jobs.map((job: any, index: number) => (
                  <JobCard 
                    key={index}
                    job={job}
                    index={index}
                  />
                ))
              )}
            </div>

            {/* 다시 추천받기 버튼 */}
            <div className="mt-12 flex justify-center gap-4">
              <button
                onClick={fetchRecommendation}
                className="px-8 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-gray-700"
              >
                🔄 다시 추천받기
              </button>
              <button
                onClick={() => router.push(type === 'scholarship' ? '/scholarship' : '/jobs')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold shadow-md hover:shadow-lg"
              >
                더 많은 {type === 'scholarship' ? '장학금' : '채용'} 정보 보기 →
              </button>
            </div>
          </>
        )}

        {!loading && !error && itemCount === 0 && data && (
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600 mb-4">추천 결과가 없습니다</p>
            <p className="text-gray-500 mb-6">조건을 변경하여 다시 시도해주세요</p>
            <button
              onClick={() => router.push('/additional-info')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              추가 정보 수정하기
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
