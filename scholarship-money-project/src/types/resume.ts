// 이력서 관련 타입 정의

export interface ResumeExperience {
  workplace: string;
  period: string;
  duties: string;
}

export interface ResumeSkills {
  computer: string[];
  languages: string[];
  certificates: string[];
  others: string[];
}

export interface ResumeExclusions {
  nightShift: boolean;
  weekend: boolean;
  farLocation: boolean;
  specificIndustries: string[];
}

export interface ResumeAttachments {
  resumePdf?: string;
  portfolioLink?: string;
}

export interface Resume {
  // 기본 인적사항
  name: string;
  phone: string;
  email: string;
  region: string;
  birthYear?: string;
  gender?: string;

  // 학력 정보
  university: string;
  major: string;
  grade: string;
  status: '재학' | '휴학' | '졸업예정';
  admissionYear: string;
  graduationYear: string;

  // 희망 지원 분야
  desiredField: string;
  desiredPosition: string;
  workType: string[];

  // 근무 가능 조건
  availableDays: string[];
  availableTime: string;
  workRegion: string;
  desiredSalary?: string;

  // 경력
  hasExperience: boolean;
  experiences: ResumeExperience[];

  // 자기소개
  introduction: string;

  // 보유 역량
  skills: ResumeSkills;

  // 희망 제외 조건
  exclusions: ResumeExclusions;

  // 첨부 파일
  attachments?: ResumeAttachments;

  // 메타 정보
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// 관심 공고 (찜)
export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  jobData: {
    company: string;
    position: string;
    description: string;
    requirements: string[];
    preferred: string[];
    reason: string;
    salary: string;
    location?: string;
    workHours?: string;
    applicationMethod: string;
    website: string;
    deadline: string;
    imageUrl?: string;
  };
  createdAt: Date;
}

// 폼 초기값 생성 함수
export function createEmptyResume(): Resume {
  return {
    name: '',
    phone: '',
    email: '',
    region: '',
    birthYear: '',
    gender: '',
    university: '',
    major: '',
    grade: '',
    status: '재학',
    admissionYear: '',
    graduationYear: '',
    desiredField: '',
    desiredPosition: '',
    workType: [],
    availableDays: [],
    availableTime: '',
    workRegion: '',
    desiredSalary: '',
    hasExperience: false,
    experiences: [],
    introduction: '',
    skills: {
      computer: [],
      languages: [],
      certificates: [],
      others: [],
    },
    exclusions: {
      nightShift: false,
      weekend: false,
      farLocation: false,
      specificIndustries: [],
    },
    attachments: {},
    userId: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
