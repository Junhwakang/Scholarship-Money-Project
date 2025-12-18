"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { DollarSign, Clock, TrendingUp, HelpCircle, AlertCircle, Calculator, CheckCircle, XCircle, RefreshCw } from "lucide-react";

export default function MinimumWagePage() {
  // 계산기 상태
  const [workHoursPerDay, setWorkHoursPerDay] = useState(8);
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState(5);
  const [includeHoliday, setIncludeHoliday] = useState(true);
  const [hourlyWage, setHourlyWage] = useState(10030);

  const MINIMUM_WAGE = 10030;

  // 계산
  const weeklyHours = workHoursPerDay * workDaysPerWeek;
  const holidayHours = includeHoliday && weeklyHours >= 15 ? 8 : 0;
  const totalWeeklyHours = weeklyHours + holidayHours;
  const monthlyHours = Math.round((totalWeeklyHours / 7) * 365 / 12);
  const expectedMonthlySalary = Math.round(hourlyWage * monthlyHours);
  const minimumMonthlySalary = Math.round(MINIMUM_WAGE * monthlyHours);
  const isMinimumWageOk = hourlyWage >= MINIMUM_WAGE;
  const shortfall = isMinimumWageOk ? 0 : minimumMonthlySalary - expectedMonthlySalary;

  const resetCalculator = () => {
    setWorkHoursPerDay(8);
    setWorkDaysPerWeek(5);
    setIncludeHoliday(true);
    setHourlyWage(10030);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* 헤더 */}
      <div className="pt-24 pb-12 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            2025년도<br />
            <span className="text-green-600">최저임금</span> 안내
          </h1>
          <div className="flex items-baseline gap-3">
            <span className="text-6xl md:text-7xl font-bold text-green-600">10,030</span>
            <span className="text-3xl text-gray-600">원</span>
          </div>
          <p className="text-lg text-gray-600 mt-6 leading-relaxed">
            2025년 법정 최저임금액이 시급 10,030원으로 확정됩니다.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        
        {/* 💰 최저임금 계산기 (새로 추가!) */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">최저임금 계산기</h2>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* 왼쪽: 입력 */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    ⏰ 하루 근무 시간
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={workHoursPerDay}
                    onChange={(e) => setWorkHoursPerDay(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-600 mt-1">하루에 몇 시간 일하나요?</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    📅 주 근무 일수
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="7"
                    value={workDaysPerWeek}
                    onChange={(e) => setWorkDaysPerWeek(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-600 mt-1">일주일에 며칠 일하나요?</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    💵 시급
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={hourlyWage}
                    onChange={(e) => setHourlyWage(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg text-lg font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-600 mt-1">받기로 한 시급은 얼마인가요?</p>
                </div>

                <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeHoliday}
                      onChange={(e) => setIncludeHoliday(e.target.checked)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div>
                      <p className="font-bold text-gray-900">주휴수당 포함</p>
                      <p className="text-xs text-gray-600">주 15시간 이상 근무 시 자동 적용</p>
                    </div>
                  </label>
                </div>

                <button
                  onClick={resetCalculator}
                  className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 font-bold"
                >
                  <RefreshCw className="w-5 h-5" />
                  초기화
                </button>
              </div>

              {/* 오른쪽: 결과 */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-sm font-bold text-gray-600 mb-2">예상 월급</h3>
                  <p className="text-4xl font-bold text-blue-600 mb-1">
                    {expectedMonthlySalary.toLocaleString()}원
                  </p>
                  <p className="text-xs text-gray-500">월 근무시간: 약 {monthlyHours}시간</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-sm font-bold text-gray-600 mb-2">최저임금 기준 월급</h3>
                  <p className="text-4xl font-bold text-green-600 mb-1">
                    {minimumMonthlySalary.toLocaleString()}원
                  </p>
                  <p className="text-xs text-gray-500">2025년 최저임금 기준</p>
                </div>

                {/* 최저임금 적정 여부 */}
                {isMinimumWageOk ? (
                  <div className="bg-green-100 border-2 border-green-400 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <h3 className="text-lg font-bold text-green-900">✅ 최저임금 적정</h3>
                    </div>
                    <p className="text-sm text-green-800">
                      현재 시급은 2025년 최저임금({MINIMUM_WAGE.toLocaleString()}원)을 충족합니다!
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-100 border-2 border-red-400 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <XCircle className="w-8 h-8 text-red-600" />
                      <h3 className="text-lg font-bold text-red-900">⚠️ 최저임금 위반</h3>
                    </div>
                    <p className="text-sm text-red-800 mb-2">
                      현재 시급은 2025년 최저임금보다 낮습니다!
                    </p>
                    <p className="text-sm font-bold text-red-900">
                      부족 금액: 월 {shortfall.toLocaleString()}원
                    </p>
                  </div>
                )}

                {/* 주휴수당 안내 */}
                {weeklyHours >= 15 && includeHoliday && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900 font-medium mb-2">
                      💡 주휴수당이 포함되었습니다
                    </p>
                    <p className="text-xs text-blue-700">
                      주 15시간 이상 근무하여 주휴수당({holidayHours}시간) 적용
                    </p>
                  </div>
                )}

                {weeklyHours < 15 && (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-900 font-medium mb-2">
                      ℹ️ 주휴수당 미적용
                    </p>
                    <p className="text-xs text-yellow-700">
                      주 15시간 이상 근무해야 주휴수당을 받을 수 있습니다
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 계산 방식 설명 */}
            <div className="mt-6 bg-white rounded-xl p-6 border-2 border-gray-200">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                계산 방식
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• 주 근무시간 = 하루 근무시간 × 주 근무일수 = {weeklyHours}시간</p>
                {includeHoliday && weeklyHours >= 15 && (
                  <p>• 주휴수당 = 8시간 (주 15시간 이상 근무 시 적용)</p>
                )}
                <p>• 월 근무시간 = (주 총 근무시간 / 7) × 365 / 12 ≈ {monthlyHours}시간</p>
                <p>• 예상 월급 = 시급 × 월 근무시간 = {expectedMonthlySalary.toLocaleString()}원</p>
              </div>
            </div>
          </div>
        </section>

        {/* 최저임금 이것만 꼭 기억하세요 */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">최저임금 이것만 꼭 기억하세요</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 최저임금 */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-lg">
              <h3 className="text-2xl font-bold mb-4">최저임금</h3>
              <p className="text-green-100 mb-6">
                2025년 적용 최저임금은 시급 10,030원입니다.<br />
                (적용년도 2025.1.1 ~ 2025.12.31)
              </p>
              
              <div className="space-y-4">
                <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm font-medium">시급</span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold">10,030</span>
                    <span className="text-lg ml-2">원</span>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm font-medium">일급 (8시간)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold">80,240</span>
                    <span className="text-lg ml-2">원</span>
                  </div>
                </div>

                <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-5 h-5" />
                    <span className="text-sm font-medium">월급 (주40시간)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold">2,096,270</span>
                    <span className="text-lg ml-2">원</span>
                  </div>
                  <p className="text-xs text-green-100 mt-2 text-right">209시간 기준</p>
                </div>
              </div>
            </div>

            {/* 적용대상 */}
            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">적용대상</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-gray-700 mb-4">
                    근로기준법상 근로자 1명 이상이면, 비정규직, 외국인 근로자 등 
                    <strong className="text-green-600"> 1명이라도 모든 사업장에 적용</strong>됩니다!
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-3">✅ 적용 대상</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>정규직, 비정규직, 파트타임, 아르바이트</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>청소년 근로자 (나이 무관)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">•</span>
                      <span>외국인 근로자</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                  <h4 className="font-bold text-red-900 mb-3">⚠️ 위반 시 처벌</h4>
                  <p className="text-sm text-red-800">
                    <strong>3년 이하의 징역</strong> 또는 <strong>3,000만원 이하의 벌금</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Q&A */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Q & A</h2>
          
          <div className="space-y-6">
            {/* Q1 */}
            <div className="bg-white border-2 border-green-500 rounded-xl overflow-hidden shadow-md">
              <div className="bg-green-500 text-white px-6 py-4">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-6 h-6" />
                  <h3 className="text-lg font-bold">최저임금 미만을 지급받기로 한 근로계약은 유효한가요?</h3>
                </div>
              </div>
              <div className="px-6 py-4 bg-green-50">
                <p className="text-gray-800">
                  <strong>A.</strong> 최저임금액에 미치지 못하는 금액으로 정한 임금은 무효하며 최저임금액과 동일한 임금을 지급하여야 합니다
                </p>
              </div>
            </div>

            {/* Q2 */}
            <div className="bg-white border-2 border-green-500 rounded-xl overflow-hidden shadow-md">
              <div className="bg-green-500 text-white px-6 py-4">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-6 h-6" />
                  <h3 className="text-lg font-bold">주휴수당은 무엇인가요?</h3>
                </div>
              </div>
              <div className="px-6 py-4 bg-green-50">
                <p className="text-gray-800 mb-3">
                  <strong>A.</strong> 주 15시간 이상 근무하는 근로자에게 1주일에 1회 이상의 유급휴일을 부여하는데, 
                  이러한 유급휴일에 지급하는 수당을 말합니다
                </p>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>예시:</strong> 시급 10,030원에 주 20시간 근무 시
                  </p>
                  <p className="text-sm text-gray-700">
                    10,030원 × 24시간(주 20시간 + 주휴 4시간) = 240,720원
                  </p>
                </div>
              </div>
            </div>

            {/* Q3 */}
            <div className="bg-white border-2 border-green-500 rounded-xl overflow-hidden shadow-md">
              <div className="bg-green-500 text-white px-6 py-4">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-6 h-6" />
                  <h3 className="text-lg font-bold">야간·연장 근무 시 추가 수당이 있나요?</h3>
                </div>
              </div>
              <div className="px-6 py-4 bg-green-50">
                <p className="text-gray-800 mb-3">
                  <strong>A.</strong> 5인 이상 사업장에서 야간(오후 10시~오전 6시) 또는 연장근무 시 
                  <strong className="text-green-700"> 시급의 50%를 가산</strong>하여 지급해야 합니다
                </p>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>예시:</strong> 시급 10,030원으로 야간 4시간 근무 시
                  </p>
                  <p className="text-sm text-gray-700">
                    10,030원 × 1.5 × 4시간 = 60,180원
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}
