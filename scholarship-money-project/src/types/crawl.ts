// Scholarship 타입
export interface Scholarship {
  id: string;
  name: string;
  organization: string;
  amount: string;
  requirements: string[];
  reason?: string;
  applicationMethod: string;
  website: string;
  deadline: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

// Job 타입
export interface Job {
  id: string;
  company: string;
  position: string;
  description: string;
  requirements: string[];
  preferred: string[];
  reason?: string;
  salary: string;
  applicationMethod: string;
  website: string;
  deadline: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

// 크롤링 메타데이터
export interface CrawlMetadata {
  lastCrawlTime: Date;
  scholarshipCount: number;
  jobCount: number;
  status: 'success' | 'failed' | 'running';
  errorMessage?: string;
}
