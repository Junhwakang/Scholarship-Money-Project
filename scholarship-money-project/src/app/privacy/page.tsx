"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-24 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-gray-900" />
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
              개인정보처리방침
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            본 서비스는 「개인정보 보호법」 등 관련 법령을 준수하며, 이용자의 개인정보를 보호하기 위해 최선을 다하고 있습니다.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. 수집하는 개인정보 항목</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>필수항목: 이름, 이메일 주소</li>
              <li>선택항목: 관심 분야, 서비스 이용 기록</li>
              <li>자동 수집 정보: 접속 IP 주소, 쿠키, 로그인 이용 기록</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. 개인정보의 수집 및 이용 목적</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>회원 식별 및 서비스 제공</li>
              <li>맞춤형 정보(장학금/채용 정보 등) 제공</li>
              <li>서비스 개선 및 통계 분석</li>
              <li>문의 및 민원 처리</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. 개인정보의 보유 및 이용 기간</h2>
            <div className="space-y-2 text-gray-700">
              <p>개인정보는 수집·이용 목적이 달성된 후 지체 없이 파기합니다.</p>
              <p>단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. 개인정보의 제3자 제공</h2>
            <div className="space-y-2 text-gray-700">
              <p>원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.</p>
              <p>다만, 법령에 의해 요구되는 경우 등 예외적인 상황에서는 제공될 수 있습니다.</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. 개인정보 처리의 위탁</h2>
            <p className="text-gray-700">
              서비스 향상을 위해 업무 일부를 외부에 위탁할 수 있으며, 이 경우 관련 법령을 준수합니다.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. 이용자의 권리</h2>
            <p className="text-gray-700 mb-2">이용자는 언제든지 개인정보를 열람, 수정, 삭제를 요청할 수 있습니다.</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>개인정보 열람 요청</li>
              <li>개인정보 정정 요청</li>
              <li>개인정보 삭제 요청</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. 개인정보 보호책임자</h2>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>담당자: 관리자</li>
              <li>문의: 이메일을 통한 연락</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. 개인정보처리방침 변경</h2>
            <p className="text-gray-700">
              본 방침은 법령 또는 서비스 변경에 따라 수정될 수 있으며, 변경 시 웹사이트를 통해 공지합니다.
            </p>
          </section>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              시행일자: 2025년 12월 10일
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
