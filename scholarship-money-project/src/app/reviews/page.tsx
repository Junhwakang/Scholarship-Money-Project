"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Star, Plus, X, Lock } from "lucide-react";

interface Review {
  id: string;
  userId: string;
  userName: string;
  jobType: string;
  content: string;
  rating: number;
  date: string;
}

export default function ReviewsPage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showModal, setShowModal] = useState(false);
  
  // 폼 상태
  const [jobType, setJobType] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  // 로컬스토리지에서 후기 불러오기
  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = () => {
    const savedReviews = localStorage.getItem('reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
  };

  // 후기 작성 버튼 클릭
  const handleWriteReviewClick = () => {
    if (!user) {
      // 로그인 안 되어 있으면 로그인 페이지로
      if (confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")) {
        router.push('/login');
      }
      return;
    }

    // 이메일 인증 체크
    if (!user.emailVerified) {
      alert("이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.");
      return;
    }

    setShowModal(true);
  };

  // 후기 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !userProfile) {
      alert("로그인이 필요합니다.");
      return;
    }
    
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
      userId: user.uid,
      userName: userProfile.name,
      jobType,
      content,
      rating,
      date: new Date().toISOString(),
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    
    // 로컬스토리지에 저장
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    
    // storage 이벤트 발생 (다른 컴포넌트에서 감지)
    window.dispatchEvent(new Event('storage'));
    
    // 폼 초기화
    setJobType("");
    setContent("");
    setRating(0);
    setShowModal(false);
  };

  // 후기 삭제
  const handleDelete = (id: string, reviewUserId: string) => {
    // 본인이 작성한 후기만 삭제 가능
    if (user?.uid !== reviewUserId) {
      alert("본인이 작성한 후기만 삭제할 수 있습니다.");
      return;
    }

    if (confirm("정말 삭제하시겠습니까?")) {
      const updatedReviews = reviews.filter(review => review.id !== id);
      setReviews(updatedReviews);
      localStorage.setItem('reviews', JSON.stringify(updatedReviews));
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* 헤더 */}
      <div className="pt-24 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
                후기
              </h1>
              <p className="text-gray-600 text-lg">
                다른 사용자들의 경험을 확인하세요
              </p>
            </div>
            
            <button
              onClick={handleWriteReviewClick}
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>후기 작성</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        {/* 모바일 후기 작성 버튼 */}
        <button
          onClick={handleWriteReviewClick}
          className="md:hidden w-full mb-6 flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>후기 작성</span>
        </button>

        {/* 로그인 안내 배너 */}
        {!user && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6 flex items-start gap-4">
            <Lock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-1">
                로그인이 필요합니다
              </h3>
              <p className="text-blue-700 text-sm mb-3">
                후기를 작성하려면 로그인이 필요합니다.
              </p>
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                로그인하기
              </button>
            </div>
          </div>
        )}

        {/* 후기 목록 */}
        {reviews.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">아직 작성된 후기가 없습니다.</p>
            <p className="text-gray-400 mt-2">첫 번째 후기를 작성해보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {review.jobType}
                    </span>
                  </div>
                  
                  {/* 본인 후기면 삭제 버튼 표시 */}
                  {user?.uid === review.userId && (
                    <button
                      onClick={() => handleDelete(review.id, review.userId)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <p className="text-gray-700 mb-4 line-clamp-4 min-h-[96px]">
                  {review.content}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <span>{review.userName}</span>
                  <span>{new Date(review.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 후기 작성 모달 */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowModal(false)}
          />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light text-gray-900">후기 작성</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    직종 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    placeholder="예: 카페 아르바이트"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    평점 <span className="text-red-500">*</span>
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
                          className={`w-10 h-10 transition-colors ${
                            star <= (hoverRating || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    후기 내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    placeholder="경험을 자세히 작성해주세요 (최소 10자)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    {content.length}자
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    작성 완료
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
