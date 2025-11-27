"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BookOpen, Briefcase, CheckCircle } from "lucide-react";

export default function AdditionalInfoPage() {
  const router = useRouter();
  const { user, refreshUserProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'scholarship' | 'job'>('scholarship');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 장학금 정보
  const [income, setIncome] = useState("");
  const [assets, setAssets] = useState("");
  const [householdSize, setHouseholdSize] = useState("");
  const [scholarshipRegion, setScholarshipRegion] = useState("");
  const [university, setUniversity] = useState("");
  const [grade, setGrade] = useState("");
  const [major, setMajor] = useState("");
  const [gpa, setGpa] = useState("");

  // 채용 정보
  const [desiredCompany, setDesiredCompany] = useState("");
  const [desiredField, setDesiredField] = useState("");
  const [desiredPosition, setDesiredPosition] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [certifications, setCertifications] = useState("");
  const [jobRegion, setJobRegion] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const userRef = doc(db, 'users', user.uid);
      
      const updateData: any = {
        hasAdditionalInfo: true,
      };

      if (activeTab === 'scholarship') {
        updateData.scholarshipInfo = {
          income,
          assets,
          householdSize: parseInt(householdSize) || 0,
          region: scholarshipRegion,
          university,
          grade,
          major,
          gpa,
        };
      } else {
        updateData.jobInfo = {
          desiredCompany,
          desiredField,
          desiredPosition,
          experience,
          education,
          skills: skills.split(',').map(s => s.trim()).filter(s => s),
          certifications: certifications.split(',').map(c => c.trim()).filter(c => c),
          region: jobRegion,
        };
      }

      await updateDoc(userRef, updateData);
      await refreshUserProfile();
      
      setSuccess(true);
      
      // AI 추천 페이지로 이동
      setTimeout(() => {
        router.push(`/ai-recommend?type=${activeTab}`);
      }, 2000);

    } catch (error) {
      console.error("정보 저장 에러:", error);
      alert("정보 저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navigation />
        
        <div className="flex-1 flex items-center justify-center px-6 py-24">
          <div className="w-full max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-3xl font-light text-gray-900 mb-4">정보 저장 완료!</h1>
            <p className="text-gray-600">
              AI가 맞춤 추천을 준비하고 있습니다...
            </p>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-24 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 tracking-tight">
            추가 정보 입력
          </h1>
          <p className="text-gray-600 text-lg">
            AI 맞춤 추천을 위해 추가 정보를 입력해주세요
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-8">
        {/* 탭 */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('scholarship')}
            className={`pb-4 px-2 flex items-center gap-2 transition-colors ${
              activeTab === 'scholarship'
                ? 'border-b-2 border-gray-900 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">장학금 정보</span>
          </button>
          
          <button
            onClick={() => setActiveTab('job')}
            className={`pb-4 px-2 flex items-center gap-2 transition-colors ${
              activeTab === 'job'
                ? 'border-b-2 border-gray-900 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span className="font-medium">채용 정보</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 장학금 정보 입력 */}
          {activeTab === 'scholarship' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    소득분위 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">선택하세요</option>
                    <option value="1분위">1분위</option>
                    <option value="2분위">2분위</option>
                    <option value="3분위">3분위</option>
                    <option value="4분위">4분위</option>
                    <option value="5분위">5분위</option>
                    <option value="6분위">6분위</option>
                    <option value="7분위">7분위</option>
                    <option value="8분위">8분위</option>
                    <option value="9분위">9분위</option>
                    <option value="10분위">10분위</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    자산 (천만원 단위) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={assets}
                    onChange={(e) => setAssets(e.target.value)}
                    required
                    placeholder="예: 5000만원"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    가구원 수 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={householdSize}
                    onChange={(e) => setHouseholdSize(e.target.value)}
                    required
                    min="1"
                    placeholder="예: 4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    거주 지역 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={scholarshipRegion}
                    onChange={(e) => setScholarshipRegion(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">선택하세요</option>
                    <option value="서울">서울</option>
                    <option value="부산">부산</option>
                    <option value="대구">대구</option>
                    <option value="인천">인천</option>
                    <option value="광주">광주</option>
                    <option value="대전">대전</option>
                    <option value="울산">울산</option>
                    <option value="세종">세종</option>
                    <option value="경기">경기</option>
                    <option value="강원">강원</option>
                    <option value="충북">충북</option>
                    <option value="충남">충남</option>
                    <option value="전북">전북</option>
                    <option value="전남">전남</option>
                    <option value="경북">경북</option>
                    <option value="경남">경남</option>
                    <option value="제주">제주</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    재학 중인 대학교 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    required
                    placeholder="예: 부산대학교"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    학년 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">선택하세요</option>
                    <option value="1학년">1학년</option>
                    <option value="2학년">2학년</option>
                    <option value="3학년">3학년</option>
                    <option value="4학년">4학년</option>
                    <option value="대학원">대학원</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    전공 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    required
                    placeholder="예: 컴퓨터공학"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    학점 (평점) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                    required
                    placeholder="예: 3.8/4.5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 채용 정보 입력 */}
          {activeTab === 'job' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    희망 회사 (선택사항)
                  </label>
                  <input
                    type="text"
                    value={desiredCompany}
                    onChange={(e) => setDesiredCompany(e.target.value)}
                    placeholder="예: 삼성전자, 네이버"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    희망 분야 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={desiredField}
                    onChange={(e) => setDesiredField(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">선택하세요</option>
                    <option value="IT/소프트웨어">IT/소프트웨어</option>
                    <option value="제조/생산">제조/생산</option>
                    <option value="금융/보험">금융/보험</option>
                    <option value="유통/무역">유통/무역</option>
                    <option value="서비스">서비스</option>
                    <option value="건설/건축">건설/건축</option>
                    <option value="의료/제약">의료/제약</option>
                    <option value="교육">교육</option>
                    <option value="미디어/광고">미디어/광고</option>
                    <option value="공공/공기업">공공/공기업</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    희망 직무 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={desiredPosition}
                    onChange={(e) => setDesiredPosition(e.target.value)}
                    required
                    placeholder="예: 백엔드 개발자"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    경력 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">선택하세요</option>
                    <option value="신입">신입</option>
                    <option value="1년 미만">1년 미만</option>
                    <option value="1-3년">1-3년</option>
                    <option value="3-5년">3-5년</option>
                    <option value="5-10년">5-10년</option>
                    <option value="10년 이상">10년 이상</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    학력 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">선택하세요</option>
                    <option value="고졸">고졸</option>
                    <option value="전문대졸">전문대졸</option>
                    <option value="대졸(4년)">대졸(4년)</option>
                    <option value="석사">석사</option>
                    <option value="박사">박사</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    희망 근무지역 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={jobRegion}
                    onChange={(e) => setJobRegion(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    <option value="">선택하세요</option>
                    <option value="서울">서울</option>
                    <option value="부산">부산</option>
                    <option value="대구">대구</option>
                    <option value="인천">인천</option>
                    <option value="광주">광주</option>
                    <option value="대전">대전</option>
                    <option value="울산">울산</option>
                    <option value="세종">세종</option>
                    <option value="경기">경기</option>
                    <option value="강원">강원</option>
                    <option value="충북">충북</option>
                    <option value="충남">충남</option>
                    <option value="전북">전북</option>
                    <option value="전남">전남</option>
                    <option value="경북">경북</option>
                    <option value="경남">경남</option>
                    <option value="제주">제주</option>
                    <option value="전국">전국</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    보유 기술 (쉼표로 구분) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    required
                    placeholder="예: Java, Python, React, Node.js"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <p className="mt-1 text-sm text-gray-500">기술이나 역량을 쉼표로 구분해서 입력하세요</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    자격증 (쉼표로 구분, 선택사항)
                  </label>
                  <input
                    type="text"
                    value={certifications}
                    onChange={(e) => setCertifications(e.target.value)}
                    placeholder="예: 정보처리기사, TOEIC 900, AWS SAA"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  />
                  <p className="mt-1 text-sm text-gray-500">보유한 자격증을 쉼표로 구분해서 입력하세요</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400"
            >
              {loading ? "저장 중..." : "저장하고 AI 추천 받기"}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
