"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function StatisticsSection() {
  const [stats, setStats] = useState([
    {
      label: "설립연도",
      value: "2025",
      unit: "YEAR",
    },
    {
      label: "등록된 채용",
      value: "200+",
      unit: "JOBS",
    },
    {
      label: "장학금 정보",
      value: "100+",
      unit: "PROGRAMS",
    },
    {
      label: "평균 평점",
      value: "4.8",
      unit: "RATING",
    }
  ]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // 채용 정보 개수
      const jobsSnapshot = await getDocs(collection(db, "jobs"));
      const jobsCount = jobsSnapshot.size;

      // 장학금 정보 개수
      const scholarshipsSnapshot = await getDocs(collection(db, "scholarships"));
      const scholarshipsCount = scholarshipsSnapshot.size;

      setStats([
        {
          label: "설립연도",
          value: "2025",
          unit: "YEAR",
        },
        {
          label: "등록된 채용",
          value: jobsCount > 0 ? jobsCount.toLocaleString() : "200+",
          unit: "JOBS",
        },
        {
          label: "장학금 정보",
          value: scholarshipsCount > 0 ? scholarshipsCount.toLocaleString() : "100+",
          unit: "PROGRAMS",
        },
        {
          label: "평균 평점",
          value: "4.8",
          unit: "RATING",
        }
      ]);
    } catch (error) {
      console.error("통계 로드 실패:", error);
      // 에러 발생 시 기본값 유지
    }
  };

  return (
    <div className="bg-neutral-50 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-gray-400 text-xs tracking-[0.2em] mb-3">
                {stat.unit}
              </div>
              <div className="text-4xl lg:text-5xl font-light text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
