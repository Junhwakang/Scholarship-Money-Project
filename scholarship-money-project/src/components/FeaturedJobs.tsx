"use client";

import { useState, useEffect } from "react";
import { MapPin, Clock, ArrowRight, DollarSign } from "lucide-react";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Job {
  id: string;
  company: string;
  position: string;
  location: string;
  workTime: string;
  salary: string;
  deadline: string;
  website: string;
}

export default function FeaturedJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const jobsRef = collection(db, "jobs");
      const q = query(jobsRef, limit(6));
      const querySnapshot = await getDocs(q);
      
      const jobsData: Job[] = [];
      querySnapshot.forEach((doc) => {
        jobsData.push({
          id: doc.id,
          ...doc.data()
        } as Job);
      });
      
      setJobs(jobsData.slice(0, 3));
    } catch (error) {
      console.error("채용 정보 로딩 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (job: Job) => {
    if (job.website) {
      window.open(job.website, '_blank');
    }
  };

  // 금액에서 숫자만 추출
  const extractAmount = (salary: string) => {
    if (!salary) return "협의";
    const match = salary.match(/[\d,]+/);
    return match ? match[0] : salary;
  };

  if (loading) {
    return (
      <div className="py-24 bg-white" id="jobs">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">채용 정보 불러오는 중...</p>
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
            <div className="text-gray-400 text-xs tracking-[0.2em] mb-3">FEATURED OPPORTUNITIES</div>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">추천 채용</h2>
          </div>
          <a href="/jobs" className="hidden md:inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:gap-4 transition-all">
            <span>전체 보기</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                className="group cursor-pointer border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all"
                onClick={() => handleJobClick(job)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="px-3 py-1 bg-gray-100 text-gray-900 text-xs font-medium rounded truncate max-w-[200px]">
                    {job.company || "회사명"}
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                    {job.location || "전국"}
                  </div>
                </div>
                
                <h4 className="text-lg font-light text-gray-900 mb-4 group-hover:text-gray-600 transition-colors line-clamp-2 min-h-[56px]">
                  {job.position || "채용 공고"}
                </h4>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location || "전국"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{job.workTime || "협의"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>{extractAmount(job.salary)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-blue-600 group-hover:text-blue-800 font-medium">
                    상세보기 →
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            채용 정보를 불러올 수 없습니다.
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <a href="/jobs" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <span>전체 보기</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
