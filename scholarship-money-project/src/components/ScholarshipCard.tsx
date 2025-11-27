"use client";

import { ExternalLink, Calendar, Award, Building2 } from "lucide-react";

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
  };
  index: number;
}

export function ScholarshipCard({ scholarship, index }: ScholarshipCardProps) {
  const handleClick = () => {
    if (scholarship.website) {
      window.open(scholarship.website, '_blank');
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-blue-300 group"
    >
      {/* 콘텐츠 섹션 */}
      <div className="p-6">
        {/* 번호 뱃지 */}
        <div className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold mb-4">
          #{index + 1}
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

        {/* 추천 이유 */}
        <div className="mb-5 bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 추천 이유</h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            {scholarship.reason}
          </p>
        </div>

        {/* 자격 요건 */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">📋 자격 요건</h4>
          <div className="flex flex-wrap gap-2">
            {scholarship.requirements.map((req, idx) => (
              <span 
                key={idx}
                className="text-sm bg-blue-100 text-blue-800 px-4 py-2 rounded-full"
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
