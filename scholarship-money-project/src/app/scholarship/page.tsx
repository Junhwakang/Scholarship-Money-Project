"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Search, Building2, GraduationCap, ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

const ITEMS_PER_PAGE = 20;

export default function ScholarshipPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedOrganization, setSelectedOrganization] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Firebase에서 장학금 정보 가져오기
  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setLoading(true);
        const scholarshipsRef = collection(db, "scholarships");
        const querySnapshot = await getDocs(scholarshipsRef);
        
        const scholarshipsData: Scholarship[] = [];
        querySnapshot.forEach((doc) => {
          scholarshipsData.push({
            id: doc.id,
            ...doc.data()
          } as Scholarship);
        });
        
        setScholarships(scholarshipsData);
        setFilteredScholarships(scholarshipsData);
      } catch (error) {
        console.error("장학금 정보 로딩 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  // 조직 목록 추출
  const organizations = Array.from(new Set(scholarships.map(s => s.organization))).sort();

  // 필터링
  useEffect(() => {
    let filtered = scholarships;

    if (searchKeyword) {
      filtered = filtered.filter(scholarship =>
        (scholarship.name && scholarship.name.toLowerCase().includes(searchKeyword.toLowerCase())) ||
        (scholarship.organization && scholarship.organization.toLowerCase().includes(searchKeyword.toLowerCase())) ||
        (scholarship.summary && scholarship.summary.toLowerCase().includes(searchKeyword.toLowerCase()))
      );
    }

    if (selectedOrganization) {
      filtered = filtered.filter(s => s.organization === selectedOrganization);
    }

    setFilteredScholarships(filtered);
    setCurrentPage(1);
  }, [searchKeyword, selectedOrganization, scholarships]);

  // 필터 초기화
  const resetFilters = () => {
    setSearchKeyword("");
    setSelectedOrganization("");
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredScholarships.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentScholarships = filteredScholarships.slice(startIndex, endIndex);

  // 페이지 변경
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 페이지 번호 생성
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "상시" || dateString === "상시채용") return dateString;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* 헤더 */}
      <div className="pt-24 pb-12 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            장학금 정보
          </h1>
          <p className="text-gray-600 text-lg">
            총 <span className="font-semibold text-gray-900">{filteredScholarships.length}</span>개의 장학금
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {/* 검색 및 필터 영역 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 검색 */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="장학금명, 기관명 검색"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* 필터 버튼 */}
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="md:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Filter className="w-5 h-5" />
              <span>필터</span>
              {(selectedOrganization) && (
                <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">1</span>
              )}
            </button>
          </div>

          {/* 필터 패널 */}
          {showFilterPanel && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">필터 옵션</h3>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  초기화
                </button>
              </div>

              {/* 기관 필터 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기관명
                </label>
                <select
                  value={selectedOrganization}
                  onChange={(e) => setSelectedOrganization(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">전체</option>
                  {organizations.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
              </div>

              {/* 적용된 필터 태그 */}
              {selectedOrganization && (
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    <span>{selectedOrganization}</span>
                    <button
                      onClick={() => setSelectedOrganization("")}
                      className="hover:text-blue-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 로딩 */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* 결과 없음 */}
        {!loading && filteredScholarships.length === 0 && (
          <div className="text-center py-20">
            <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
            <button
              onClick={resetFilters}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              필터 초기화
            </button>
          </div>
        )}

        {/* 장학금 리스트 */}
        {!loading && currentScholarships.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentScholarships.map((scholarship) => (
                <div
                  key={scholarship.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  {/* 기관명 */}
                  <div className="flex items-center gap-2 text-sm text-blue-600 mb-3">
                    <Building2 className="w-4 h-4" />
                    <span>{scholarship.organization}</span>
                  </div>

                  {/* 장학금명 */}
                  <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[48px]">
                    {scholarship.name}
                  </h3>

                  {/* 요약 */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {scholarship.summary}
                  </p>

                  {/* 지원 금액 */}
                  <div className="bg-blue-50 rounded-lg p-3 mb-4">
                    <div className="text-xs text-gray-600 mb-1">지원 금액</div>
                    <div className="font-semibold text-blue-600">{scholarship.amount}</div>
                  </div>

                  {/* 마감일 */}
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-gray-600">마감일</span>
                    <span className="font-medium text-gray-900">{formatDate(scholarship.deadline)}</span>
                  </div>

                  {/* 버튼 */}
                  <a
                    href={scholarship.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2 bg-gray-900 text-white text-center rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    지원하기
                  </a>
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
