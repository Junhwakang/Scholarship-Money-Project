"use client";

import { useState, useEffect } from "react";
import { saveInterestTags, saveExclusions, saveNotifications, getFavoriteJobs, removeFavoriteJob, getUserResumes } from "@/lib/firebase/profile";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Resume } from "@/types/resume";
import { 
  User, Mail, Phone, Calendar, CheckCircle, XCircle, Sparkles, 
  Bell, BellOff, Tag, Filter, TrendingUp, Heart, X, Plus,
  Clock, MapPin, Briefcase, Award, Settings, AlertCircle, ExternalLink, Trash2, FileText, Edit
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, userProfile, loading } = useAuth();

  // 알림 설정
  const [notifications, setNotifications] = useState({
    deadlineAlert: true,
    newJobAlert: true,
    scholarshipAlert: true,
    wageViolationAlert: false,
  });

  // 관심 태그
  const [interestTags, setInterestTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [savingTags, setSavingTags] = useState(false);

  // 추천 제외 조건
  const [exclusions, setExclusions] = useState({
    nightShift: false,
    weekend: false,
    farLocation: false,
    lowSalary: false,
  });
  const [savingExclusions, setSavingExclusions] = useState(false);

  // 지원 가능 공고 수 (예시 데이터)
  const [availableJobs, setAvailableJobs] = useState({
    jobs: 87,
    scholarships: 42,
    total: 129,
  });

  // 관심 공고 목록
  const [favoriteJobs, setFavoriteJobs] = useState<any[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  // 저장된 이력서 목록
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  // 사용자 프로필에서 데이터 불러오기
  useEffect(() => {
    if (userProfile) {
      if (userProfile.interestTags && Array.isArray(userProfile.interestTags)) {
        setInterestTags(userProfile.interestTags);
      }
      if (userProfile.exclusions) {
        setExclusions({
          nightShift: userProfile.exclusions.nightShift ?? false,
          weekend: userProfile.exclusions.weekend ?? false,
          farLocation: userProfile.exclusions.farLocation ?? false,
          lowSalary: userProfile.exclusions.lowSalary ?? false,
        });
      }
      if (userProfile.notifications) {
        setNotifications({
          deadlineAlert: userProfile.notifications.deadlineAlert ?? true,
          newJobAlert: userProfile.notifications.newJobAlert ?? true,
          scholarshipAlert: userProfile.notifications.scholarshipAlert ?? true,
          wageViolationAlert: userProfile.notifications.wageViolationAlert ?? false,
        });
      }
    }
  }, [userProfile]);

  // 관심 공고 불러오기
  useEffect(() => {
    const loadFavoriteJobs = async () => {
      if (!user) return;
      
      try {
        setLoadingFavorites(true);
        const favorites = await getFavoriteJobs(user.uid);
        setFavoriteJobs(favorites);
      } catch (error) {
        console.error('관심 공고 로딩 오류:', error);
      } finally {
        setLoadingFavorites(false);
      }
    };

    if (user) {
      loadFavoriteJobs();
    }
  }, [user]);

  // 이력서 불러오기
  useEffect(() => {
    const loadResumes = async () => {
      if (!user) return;
      
      try {
        setLoadingResumes(true);
        const userResumes = await getUserResumes(user.uid);
        setResumes(userResumes);
      } catch (error) {
        console.error('이력서 로딩 오류:', error);
      } finally {
        setLoadingResumes(false);
      }
    };

    if (user) {
      loadResumes();
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleNotificationToggle = async (key: keyof typeof notifications) => {
    if (!user) return;
    
    const newNotifications = { ...notifications, [key]: !notifications[key] };
    setNotifications(newNotifications);
    
    try {
      await saveNotifications(user.uid, newNotifications);
    } catch (error) {
      console.error('알림 설정 저장 오류:', error);
      alert('알림 설정 저장에 실패했습니다.');
      // 원래대로 돌려놓기
      setNotifications(prev => ({ ...prev, [key]: !newNotifications[key] }));
    }
  };

  const handleAddTag = async () => {
    if (!user) return;
    if (!newTag.trim() || interestTags.includes(newTag.trim())) return;
    
    const newTags = [...interestTags, newTag.trim()];
    setInterestTags(newTags);
    setNewTag("");
    
    try {
      setSavingTags(true);
      await saveInterestTags(user.uid, newTags);
    } catch (error) {
      console.error('태그 저장 오류:', error);
      alert('태그 저장에 실패했습니다.');
      setInterestTags(interestTags);
    } finally {
      setSavingTags(false);
    }
  };

  const handleRemoveTag = async (tag: string) => {
    if (!user) return;
    
    const newTags = interestTags.filter(t => t !== tag);
    setInterestTags(newTags);
    
    try {
      setSavingTags(true);
      await saveInterestTags(user.uid, newTags);
    } catch (error) {
      console.error('태그 삭제 오류:', error);
      alert('태그 삭제에 실패했습니다.');
      setInterestTags(interestTags);
    } finally {
      setSavingTags(false);
    }
  };

  const handleExclusionToggle = async (key: keyof typeof exclusions) => {
    if (!user) return;
    
    const newExclusions = { ...exclusions, [key]: !exclusions[key] };
    setExclusions(newExclusions);
    
    try {
      setSavingExclusions(true);
      await saveExclusions(user.uid, newExclusions);
    } catch (error) {
      console.error('제외 조건 저장 오류:', error);
      alert('제외 조건 저장에 실패했습니다.');
      setExclusions(prev => ({ ...prev, [key]: !newExclusions[key] }));
    } finally {
      setSavingExclusions(false);
    }
  };

  // 관심 공고 제거
  const handleRemoveFavorite = async (jobId: string) => {
    if (!user) return;
    if (!confirm('관심 공고에서 제거하시겠습니까?')) return;
    
    try {
      await removeFavoriteJob(user.uid, jobId);
      setFavoriteJobs(prev => prev.filter(fav => fav.jobId !== jobId));
    } catch (error) {
      console.error('관심 공고 제거 오류:', error);
      alert('관심 공고 제거에 실패했습니다.');
    }
  };

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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* 헤더 */}
      <div className="pt-24 pb-12 bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {userProfile.name}님
              </h1>
              <p className="text-blue-100 text-lg">
                환영합니다! 맞춤 정보를 관리하세요
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        
        {/* 지원 가능 공고 수 카드 */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-8 h-8" />
              <h2 className="text-2xl font-bold">내 조건으로 지원 가능한 공고</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 backdrop-blur rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Briefcase className="w-6 h-6" />
                  <p className="text-sm font-medium">채용 공고</p>
                </div>
                <p className="text-5xl font-bold mb-2">{availableJobs.jobs}</p>
                <p className="text-sm text-purple-100">개의 공고 매칭</p>
              </div>

              <div className="bg-white/20 backdrop-blur rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-6 h-6" />
                  <p className="text-sm font-medium">장학금</p>
                </div>
                <p className="text-5xl font-bold mb-2">{availableJobs.scholarships}</p>
                <p className="text-sm text-purple-100">개의 장학금 매칭</p>
              </div>

              <div className="bg-white/20 backdrop-blur rounded-xl p-6 border-2 border-white/40">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-6 h-6" />
                  <p className="text-sm font-medium">전체 매칭</p>
                </div>
                <p className="text-5xl font-bold mb-2">{availableJobs.total}</p>
                <p className="text-sm text-purple-100">개의 기회 대기중!</p>
              </div>
            </div>

            {/* 저장된 이력서 */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">내 이력서</h2>
                </div>
                <button
                  onClick={() => router.push('/resume')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  새 이력서
                </button>
              </div>

              {loadingResumes ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                  <p className="text-sm text-gray-600">로딩 중...</p>
                </div>
              ) : resumes.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">저장된 이력서가 없습니다</p>
                  <button
                    onClick={() => router.push('/resume')}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-bold text-sm"
                  >
                    이력서 작성하기
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumes.map((resume, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-gray-900 mb-1">
                            {resume.name} - {resume.desiredPosition || '희망 직무 미입력'}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">{resume.university} {resume.major}</p>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                            <span>{resume.grade}</span>
                            <span>•</span>
                            <span>{resume.workRegion || '전국'}</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => router.push('/resume')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="수정"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => router.push('/ai-recommend?type=job')}
                className="flex-1 bg-white text-purple-600 py-3 rounded-lg font-bold hover:bg-purple-50 transition-colors"
              >
                AI 채용 추천받기
              </button>
              <button
                onClick={() => router.push('/ai-recommend?type=scholarship')}
                className="flex-1 bg-white text-pink-600 py-3 rounded-lg font-bold hover:bg-pink-50 transition-colors"
              >
                AI 장학금 추천받기
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* 왼쪽 컬럼 */}
          <div className="space-y-8">
            
            {/* 기본 정보 */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">기본 정보</h2>
                <button
                  onClick={() => router.push('/additional-info')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  수정
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">이메일</p>
                    <p className="text-gray-900 font-medium">{userProfile.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">연락처</p>
                    <p className="text-gray-900 font-medium">{userProfile.phone || '미등록'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-xs text-gray-500">가입일</p>
                    <p className="text-gray-900 font-medium">
                      {userProfile.createdAt 
                        ? new Date(userProfile.createdAt as any).toLocaleDateString('ko-KR')
                        : '정보 없음'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 관심 태그 */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <Tag className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">관심 분야 태그</h2>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                관심 있는 분야를 태그로 추가하면 더 정확한 추천을 받을 수 있어요
              </p>

              {/* 태그 리스트 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {interestTags.map((tag, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full"
                  >
                    <span className="font-medium">{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* 태그 추가 */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="새 태그 입력"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  추가
                </button>
              </div>

              {/* 추천 태그 */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">추천 태그</p>
                <div className="flex flex-wrap gap-2">
                  {['서빙', '편의점', '카페', '배달', '튜터링', '사무보조'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => !interestTags.includes(tag) && setInterestTags([...interestTags, tag])}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 추천 제외 조건 */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <Filter className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">추천 제외 조건</h2>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                원하지 않는 조건을 제외하면 더 만족스러운 추천을 받을 수 있어요
              </p>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">야간 근무 제외</p>
                      <p className="text-xs text-gray-500">오후 10시 이후 근무</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={exclusions.nightShift}
                    onChange={() => handleExclusionToggle('nightShift')}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">주말 근무 제외</p>
                      <p className="text-xs text-gray-500">토요일, 일요일 근무</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={exclusions.weekend}
                    onChange={() => handleExclusionToggle('weekend')}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">먼 지역 제외</p>
                      <p className="text-xs text-gray-500">거주지에서 5km 이상</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={exclusions.farLocation}
                    onChange={() => handleExclusionToggle('farLocation')}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">최저임금 미달 제외</p>
                      <p className="text-xs text-gray-500">시급 10,030원 미만</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={exclusions.lowSalary}
                    onChange={() => handleExclusionToggle('lowSalary')}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="space-y-8">
            
            {/* 알림 설정 */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">알림 설정</h2>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                중요한 정보를 놓치지 않도록 알림을 설정하세요
              </p>

              <div className="space-y-4">
                {/* 마감 알림 */}
                <div className="p-5 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-2 border-red-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">마감 임박 알림</p>
                        <p className="text-xs text-gray-600">D-3, D-1 알림</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle('deadlineAlert')}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        notifications.deadlineAlert ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform ${
                          notifications.deadlineAlert ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                  {notifications.deadlineAlert && (
                    <div className="bg-white rounded-lg p-3 text-sm text-gray-700">
                      <p className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        관심 공고 마감 3일, 1일 전 알림
                      </p>
                    </div>
                  )}
                </div>

                {/* 신규 채용 알림 */}
                <div className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">신규 채용 알림</p>
                        <p className="text-xs text-gray-600">내 조건 맞는 공고</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle('newJobAlert')}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        notifications.newJobAlert ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform ${
                          notifications.newJobAlert ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                  {notifications.newJobAlert && (
                    <div className="bg-white rounded-lg p-3 text-sm text-gray-700">
                      <p className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        매일 오전 9시 신규 공고 알림
                      </p>
                    </div>
                  )}
                </div>

                {/* 장학금 알림 */}
                <div className="p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Award className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">장학금 알림</p>
                        <p className="text-xs text-gray-600">신규 장학금 공고</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle('scholarshipAlert')}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        notifications.scholarshipAlert ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform ${
                          notifications.scholarshipAlert ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                  {notifications.scholarshipAlert && (
                    <div className="bg-white rounded-lg p-3 text-sm text-gray-700">
                      <p className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        주 2회 (월, 목) 장학금 알림
                      </p>
                    </div>
                  )}
                </div>

                {/* 임금체불 알림 */}
                <div className="p-5 bg-gradient-to-r from-yellow-50 to-red-50 rounded-xl border-2 border-yellow-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">체불업체 알림</p>
                        <p className="text-xs text-gray-600">새 명단 공개 시</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNotificationToggle('wageViolationAlert')}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        notifications.wageViolationAlert ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform ${
                          notifications.wageViolationAlert ? 'right-1' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                  {notifications.wageViolationAlert && (
                    <div className="bg-white rounded-lg p-3 text-sm text-gray-700">
                      <p className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        임금체불 명단 업데이트 시 알림
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <p className="text-sm text-blue-900 flex items-start gap-2">
                  <Bell className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>
                    알림은 이메일로 발송됩니다. 더 빠른 알림을 원하시면 
                    <strong className="ml-1">앱 설치를 권장</strong>합니다.
                  </span>
                </p>
              </div>
            </div>

            {/* 추가 정보 입력 현황 */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-yellow-600" />
                <h2 className="text-2xl font-bold text-gray-900">AI 추천 정확도</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">장학금 정보</span>
                  {userProfile.scholarshipInfo ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">입력 완료</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="w-5 h-5" />
                      <span className="font-medium">미입력</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700">채용 정보</span>
                  {userProfile.jobInfo ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">입력 완료</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="w-5 h-5" />
                      <span className="font-medium">미입력</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-200">
                    <p className="text-sm text-yellow-900 font-medium mb-2">
                      💡 정보를 더 입력할수록 AI 추천 정확도가 높아집니다!
                    </p>
                    <button
                      onClick={() => router.push('/additional-info')}
                      className="w-full mt-2 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors font-bold"
                    >
                      추가 정보 입력하기
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 내 관심 공고 */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <Heart className="w-6 h-6 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900">내 관심 공고</h2>
                <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                  {favoriteJobs.length}개
                </span>
              </div>

              {loadingFavorites ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
                  <p className="text-sm text-gray-600">로딩 중...</p>
                </div>
              ) : favoriteJobs.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">아직 관심 공고가 없습니다</p>
                  <p className="text-sm text-gray-500 mb-4">채용 페이지에서 하트를 눌러 관심 공고를 등록하세요!</p>
                  <button
                    onClick={() => router.push('/jobs')}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-bold text-sm"
                  >
                    채용 공고 보러가기
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {favoriteJobs.map((favorite) => {
                    const job = favorite.jobData;
                    return (
                      <div
                        key={favorite.id}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-medium text-gray-900 mb-1 truncate">
                              {job.position || '채용 공고'}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">{job.company || '회사명'}</p>
                            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {job.location || '전국'}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                마감: {job.deadline || '상시'}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 flex-shrink-0 ml-4">
                            <button
                              onClick={() => window.open(job.website, '_blank')}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="공고 보기"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveFavorite(favorite.jobId)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="관심 해제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  <button
                    onClick={() => router.push('/jobs')}
                    className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors text-sm font-medium"
                  >
                    더 많은 공고 둘러보기
                  </button>
                </div>
              )}
            </div>

            {/* AI 추천을 위한 저장된 정보 */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">AI 추천을 위한 저장된 정보</h2>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                이 정보들을 기반으로 AI가 맞춤형 추천을 제공합니다
              </p>

              {!userProfile?.scholarshipInfo && !userProfile?.jobInfo ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-2">저장된 정보가 없습니다</p>
                  <p className="text-sm text-gray-500 mb-4">추가 정보를 입력하면 더 정확한 AI 추천을 받을 수 있습니다</p>
                  <button
                    onClick={() => router.push('/additional-info')}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-bold text-sm"
                  >
                    추가 정보 입력하기
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 장학금 정보 */}
                  {userProfile?.scholarshipInfo && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <Award className="w-6 h-6 text-yellow-600" />
                        <h3 className="text-lg font-bold text-gray-900">장학금 추천 정보</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">학교</p>
                          <p className="font-medium text-gray-900">{userProfile.scholarshipInfo.university}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">학년</p>
                          <p className="font-medium text-gray-900">{userProfile.scholarshipInfo.grade}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">전공</p>
                          <p className="font-medium text-gray-900">{userProfile.scholarshipInfo.major}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">학점</p>
                          <p className="font-medium text-gray-900">{userProfile.scholarshipInfo.gpa}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">지역</p>
                          <p className="font-medium text-gray-900">{userProfile.scholarshipInfo.region}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">소득분위</p>
                          <p className="font-medium text-gray-900">{userProfile.scholarshipInfo.income}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 채용 정보 */}
                  {userProfile?.jobInfo && (
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <Briefcase className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-bold text-gray-900">채용 추천 정보</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">희망 분야</p>
                          <p className="font-medium text-gray-900">{userProfile.jobInfo.desiredField}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">희망 직무</p>
                          <p className="font-medium text-gray-900">{userProfile.jobInfo.desiredPosition}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">희망 회사</p>
                          <p className="font-medium text-gray-900">{userProfile.jobInfo.desiredCompany}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">경력</p>
                          <p className="font-medium text-gray-900">{userProfile.jobInfo.experience}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">학력</p>
                          <p className="font-medium text-gray-900">{userProfile.jobInfo.education}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">지역</p>
                          <p className="font-medium text-gray-900">{userProfile.jobInfo.region}</p>
                        </div>
                      </div>
                      {userProfile.jobInfo.skills && userProfile.jobInfo.skills.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <p className="text-gray-600 mb-2 text-sm">보유 기술</p>
                          <div className="flex flex-wrap gap-2">
                            {userProfile.jobInfo.skills.map((skill, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {userProfile.jobInfo.certifications && userProfile.jobInfo.certifications.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <p className="text-gray-600 mb-2 text-sm">자격증</p>
                          <div className="flex flex-wrap gap-2">
                            {userProfile.jobInfo.certifications.map((cert, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                {cert}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => router.push('/additional-info')}
                    className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    정보 수정하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
