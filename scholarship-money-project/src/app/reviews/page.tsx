"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Star, Plus, X } from "lucide-react";

interface Review {
  id: string;
  jobType: string;
  content: string;
  rating: number;
  date: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showModal, setShowModal] = useState(false);
  
  // 폼 상태
  const [jobType, setJobType] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // 로컬스토리지에서 후기 불러오기
  useEffect(() => {
    const savedReviews = localStorage.getItem('reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  }, []);

  // 후기 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!jobType || !content || rating === 0) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if (content.length < 10) {
      alert("후기 내용은 최소 10자 이상 작성해주세요.");
      return;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      jobType,
      content,
      rating,
      date: new Date().toLocaleDateString('ko-KR'),
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    
    // 로컬스토리지에 저장
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    
    // 폼 초기화
    setJobType("");
    setContent("");
    setRating(0);
    setShowModal(false);
    
    // storage 이벤트 트리거 (같은 탭에서도 업데이트하기 위해)
    window.dispatchEvent(new Event('storage'));
    
    alert("후기가 등록되었습니다!");
  };

  // 모달 닫기
  const closeModal = () => {
    setShowModal(false);
    setJobType("");
    setContent("");
    setRating(0);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* 헤더 */}
      <div className="pt-24 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
                후기
              </h1>
              <p className="text-gray-600 text-lg">
                여러분의 소중한 경험을 공유해주세요
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>후기 작성</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {/* 후기 목록 */}
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {review.jobType}
                      </h3>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {review.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-4">아직 등록된 후기가 없습니다.</p>
            <p className="text-gray-500 mb-8">첫 번째 후기를 작성해보세요!</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>후기 작성하기</span>
            </button>
          </div>
        )}
      </div>

      {/* 후기 작성 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-light text-gray-900">후기 작성</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* 직종 입력 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  직종 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  placeholder="예: 카페 바리스타, 편의점 알바, 사무직 인턴"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>

              {/* 별점 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  별점 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-gray-600 self-center">
                      {rating}점
                    </span>
                  )}
                </div>
              </div>

              {/* 후기 내용 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  후기 내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="근무 환경, 업무 내용, 급여, 복지 등 자유롭게 작성해주세요."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  최소 10자 이상 작성해주세요. (현재 {content.length}자)
                </p>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
