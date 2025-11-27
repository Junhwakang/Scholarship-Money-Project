"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { User, Mail, Phone, Calendar, CheckCircle, XCircle, Sparkles } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, userProfile, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-24 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            마이페이지
          </h1>
          <p className="text-gray-600 text-lg">
            내 정보를 확인하고 관리하세요
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-8">
        {/* 기본 정보 */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-light text-gray-900 mb-6">기본 정보</h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">이름</p>
                <p className="text-gray-900">{userProfile.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">이메일</p>
                <p className="text-gray-900">{userProfile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">전화번호</p>
                <p className="text-gray-900">{userProfile.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">가입일</p>
                <p className="text-gray-900">
                  {new Date(userProfile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {user.emailVerified ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">이메일 인증</p>
                    <p className="text-green-600 font-medium">인증 완료</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-500">이메일 인증</p>
                    <p className="text-red-600 font-medium">인증 필요</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* AI 추천 정보 */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-8">
          <div className="flex items-start gap-4 mb-6">
            <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-2">AI 맞춤 추천</h2>
              <p className="text-gray-600">
                추가 정보를 입력하여 맞춤형 장학금 및 채용정보를 받아보세요
              </p>
            </div>
          </div>

          {userProfile.hasAdditionalInfo ? (
            <div className="space-y-4">
              {userProfile.scholarshipInfo && (
                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-3">장학금 정보</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">대학교</p>
                      <p className="text-gray-900">{userProfile.scholarshipInfo.university}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">전공</p>
                      <p className="text-gray-900">{userProfile.scholarshipInfo.major}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">학년</p>
                      <p className="text-gray-900">{userProfile.scholarshipInfo.grade}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">학점</p>
                      <p className="text-gray-900">{userProfile.scholarshipInfo.gpa}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/ai-recommend?type=scholarship')}
                    className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    장학금 AI 추천 받기
                  </button>
                </div>
              )}

              {userProfile.jobInfo && (
                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-3">채용 정보</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">희망 분야</p>
                      <p className="text-gray-900">{userProfile.jobInfo.desiredField}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">희망 직무</p>
                      <p className="text-gray-900">{userProfile.jobInfo.desiredPosition}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">경력</p>
                      <p className="text-gray-900">{userProfile.jobInfo.experience}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">희망 지역</p>
                      <p className="text-gray-900">{userProfile.jobInfo.region}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/ai-recommend?type=job')}
                    className="mt-4 w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    채용 AI 추천 받기
                  </button>
                </div>
              )}

              <button
                onClick={() => router.push('/additional-info')}
                className="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                추가 정보 수정하기
              </button>
            </div>
          ) : (
            <button
              onClick={() => router.push('/additional-info')}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
            >
              추가 정보 입력하고 AI 추천 받기
            </button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
