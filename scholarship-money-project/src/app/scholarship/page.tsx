"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Search, MapPin, DollarSign, GraduationCap, Filter, X, Building2 } from "lucide-react";
import { Scholarship } from "@/types/scholarship";
import { fetchScholarships, formatAmount, regions, universityTypes, scholarshipTypes } from "@/lib/scholarship";

export default function ScholarshipPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  // 필터 상태
  const [filterRegion, setFilterRegion] = useState("");
  const [filterUnivType, setFilterUnivType] = useState("");
  const [filterScholarshipType, setFilterScholarshipType] = useState("");

  // 데이터 가져오기
  const loadScholarships = async () => {
    setLoading(true);
    setError("");
    
    try {
      console.log("=== 장학금 정보 로딩 시작 ===");
      console.log("페이지:", currentPage);
      console.log("검색어:", searchKeyword);
      console.log("필터:", { filterRegion, filterUnivType, filterScholarshipType });
      
      const params: any = {
        pageNo: currentPage,
        numOfRows: 20,
      };

      if (searchKeyword) params.UNIV_NM = searchKeyword;
      if (filterRegion) params.CTPV_NM = filterRegion;
      if (filterUnivType) params.UNIV_SE_NM = filterUnivType;
      if (filterScholarshipType) params.SCHLSHIP_TYPE_SE_NM = filterScholarshipType;

      const { scholarships: data, totalCount: count } = await fetchScholarships(params);
      
      console.log("받은 데이터:", data.length, "개");
      console.log("총 개수:", count);
      
      if (data.length === 0) {
        setError("검색 결과가 없습니다. 다른 검색 조건을 시도해보세요.");
      }

      // 최신순 정렬 (CRTR_YMD 기준 내림차순)
      const sortedData = data.sort((a, b) => {
        return (b.CRTR_YMD || '').localeCompare(a.CRTR_YMD || '');
      });
      
      setScholarships(sortedData);
      setTotalCount(count);
    } catch (err: any) {
      console.error("데이터 로딩 오류:", err);
      setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadScholarships();
  }, [currentPage]);

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("검색 실행:", searchKeyword);
    setCurrentPage(1);
    loadScholarships();
  };

  // 필터 초기화
  const resetFilters = () => {
    setFilterRegion("");
    setFilterUnivType("");
    setFilterScholarshipType("");
    setSearchKeyword("");
    setCurrentPage(1);
    loadScholarships();
  };

  // 날짜 포맷팅
  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    return `${dateStr.substring(0, 4)}.${dateStr.substring(4, 6)}.${dateStr.substring(6, 8)}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* 헤더 */}
      <div className="pt-24 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            장학금 정보
          </h1>
          <p className="text-gray-600 text-lg">
            전국 대학별 장학금 정보를 확인하세요
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {/* 검색 및 필터 영역 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* 검색바 */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="대학교명 검색 (예: 부산대학교, 서울대학교)"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                <span>필터</span>
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                검색
              </button>
            </div>

            {/* 필터 영역 */}
            {showFilters && (
              <div className="border-t border-gray-200 pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* 지역 필터 */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">시도</label>
                    <select
                      value={filterRegion}
                      onChange={(e) => setFilterRegion(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      {regions.map(region => (
                        <option key={region.value} value={region.value}>
                          {region.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 대학구분 필터 */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">대학구분</label>
                    <select
                      value={filterUnivType}
                      onChange={(e) => setFilterUnivType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      {universityTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 장학금유형 필터 */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">장학금유형</label>
                    <select
                      value={filterScholarshipType}
                      onChange={(e) => setFilterScholarshipType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      {scholarshipTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    필터 초기화
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage(1);
                      loadScholarships();
                    }}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                  >
                    필터 적용
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* 로딩 */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
          </div>
        )}

        {/* 결과 */}
        {!loading && !error && scholarships.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                총 <span className="font-semibold text-gray-900">{totalCount}</span>개의 장학금 정보
                <span className="text-sm text-gray-500 ml-2">(최신순)</span>
              </p>
            </div>

            <div className="space-y-4">
              {scholarships.map((scholarship, index) => (
                <div
                  key={`${scholarship.UNIV_NM}-${scholarship.instt_code}-${index}`}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-light text-gray-900 mb-2">
                        {scholarship.UNIV_NM}
                      </h3>
                      {scholarship.instt_nm && (
                        <p className="text-gray-600 mb-2 font-medium">{scholarship.instt_nm}</p>
                      )}
                    </div>
                    <div className="ml-4 flex flex-col gap-2 items-end">
                      {scholarship.SCHLSHIP && (
                        <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-bold text-lg">
                          {formatAmount(scholarship.SCHLSHIP)}
                        </div>
                      )}
                      {scholarship.SCHLSHIP_TYPE_SE_NM && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full whitespace-nowrap">
                          {scholarship.SCHLSHIP_TYPE_SE_NM}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                    {scholarship.CTPV_NM && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{scholarship.CTPV_NM}</span>
                      </div>
                    )}
                    {scholarship.UNIV_SE_NM && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <GraduationCap className="w-4 h-4" />
                        <span>{scholarship.UNIV_SE_NM}</span>
                      </div>
                    )}
                    {scholarship.SCHLJO_SE_NM && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 className="w-4 h-4" />
                        <span>{scholarship.SCHLJO_SE_NM}</span>
                      </div>
                    )}
                    {scholarship.CRTR_YR && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{scholarship.CRTR_YR}년 기준</span>
                      </div>
                    )}
                  </div>

                  {scholarship.CRTR_YMD && (
                    <div className="text-sm text-gray-500">
                      데이터 기준일: {formatDate(scholarship.CRTR_YMD)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                이전
              </button>
              
              <span className="px-4 py-2 text-gray-600">
                {currentPage} 페이지
              </span>

              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage >= Math.ceil(totalCount / 20)}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                다음
              </button>
            </div>
          </>
        )}

        {/* 결과 없음 */}
        {!loading && !error && scholarships.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">검색 결과가 없습니다.</p>
            <p className="text-gray-500 mt-2">다른 검색어나 필터를 사용해보세요.</p>
            <button
              onClick={resetFilters}
              className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              검색 초기화
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
