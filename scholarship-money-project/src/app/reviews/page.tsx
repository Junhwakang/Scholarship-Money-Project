"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Star, Briefcase, MapPin, Calendar, TrendingUp, Award } from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Review } from "@/types/review";

export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'job' | 'company' | 'intern'>('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const reviewsRef = collection(db, 'reviews');
      const q = query(reviewsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      
      setReviews(reviewsData);
    } catch (error) {
      console.error('후기 로딩 에러:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    return review.type === filter;
  });

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'job': return '알바';
      case 'company': return '정규직';
      case 'intern': return '인턴';
      default: return type;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch(type) {
      case 'job': return 'bg-blue-100 text-blue-700';
      case 'company': return 'bg-purple-100 text-purple-700';
      case 'intern': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleCardClick = (review: Review) => {
    setSelectedReview(review);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* 헤더 */}
      <div className="pt-24 pb-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            알바 & 취업 후기
          </h1>
          <p className="text-gray-600 text-lg">
            실제 경험자들의 생생한 후기를 확인하세요
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        {/* 필터 */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
              filter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilter('job')}
            className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
              filter === 'job'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            알바
          </button>
          <button
            onClick={() => setFilter('company')}
            className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
              filter === 'company'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            정규직
          </button>
          <button
            onClick={() => setFilter('intern')}
            className={`px-6 py-2.5 rounded-full font-medium whitespace-nowrap transition-all ${
              filter === 'intern'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            인턴
          </button>
        </div>

        {/* 로딩 */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-500 mt-4">후기를 불러오는 중...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">후기가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                onClick={() => handleCardClick(review)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
              >
                {/* 카드 헤더 */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadgeColor(review.type)}`}>
                      {getTypeLabel(review.type)}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-gray-900">
                        {review.ratings.overall.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {review.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="font-medium">{review.company}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{review.location}</span>
                  </div>
                </div>

                {/* 카드 본문 */}
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{review.workPeriod}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="w-4 h-4" />
                      <span>{review.salary}</span>
                    </div>
                  </div>

                  {/* 평점 그리드 */}
                  <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">급여</div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.ratings.salary
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">워라밸</div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.ratings.workLifeBalance
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">분위기</div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.ratings.culture
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">성장</div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.ratings.growth
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 태그 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {review.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* 간단 후기 */}
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {review.overallReview}
                  </p>

                  {/* 하단 정보 */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>by {review.author}</span>
                    <div className="flex items-center gap-3">
                      <span>👁 {review.viewCount}</span>
                      <span>❤️ {review.likeCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 자세히 보기 모달 */}
      {showModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* 모달 헤더 */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadgeColor(selectedReview.type)}`}>
                    {getTypeLabel(selectedReview.type)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-bold text-gray-900">
                      {selectedReview.ratings.overall.toFixed(1)}
                    </span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedReview.title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span className="font-medium">{selectedReview.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedReview.location}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 모달 본문 */}
            <div className="p-6 space-y-6">
              {/* 근무 정보 */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4">근무 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">근무 기간</p>
                      <p className="text-sm font-medium text-gray-900">{selectedReview.workPeriod}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">급여</p>
                      <p className="text-sm font-medium text-gray-900">{selectedReview.salary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">직무</p>
                      <p className="text-sm font-medium text-gray-900">{selectedReview.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">근무 형태</p>
                      <p className="text-sm font-medium text-gray-900">{selectedReview.workType}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 상세 평점 */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">상세 평점</h3>
                <div className="space-y-3">
                  {[
                    { label: '급여 만족도', value: selectedReview.ratings.salary },
                    { label: '워라밸', value: selectedReview.ratings.workLifeBalance },
                    { label: '조직 문화', value: selectedReview.ratings.culture },
                    { label: '성장 가능성', value: selectedReview.ratings.growth },
                    { label: '복지', value: selectedReview.ratings.welfare },
                  ].map((rating, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">{rating.label}</span>
                        <span className="text-sm font-bold text-gray-900">{rating.value.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating.value
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 종합 후기 */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">종합 후기</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedReview.overallReview}</p>
              </div>

              {/* 장점 */}
              {selectedReview.pros && selectedReview.pros.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">👍 장점</h3>
                  <ul className="space-y-2">
                    {selectedReview.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 단점 */}
              {selectedReview.cons && selectedReview.cons.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">👎 단점</h3>
                  <ul className="space-y-2">
                    {selectedReview.cons.map((con, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 주요 업무 */}
              {selectedReview.mainTasks && selectedReview.mainTasks.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">📋 주요 업무</h3>
                  <ul className="space-y-2">
                    {selectedReview.mainTasks.map((task, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 팁 */}
              {selectedReview.tips && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">💡 지원자를 위한 팁</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedReview.tips}</p>
                </div>
              )}

              {/* 면접 팁 */}
              {selectedReview.interviewTips && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">🎯 면접 팁</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedReview.interviewTips}</p>
                </div>
              )}

              {/* 추천 대상 */}
              {((selectedReview.recommendFor && selectedReview.recommendFor.length > 0) || 
                (selectedReview.notRecommendFor && selectedReview.notRecommendFor.length > 0)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedReview.recommendFor && selectedReview.recommendFor.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <h4 className="font-bold text-green-900 mb-2">✅ 추천 대상</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedReview.recommendFor.map((rec, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedReview.notRecommendFor && selectedReview.notRecommendFor.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <h4 className="font-bold text-red-900 mb-2">❌ 비추천 대상</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedReview.notRecommendFor.map((rec, idx) => (
                          <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 태그 */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">🏷️ 태그</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedReview.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 작성자 정보 */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">작성자: {selectedReview.author}</span>
                    {selectedReview.isVerified && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">인증</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span>👁 {selectedReview.viewCount}</span>
                    <span>❤️ {selectedReview.likeCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 모달 푸터 */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-bold"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
