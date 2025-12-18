"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Shield, AlertTriangle, CheckCircle, Phone, MessageSquare, TrendingUp, MapPin, DollarSign } from "lucide-react";

export default function JobScamPreventionPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* 헤더 */}
      <div className="pt-24 pb-12 bg-gradient-to-b from-yellow-50 to-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-yellow-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              알고 피하고 지키자!
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            금융감독원 • 법금융 X 알장딸깍센
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        
        {/* 자주 발생하는 아르바이트 사기 유형 Top 5 */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-8 h-8 text-red-600" />
            <h2 className="text-3xl font-bold text-gray-900">자주 발생하는 아르바이트 사기 유형 Top 5</h2>
          </div>

          <div className="space-y-6">
            {/* 유형 1: 고액 해외 알바 사기 */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-red-900 mb-2">🌏 고액 해외 알바 사기</h3>
                  <p className="text-red-800 font-semibold mb-3">
                    "비자 없이 리조트 알바 가능", "한 달에 1,000만 원 가능"
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 mb-4">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  수법
                </h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>SNS나 메신저로 '비자 없이 고수익' 알바 제안</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>출국 후 공항에서 여권과 휴대전화 강제 압수</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>범죄 조직 본거지로 강제 이송 및 감금</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>보이스피싱, 마약 운반, 유흥업소 강제 노동</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg mb-4">
                <p className="text-sm text-red-900">
                  <strong>📊 2024년 통계:</strong> 캄보디아 감금 피해 신고 330건 (2023년 17건 대비 19배 증가)
                </p>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  예방법
                </h4>
                <ul className="space-y-1 text-sm text-yellow-900">
                  <li>✓ 비자 없이 일할 수 있다는 말은 100% 사기</li>
                  <li>✓ 고액 급여를 보장하는 해외 알바는 의심</li>
                  <li>✓ 코트라 해외취업 헬프데스크에서 기업정보 확인 (1600-7119)</li>
                  <li>✓ 계약 내용이 불분명하면 절대 출국하지 않기</li>
                </ul>
              </div>
            </div>

            {/* 유형 2: 부업·미션 알바 사기 */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border-2 border-orange-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-orange-900 mb-2">💰 부업·미션 알바 사기</h3>
                  <p className="text-orange-800 font-semibold mb-3">
                    "앱 다운로드만 하면 수익", "팀 미션 완료 시 보상"
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 mb-4">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  수법
                </h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>틱톡, 인스타 광고로 "재택 부업" 유혹</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>특정 앱 설치 후 단체 채팅방 초대</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>"팀 미션"이라는 명목으로 포인트 충전 요구</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>충전 후 수익 지급 약속 → 먹튀</span>
                  </li>
                </ul>
              </div>

              <div className="bg-orange-100 border-l-4 border-orange-500 p-4 rounded-lg mb-4">
                <p className="text-sm text-orange-900">
                  <strong>📊 실제 사례:</strong> 대학생 A씨, "투자 미션" 명목으로 4회 충전 → 570만원 피해
                </p>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  예방법
                </h4>
                <ul className="space-y-1 text-sm text-yellow-900">
                  <li>✓ 선입금·포인트 충전 요구 시 100% 사기</li>
                  <li>✓ "팀 미션", "투자 활동" 등의 용어 사용 시 의심</li>
                  <li>✓ 알 수 없는 앱 설치 절대 금지</li>
                  <li>✓ 가입 시 특정 코드 입력 요구 시 거부</li>
                </ul>
              </div>
            </div>

            {/* 유형 3: 대포통장·명의 도용 알바 */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">🏦 대포통장·명의 도용 알바</h3>
                  <p className="text-blue-800 font-semibold mb-3">
                    "통장만 빌려주면 일당 50만원", "명의만 빌려주세요"
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 mb-4">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                  수법
                </h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>"급여 계좌 필요하다"며 통장과 체크카드 요구</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>"OTP 인증만 해주면 일당 지급" 제안</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>보이스피싱 범죄에 본인 통장이 사용됨</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>본인이 공범으로 처벌받거나 금융거래 정지</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-900">
                  <strong>⚠️ 처벌:</strong> 대포통장 양도·대여 시 징역 3년 이하 또는 2천만원 이하 벌금 (전자금융거래법 위반)
                </p>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  예방법
                </h4>
                <ul className="space-y-1 text-sm text-yellow-900">
                  <li>✓ 통장·체크카드 대여는 범죄 (절대 금지)</li>
                  <li>✓ 본인 명의 휴대폰 개통 요구 시 거부</li>
                  <li>✓ OTP 인증 대행은 금융사기 공범이 될 수 있음</li>
                  <li>✓ 의심되면 금융감독원 (1332) 신고</li>
                </ul>
              </div>
            </div>

            {/* 유형 4: 선입금 요구 사기 */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-2xl">4</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-green-900 mb-2">💳 선입금·교육비 요구 사기</h3>
                  <p className="text-green-800 font-semibold mb-3">
                    "교육비 먼저 입금", "유니폼·장비 구매 필수"
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 mb-4">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-green-600" />
                  수법
                </h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>"교육 후 취업 보장" 명목으로 교육비 선청구</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>"유니폼·장비 구매 필수" 라며 수십만원 요구</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>"보증금 입금 후 첫 급여에서 환급" 약속</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span>입금 후 연락 두절 또는 환급 거부</span>
                  </li>
                </ul>
              </div>

              <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded-lg mb-4">
                <p className="text-sm text-green-900">
                  <strong>📊 실제 사례:</strong> 대학생 B씨, "교육비 30만원" 입금 후 채용 취소 통보 → 환불 거부
                </p>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  예방법
                </h4>
                <ul className="space-y-1 text-sm text-yellow-900">
                  <li>✓ 근로 전 금전 요구는 99% 사기</li>
                  <li>✓ 교육비는 회사가 부담하는 것이 정상</li>
                  <li>✓ 유니폼은 회사 제공이 원칙</li>
                  <li>✓ 보증금 요구 시 고용노동부 (1350) 신고</li>
                </ul>
              </div>
            </div>

            {/* 유형 5: 개인정보 탈취 사기 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-2xl">5</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-purple-900 mb-2">🔐 개인정보 탈취 사기</h3>
                  <p className="text-purple-800 font-semibold mb-3">
                    "이력서 접수 위해 정보 입력", "신원조회 필요"
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 mb-4">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-purple-600" />
                  수법
                </h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>가짜 구인 공고로 이력서 수집</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>"신원조회·범죄경력조회" 명목으로 주민번호 요구</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>통장 사본, 신분증 사본 요청</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 mt-1">•</span>
                    <span>수집한 정보로 대출 사기·명의 도용</span>
                  </li>
                </ul>
              </div>

              <div className="bg-purple-100 border-l-4 border-purple-500 p-4 rounded-lg mb-4">
                <p className="text-sm text-purple-900">
                  <strong>📊 2024년 통계:</strong> 인터넷 사기 중 '부업·아르바이트 사기' 67건 (전년 대비 81% 증가)
                </p>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                <h4 className="font-bold text-yellow-900 mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  예방법
                </h4>
                <ul className="space-y-1 text-sm text-yellow-900">
                  <li>✓ 채용 전 주민번호 전체 제공은 위험</li>
                  <li>✓ 통장·신분증 사본은 계약 체결 후 제공</li>
                  <li>✓ 출처 불명 링크 클릭 금지</li>
                  <li>✓ 개인정보 유출 시 개인정보침해 신고센터 (118) 신고</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 기존 취업사기란 섹션 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">취업사기란?</h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            일자리를 구하기 위해 지원자를 물색하여 구직자의 일반적 상식을 이용한 사기로, 구직자에게 
            사전에 대출 받게, 취업 후 알선 받을 곳에 지급되도록 금융 위장 유도 등의 수법으로 인한 수 있음
          </p>

          {/* 3가지 주요 유형 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-4">개인정보 유형</h3>
              <p className="text-blue-800 text-sm mb-3">개인정보 수집하여 판매 구인광고로</p>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• 허수 인력 회원 선발</li>
                <li>• 개인정보를 외부에 판매</li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
              <h3 className="text-xl font-bold text-red-900 mb-4">금전 탈취유형</h3>
              <p className="text-red-800 text-sm mb-3">금전요구, 보증금, 등록비 명목,<br />복리 비 등 강요함으로 중요</p>
              <ul className="text-sm text-red-700 space-y-2">
                <li>• 선금 지원 요구</li>
                <li>• 교육비 명목 탈취</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
              <h3 className="text-xl font-bold text-green-900 mb-4">기타 위험사기 유형</h3>
              <p className="text-green-800 text-sm mb-3">다단계 경영, 선제비 요구 등</p>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• 불법 다단계 유인</li>
                <li>• 명의 도용</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 신고 및 상담 안내 */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Phone className="w-8 h-8" />
            사기 피해 시 즉시 신고하세요!
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/20 backdrop-blur rounded-xl p-5">
              <p className="text-sm text-blue-100 mb-2">경찰청</p>
              <p className="text-3xl font-bold mb-1">☎ 112</p>
              <p className="text-sm text-blue-100">24시간 신고 가능</p>
            </div>

            <div className="bg-white/20 backdrop-blur rounded-xl p-5">
              <p className="text-sm text-blue-100 mb-2">금융감독원</p>
              <p className="text-3xl font-bold mb-1">☎ 1332</p>
              <p className="text-sm text-blue-100">금융사기 상담</p>
            </div>

            <div className="bg-white/20 backdrop-blur rounded-xl p-5">
              <p className="text-sm text-blue-100 mb-2">고용노동부</p>
              <p className="text-3xl font-bold mb-1">☎ 1350</p>
              <p className="text-sm text-blue-100">근로 관련 상담</p>
            </div>
          </div>

          <div className="mt-6 bg-yellow-400 text-yellow-900 rounded-lg p-4">
            <p className="font-bold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              사기 피해는 초기 대응이 중요합니다!
            </p>
            <p className="text-sm mt-2">
              피해 발생 즉시 신고하면 범인 검거 및 피해 회복 가능성이 높아집니다.
            </p>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}
