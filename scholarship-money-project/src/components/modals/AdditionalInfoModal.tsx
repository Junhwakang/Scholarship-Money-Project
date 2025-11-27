"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { X, Sparkles } from "lucide-react";

export default function AdditionalInfoModal() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 로그인한 사용자가 추가 정보를 입력하지 않은 경우 모달 표시
    if (user && userProfile && !userProfile.hasAdditionalInfo) {
      // 로그인 후 3초 뒤에 모달 표시
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [user, userProfile]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleGoToAdditionalInfo = () => {
    setIsOpen(false);
    router.push('/additional-info');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 배경 오버레이 */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={handleClose}
      />

      {/* 모달 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 닫기 버튼 */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* 아이콘 */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* 제목 */}
          <h2 className="text-2xl font-light text-gray-900 text-center mb-3">
            AI 맞춤 추천 받기
          </h2>

          {/* 설명 */}
          <p className="text-gray-600 text-center mb-8 leading-relaxed">
            추가 정보를 입력하고<br />
            <strong className="text-gray-900">장학금/채용정보</strong>를 AI에게 추천받아보세요!
          </p>

          {/* 버튼 */}
          <div className="space-y-3">
            <button
              onClick={handleGoToAdditionalInfo}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
            >
              추가 정보 입력하기
            </button>
            
            <button
              onClick={handleClose}
              className="w-full py-3 text-gray-600 hover:text-gray-900 transition-colors text-sm"
            >
              나중에 하기
            </button>
          </div>

          {/* 혜택 안내 */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              💡 맞춤형 장학금 및 채용정보로 더 나은 기회를 찾아보세요
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
