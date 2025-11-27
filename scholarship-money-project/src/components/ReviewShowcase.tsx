"use client";

import { useState, useEffect } from "react";
import { Star, Quote, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Review {
  id: string;
  jobType: string;
  content: string;
  rating: number;
  date: string;
}

export default function ReviewShowcase() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // 로컬스토리지에서 후기 불러오기
    const savedReviews = localStorage.getItem('reviews');
    if (savedReviews) {
      const parsedReviews = JSON.parse(savedReviews);
      setReviews(parsedReviews.slice(0, 3)); // 최신 3개만
    }
  }, []);

  // 주기적으로 후기 업데이트 확인
  useEffect(() => {
    const handleStorageChange = () => {
      const savedReviews = localStorage.getItem('reviews');
      if (savedReviews) {
        const parsedReviews = JSON.parse(savedReviews);
        setReviews(parsedReviews.slice(0, 3));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // 컴포넌트가 포커스될 때도 업데이트
    window.addEventListener('focus', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  return (
    <div className="py-24 bg-gray-900" id="reviews">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-12">
          <div className="text-center md:text-left">
            <div className="text-gray-400 text-xs tracking-[0.2em] mb-3">REAL EXPERIENCES</div>
            <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight">실제 경험담</h2>
          </div>
          <Link 
            href="/reviews" 
            className="hidden md:inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white hover:gap-4 transition-all"
          >
            <span>더 많은 후기 보기</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-neutral-800 p-8 hover:bg-neutral-750 transition-colors">
                <Quote className="w-8 h-8 text-gray-600 mb-6" />
                
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < review.rating 
                          ? 'text-yellow-500 fill-yellow-500' 
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-300 mb-8 leading-relaxed line-clamp-4">
                  {review.content}
                </p>

                <div className="border-t border-gray-700 pt-6">
                  <div className="text-white text-sm font-light mb-1">
                    {review.jobType}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {review.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-6">아직 등록된 후기가 없습니다.</p>
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span>첫 번째 후기 작성하기</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}

        {reviews.length > 0 && (
          <div className="mt-12 text-center md:hidden">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <span>더 많은 후기 보기</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
