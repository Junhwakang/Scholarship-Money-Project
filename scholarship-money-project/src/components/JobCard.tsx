"use client";

import { ExternalLink, Calendar, Briefcase, Building2, DollarSign } from "lucide-react";

interface JobCardProps {
  job: {
    company: string;
    position: string;
    description: string;
    requirements: string[];
    preferred: string[];
    reason: string;
    salary: string;
    applicationMethod: string;
    website: string;
    deadline: string;
    imageUrl?: string;
  };
  index: number;
}

export function JobCard({ job, index }: JobCardProps) {
  const handleClick = () => {
    if (job.website) {
      window.open(job.website, '_blank');
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-green-300 group"
    >
      {/* 콘텐츠 섹션 */}
      <div className="p-6">
        {/* 번호 뱃지 */}
        <div className="inline-block bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-semibold mb-4">
          #{index + 1}
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

        {/* 연봉 */}
        <div className="flex items-center gap-2 mb-5 bg-green-50 p-3 rounded-lg">
          <DollarSign className="w-6 h-6 text-green-600" />
          <span className="text-xl font-bold text-gray-900">{job.salary}</span>
        </div>

        {/* 업무 설명 */}
        <div className="mb-5 bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">💼 주요 업무</h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* 추천 이유 */}
        <div className="mb-5 bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-green-900 mb-2">💡 추천 이유</h4>
          <p className="text-gray-700 text-sm leading-relaxed">
            {job.reason}
          </p>
        </div>

        {/* 필수 요건 */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">✅ 필수 요건</h4>
          <div className="flex flex-wrap gap-2">
            {job.requirements.map((req, idx) => (
              <span 
                key={idx}
                className="text-sm bg-green-100 text-green-800 px-4 py-2 rounded-full"
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
