// 알바/회사 후기 관련 타입 정의

export interface Review {
  id: string;
  type: 'job' | 'company' | 'intern'; // 알바, 회사(정규직/계약직), 인턴
  
  // 기본 정보
  title: string;
  company: string; // 회사명 또는 매장명
  position: string; // 직무/포지션
  location: string; // 근무 지역
  
  // 근무 정보
  workPeriod: string; // 근무 기간 (예: "2023.01 ~ 2023.06")
  workType: '정규직' | '계약직' | '인턴' | '아르바이트' | '단기알바';
  salary: string; // 급여 정보 (예: "시급 10,000원", "연봉 3,500만원")
  
  // 후기 내용
  pros: string[]; // 장점 (배열)
  cons: string[]; // 단점 (배열)
  mainTasks: string[]; // 주요 업무
  overallReview: string; // 종합 후기 (긴 텍스트)
  
  // 평점 (5점 만점)
  ratings: {
    salary: number; // 급여 만족도
    workLifeBalance: number; // 워라밸
    culture: number; // 조직문화
    growth: number; // 성장 가능성
    welfare: number; // 복지
    overall: number; // 종합 평점
  };
  
  // 팁 & 조언
  tips?: string; // 지원자들을 위한 팁
  interviewTips?: string; // 면접 팁 (있는 경우)
  
  // 추천 대상
  recommendFor?: string[]; // 예: ["대학생", "경력자", "신입"]
  notRecommendFor?: string[]; // 예: ["체력이 약한 사람", "단기만 원하는 사람"]
  
  // 카테고리/태그
  category: string; // 예: "카페", "편의점", "IT", "금융"
  tags: string[]; // 예: ["힘듦", "배울게많음", "친절한사장님"]
  
  // 메타 정보
  author: string; // 작성자 닉네임
  authorId: string; // 작성자 ID
  isVerified: boolean; // 인증 여부
  viewCount: number; // 조회수
  likeCount: number; // 좋아요 수
  createdAt: Date;
  updatedAt: Date;
}

// 면접 후기 (별도)
export interface InterviewReview {
  id: string;
  company: string;
  position: string;
  
  // 면접 정보
  interviewDate: string; // 면접 날짜
  interviewType: string[]; // 예: ["서류", "1차 면접", "2차 면접", "임원 면접"]
  interviewFormat: string; // 예: "1:1", "다대다", "PT면접"
  
  // 면접 과정
  applicationProcess: string; // 지원 과정
  interviewProcess: string[]; // 각 단계별 면접 과정
  interviewQuestions: string[]; // 면접 질문들
  
  // 팁
  preparationTips: string; // 준비 팁
  attire: string; // 복장
  atmosphere: string; // 분위기
  
  // 결과
  result: 'pass' | 'fail' | 'waiting' | ''; // 합격/불합격/대기/비공개
  difficulty: number; // 난이도 (1-5)
  
  // 메타 정보
  author: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

// 후기 생성 함수
export function createEmptyReview(): Omit<Review, 'id' | 'authorId' | 'viewCount' | 'likeCount' | 'createdAt' | 'updatedAt'> {
  return {
    type: 'job',
    title: '',
    company: '',
    position: '',
    location: '',
    workPeriod: '',
    workType: '아르바이트',
    salary: '',
    pros: [],
    cons: [],
    mainTasks: [],
    overallReview: '',
    ratings: {
      salary: 0,
      workLifeBalance: 0,
      culture: 0,
      growth: 0,
      welfare: 0,
      overall: 0,
    },
    tips: '',
    interviewTips: '',
    recommendFor: [],
    notRecommendFor: [],
    category: '',
    tags: [],
    author: '',
    isVerified: false,
  };
}
