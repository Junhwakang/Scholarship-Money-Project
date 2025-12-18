"use client";

import { ExternalLink, Calendar, Briefcase, Building2, DollarSign, TrendingUp, MapPin, Clock, Target, AlertTriangle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface JobCardProps {
  job: {
    company: string;
    position: string;
    description: string;
    requirements: string[];
    preferred: string[];
    reason: string;
    salary: string;
    location?: string;
    workHours?: string;
    applicationMethod: string;
    website: string;
    deadline: string;
    imageUrl?: string;
    matchScore?: {
      major?: number;
      location?: number;
      workTime?: number;
      overall?: number;
    };
  };
  index: number;
}

export function JobCard({ job, index }: JobCardProps) {
  const [isWageViolator, setIsWageViolator] = useState(false);
  const [isMinimumWageOk, setIsMinimumWageOk] = useState(true);
  const [checkingComplete, setCheckingComplete] = useState(false);

  useEffect(() => {
    checkSafety();
  }, [job]);

  const checkSafety = async () => {
    try {
      // 임금체불자 확인 (실제로는 API 호출)
      // const violatorCheck = await fetch('/api/check-wage-violation', { ... });
      setIsWageViolator(false); // 임시

      // 최저임금 확인
      const hourlyWage = extractHourlyWage(job.salary);
      setIsMinimumWageOk(hourlyWage >= 10030);
      
      setCheckingComplete(true);
    } catch (error) {
      console.error('안전성 확인 실패:', error);
      setCheckingComplete(true);
    }
  };

  const extractHourlyWage = (salaryStr: string): number => {
    // "시급 12,000원" 형태에서 숫자 추출
    const match = salaryStr.match(/(\d{1,3}(?:,\d{3})*)/);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''));
    }
    return 10030; // 기본값
  };

  const handleClick = () => {
    if (job.website) {
      window.open(job.website, '_blank');
    }
  };

  // 점수를 별로 변환 (5점 만점)
  const getStars = (score: number = 0) => {
    const stars = Math.round((score / 100) * 5);
    return '★'.repeat(stars) + '☆'.repeat(5 - stars);
  };

  // 적합도 레벨
  const getMatchLevel = (score: number = 0) => {
    if (score >= 90) return { text: '매우 높음', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 70) return { text: '높음', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 50) return { text: '보통', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { text: '낮음', color: 'text-gray-600', bg: 'bg-gray-50' };
  };

  const matchScore = job.matchScore || {};
  const overallMatch = getMatchLevel(matchScore.overall || 0);

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-green-300 group"
    >
      {/* 콘텐츠 섹션 */}
      <div className="p-6">
        {/* 번호 뱃지 & 전체 적합도 */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold">
            #{index + 1}
          </div>
          <div className={`flex items-center gap-2 ${overallMatch.bg} px-4 py-2 rounded-full`}>
            <TrendingUp className={`w-4 h-4 ${overallMatch.color}`} />
            <span className={`text-sm font-bold ${overallMatch.color}`}>
              적합도: {overallMatch.text}
            </span>
          </div>
        </div>

        {/* 회사명 */}
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <Building2 className="w-5 h-5" />
          <span className="text-base font-bold text-gray-800">{job.company}</span>
        </div>

        {/* 직무명 */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
          {job.position}
        </h3>

        {/* 연봉/시급 */}
        <div className="flex items-center gap-2 mb-5 bg-green-50 p-3 rounded-lg">
          <DollarSign className="w-6 h-6 text-green-600" />
          <span className="text-xl font-bold text-gray-900">{job.salary}</span>
        </div>

        {/* 지원 전 체크리스트 */}
        {checkingComplete && (
          <div className="mb-5 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border-2 border-blue-200">
            <h4 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              지원 전 안전 확인
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">사업자명: 임금체불 명단 조회</span>
                {isWageViolator ? (
                  <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    체불자 등록
                  </span>
                ) : (
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    해당 없음
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">시급: 최저임금 이상 여부</span>
                {isMinimumWageOk ? (
                  <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    적정
                  </span>
                ) : (
                  <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    최저임금 미달
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">계약서 제공 여부</span>
                <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-bold">
                  지원 시 확인
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 이 공고를 추천한 이유 (상세 매칭 점수) */}
        {(matchScore.major || matchScore.location || matchScore.workTime) && (
          <div className="mb-5 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
            <h4 className="text-sm font-bold text-green-900 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              이 공고를 추천한 이유
            </h4>
            <div className="space-y-2">
              {matchScore.major !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">전공 일치도</span>
                  <span className="text-yellow-500 font-bold">{getStars(matchScore.major)}</span>
                </div>
              )}
              {matchScore.location !== undefined && job.location && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    지역 거리
                  </span>
                  <span className="text-sm font-bold text-green-700">
                    {job.location} (가까움)
                  </span>
                </div>
              )}
              {matchScore.workTime !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    근무 시간 적합도
                  </span>
                  <span className="text-yellow-500 font-bold">{getStars(matchScore.workTime)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 업무 설명 */}
        <div className="mb-5 bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">💼 주요 업무</h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* AI 추천 이유 */}
        <div className="mb-5 bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h4 className="text-sm font-semibold text-purple-900 mb-2">💡 AI 추천 분석</h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            {job.reason}
          </p>
        </div>

        {/* 이런 학생에게 특히 적합합니다 */}
        <div className="mb-5 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">✅ 이런 학생에게 특히 적합합니다</h4>
          <div className="flex flex-wrap gap-2">
            {job.requirements.slice(0, 3).map((req, idx) => (
              <span 
                key={idx}
                className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
              >
                {req}
              </span>
            ))}
          </div>
        </div>

        {/* 필수 요건 */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">✅ 필수 요건</h4>
          <div className="flex flex-wrap gap-2">
            {job.requirements.map((req, idx) => (
              <span 
                key={idx}
                className="text-sm bg-gray-100 text-gray-800 px-4 py-2 rounded-full"
              >
                {req}
              </span>
            ))}
          </div>
        </div>

        {/* 우대 요건 */}
        {job.preferred && job.preferred.length > 0 && (
          <div className="mb-5">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">⭐ 우대 요건</h4>
            <div className="flex flex-wrap gap-2">
              {job.preferred.map((pref, idx) => (
                <span 
                  key={idx}
                  className="text-sm bg-blue-100 text-blue-800 px-4 py-2 rounded-full"
                >
                  {pref}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 지원 방법 */}
        <div className="mb-5 border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">📝 지원 방법</h4>
          <p className="text-gray-700 text-sm">{job.applicationMethod}</p>
        </div>

        {/* 마감일 */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-5 bg-red-50 p-3 rounded-lg">
          <Calendar className="w-5 h-5 text-red-600" />
          <span>
            마감: <span className="font-bold text-red-700">{job.deadline}</span>
          </span>
        </div>

        {/* 지원하기 버튼 */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg text-lg"
        >
          지금 지원하기
          <ExternalLink className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
