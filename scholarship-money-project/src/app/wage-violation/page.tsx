"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ExternalLink, AlertCircle, Shield, AlertTriangle, Phone, FileText, TrendingDown, Users } from "lucide-react";
import { WageViolation } from "@/types/wage-violation";

export default function WageViolationPage() {
  const [violations, setViolations] = useState<WageViolation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadViolations();
  }, []);

  const loadViolations = async () => {
    try {
      const violationsRef = collection(db, "wageViolations");
      const q = query(violationsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as WageViolation[];
      
      setViolations(data);
    } catch (error) {
      console.error("임금체불 데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ko-KR');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow-lg p-8 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-10 h-10 text-white" />
              <h1 className="text-4xl font-bold text-white">임금체불 사업주 명단</h1>
            </div>
            <p className="text-white/90 text-lg mb-6">
              고용노동부가 공개한 임금체불 사업주 명단입니다. 아르바이트 지원 전 반드시 확인하세요!
            </p>
            <a
              href="https://www.moel.go.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors shadow-md"
            >
              고용노동부 바로가기
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 자주 발생하는 임금체불 유형 Top 5 */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingDown className="w-8 h-8 text-red-600" />
            <h2 className="text-3xl font-bold text-gray-900">자주 발생하는 임금체불 유형 Top 5</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 유형 1 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border-l-4 border-red-500">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-600 font-bold text-lg">1</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">최저임금 미달</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                2025년 최저시급 10,030원보다 낮은 급여를 지급하는 경우. 특히 수습기간이라는 명목으로 최저임금에 미치지 못하는 급여를 주는 사례가 많습니다.
              </p>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-xs text-red-800">
                  <strong>실제 사례:</strong> 편의점 알바생 A씨, 시급 9,000원으로 3개월 근무 → 약 62만원 체불
                </p>
              </div>
            </div>

            {/* 유형 2 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border-l-4 border-orange-500">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold text-lg">2</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">주휴수당 미지급</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                주 15시간 이상 근무 시 받을 수 있는 주휴수당을 지급하지 않는 경우. "알바는 주휴수당이 없다"는 거짓말로 속이는 사례가 흔합니다.
              </p>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-xs text-orange-800">
                  <strong>실제 사례:</strong> 카페 알바생 B씨, 주 20시간 근무하며 6개월간 주휴수당 미지급 → 약 104만원 체불
                </p>
              </div>
            </div>

            {/* 유형 3 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border-l-4 border-yellow-500">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-600 font-bold text-lg">3</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">퇴직금 미지급</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                1년 이상 주 15시간 이상 근무한 근로자에게 지급해야 하는 퇴직금을 주지 않는 경우. "알바는 퇴직금 대상이 아니다"라고 잘못 알고 있는 사업주가 많습니다.
              </p>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>실제 사례:</strong> 음식점 알바생 C씨, 1년 3개월 근무 후 퇴직금 없이 퇴사 → 약 230만원 체불
                </p>
              </div>
            </div>

            {/* 유형 4 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border-l-4 border-green-500">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-lg">4</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">야간·연장 수당 누락</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                오후 10시 이후 야간근무나 연장근무 시 받아야 할 가산수당(50%)을 지급하지 않는 경우. 특히 5인 이상 사업장에서 자주 발생합니다.
              </p>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs text-green-800">
                  <strong>실제 사례:</strong> 편의점 알바생 D씨, 야간근무 3개월간 가산수당 미지급 → 약 85만원 체불
                </p>
              </div>
            </div>

            {/* 유형 5 */}
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border-l-4 border-blue-500">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-lg">5</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">근로계약서 없이 일방적 임금 삭감</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                근로계약서를 작성하지 않고 구두로만 약속한 뒤, 나중에 임금을 일방적으로 깎거나 지급하지 않는 경우. 증거가 없어 가장 해결이 어렵습니다.
              </p>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>실제 사례:</strong> 배달 알바생 E씨, 계약서 없이 3개월 근무 후 임금 50% 삭감 통보 → 약 180만원 피해
                </p>
              </div>
            </div>

            {/* 추가 정보 카드 */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 shadow-md text-white">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8" />
                <h3 className="text-lg font-bold">2024년 통계</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-purple-100 mb-1">전체 임금체불 건수</p>
                  <p className="text-2xl font-bold">112,473건</p>
                </div>
                <div>
                  <p className="text-sm text-purple-100 mb-1">20대 피해자 비율</p>
                  <p className="text-2xl font-bold">약 35%</p>
                </div>
                <div>
                  <p className="text-sm text-purple-100 mb-1">평균 체불 금액</p>
                  <p className="text-2xl font-bold">약 418만원</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 피해 시 행동 가이드 */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">임금체불 피해 시 행동 가이드</h2>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* STEP 1 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">증거 자료 확보</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>근로계약서 (없으면 카톡, 문자 대화 내역)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>출퇴근 기록 (사진, 메모 등)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>급여 입금 내역 (통장 사본)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">✓</span>
                    <span>구인 공고 화면 캡처</span>
                  </li>
                </ul>
              </div>

              {/* STEP 2 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">사업주와 대화 시도</h3>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>문자나 카톡으로 임금 지급 요청 (증거 남기기)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>구체적인 날짜와 금액 명시</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>감정적 대응 자제, 사실만 전달</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>지급 기한 합의 (문서로 남기기)</span>
                  </li>
                </ul>
              </div>

              {/* STEP 3 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">고용노동부 신고</h3>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p className="font-semibold text-gray-900">📞 고용노동부 상담센터</p>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-lg font-bold text-orange-600">☎ 1350</p>
                    <p className="text-sm text-gray-600 mt-1">평일 09:00~18:00 운영</p>
                  </div>
                  <p className="text-sm">
                    온라인 신고: 고용노동부 홈페이지 &gt; 민원마당 &gt; 임금체불 진정
                  </p>
                </div>
              </div>

              {/* STEP 4 */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-xl">4</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">법률 지원 받기</h3>
                </div>
                <div className="space-y-3 text-gray-700">
                  <p className="font-semibold text-gray-900">⚖️ 대한법률구조공단</p>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-lg font-bold text-purple-600">☎ 132</p>
                    <p className="text-sm text-gray-600 mt-1">무료 법률 상담 및 소송 지원</p>
                  </div>
                  <p className="text-sm">
                    체불확인서 발급 후 무료 소송 지원 가능
                  </p>
                </div>
              </div>
            </div>

            {/* 주의사항 */}
            <div className="mt-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-lg font-bold text-yellow-900 mb-2">⚠️ 중요 주의사항</h4>
                  <ul className="space-y-2 text-yellow-800 text-sm">
                    <li>• 임금체불 신고는 <strong>퇴사 후 14일 이내</strong>에 하는 것이 좋습니다.</li>
                    <li>• 증거 자료가 많을수록 유리하니 평소에 기록을 잘 남겨두세요.</li>
                    <li>• 사업주가 협박하거나 폭력을 사용하면 즉시 <strong>112(경찰)</strong>에 신고하세요.</li>
                    <li>• 소액체불(1,000만원 미만)은 근로복지공단에서 지원받을 수 있습니다.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 체불 사업주 리스트 */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-gray-900" />
              <h2 className="text-3xl font-bold text-gray-900">공개된 체불 사업주 명단</h2>
            </div>
            <span className="text-sm text-gray-600">총 {violations.length}건</span>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : violations.length === 0 ? (
              <div className="text-center py-20">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">등록된 임금체불 사업주가 없습니다.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">사업주명</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">상호명</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">사업장 소재지</th>
                      <th className="px-6 py-4 text-right text-sm font-bold text-gray-900">체불액</th>
                      <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">근로자 수</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {violations.map((violation: any) => (
                      <tr key={violation.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900">{violation.ownerName || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{violation.businessName || '-'}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{violation.location || '-'}</td>
                        <td className="px-6 py-4 text-sm text-right font-semibold text-red-600">
                          {violation.amount ? formatAmount(violation.amount) : '0'}원
                        </td>
                        <td className="px-6 py-4 text-sm text-center text-gray-700">
                          {violation.workerCount || 0}명
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
