"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Search, DollarSign, GraduationCap, MapPin, Building2, Filter, X } from "lucide-react";
import { Scholarship } from "@/types/scholarship";
import { 
  fetchScholarships, 
  formatAmount, 
  scholarshipTypes, 
  universityTypes, 
  regions 
} from "@/lib/scholarship";

export default function ScholarshipPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedUnivType, setSelectedUnivType] = useState("");
  const [selectedScholarshipType, setSelectedScholarshipType] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // 데이터 가져오기
  const loadScholarships = async () => {
    setLoading(true);
    try {
      const { scholarships: data, totalCount: count } = await fetchScholarships({
        pageNo: currentPage,
        numOfRows: 100,
      });

      // 검색어 필터링
      let filteredData = data;
      
      if (searchKeyword) {
        filteredData = filteredData.filter(scholarship => 
          scholarship.UNIV_NM?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          scholarship.SCHLSHIP_TYPE_SE_NM?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          scholarship.instt_nm?.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      }

      // 필터 적용
      if (selectedRegion) {
        filteredData = filteredData.filter(scholarship =>
          scholarship.CTPV_NM?.includes(selectedRegion)
        );
      }

      if (selectedUnivType) {
        filteredData = filteredData.filter(scholarship =>
          scholarship.UNIV_SE_NM === selectedUnivType
        );
      }

      if (selectedScholarshipType) {
        filteredData = filteredData.filter(scholarship =>
          scholarship.SCHLSHIP_TYPE_SE_NM === selectedScholarshipType
        );
      }

      setScholarships(filteredData);
      setTotalCount(filteredData.length);
    } catch (error) {
      console.error("데이터 로딩 오류:", error);
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
    setCurrentPage(1);
    loadScholarships();
  };

  // 필터 초기화
  const resetFilters = () => {
    setSelectedRegion("");
    setSelectedUnivType("");
    setSelectedScholarshipType("");
    loadScholarships();
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
                  placeholder="대학교명, 장학금유형, 기관명 검색"
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
                className="px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
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
                    <label className="block text-sm text-gray-700 mb-2">지역</label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      {regions.map((region) => (
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
                      value={selectedUnivType}
                      onChange={(e) => setSelectedUnivType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      {universityTypes.map((type) => (
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
                      value={selectedScholarshipType}
                      onChange={(e) => setSelectedScholarshipType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      {scholarshipTypes.map((type) => (
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

        {/* 로딩 */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
          </div>
        )}

        {/* 결과 */}
        {!loading && scholarships.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                총 <span className="font-semibold text-gray-900">{scholarships.length}</span>개의 장학금 정보
              </p>
            </div>

            <div className="space-y-4">
              {scholarships.map((scholarship, index) => (
                <div
                  key={`${scholarship.UNIV_NM}-${index}`}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-light text-gray-900">
                          {scholarship.UNIV_NM}
                        </h3>
                        {scholarship.UNIV_SE_NM && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {scholarship.UNIV_SE_NM}
                          </span>
                        )}
                      </div>
                      {scholarship.SCHLSHIP_TYPE_SE_NM && (
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {scholarship.SCHLSHIP_TYPE_SE_NM}
                        </span>
                      )}
                    </div>
                    {scholarship.SCHLSHIP && (
                      <div className="ml-4 text-right">
                        <div className="text-2xl font-light text-gray-900">
                          {formatAmount(scholarship.SCHLSHIP)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {scholarship.CTPV_NM && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{scholarship.CTPV_NM}</span>
                      </div>
                    )}

                    {scholarship.SCHLJO_SE_NM && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <GraduationCap className="w-4 h-4 text-gray-400" />
                        <span>{scholarship.SCHLJO_SE_NM}</span>
                      </div>
                    )}

                    {scholarship.instt_nm && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span>{scholarship.instt_nm}</span>
                      </div>
                    )}
                  </div>

                  {scholarship.CRTR_YR && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        기준연도: {scholarship.CRTR_YR}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* 결과 없음 */}
        {!loading && scholarships.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">검색 결과가 없습니다.</p>
            <p className="text-gray-500 mt-2">다른 검색어나 필터를 사용해보세요.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
