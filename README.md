# 🎓 Alba Scholarship - 통합 채용·장학금 플랫폼

> 대학생을 위한 원스톱 아르바이트 및 장학금 정보 제공 플랫폼  
> **AI 기반 맞춤형 추천 시스템**과 **실시간 후기 공유**를 통해 최적의 기회를 찾아드립니다.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7-orange)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)

-----

## 📑 목차

1. [프로젝트 개요](#-프로젝트-개요)
2. [시스템 아키텍처](#-시스템-아키텍처)
3. [주요 기능](#-주요-기능)
4. [기술 스택](#-기술-스택)
5. [데이터베이스 구조](#-데이터베이스-구조)
6. [설치 및 실행](#-설치-및-실행)
7. [환경 변수 설정](#-환경-변수-설정)
8. [프로젝트 구조](#-프로젝트-구조)
9. [API 엔드포인트](#-api-엔드포인트)
10. [UI/UX 디자인](#-uiux-디자인)
11. [보안 및 인증](#-보안-및-인증)
12. [자동화 시스템](#-자동화-시스템)
13. [배포 가이드](#-배포-가이드)
14. [트러블슈팅](#-트러블슈팅)
15. [향후 개발 계획](#-향후-개발-계획)

---

## 🎯 프로젝트 개요

### 비전
대학생들이 겪는 **정보 비대칭 문제**를 해결하고, **AI 기술**을 활용하여 개인 맞춤형 기회를 제공하는 플랫폼

### 핵심 가치
- 🎯 **맞춤형 추천**: AI가 분석한 개인별 최적의 기회 제공
- ⏱️ **시간 절약**: 흩어진 정보를 한 곳에서 통합 제공
- 💬 **신뢰성**: 실제 경험자 후기 기반 정보
- 🔔 **실시간 알림**: 마감 임박 정보 자동 알림
- 📊 **투명성**: 임금체불 업체 정보 공개

### 타겟 사용자
- 📚 대학생 (1~4학년)
- 👨‍🎓 대학원생
- 🎓 졸업생 (신입 구직자)

---

## 🏗️ 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                         클라이언트 Layer                         │
├─────────────────────────────────────────────────────────────────┤
│  Next.js 15 (React 18) + TypeScript                             │
│  ├─ SSR/SSG Pages                                               │
│  ├─ Client Components (로그인, 프로필, AI 추천)                  │
│  └─ Static Assets (Tailwind CSS, Lucide Icons)                 │
└─────────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────────┐
│                      서비스 Layer (API Routes)                   │
├─────────────────────────────────────────────────────────────────┤
│  API Routes (Next.js)                                           │
│  ├─ /api/ai-recommend        → AI 추천 생성                     │
│  ├─ /api/crawl-jobs          → 워크넷 크롤링                     │
│  ├─ /api/crawl-scholarships  → 한국장학재단 크롤링               │
│  ├─ /api/send-deadline-alerts → 마감 알림 발송                  │
│  ├─ /api/worknet             → 워크넷 API 연동                   │
│  └─ /api/generate-introduction → AI 자기소개서 생성              │
└─────────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────────┐
│                      데이터 Layer                                │
├─────────────────────────────────────────────────────────────────┤
│  Firebase Firestore (NoSQL Database)                           │
│  ├─ users           → 사용자 정보                               │
│  ├─ jobs            → 채용 정보                                 │
│  ├─ scholarships    → 장학금 정보                               │
│  ├─ reviews         → 후기                                      │
│  ├─ favoriteJobs    → 관심 공고                                 │
│  ├─ resumes         → 이력서                                    │
│  └─ notificationLogs → 알림 발송 기록                           │
│                                                                 │
│  Firebase Authentication                                        │
│  └─ Email/Password 인증                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────────┐
│                      외부 서비스 Layer                           │
├─────────────────────────────────────────────────────────────────┤
│  OpenAI API (GPT-4o-mini)    → AI 추천, 자기소개서 생성         │
│  Google Gemini API           → 이미지 인식, 대화형 AI           │
│  워크넷 Open API              → 실시간 채용 정보                 │
│  한국장학재단 API             → 장학금 정보                      │
│  고용노동부 API               → 임금체불 업체 정보               │
└─────────────────────────────────────────────────────────────────┘
                              ↕️
┌─────────────────────────────────────────────────────────────────┐
│                      자동화 Layer                                │
├─────────────────────────────────────────────────────────────────┤
│  Vercel Cron Jobs / GitHub Actions                             │
│  ├─ 매일 오전 9시: 마감 임박 알림 발송                          │
│  ├─ 매일 자정: 신규 채용/장학금 크롤링                          │
│  └─ 주 1회: 임금체불 업체 데이터 갱신                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ 주요 기능

### 1. 🔐 회원 인증 시스템
- **회원가입**: 이메일/비밀번호 + 이름/전화번호
- **이메일 인증**: Firebase Authentication 기반 인증 메일 발송
- **로그인/로그아웃**: 세션 관리
- **프로필 관리**: 사용자 정보 수정

### 2. 🤖 AI 맞춤 추천
#### 장학금 추천
- **입력 정보**:
  - 소득분위, 자산, 가구원 수
  - 대학교, 학과, 학년, 학점
  - 거주 지역
- **추천 알고리즘**:
  - OpenAI GPT-4o-mini 활용
  - 사용자 프로필 기반 필터링
  - 우선순위 점수 산정
  - 신청 가능성 분석

#### 채용 정보 추천
- **입력 정보**:
  - 희망 분야/직무/회사
  - 경력, 학력
  - 보유 기술, 자격증
  - 근무 가능 지역
- **추천 알고리즘**:
  - 워크넷 API 연동
  - 직무 매칭도 분석
  - 급여 수준 비교
  - 기업 정보 제공

### 3. 📝 이력서 관리
- **작성**: 단계별 이력서 입력 폼
- **AI 자기소개서 생성**: 
  - 사용자 정보 기반 자동 생성
  - OpenAI GPT-4o-mini 활용
  - 강점, 목표 입력 시 맞춤형 생성
- **저장/수정**: Firebase Firestore 저장
- **다운로드**: PDF/DOCX 형식 지원 (향후 개발)

### 4. 💬 후기 시스템
- **작성**: 알바/정규직/인턴 후기 작성
- **세부 평가**:
  - 급여 만족도
  - 워라밸
  - 조직 문화
  - 성장 가능성
  - 복지
- **상세 정보**:
  - 장점/단점
  - 주요 업무
  - 지원 팁
  - 면접 팁
  - 추천/비추천 대상
- **자세히 보기**: 모달로 전체 후기 확인
- **필터링**: 알바/정규직/인턴 분류

### 5. 🔔 실시간 알림
- **마감 임박 알림**:
  - D-3: 마감 3일 전
  - D-1: 마감 1일 전
- **신규 공고 알림**: 매일 오전 9시
- **장학금 알림**: 주 2회 (월, 목)
- **임금체불 업체 알림**: 명단 업데이트 시
- **중복 발송 방지**: Firestore 로그 관리

### 6. 📊 통계 및 분석
- **실시간 통계**:
  - 등록된 채용 공고 수
  - 등록된 장학금 수
  - 사용자 수
  - 후기 수
- **개인화 통계**:
  - 내 조건 맞는 공고 수
  - 저장한 관심 공고 수
  - 추천 정확도

### 7. ⚠️ 임금체불 확인
- **명단 조회**: 고용노동부 공개 명단
- **검색**: 회사명/사업자번호 검색
- **상세 정보**:
  - 체불 금액
  - 인원 수
  - 공개 날짜
  - 관할 지청
- **알림**: 신규 명단 추가 시

### 8. 🎯 스마트 필터링
- **관심 태그**: 사용자 관심 분야 설정
- **제외 조건**:
  - 야간 근무 제외
  - 주말 근무 제외
  - 먼 지역 제외
  - 최저임금 미달 제외
- **자동 필터링**: 추천 시 자동 적용

### 9. ❤️ 관심 공고 관리
- **저장**: 마음에 드는 공고 저장
- **알림 설정**: 마감일 알림 자동 설정
- **빠른 접근**: 프로필에서 한눈에 확인

### 10. 📱 반응형 디자인
- **모바일**: 1열 레이아웃
- **태블릿**: 2열 그리드
- **데스크톱**: 3~4열 그리드
- **터치 최적화**: 모바일 제스처 지원

---

## 🛠️ 기술 스택

### Frontend
```
Next.js 15          - React 프레임워크, SSR/SSG
React 18            - UI 라이브러리
TypeScript 5.9      - 타입 안정성
Tailwind CSS 3.4    - 유틸리티 CSS 프레임워크
Lucide React        - 아이콘 라이브러리
Framer Motion       - 애니메이션 라이브러리
```

### Backend & Database
```
Firebase Auth       - 사용자 인증
Firestore          - NoSQL 데이터베이스
Firebase Storage   - 파일 저장 (향후)
```

### AI & External APIs
```
OpenAI GPT-4o-mini  - AI 추천, 자기소개서 생성
Google Gemini       - 이미지 인식, 대화형 AI
워크넷 Open API      - 채용 정보
한국장학재단 API     - 장학금 정보
고용노동부 API       - 임금체불 정보
```

### DevOps & Automation
```
Vercel             - 배포 플랫폼
Vercel Cron        - 스케줄 작업
GitHub Actions     - CI/CD
ESLint             - 코드 품질 검사
```

### Development Tools
```
Node.js 24+        - 런타임
npm                - 패키지 매니저
Git                - 버전 관리
VS Code            - 개발 환경
```

---

## 🗄️ 데이터베이스 구조

### Firestore Collections

#### 1. `users` - 사용자 정보
```typescript
{
  uid: string;                  // Firebase Auth UID
  email: string;                // 이메일
  name: string;                 // 이름
  phone: string;                // 전화번호
  createdAt: Timestamp;         // 가입일
  hasAdditionalInfo: boolean;   // 추가 정보 입력 여부
  
  // 프로필 설정
  interestTags?: string[];      // 관심 태그 배열
  exclusions?: {                // 제외 조건
    nightShift: boolean;        // 야간 근무 제외
    weekend: boolean;           // 주말 근무 제외
    farLocation: boolean;       // 먼 지역 제외
    lowSalary: boolean;         // 최저임금 미달 제외
  };
  notifications?: {             // 알림 설정
    deadlineAlert: boolean;     // 마감 알림
    newJobAlert: boolean;       // 신규 공고 알림
    scholarshipAlert: boolean;  // 장학금 알림
    wageViolationAlert: boolean;// 임금체불 알림
  };
  
  // AI 추천을 위한 정보
  scholarshipInfo?: {           // 장학금 정보
    income: string;             // 소득분위
    assets: string;             // 자산
    householdSize: number;      // 가구원 수
    region: string;             // 지역
    university: string;         // 대학교
    grade: string;              // 학년
    major: string;              // 전공
    gpa: string;                // 학점
  };
  jobInfo?: {                   // 채용 정보
    desiredCompany: string;     // 희망 회사
    desiredField: string;       // 희망 분야
    desiredPosition: string;    // 희망 직무
    experience: string;         // 경력
    education: string;          // 학력
    skills: string[];           // 보유 기술
    certifications: string[];   // 자격증
    region: string;             // 근무 가능 지역
  };
}
```

#### 2. `jobs` - 채용 정보
```typescript
{
  id: string;                   // 공고 ID
  title: string;                // 제목
  company: string;              // 회사명
  location: string;             // 근무 지역
  salary: string;               // 급여
  type: string;                 // 근무 형태
  description: string;          // 설명
  requirements: string[];       // 자격 요건
  benefits: string[];           // 복리후생
  deadline: string;             // 마감일 (YYYY-MM-DD)
  website: string;              // 공고 링크
  category: string;             // 카테고리
  workHours: string;            // 근무 시간
  createdAt: Timestamp;         // 등록일
  updatedAt: Timestamp;         // 수정일
}
```

#### 3. `scholarships` - 장학금 정보
```typescript
{
  id: string;                   // 장학금 ID
  name: string;                 // 장학금명
  organization: string;         // 운영기관
  amount: string;               // 금액
  deadline: string;             // 마감일 (YYYY-MM-DD)
  requirements: string[];       // 자격 요건
  documents: string[];          // 제출 서류
  website: string;              // 신청 링크
  description: string;          // 설명
  targetGroup: string[];        // 대상 (대학생, 대학원생 등)
  incomeRequirement?: string;   // 소득 요건
  gpaRequirement?: string;      // 학점 요건
  createdAt: Timestamp;         // 등록일
  updatedAt: Timestamp;         // 수정일
}
```

#### 4. `reviews` - 후기
```typescript
{
  id: string;                   // 후기 ID
  type: 'job' | 'company' | 'intern'; // 유형
  
  // 기본 정보
  title: string;                // 제목
  company: string;              // 회사명
  position: string;             // 직무
  location: string;             // 지역
  
  // 근무 정보
  workPeriod: string;           // 근무 기간
  workType: string;             // 근무 형태
  salary: string;               // 급여
  
  // 후기 내용
  pros: string[];               // 장점
  cons: string[];               // 단점
  mainTasks: string[];          // 주요 업무
  overallReview: string;        // 종합 후기
  
  // 평점 (5점 만점)
  ratings: {
    salary: number;             // 급여 만족도
    workLifeBalance: number;    // 워라밸
    culture: number;            // 조직문화
    growth: number;             // 성장 가능성
    welfare: number;            // 복지
    overall: number;            // 종합 평점
  };
  
  // 팁 & 조언
  tips?: string;                // 지원자 팁
  interviewTips?: string;       // 면접 팁
  
  // 추천 대상
  recommendFor?: string[];      // 추천 대상
  notRecommendFor?: string[];   // 비추천 대상
  
  // 카테고리/태그
  category: string;             // 카테고리
  tags: string[];               // 태그
  
  // 메타 정보
  author: string;               // 작성자 닉네임
  authorId: string;             // 작성자 ID
  isVerified: boolean;          // 인증 여부
  viewCount: number;            // 조회수
  likeCount: number;            // 좋아요 수
  createdAt: Timestamp;         // 작성일
  updatedAt: Timestamp;         // 수정일
}
```

#### 5. `favoriteJobs` - 관심 공고
```typescript
{
  id: string;                   // 문서 ID
  userId: string;               // 사용자 ID
  jobId: string;                // 공고 ID
  jobData: object;              // 공고 정보 (조인 대체)
  createdAt: Timestamp;         // 저장일
}
```

#### 6. `resumes` - 이력서
```typescript
{
  // 기본 인적사항
  name: string;                 // 이름
  phone: string;                // 연락처
  email: string;                // 이메일
  region: string;               // 거주 지역
  birthYear?: string;           // 생년
  gender?: string;              // 성별
  
  // 학력 정보
  university: string;           // 학교명
  major: string;                // 전공
  grade: string;                // 학년
  status: '재학' | '휴학' | '졸업예정'; // 재학 상태
  admissionYear?: string;       // 입학년도
  graduationYear?: string;      // 졸업(예정)년도
  
  // 희망 지원 분야
  desiredField?: string;        // 희망 분야
  desiredPosition?: string;     // 희망 직무
  workType?: string[];          // 근무 형태
  
  // 근무 조건
  availableDays?: string[];     // 근무 가능 요일
  availableTime?: string;       // 근무 가능 시간
  workRegion?: string;          // 근무 가능 지역
  desiredSalary?: string;       // 희망 급여
  
  // 경력
  hasExperience: boolean;       // 경력 유무
  experiences: Array<{          // 경력 배열
    workplace: string;          // 근무처
    period: string;             // 기간
    duties: string;             // 담당 업무
  }>;
  
  // 자기소개
  introduction: string;         // 자기소개서
  
  // 스킬 및 자격증
  skills: {                     // 보유 기술
    computer: string[];         // 컴퓨터 기술
    languages: string[];        // 어학
    certificates: string[];     // 자격증
    others: string[];           // 기타
  };
  
  // 추가 정보
  exclusions?: string[];        // 불가능한 조건
  attachments?: string[];       // 첨부 파일 URL
  
  // 메타 정보
  userId: string;               // 작성자 ID
  createdAt: Timestamp;         // 작성일
  updatedAt: Timestamp;         // 수정일
}
```

#### 7. `notificationLogs` - 알림 발송 기록
```typescript
{
  id: string;                   // 로그 ID
  userId: string;               // 사용자 ID
  jobId: string;                // 공고 ID
  type: 'D-3' | 'D-1';         // 알림 타입
  email: string;                // 발송 이메일
  sentAt: Timestamp;            // 발송 시각
}
```

---

## 🚀 설치 및 실행

### 1. 사전 요구사항
```bash
Node.js >= 24.0.0
npm >= 10.0.0
Git
```

### 2. 클론 및 설치
```bash
# 저장소 클론
git clone https://github.com/your-repo/scholarship-money-project.git
cd scholarship-money-project

# 패키지 설치
npm install
```

### 3. 환경 변수 설정
`.env.local` 파일 생성 및 설정 (하단 [환경 변수 설정](#-환경-변수-설정) 참조)

### 4. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 5. 프로덕션 빌드
```bash
npm run build
npm start
```

---

## 🔑 환경 변수 설정

### `.env.local` 파일 생성
```env
# Firebase 설정 (Firebase Console에서 복사)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# OpenAI API 키
OPENAI_API_KEY=sk-...

# Google Gemini API 키 (선택)
GEMINI_API_KEY=AIza...

# Cron 작업 보안 키
CRON_SECRET=your-super-secret-key-change-this-in-production

# 이메일 서비스 (선택 - Resend 추천)
RESEND_API_KEY=re_...

# 또는 SendGrid
SENDGRID_API_KEY=SG....

# 또는 Gmail
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# 워크넷 API 키 (선택)
WORKNET_API_KEY=your_worknet_key

# 한국장학재단 API 키 (선택)
KOSAF_API_KEY=your_kosaf_key
```

### Firebase 설정 방법
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 새 프로젝트 생성
3. **Authentication** 활성화
   - 이메일/비밀번호 로그인 활성화
4. **Firestore Database** 생성
   - 프로덕션 모드로 시작
   - 보안 규칙 설정
5. 프로젝트 설정 → 웹 앱 추가
6. 설정 정보를 `.env.local`에 복사

### OpenAI API 키 발급
1. [OpenAI Platform](https://platform.openai.com/) 접속
2. API Keys 메뉴에서 새 키 생성
3. `.env.local`에 추가

---

## 📂 프로젝트 구조

```
scholarship-money-project/
│
├── .github/                    # GitHub 설정
│   └── workflows/              # GitHub Actions
│       └── cron-alerts.yml     # 자동 알림 워크플로우
│
├── public/                     # 정적 파일
│   └── images/                 # 이미지 파일
│
├── scripts/                    # 유틸리티 스크립트
│   ├── seed-data.js           # 샘플 데이터 시딩
│   ├── add-deu-scholarships.js # 동의대 장학금 추가
│   └── seed-reviews.js        # 후기 샘플 데이터
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   ├── page.tsx           # 메인 페이지
│   │   ├── globals.css        # 글로벌 스타일
│   │   │
│   │   ├── login/             # 로그인
│   │   │   └── page.tsx
│   │   ├── register/          # 회원가입
│   │   │   └── page.tsx
│   │   ├── profile/           # 프로필
│   │   │   └── page.tsx
│   │   ├── resume/            # 이력서 작성
│   │   │   └── page.tsx
│   │   ├── additional-info/   # 추가 정보 입력
│   │   │   └── page.tsx
│   │   ├── ai-recommend/      # AI 추천 결과
│   │   │   ├── page.tsx
│   │   │   └── AIRecommendContent.tsx
│   │   │
│   │   ├── jobs/              # 채용 정보
│   │   │   └── page.tsx
│   │   ├── scholarship/       # 장학금 정보
│   │   │   └── page.tsx
│   │   ├── reviews/           # 후기
│   │   │   └── page.tsx
│   │   │
│   │   ├── wage-violation/    # 임금체불 확인
│   │   │   └── page.tsx
│   │   ├── minimum-wage/      # 최저임금 정보
│   │   │   └── page.tsx
│   │   ├── job-scam-prevention/ # 알바 사기 예방
│   │   │   └── page.tsx
│   │   │
│   │   ├── about/             # 소개
│   │   │   └── page.tsx
│   │   ├── faq/               # FAQ
│   │   │   └── page.tsx
│   │   ├── contact/           # 문의
│   │   │   └── page.tsx
│   │   ├── terms/             # 이용약관
│   │   │   └── page.tsx
│   │   ├── privacy/           # 개인정보처리방침
│   │   │   └── page.tsx
│   │   │
│   │   └── api/               # API Routes
│   │       ├── ai-recommend/
│   │       │   └── route.ts
│   │       ├── generate-introduction/
│   │       │   └── route.ts
│   │       ├── crawl-jobs/
│   │       │   └── route.ts
│   │       ├── crawl-scholarships/
│   │       │   └── route.ts
│   │       ├── send-deadline-alerts/
│   │       │   └── route.ts
│   │       ├── worknet/
│   │       │   └── route.ts
│   │       └── add-deu-scholarships/
│   │           └── route.ts
│   │
│   ├── components/            # React 컴포넌트
│   │   ├── Navigation.tsx     # 상단 네비게이션
│   │   ├── NewNavigation.tsx  # 새 네비게이션
│   │   ├── Footer.tsx         # 푸터
│   │   ├── NewFooter.tsx      # 새 푸터
│   │   ├── Hero.tsx           # 히어로 섹션
│   │   ├── NewHero.tsx        # 새 히어로 섹션
│   │   ├── DualSection.tsx    # 듀얼 섹션
│   │   ├── Statistics.tsx     # 통계 섹션
│   │   ├── StatisticsSection.tsx # 통계 섹션 (새)
│   │   ├── FeaturedJobs.tsx   # 추천 알바
│   │   ├── JobCategories.tsx  # 알바 카테고리
│   │   ├── JobCard.tsx        # 알바 카드
│   │   ├── ScholarshipGrid.tsx # 장학금 그리드
│   │   ├── ScholarshipSection.tsx # 장학금 섹션
│   │   ├── ScholarshipCard.tsx # 장학금 카드
│   │   ├── ReviewShowcase.tsx # 후기 쇼케이스
│   │   ├── ReviewSection.tsx  # 후기 섹션
│   │   ├── ReviewsMarquee.tsx # 후기 마퀴
│   │   ├── FAQSection.tsx     # FAQ 섹션
│   │   ├── HowItWorks.tsx     # 사용 방법
│   │   ├── ValueProposition.tsx # 가치 제안
│   │   ├── SmartSearch.tsx    # 스마트 검색
│   │   ├── RotatingWords.tsx  # 회전 텍스트
│   │   ├── ClientLayout.tsx   # 클라이언트 레이아웃
│   │   ├── Providers.tsx      # Provider 래퍼
│   │   ├── modals/
│   │   │   └── AdditionalInfoModal.tsx # 추가 정보 모달
│   │   └── ui/
│   │       └── button.tsx     # 버튼 컴포넌트
│   │
│   ├── contexts/              # React Context
│   │   └── AuthContext.tsx    # 인증 컨텍스트
│   │
│   ├── lib/                   # 유틸리티 라이브러리
│   │   ├── firebase/
│   │   │   ├── config.ts      # Firebase 설정
│   │   │   └── profile.ts     # 프로필 관련 함수
│   │   ├── firebase.ts        # Firebase 헬퍼
│   │   ├── data.ts            # 샘플 데이터
│   │   ├── scholarship.ts     # 장학금 데이터
│   │   ├── worknet.ts         # 워크넷 API
│   │   └── busan-job.ts       # 부산 알바 API
│   │
│   └── types/                 # TypeScript 타입 정의
│       ├── resume.ts          # 이력서 타입
│       ├── review.ts          # 후기 타입
│       ├── scholarship.ts     # 장학금 타입
│       ├── crawl.ts           # 크롤링 타입
│       ├── worknet.ts         # 워크넷 타입
│       ├── busan-job.ts       # 부산 알바 타입
│       └── wage-violation.ts  # 임금체불 타입
│
├── .env.local                 # 환경 변수 (gitignore)
├── .gitignore                 # Git 제외 파일
├── next.config.mjs            # Next.js 설정
├── tailwind.config.mjs        # Tailwind 설정
├── tsconfig.json              # TypeScript 설정
├── package.json               # 패키지 정보
├── vercel.json                # Vercel 배포 설정
│
└── README.md                  # 프로젝트 설명
```

---

## 🔌 API 엔드포인트

### 1. AI 추천
```
POST /api/ai-recommend
```
**Request Body**:
```json
{
  "type": "scholarship" | "job",
  "userInfo": {
    "scholarshipInfo": { ... },
    "jobInfo": { ... }
  }
}
```
**Response**:
```json
{
  "success": true,
  "recommendations": [
    {
      "title": "...",
      "score": 95,
      "reason": "...",
      "details": { ... }
    }
  ]
}
```

### 2. 자기소개서 생성
```
POST /api/generate-introduction
```
**Request Body**:
```json
{
  "name": "홍길동",
  "major": "컴퓨터공학",
  "grade": "3학년",
  "desiredPosition": "웹 개발자",
  "skills": "React, Node.js",
  "experiences": "...",
  "strengths": "책임감",
  "goal": "성장하고 싶습니다"
}
```

### 3. 마감 알림 발송
```
POST /api/send-deadline-alerts
Authorization: Bearer {CRON_SECRET}
```
**Response**:
```json
{
  "success": true,
  "message": "5개의 알림을 발송했습니다.",
  "sentCount": 5
}
```

### 4. 워크넷 API
```
GET /api/worknet?keyword=카페&region=부산
```

### 5. 크롤링
```
POST /api/crawl-jobs
POST /api/crawl-scholarships
```

---

## 🎨 UI/UX 디자인

### 디자인 철학
1. **미니멀리즘**: 불필요한 요소 제거, 본질에 집중
2. **타이포그래피**: 깔끔한 폰트, 명확한 계층 구조
3. **색상**: 흑백 기조 + 포인트 컬러
4. **인터랙션**: 부드러운 전환, 호버 효과

### 색상 팔레트
```css
Primary:
- Gray 900 (#111827) - 메인 텍스트
- Gray 600 (#4b5563) - 보조 텍스트
- White (#ffffff) - 배경

Accent:
- Blue 500 (#3b82f6) - 링크, 버튼
- Purple 500 (#a855f7) - AI 기능
- Yellow 500 (#eab308) - 장학금
- Green 500 (#22c55e) - 성공
- Red 500 (#ef4444) - 경고

Neutral:
- Gray 50 (#fafafa) - 카드 배경
- Gray 100 (#f3f4f6) - 구분선
```

### 타이포그래피
```css
Headings:
- H1: 3rem (48px) / font-bold
- H2: 2.25rem (36px) / font-bold
- H3: 1.875rem (30px) / font-bold
- H4: 1.5rem (24px) / font-semibold

Body:
- Large: 1.125rem (18px)
- Normal: 1rem (16px)
- Small: 0.875rem (14px)
- XSmall: 0.75rem (12px)
```

### 간격 시스템
```css
Spacing Scale (Tailwind):
- 1: 0.25rem (4px)
- 2: 0.5rem (8px)
- 3: 0.75rem (12px)
- 4: 1rem (16px)
- 6: 1.5rem (24px)
- 8: 2rem (32px)
- 12: 3rem (48px)
- 16: 4rem (64px)
```

### 반응형 브레이크포인트
```css
sm:  640px  (모바일)
md:  768px  (태블릿)
lg:  1024px (데스크톱)
xl:  1280px (대형 데스크톱)
2xl: 1536px (초대형 데스크톱)
```

### 애니메이션
```css
Transition Duration:
- Fast: 150ms
- Normal: 300ms
- Slow: 700ms

Easing:
- ease-in-out (기본)
- ease-out (등장)
- ease-in (퇴장)
```

---

## 🔒 보안 및 인증

### Firebase Authentication
- **이메일/비밀번호** 인증
- **이메일 인증** 필수
- **세션 관리**: Firebase Auth
- **토큰 갱신**: 자동

### Firestore 보안 규칙
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 사용자 문서: 본인만 읽기/쓰기
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
    
    // 이력서: 본인만 접근
    match /resumes/{resumeId} {
      allow read, write: if request.auth != null 
        && request.resource.data.userId == request.auth.uid;
    }
    
    // 관심 공고: 본인만 접근
    match /favoriteJobs/{favoriteId} {
      allow read, write: if request.auth != null 
        && request.resource.data.userId == request.auth.uid;
    }
    
    // 공개 데이터: 모두 읽기, 인증된 사용자만 쓰기
    match /jobs/{jobId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /scholarships/{scholarshipId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // 후기: 모두 읽기, 작성자만 삭제
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null 
        && request.auth.uid == resource.data.authorId;
    }
  }
}
```

### API 보안
- **CRON_SECRET**: Cron Job 인증
- **CORS**: 허용된 도메인만 접근
- **Rate Limiting**: 과도한 요청 차단 (Vercel 자동)
- **환경 변수**: 민감한 정보는 `.env.local`에만 저장

### 개인정보 보호
- **최소 수집**: 필요한 정보만 수집
- **암호화**: Firebase가 자동 암호화
- **삭제 권리**: 사용자가 직접 계정 삭제 가능
- **익명화**: 후기 작성 시 닉네임만 표시

---

## ⚙️ 자동화 시스템

### 1. 마감 알림 (Cron Job)
**실행 주기**: 매일 오전 9시 (KST)
**역할**:
- D-3, D-1 마감 공고 확인
- 알림 설정 ON 사용자 필터링
- 이메일 알림 발송
- 발송 기록 저장 (중복 방지)

**설정 파일**: `vercel.json`
```json
{
  "crons": [
    {
      "path": "/api/send-deadline-alerts",
      "schedule": "0 0 * * *"
    }
  ]
}
```

### 2. 데이터 크롤링 (선택)
**실행 주기**: 매일 자정
**역할**:
- 워크넷 신규 채용 정보 수집
- 한국장학재단 장학금 정보 수집
- 고용노동부 임금체불 명단 갱신

### 3. GitHub Actions (CI/CD)
**트리거**: Push to main branch
**역할**:
- 코드 린팅
- 타입 체크
- 빌드 테스트
- Vercel 자동 배포

---

## 🚢 배포 가이드

### Vercel 배포 (추천)

#### 1. Vercel 계정 연동
```bash
npm i -g vercel
vercel login
```

#### 2. 프로젝트 초기화
```bash
vercel
```

#### 3. 환경 변수 설정
Vercel Dashboard → Settings → Environment Variables
- `.env.local`의 모든 변수 추가

#### 4. 배포
```bash
vercel --prod
```

#### 5. Cron Job 확인
Vercel Dashboard → Settings → Cron Jobs
- `/api/send-deadline-alerts` 확인

### 커스텀 서버 배포

#### 1. Docker (선택)
```dockerfile
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### 2. 빌드 및 실행
```bash
docker build -t scholarship-app .
docker run -p 3000:3000 \
  --env-file .env.local \
  scholarship-app
```

#### 3. Nginx 리버스 프록시
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔧 트러블슈팅

### 1. Firebase 연결 오류
**증상**: "Firebase: Error (auth/configuration-not-found)"
**해결**:
```bash
# .env.local 파일 확인
# NEXT_PUBLIC_ 접두사 확인
# Firebase Console에서 설정 재확인
```

### 2. OpenAI API 오류
**증상**: "Rate limit exceeded"
**해결**:
- API 키 확인
- 사용량 확인 (OpenAI Dashboard)
- 요청 수 제한 고려

### 3. Cron Job 실행 안 됨
**증상**: 알림이 발송되지 않음
**해결**:
```bash
# 로컬 테스트
curl -X POST http://localhost:3000/api/send-deadline-alerts \
  -H "Authorization: Bearer your-secret"

# Vercel 로그 확인
vercel logs
```

### 4. 이미지 로딩 실패
**증상**: Next.js Image 404 오류
**해결**:
```javascript
// next.config.mjs
export default {
  images: {
    domains: ['your-image-domain.com'],
  },
};
```

### 5. 빌드 오류
**증상**: Type errors during build
**해결**:
```bash
# 타입 체크
npm run type-check

# 캐시 삭제
rm -rf .next
npm run build
```

---

## 🚀 향후 개발 계획

### Phase 1 (Q1 2025) ✅ 완료
- [x] 기본 UI/UX 구축
- [x] Firebase 인증 시스템
- [x] AI 추천 시스템
- [x] 후기 시스템
- [x] 이력서 작성
- [x] 마감 알림

### Phase 2 (Q2 2025) 🔄 진행 중
- [ ] 모바일 앱 (React Native)
- [ ] 채팅 상담 (실시간)
- [ ] 화상 면접 연습 (WebRTC)
- [ ] 포트폴리오 생성기
- [ ] 급여 계산기

### Phase 3 (Q3 2025) 📋 계획
- [ ] 기업 페이지 (채용 공고 직접 등록)
- [ ] 대학 파트너십 (장학금 연동)
- [ ] AI 면접관 (모의 면접)
- [ ] 커뮤니티 기능 (Q&A)
- [ ] 추천인 시스템

### Phase 4 (Q4 2025) 💡 구상
- [ ] 블록체인 자격증 (NFT)
- [ ] 메타버스 채용 박람회
- [ ] 글로벌 확장 (영어 버전)
- [ ] 프리미엄 멤버십
- [ ] API 서비스 제공

---

## 📊 성능 최적화

### 1. 이미지 최적화
- Next.js Image 컴포넌트 사용
- WebP 자동 변환
- Lazy loading
- Priority 속성 활용

### 2. 코드 스플리팅
- Dynamic imports
- Route-based splitting
- Component lazy loading

### 3. 캐싱 전략
- Firestore 쿼리 캐싱
- API 응답 캐싱
- Static Generation (SSG)
- Incremental Static Regeneration (ISR)

### 4. 성능 측정
```bash
# Lighthouse 스코어
npm run build
npm start
# Chrome DevTools → Lighthouse

# Bundle 분석
npm install -g @next/bundle-analyzer
npm run analyze
```

---

## 🧪 테스트

### 단위 테스트 (예정)
```bash
npm install --save-dev jest @testing-library/react
npm test
```

### E2E 테스트 (예정)
```bash
npm install --save-dev playwright
npm run test:e2e
```

---

## 📝 기여 가이드

### 1. Fork & Clone
```bash
git clone https://github.com/Junhwakang/Scholarship-Money-Project

### 2. 브랜치 생성
```bash
git checkout -b feature/your-feature-name
```

### 3. 커밋
```bash
git commit -m "feat: add new feature"
```

### 4. Pull Request
- 명확한 제목과 설명
- 스크린샷 첨부 (UI 변경 시)
- 테스트 완료 확인

---

## 📄 라이선스

MIT License

Copyright (c) 2025 Alba Scholarship

---

## 📞 연락처

- **이메일**: rkdwnsghk12@naver.com
- **전화**: 010-3180-5728
- **주소**: 부산광역시 부산진구
- **GitHub**: https://github.com/Junhwakang/Scholarship-Money-Project
- **Website**: http://35.216.77.238/

---

## 🙏 감사의 말

이 프로젝트는 다음 오픈소스 프로젝트들의 도움을 받았습니다:
- Next.js
- React
- Firebase
- Tailwind CSS
- OpenAI
- Lucide Icons

그리고 모든 기여자분들께 감사드립니다! 🎉

---

## 📚 참고 문서

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Firebase 공식 문서](https://firebase.google.com/docs)
- [OpenAI API 문서](https://platform.openai.com/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [워크넷 Open API](https://openapi.work.go.kr/)
- [한국장학재단 API](https://www.kosaf.go.kr/)

---

**최종 업데이트**: 2025년 12월  
**버전**: 1.0.0  
**작성자**: Alba Scholarship Team

---

*이 문서는 프로젝트의 모든 측면을 포괄적으로 다루고 있습니다. 추가 질문이나 기여는 언제든 환영합니다!* ✨
