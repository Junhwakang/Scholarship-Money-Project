"use client";

import { useState, useEffect } from "react";
import { DollarSign, ArrowRight, Building2, GraduationCap } from "lucide-react";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

interface Scholarship {
  id: string;
  name: string;
  organization: string;
  amount: string;
  requirements: string[];
  applicationMethod: string;
  website: string;
  deadline: string;
  summary: string;
}

export default function ScholarshipGrid() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScholarships();
  }, []);

  const loadScholarships = async () => {
    try {
      const scholarshipsRef = collection(db, "scholarships");
      const q = query(scholarshipsRef, limit(6));
      const querySnapshot = await getDocs(q);
      
      const scholarshipsData: Scholarship[] = [];
      querySnapshot.forEach((doc) => {
        scholarshipsData.push({
          id: doc.id,
          ...doc.data()
        } as Scholarship);
      });
      
      setScholarships(scholarshipsData);
    } catch (error) {
      console.error("장학금 로딩 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 bg-neutral-50" id="scholarship">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">장학금 정보 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-neutral-50" id="scholarship">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <div className="text-gray-400 text-xs tracking-[0.2em] mb-3">SCHOLARSHIP PROGRAMS</div>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 tracking-tight">장학금 정보</h2>
          </div>
          <Link href="/scholarship" className="hidden md:inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 hover:gap-4 transition-all">
            <span>전체 보기</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {scholarships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.map((scholarship) => (
              <Link
                key={scholarship.id}
                href="/scholarship"
                className="bg-white p-8 hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
              >
                <div className="text-gray-400 text-xs tracking-[0.2em] mb-4 truncate">
                  {scholarship.organization || "재단"}
                </div>
                
                <h4 className="text-lg font-light text-gray-900 mb-4 line-clamp-2 min-h-[56px]">
                  {scholarship.name || "장학금"}
                </h4>

                {scholarship.summary && (
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {scholarship.summary.length > 20 ? scholarship.summary.substring(0, 20) + "..." : scholarship.summary}
                    </span>
                  </div>
                )}
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold text-gray-900">
                      {scholarship.amount && scholarship.amount.length > 20 ? scholarship.amount.substring(0, 20) + "..." : scholarship.amount || "별도문의"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>{scholarship.organization || "재단"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4 text-gray-400" />
                    <span>
                      {scholarship.applicationMethod && scholarship.applicationMethod.length > 15 
                        ? scholarship.applicationMethod.substring(0, 15) + "..." 
                        : scholarship.applicationMethod || "홈페이지"}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <span className="inline-flex items-center gap-2 text-sm text-gray-900 hover:gap-4 transition-all">
                    <span>자세히 보기</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            장학금 정보를 불러올 수 없습니다.
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link href="/scholarship" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <span>전체 보기</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
