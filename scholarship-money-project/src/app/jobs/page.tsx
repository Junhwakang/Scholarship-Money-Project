"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Search, MapPin, Calendar, Briefcase, Filter, X, DollarSign, GraduationCap } from "lucide-react";
import { WorknetJob } from "@/types/worknet";
import { fetchWorknetJobs, formatDate, formatSalary, getDaysUntilClose } from "@/lib/worknet";

export default function JobsPage() {
  const [jobs, setJobs] = useState<WorknetJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  // 필터 상태
  const [filterRegion, setFilterRegion] = useState("");
  const [filterCareer, setFilterCareer] = useState("");
  const [filterSalType, setFilterSalType] = useState("");

  // 데이터 가져오기
  const loadJobs = async () => {
    setLoading(true);
    try {
      const params: any = {
        startPage: currentPage,
        display: 10,
      };

      if (searchKeyword) params.keyword = searchKeyword;
      if (filterRegion) params.region = filterRegion;
      if (filterCareer) params.career = filterCareer;
      if (filterSalType) params.salTp = filterSalType;

      const { jobs: data, totalCount: count } = await fetchWorknetJobs(params);
      
      setJobs(data);
      setTotalCount(count);
    } catch (error) {
      console.error("데이터 로딩 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드 및 페이지 변경 시 로드
  useEffect(() => {
    loadJobs();
  }, [currentPage]);

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadJobs();
  };

  // 필터 초기화
  const resetFilters = () => {
    setFilterRegion("");
    setFilterCareer("");
    setFilterSalType("");
    loadJobs();
  };

  // 공고 클릭 시 워크넷 채용 페이지로 이동
  const handleJobClick = (job: WorknetJob) => {
    if (job.wantedInfoUrl) {
      window.open(job.wantedInfoUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* 헤더 */}
      <div className="pt-24 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            채용 정보
          </h1>
          <p className="text-gray-600 text-lg">
            워크넷 채용 정보를 확인하세요
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
                  placeholder="회사명, 채용제목, 키워드 검색"
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
                    <label className="block text-sm text-gray-700 mb-2">근무지역</label>
                    <input
                      type="text"
                      value={filterRegion}
                      onChange={(e) => setFilterRegion(e.target.value)}
                      placeholder="예: 부산, 서울"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                  </div>

                  {/* 경력 필터 */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">경력</label>
                    <select
                      value={filterCareer}
                      onChange={(e) => setFilterCareer(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="">전체</option>
                      <option value="N">신입</option>
                      <option value="E">경력</option>
                      <option value="Z">관계없음</option>
                    </select>
                  </div>

                  {/* 임금형태 필터 */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">임금형태</label>
                    <select
                      value={filterSalType}
                      onChange={(e) => setFilterSalType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="">전체</option>
                      <option value="Y">연봉</option>
                      <option value="M">월급</option>
                      <option value="D">일급</option>
                      <option value="H">시급</option>
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
                      loadJobs();
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
        {!loading && jobs.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                총 <span className="font-semibold text-gray-900">{totalCount}</span>개의 채용 공고
              </p>
            </div>

            <div className="space-y-4">
              {jobs.map((job, index) => {
                const daysLeft = getDaysUntilClose(job.closeDt);
                return (
                  <div
                    key={`${job.wantedAuthNo}-${index}`}
                    onClick={() => handleJobClick(job)}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer hover:border-gray-400"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-light text-gray-900 mb-2 hover:text-gray-600 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-gray-600 mb-2 font-medium">{job.company}</p>
                        {job.indTpNm && (
                          <p className="text-sm text-gray-500">{job.indTpNm}</p>
                        )}
                      </div>
                      <div className="ml-4 flex flex-col gap-2">
                        {daysLeft <= 7 && daysLeft >= 0 && (
                          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full whitespace-nowrap">
                            D-{daysLeft}
                          </span>
                        )}
                        {job.career && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full whitespace-nowrap">
                            {job.career}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                      {job.region && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{job.region}</span>
                        </div>
                      )}
                      {job.sal && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <DollarSign className="w-4 h-4" />
                          <span>{formatSalary(job.sal, job.salTpNm)}</span>
                        </div>
                      )}
                      {job.minEdubg && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <GraduationCap className="w-4 h-4" />
                          <span>{job.minEdubg}</span>
                        </div>
                      )}
                      {job.holidayTpNm && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Briefcase className="w-4 h-4" />
                          <span>{job.holidayTpNm}</span>
                        </div>
                      )}
                    </div>

                    <div className="mb-3 bg-gray-50 px-4 py-2 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          마감일: {formatDate(job.closeDt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        등록일: {formatDate(job.regDt)}
                      </span>
                      <span className="text-blue-600 hover:text-blue-800 font-medium">
                        상세보기 →
                      </span>
                    </div>
                  </div>
                );
              })}
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
                disabled={currentPage >= Math.ceil(totalCount / 10)}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                다음
              </button>
            </div>
          </>
        )}

        {/* 결과 없음 */}
        {!loading && jobs.length === 0 && (
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
