"use client";

import { ExternalLink, Calendar, Award, Building2, TrendingUp, MapPin, Target } from "lucide-react";

interface ScholarshipCardProps {
  scholarship: {
    name: string;
    organization: string;
    amount: string;
    requirements: string[];
    reason: string;
    applicationMethod: string;
    website: string;
    deadline: string;
    imageUrl?: string;
    matchScore?: {
      major?: number;
      grade?: number;
      income?: number;
      overall?: number;
    };
  };
  index: number;
}

export function ScholarshipCard({ scholarship, index }: ScholarshipCardProps) {
  const handleClick = () => {
    if (scholarship.website) {
      window.open(scholarship.website, '_blank');
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

  const matchScore = scholarship.matchScore || {};
  const overallMatch = getMatchLevel(matchScore.overall || 0);

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-blue-300 group"
    >
      {/* 콘텐츠 섹션 */}
      <div className="p-6">
        {/* 번호 뱃지 & 전체 적합도 */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
            #{index + 1}
          </div>
          <div className={`flex items-center gap-2 ${overallMatch.bg} px-4 py-2 rounded-full`}>
            <TrendingUp className={`w-4 h-4 ${overallMatch.color}`} />
            <span className={`text-sm font-bold ${overallMatch.color}`}>
              적합도: {overallMatch.text}
            </span>
          </div>
        </div>

        {/* 제목 */}
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {scholarship.name}
        </h3>

        {/* 기관 */}
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Building2 className="w-5 h-5" />
          <span className="text-base font-medium">{scholarship.organization}</span>
        </div>

        {/* 지원 금액 */}
        <div className="flex items-center gap-2 mb-5 bg-yellow-50 p-3 rounded-lg">
          <Award className="w-6 h-6 text-yellow-600" />
          <span className="text-xl font-bold text-gray-900">{scholarship.amount}</span>
        </div>

        {/* 이 공고를 추천한 이유 (상세 매칭 점수) */}
        {(matchScore.major || matchScore.grade || matchScore.income) && (
          <div className="mb-5 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
            <h4 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              이 장학금을 추천한 이유
            </h4>
            <div className="space-y-2">
              {matchScore.major !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">전공 일치도</span>
                  <span className="text-yellow-500 font-bold">{getStars(matchScore.major)}</span>
                </div>
              )}
              {matchScore.grade !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">성적 적합도</span>
                  <span className="text-yellow-500 font-bold">{getStars(matchScore.grade)}</span>
                </div>
              )}
              {matchScore.income !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">소득 요건</span>
                  <span className="text-yellow-500 font-bold">{getStars(matchScore.income)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI 추천 이유 */}
        <div className="mb-5 bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h4 className="text-sm font-semibold text-purple-900 mb-2">💡 AI 추천 분석</h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            {scholarship.reason}
          </p>
        </div>

        {/* 이런 학생에게 특히 적합합니다 */}
        <div className="mb-5 bg-green-50 p-4 rounded-lg border border-green-100">
          <h4 className="text-sm font-semibold text-green-900 mb-2">✅ 이런 학생에게 특히 적합합니다</h4>
          <div className="flex flex-wrap gap-2">
            {scholarship.requirements.slice(0, 3).map((req, idx) => (
              <span 
                key={idx}
                className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full"
              >
                {req}
              </span>
            ))}
          </div>
        </div>

        {/* 자격 요건 */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">📋 자격 요건</h4>
          <div className="flex flex-wrap gap-2">
            {scholarship.requirements.map((req, idx) => (
              <span 
                key={idx}
                className="text-sm bg-gray-100 text-gray-800 px-4 py-2 rounded-full"
              >
                {req}
              </span>
            ))}
          </div>
        </div>

        {/* 신청 방법 */}
        <div className="mb-5 border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">📝 신청 방법</h4>
          <p className="text-gray-700 text-sm">{scholarship.applicationMethod}</p>
        </div>

        {/* 마감일 */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-5 bg-red-50 p-3 rounded-lg">
          <Calendar className="w-5 h-5 text-red-600" />
          <span>
            마감: <span className="font-bold text-red-700">{scholarship.deadline}</span>
          </span>
        </div>

        {/* 신청하기 버튼 */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg text-lg"
        >
          지금 신청하기
          <ExternalLink className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
