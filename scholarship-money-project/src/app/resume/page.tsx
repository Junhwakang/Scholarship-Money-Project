"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { saveResume } from "@/lib/firebase/profile";
import { Resume, createEmptyResume } from "@/types/resume";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { 
  FileText, Sparkles, Loader2, Save, User, GraduationCap, 
  Briefcase, Award, Clock, Plus, X, CheckCircle, AlertCircle
} from "lucide-react";

export default function ResumePage() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  
  // Resume 타입 전체를 상태로 사용 (Partial 아님!)
  const [formData, setFormData] = useState<Resume>(createEmptyResume());
  const [resumeId, setResumeId] = useState<string | undefined>(undefined);
  const [loadingResume, setLoadingResume] = useState(true);

  // AI 관련 상태
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiStrengths, setAiStrengths] = useState("");
  const [aiGoal, setAiGoal] = useState("");

  // 템플릿 모달 상태
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // 저장 상태
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // 저장된 이력서 불러오기
  useEffect(() => {
    const loadExistingResume = async () => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        setLoadingResume(true);
        const { getUserResumes } = await import('@/lib/firebase/profile');
        const resumes = await getUserResumes(user.uid);
        
        if (resumes.length > 0) {
          // 가장 최근 이력서를 불러옴
          const latestResume = resumes[0];
          setFormData(latestResume);
          // 이력서 ID는 Firestore에서 가져온 것이 아니므로 별도 저장 필요
          // 일단은 저장된 이력서로 폼 초기화
        } else {
          // 저장된 이력서가 없으면 사용자 정보만 채움
          setFormData(prev => ({
            ...prev,
            name: userProfile?.name || '',
            email: userProfile?.email || '',
            phone: userProfile?.phone || '',
            userId: user.uid,
          }));
        }
      } catch (error) {
        console.error('이력서 로딩 오류:', error);
        // 오류 발생 시 기본 정보만 채움
        if (userProfile) {
          setFormData(prev => ({
            ...prev,
            name: userProfile.name || '',
            email: userProfile.email || '',
            phone: userProfile.phone || '',
            userId: user.uid,
          }));
        }
      } finally {
        setLoadingResume(false);
      }
    };

    loadExistingResume();
  }, [user, userProfile, router]);

  // AI 자기소개서 생성
  const generateIntroduction = async () => {
    if (!formData.name || !formData.major || !formData.desiredPosition) {
      setAiError("이름, 전공, 희망 직무는 필수입니다.");
      return;
    }

    try {
      setAiLoading(true);
      setAiError("");

      const response = await fetch('/api/generate-introduction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          major: formData.major,
          grade: formData.grade,
          desiredPosition: formData.desiredPosition,
          skills: formData.skills.computer.join(', '),
          experiences: formData.hasExperience ? formData.experiences[0]?.duties : '없음',
          strengths: aiStrengths || '성실함, 책임감',
          goal: aiGoal || '성장하고 싶습니다'
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setFormData(prev => ({ ...prev, introduction: result.introduction }));
      setShowAiModal(false);
      setAiStrengths("");
      setAiGoal("");

    } catch (error: any) {
      console.error('AI 생성 에러:', error);
      setAiError(error.message || '자기소개서 생성에 실패했습니다.');
    } finally {
      setAiLoading(false);
    }
  };

  // 이력서 저장
  const handleSaveResume = async () => {
    if (!agreedToTerms) {
      alert('개인정보 수집·이용에 동의해주세요.');
      return;
    }

    if (!formData.name || !formData.phone || !formData.email || !formData.university || !formData.major) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (!user) return;

    try {
      setSaving(true);

      const savedResumeId = await saveResume(user.uid, formData, resumeId);
      setResumeId(savedResumeId);

      setSaveSuccess(true);
      setTimeout(() => {
        router.push('/profile');
      }, 2000);

    } catch (error) {
      console.error('저장 실패:', error);
      alert('이력서 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experiences: [...prev.experiences, { workplace: "", period: "", duties: "" }]
    }));
  };

  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
  };

  const updateExperience = (index: number, field: 'workplace' | 'period' | 'duties', value: string) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addSkill = (category: 'computer' | 'languages' | 'certificates' | 'others', skill: string) => {
    if (skill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: {
          ...prev.skills,
          [category]: [...prev.skills[category], skill.trim()]
        }
      }));
    }
  };

  const removeSkill = (category: 'computer' | 'languages' | 'certificates' | 'others', index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index)
      }
    }));
  };

  // 템플릿 적용
  const applyTemplate = (templateType: string) => {
    const templates = {
      'basic': `전공 수업과 대학 생활을 통해 저는 제가 어떤 방향으로 성장하고 싶은지에 대해 지속적으로 고민해왔습니다. 처음에는 막연히 전공을 공부하는 학생에 불과했지만, 수업에서 배운 이론을 과제와 프로젝트를 통해 실제로 적용해보는 과정에서 단순한 학습을 넘어 문제를 해결해 나가는 일에 흥미를 느끼게 되었습니다. 특히 하나의 목표를 향해 단계적으로 결과를 만들어가는 과정에서 성취감을 느꼈고, 이러한 경험을 바탕으로 관련 직무에 도전하고자 지원하게 되었습니다.

대학생활 동안 저는 맡은 역할에 책임감을 가지고 임하는 태도를 가장 중요하게 생각해왔습니다. 전공 수업 중 팀 프로젝트를 수행하며 자료 조사와 정리, 일정 관리 역할을 맡은 경험이 있습니다. 팀원들 간 의견 차이로 진행이 지연된 적도 있었지만, 중간 정리 자료를 공유하며 소통을 돕고 역할을 재조정함으로써 프로젝트를 무사히 마칠 수 있었습니다. 이 경험을 통해 개인의 역량뿐 아니라 협업과 책임 있는 태도가 결과의 완성도를 높인다는 점을 배울 수 있었습니다.

입사 후에는 기본 업무를 성실히 수행하며 조직과 업무 흐름을 빠르게 이해하고 싶습니다. 작은 역할이라도 소홀히 하지 않고 책임감 있게 수행하며, 장기적으로는 꾸준한 학습과 경험을 통해 조직에 신뢰를 주는 인재로 성장하고자 합니다.`,
      'story': `대학생활을 시작하며 저는 전공 지식을 쌓는 것 자체보다, 배운 내용을 어떻게 활용할 수 있을지에 대해 고민해왔습니다. 전공 수업에서 접한 이론을 과제와 프로젝트를 통해 직접 적용해보는 과정은 제게 큰 동기부여가 되었고, 단순히 주어진 문제를 해결하는 것을 넘어 더 나은 방향을 고민하는 계기가 되었습니다. 이러한 경험을 통해 자연스럽게 해당 분야에 대한 관심이 깊어졌고, 실제 현장에서 역량을 발휘해보고 싶다는 목표를 갖게 되었습니다.

가장 기억에 남는 경험은 팀 프로젝트를 수행하며 예상치 못한 문제를 해결했던 과정입니다. 초기 계획과 달리 자료 수집이 원활하지 않아 일정에 차질이 생겼고, 팀원들 역시 방향 설정에 어려움을 겪고 있었습니다. 저는 팀원들과 논의 끝에 자료 범위를 재정의하고 역할을 세분화하여 진행 방식을 조정했습니다. 그 결과 프로젝트의 완성도를 높일 수 있었고, 이 경험을 통해 문제를 회피하기보다 상황을 분석하고 해결책을 찾는 태도의 중요성을 배웠습니다.

앞으로도 이러한 경험을 바탕으로 새로운 환경에서도 적극적으로 배우고 성장하고자 합니다. 입사 후에는 주어진 업무를 통해 실무 역량을 차근차근 쌓으며, 장기적으로는 조직의 목표 달성에 기여하는 구성원이 되고 싶습니다.`,
      'responsibility': `저는 어떤 일이든 기본을 지키며 꾸준히 임하는 태도가 가장 중요한 역량이라고 생각합니다. 대학생활 동안 화려한 성과보다는 맡은 일을 끝까지 책임지고 수행하는 경험을 통해 신뢰의 가치를 배워왔습니다. 이러한 태도는 학업뿐 아니라 다양한 활동 전반에서 저의 기준이 되었고, 성실함을 강점으로 삼게 된 계기가 되었습니다.

전공 수업과 팀 과제를 수행하며 저는 주어진 역할을 정확히 이해하고 충실히 수행하는 데 집중했습니다. 특히 팀 프로젝트에서 자료 정리와 일정 관리 역할을 맡아 전체 진행 상황을 점검하고 공유한 경험이 있습니다. 눈에 띄는 역할은 아니었지만, 이러한 기본적인 업무가 팀 전체의 완성도를 높이는 데 중요한 역할을 한다는 것을 느꼈습니다. 이를 통해 조직에서 신뢰받는 사람은 맡은 일을 묵묵히 해내는 사람이라는 점을 깨닫게 되었습니다.

입사 후에도 이러한 자세를 바탕으로 주어진 업무를 성실히 수행하며 조직에 빠르게 적응하고 싶습니다. 기본을 소홀히 하지 않는 태도로 신뢰를 쌓고, 점차 더 큰 책임을 맡을 수 있는 인재로 성장하겠습니다.`,
      'growth': `대학생활은 저에게 부족함을 인식하고 이를 개선해 나가는 성장의 과정이었습니다. 처음에는 전공 수업을 따라가는 것조차 쉽지 않았지만, 스스로 학습 계획을 세우고 반복적인 학습을 통해 점차 이해도를 높여갈 수 있었습니다. 이러한 경험은 단순한 성적 향상을 넘어 스스로를 관리하고 발전시키는 힘을 길러주었습니다.

특히 팀 프로젝트를 통해 다양한 사람들과 협력하며 새로운 관점을 배우는 경험은 제 사고방식을 크게 변화시켰습니다. 서로 다른 의견을 조율하는 과정에서 타인의 생각을 존중하는 태도를 배우게 되었고, 그 과정에서 저 역시 한층 성장할 수 있었습니다. 실패나 시행착오 역시 성장의 일부라는 점을 깨닫고, 이를 통해 더 나은 방향을 모색하는 자세를 갖게 되었습니다.

앞으로도 현재에 안주하지 않고 지속적으로 배우며 발전하는 사람이 되고자 합니다. 주어진 기회를 통해 경험을 쌓고, 장기적으로는 사회에 긍정적인 영향을 미칠 수 있는 인재로 성장하는 것이 저의 목표입니다.`,
      'practical': `저는 맡은 역할을 정확히 이해하고 책임감 있게 수행하는 것을 중요하게 생각합니다. 대학생활 동안 전공 수업과 다양한 활동을 통해 배운 내용을 실제로 적용해보며, 작은 경험 하나하나가 실질적인 역량으로 이어진다는 것을 느끼게 되었습니다. 이러한 과정에서 자연스럽게 관련 직무에 대한 관심을 갖게 되었습니다.

팀 프로젝트를 수행하며 저는 주어진 역할을 충실히 이행하며 팀의 목표 달성에 기여하고자 노력했습니다. 계획대로 진행되지 않는 상황에서도 팀원들과 소통하며 문제를 해결했고, 이 경험을 통해 협업과 책임감의 중요성을 다시 한번 깨닫게 되었습니다. 단순히 결과만을 중시하기보다 과정 속에서 배우는 것이 많다는 점이 인상 깊었습니다.

입사 후에는 기본 업무를 성실히 수행하며 조직에 빠르게 적응하고 싶습니다. 주어진 역할을 통해 경험을 쌓고, 장기적으로는 조직에 안정적으로 기여할 수 있는 인재로 성장하겠습니다.`
    };

    const template = templates[templateType as keyof typeof templates];
    if (template) {
      setFormData(prev => ({ ...prev, introduction: template }));
      setShowTemplateModal(false);
    }
  };

  if (!user) return null;

  // 이력서 로딩 중
  if (loadingResume) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-600">이력서를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* 헤더 */}
      <div className="pt-24 pb-12 bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">이력서 작성</h1>
              <p className="text-blue-100">AI가 도와주는 스마트 이력서</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* 저장 성공 메시지 */}
        {saveSuccess && (
          <div className="mb-6 bg-green-50 border-2 border-green-500 rounded-xl p-6 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-green-900 font-bold text-lg">이력서가 저장되었습니다!</p>
              <p className="text-green-700 text-sm">프로필 페이지로 이동합니다...</p>
            </div>
          </div>
        )}

        {/* 1. 기본 인적사항 */}
        <section className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">기본 인적사항</h2>
            <span className="text-red-500 text-sm">*필수</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">이름 *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="홍길동"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">연락처 *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="010-1234-5678"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">이메일 *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">거주 지역</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="서울시 강남구"
              />
            </div>
          </div>
        </section>

        {/* 2. 학력 정보 */}
        <section className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">학력 정보</h2>
            <span className="text-red-500 text-sm">*필수</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">학교명 *</label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="○○대학교"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">학과(전공) *</label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="컴퓨터공학과"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">학년</label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택</option>
                <option value="1학년">1학년</option>
                <option value="2학년">2학년</option>
                <option value="3학년">3학년</option>
                <option value="4학년">4학년</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">재학 상태</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as '재학' | '휴학' | '졸업예정' }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="재학">재학</option>
                <option value="휴학">휴학</option>
                <option value="졸업예정">졸업예정</option>
              </select>
            </div>
          </div>
        </section>

        {/* 3. 희망 지원 분야 */}
        <section className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">희망 지원 분야</h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">희망 직무/알바 유형</label>
              <input
                type="text"
                value={formData.desiredPosition}
                onChange={(e) => setFormData(prev => ({ ...prev, desiredPosition: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 카페, 사무보조, IT개발"
              />
            </div>
          </div>
        </section>

        {/* 4. 경력 */}
        <section className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">경력 및 활동</h2>
          </div>

          <label className="flex items-center gap-3 mb-6">
            <input
              type="checkbox"
              checked={!formData.hasExperience}
              onChange={(e) => setFormData(prev => ({ ...prev, hasExperience: !e.target.checked }))}
              className="w-5 h-5"
            />
            <span className="text-gray-700 font-medium">경력 없음</span>
          </label>

          {formData.hasExperience && formData.experiences.map((exp, index) => (
            <div key={index} className="border-2 border-gray-200 rounded-lg p-6 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">경력 {index + 1}</h3>
                {formData.experiences.length > 1 && (
                  <button
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">근무처</label>
                  <input
                    type="text"
                    value={exp.workplace}
                    onChange={(e) => updateExperience(index, 'workplace', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="○○카페"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">기간</label>
                  <input
                    type="text"
                    value={exp.period}
                    onChange={(e) => updateExperience(index, 'period', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="2024.01 ~ 2024.06"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">담당 업무</label>
                  <textarea
                    value={exp.duties}
                    onChange={(e) => updateExperience(index, 'duties', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="고객 응대, 주문 관리"
                  />
                </div>
              </div>
            </div>
          ))}

          {formData.hasExperience && (
            <button
              onClick={addExperience}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              경력 추가
            </button>
          )}
        </section>

        {/* 5. 자기소개 (AI 생성 포함) */}
        <section className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-900">자기소개</h2>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowTemplateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all font-bold shadow-md"
              >
                <FileText className="w-5 h-5" />
                가장 많이 쓰는 레이아웃을 만나보세요!
              </button>
              
              <button
                onClick={() => setShowAiModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-bold shadow-md"
              >
                <Sparkles className="w-5 h-5" />
                AI 맞춤 자기소개 만들기
              </button>
            </div>
          </div>

          <textarea
            value={formData.introduction}
            onChange={(e) => setFormData(prev => ({ ...prev, introduction: e.target.value }))}
            rows={10}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="자기소개를 입력하세요. (300~500자 권장)&#x0a;&#x0a;또는 위의 'AI 맞춤 자기소개 만들기' 버튼을 눌러 AI가 작성한 자기소개를 받아보세요!"
          />

          <div className="mt-3 text-sm text-gray-600">
            현재 {formData.introduction.length}자
          </div>
        </section>

        {/* 템플릿 선택 모달 */}
        {showTemplateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-600" />
                  <h3 className="text-2xl font-bold text-gray-900">어떤 형식이 필요하세요?</h3>
                </div>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                가장 많이 사용되는 자기소개서 템플릿을 선택하세요. 클릭 한 번으로 완성된 자기소개서가 입력됩니다.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => applyTemplate('basic')}
                  className="w-full text-left p-5 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">① 정석 기본형</h4>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">가장 표준</span>
                  </div>
                  <p className="text-sm text-gray-600">어디든 사용 가능한 가장 표준적인 형식입니다.</p>
                </button>

                <button
                  onClick={() => applyTemplate('story')}
                  className="w-full text-left p-5 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-purple-600">② 경험 서사 강화형</h4>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">스토리텔링</span>
                  </div>
                  <p className="text-sm text-gray-600">스토리텔링 중심으로 AI 티가 적습니다.</p>
                </button>

                <button
                  onClick={() => applyTemplate('responsibility')}
                  className="w-full text-left p-5 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-green-600">③ 성실·책임감 강조형</h4>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">알바·현장직</span>
                  </div>
                  <p className="text-sm text-gray-600">알바, 현장, 서비스직에 강력한 형식입니다.</p>
                </button>

                <button
                  onClick={() => applyTemplate('growth')}
                  className="w-full text-left p-5 border-2 border-gray-200 rounded-xl hover:border-yellow-500 hover:bg-yellow-50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-yellow-600">④ 성장·학습 중심형</h4>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">장학금·학교</span>
                  </div>
                  <p className="text-sm text-gray-600">장학금, 학교 제출용에 적합한 형식입니다.</p>
                </button>

                <button
                  onClick={() => applyTemplate('practical')}
                  className="w-full text-left p-5 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-orange-600">⑤ 실무 현실형</h4>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">담백·깊이</span>
                  </div>
                  <p className="text-sm text-gray-600">담백하지만 깊이 있는 AI 초안 기준선입니다.</p>
                </button>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  💡 <strong>팁:</strong> 템플릿을 선택한 후 자신의 경험과 강점에 맞게 수정하면 더욱 완성도 높은 자기소개서가 됩니다!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI 자기소개서 모달 */}
        {showAiModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-900">AI 자기소개서 생성</h3>
                </div>
                <button
                  onClick={() => setShowAiModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {aiError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{aiError}</p>
                </div>
              )}

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    나의 강점 (간단히)
                  </label>
                  <input
                    type="text"
                    value={aiStrengths}
                    onChange={(e) => setAiStrengths(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="예: 책임감, 성실함, 커뮤니케이션 능력"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    지원 목표 또는 포부
                  </label>
                  <input
                    type="text"
                    value={aiGoal}
                    onChange={(e) => setAiGoal(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="예: 실무 경험을 쌓고 싶습니다"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    💡 <strong>팁:</strong> 위 정보와 함께 이미 입력하신 이름, 전공, 희망 직무, 경력 정보를 바탕으로 AI가 맞춤 자기소개서를 작성해드립니다!
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAiModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={generateIntroduction}
                  disabled={aiLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      생성 중...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      생성하기
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 개인정보 동의 및 저장 */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-6 border-2 border-blue-200">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-gray-700 text-sm mb-2">
                  ✓ 본 정보는 채용/추천 목적 외에는 사용되지 않습니다.
                </p>
                <p className="text-gray-700 text-sm mb-2">
                  ✓ 언제든지 수정 및 삭제가 가능합니다.
                </p>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 mt-1"
              />
              <span className="text-gray-900 font-medium">
                개인정보 수집·이용에 동의합니다
              </span>
            </label>
          </div>
        </section>

        {/* 저장 버튼 */}
        <div className="flex gap-4">
          <button
            onClick={() => router.back()}
            className="flex-1 py-4 border-2 border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSaveResume}
            disabled={saving || !agreedToTerms}
            className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-md flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                이력서 저장
              </>
            )}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
