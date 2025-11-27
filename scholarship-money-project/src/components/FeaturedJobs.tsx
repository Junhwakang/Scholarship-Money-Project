"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, ArrowRight, Calendar } from "lucide-react";
import { WorknetJob } from "@/types/worknet";
import { fetchWorknetJobs, formatDate, getDaysUntilClose } from "@/lib/worknet";

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<WorknetJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUrgentJobs();
  }, []);

  const loadUrgentJobs = async () => {
    try {
      const { jobs: data } = await fetchWorknetJobs({
        display: 30, // 더 많이 가져와서 마감임박 필터링
      });

      // 마감임박 순으로 정렬 (마감일이 가까운 순)
      const sortedByClosing = data
        .filter(job => {
          const daysLeft = getDaysUntilClose(job.closeDt);
          return daysLeft >= 0 && daysLeft <= 30; // 30일 이내 마감
        })
        .sort((a, b) => {
          const daysA = getDaysUntilClose(a.closeDt);
          const daysB = getDaysUntilClose(b.closeDt);
          return daysA - daysB;
        })
        .slice(0, 3); // 상위 3개만

      setJobs(sortedByClosing);
    } catch (error) {
      console.error("마감임박 채용 로딩 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (job: WorknetJob) => {
    if (job.wantedInfoUrl) {
      window.open(job.wantedInfoUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="py-24 bg-white" id="jobs">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-white" id="jobs">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="text-gray-400 text-xs tracking-[0.2em] mb-3">URGENT OPPORTUNITIES</div>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">마감임박</h2>
          </div>
          <a href="/jobs" className="hidden md:inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:gap-4 transition-all">
            <span>전체 보기</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {jobs.map((job, index) => {
            const daysLeft = getDaysUntilClose(job.closeDt);
            return (
              <div 
                key={index} 
                className="group cursor-pointer border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all"
                onClick={() => handleJobClick(job)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="px-3 py-1 bg-gray-100 text-gray-900 text-xs font-medium rounded">
                    {job.company}
                  </div>
                  <div className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
                    D-{daysLeft}
                  </div>
                </div>
                
                <h4 className="text-lg font-light text-gray-900 mb-4 group-hover:text-gray-600 transition-colors line-clamp-2">
                  {job.title}
                </h4>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{job.region || '지역 정보 없음'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{job.career || '경력 무관'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>마감: {formatDate(job.closeDt)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-blue-600 group-hover:text-blue-800 font-medium">
                    상세보기 →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {jobs.length === 0 && !loading && (
          <div className="text-center py-10 text-gray-500">
            마감임박 채용 정보가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
