"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Search, MapPin, Clock, ChevronLeft, ChevronRight, Heart, Sparkles } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useAuth } from "@/contexts/AuthContext";
import { addFavoriteJob, removeFavoriteJob, getFavoriteJobs } from "@/lib/firebase/profile";

interface Job {
  id: string;
  company?: string;
  position?: string;
  location?: string;
  workTime?: string;
  salary?: string;
  deadline?: string;
  website?: string;
}

const ITEMS_PER_PAGE = 20;

export default function JobsPage() {
  const { user, userProfile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [otherJobs, setOtherJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteJobIds, setFavoriteJobIds] = useState<Set<string>>(new Set());
  const [loadingFavorites, setLoadingFavorites] = useState<Set<string>>(new Set());

  // Firebase에서 채용 정보 가져오기
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const jobsRef = collection(db, "jobs");
        const querySnapshot = await getDocs(jobsRef);
        
        const jobsData: Job[] = [];
        querySnapshot.forEach((doc) => {
          jobsData.push({
            id: doc.id,
            ...doc.data()
          } as Job);
        });
        
        setJobs(jobsData);
        setFilteredJobs(jobsData);
      } catch (error) {
        console.error("채용 정보 로딩 오류:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // 사용자의 관심 공고 가져오기
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      
      try {
        const favorites = await getFavoriteJobs(user.uid);
        const favoriteIds = new Set(favorites.map(fav => fav.jobId));
        setFavoriteJobIds(favoriteIds);
      } catch (error) {
        console.error("관심 공고 로딩 오류:", error);
      }
    };

    if (user) {
      fetchFavorites();
    }
  }, [user]);

  // 관심 태그 기반 필터링 및 정렬
  useEffect(() => {
    let filtered = jobs;

    // 검색어 필터
    if (searchKeyword) {
      filtered = filtered.filter(job =>
        (job.company && job.company.toLowerCase().includes(searchKeyword.toLowerCase())) ||
        (job.position && job.position.toLowerCase().includes(searchKeyword.toLowerCase())) ||
        (job.location && job.location.toLowerCase().includes(searchKeyword.toLowerCase()))
      );
    }

    // 지역 필터
    if (filterLocation) {
      filtered = filtered.filter(job =>
        job.location && job.location.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    // 추천 제외 조건 적용
    if (user && userProfile && userProfile.exclusions) {
      const exclusions = userProfile.exclusions;
      
      if (exclusions.nightShift) {
        filtered = filtered.filter(job => 
          !job.workTime || !(job.workTime.includes("22:00") || job.workTime.includes("23:00") || job.workTime.includes("야간"))
        );
      }
      
      if (exclusions.weekend) {
        filtered = filtered.filter(job => 
          !job.workTime || !(job.workTime.includes("토") || job.workTime.includes("일") || job.workTime.includes("주말"))
        );
      }
      
      if (exclusions.lowSalary) {
        filtered = filtered.filter(job => {
          if (!job.salary) return true;
          const match = job.salary.match(/(\d{1,3}(?:,\d{3})*)/);
          if (!match) return true;
          const amount = parseInt(match[0].replace(/,/g, ''));
          return amount >= 10030; // 2024년 최저임금
        });
      }
    }

    // 관심 태그 기반 추천/일반 분리
    if (user && userProfile && userProfile.interestTags && userProfile.interestTags.length > 0) {
      const recommended: Job[] = [];
      const others: Job[] = [];
      const tags = userProfile.interestTags;
      
      filtered.forEach(job => {
        const jobText = `${job.company || ''} ${job.position || ''} ${job.location || ''}`.toLowerCase();
        const hasMatchingTag = tags.some(tag => 
          jobText.includes(tag.toLowerCase())
        );
        
        if (hasMatchingTag) {
          recommended.push(job);
        } else {
          others.push(job);
        }
      });
      
      setRecommendedJobs(recommended);
      setOtherJobs(others);
    } else {
      setRecommendedJobs([]);
      setOtherJobs(filtered);
    }

    setFilteredJobs(filtered);
    setCurrentPage(1);
  }, [searchKeyword, filterLocation, jobs, user, userProfile]);

  // 하트 버튼 핸들러
  const handleToggleFavorite = async (job: Job) => {
    if (!user) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    // 로딩 중인 항목에 추가
    setLoadingFavorites(prev => new Set(prev).add(job.id));

    try {
      if (favoriteJobIds.has(job.id)) {
        // 관심 해제
        await removeFavoriteJob(user.uid, job.id);
        setFavoriteJobIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(job.id);
          return newSet;
        });
      } else {
        // 관심 등록
        await addFavoriteJob(user.uid, job.id, job);
        setFavoriteJobIds(prev => new Set(prev).add(job.id));
      }
    } catch (error) {
      console.error("관심 공고 토글 오류:", error);
      alert("작업에 실패했습니다. 다시 시도해주세요.");
    } finally {
      // 로딩 완료
      setLoadingFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(job.id);
        return newSet;
      });
    }
  };

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 금액에서 숫자만 추출
  const extractAmount = (salary: string) => {
    if (!salary) return "협의";
    const match = salary.match(/[\d,]+/);
    return match ? match[0] : salary;
  };

  // 렌더링 함수: 공고 카드
  const renderJobCard = (job: Job) => {
    const isFavorite = favoriteJobIds.has(job.id);
    const isLoadingFavorite = loadingFavorites.has(job.id);

    return (
      <div
        key={job.id}
        className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all hover:border-gray-400 flex items-center justify-between group"
      >
        {/* 왼쪽: 제목 및 회사 */}
        <div 
          onClick={() => window.open(job.website, '_blank')}
          className="flex-1 min-w-0 pr-6 cursor-pointer"
        >
          <h3 className="text-base font-medium text-gray-900 mb-1 truncate">
            {job.position || "채용 공고"}
          </h3>
          <p className="text-sm text-gray-600 truncate">{job.company || "회사명"}</p>
        </div>

        {/* 오른쪽: 상세 정보 */}
        <div className="flex items-center gap-6 flex-shrink-0">
          {/* 지역 */}
          <div className="flex items-center gap-2 min-w-[120px]">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">{job.location || "전국"}</span>
          </div>

          {/* 근무시간 */}
          <div className="flex items-center gap-2 min-w-[100px]">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">
              {job.workTime && job.workTime.length > 10 
                ? job.workTime.substring(0, 10) + "..." 
                : job.workTime || "협의"}
            </span>
          </div>

          {/* 급여 */}
          {(() => {
  const salary = job.salary ?? "";

  return (
    <div className="flex flex-col items-end min-w-[100px]">
      <span className="text-xs text-red-600 font-medium">
        {salary.includes("월급") ? "월급"
          : salary.includes("시급") ? "시급"
          : salary.includes("연봉") ? "연봉"
          : salary.includes("일급") ? "일급"
          : "급여"}
      </span>

      <span className="text-base font-bold text-gray-900">
        {extractAmount(salary)}
      </span>
    </div>
  );
})()}

          {/* 마감일 */}
          <div className="text-right min-w-[60px]">
            <span className="text-sm text-gray-500">
              {job.deadline ? (formatDate(job.deadline) || job.deadline) : "상시"}
            </span>
          </div>

          {/* 하트 버튼 */}
          <button
            onClick={() => handleToggleFavorite(job)}
            disabled={isLoadingFavorite}
            className={`p-2 rounded-full transition-all ${
              isFavorite 
                ? "bg-red-50 text-red-600 hover:bg-red-100" 
                : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-600"
            } ${isLoadingFavorite ? "opacity-50 cursor-not-allowed" : ""}`}
            title={isFavorite ? "관심 해제" : "관심 등록"}
          >
            <Heart 
              className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} 
            />
          </button>
        </div>
      </div>
    );
  };

  // 페이지네이션 계산 (추천 + 일반 합쳐서)
  const displayJobs = [...recommendedJobs, ...otherJobs];
  const totalPages = Math.ceil(displayJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentJobs = displayJobs.slice(startIndex, endIndex);

  // 현재 페이지에서 추천과 일반 구분
  const currentRecommended = currentJobs.filter(job => recommendedJobs.includes(job));
  const currentOthers = currentJobs.filter(job => !recommendedJobs.includes(job));

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
            총 <span className="font-semibold text-gray-900">{filteredJobs.length}</span>개의 채용 공고
            {recommendedJobs.length > 0 && (
              <span className="ml-2 text-blue-600">
                (추천 <span className="font-semibold">{recommendedJobs.length}</span>개)
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {/* 검색 및 필터 영역 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 검색바 */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="회사명, 채용제목 검색"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            {/* 지역 필터 */}
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                placeholder="지역 필터 (예: 부산, 서울)"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          {/* 필터 적용 안내 */}
          {user && userProfile?.exclusions && (
            <div className="mt-4 flex flex-wrap gap-2">
              {userProfile.exclusions.nightShift && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  야간 근무 제외
                </span>
              )}
              {userProfile.exclusions.weekend && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  주말 근무 제외
                </span>
              )}
              {userProfile.exclusions.lowSalary && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  최저임금 미달 제외
                </span>
              )}
            </div>
          )}
        </div>

        {/* 로딩 */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
          </div>
        )}

        {/* 채용 공고 리스트 */}
        {!loading && displayJobs.length > 0 && (
          <>
            {/* 추천 섹션 */}
            {currentRecommended.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    맞춤 추천 공고
                  </h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    {recommendedJobs.length}개
                  </span>
                </div>
                <div className="space-y-3 mb-8">
                  {currentRecommended.map(job => renderJobCard(job))}
                </div>
              </div>
            )}

            {/* 전체 목록 섹션 */}
            {currentOthers.length > 0 && (
              <div>
                {currentRecommended.length > 0 && (
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      전체 공고
                    </h2>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                      {otherJobs.length}개
                    </span>
                  </div>
                )}
                <div className="space-y-3">
                  {currentOthers.map(job => renderJobCard(job))}
                </div>
              </div>
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {/* 이전 버튼 */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* 페이지 번호 */}
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-4 py-2 rounded-lg border ${
                      currentPage === page
                        ? "bg-gray-900 text-white border-gray-900"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* 다음 버튼 */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

        {/* 결과 없음 */}
        {!loading && filteredJobs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">검색 결과가 없습니다.</p>
            <p className="text-gray-500 mt-2">다른 검색어나 필터를 사용해보세요.</p>
            <button
              onClick={() => {
                setSearchKeyword("");
                setFilterLocation("");
              }}
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
