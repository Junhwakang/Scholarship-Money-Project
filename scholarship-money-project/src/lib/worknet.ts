import { WorknetApiParams, WorknetApiResponse, WorknetJob } from '@/types/worknet';
import { XMLParser } from 'fast-xml-parser';

// 워크넷 채용정보 API 호출 함수
export async function fetchWorknetJobs(params: Partial<WorknetApiParams> = {}): Promise<{
  jobs: WorknetJob[];
  totalCount: number;
}> {
  const apiKey = process.env.NEXT_PUBLIC_WORKNET_API_KEY || '682e2bb1-b106-43ef-bcb7-45367d32f8bb';
  
  // 기본 파라미터
  const defaultParams: WorknetApiParams = {
    authKey: apiKey,
    callTp: 'L',
    returnType: 'xml',
    startPage: params.startPage || 1,
    display: params.display || 10,
    sortOrderBy: 'DESC',
    ...params,
  };

  // URL 파라미터 생성
  const queryParams = new URLSearchParams();
  Object.entries(defaultParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  const apiUrl = `https://www.work24.go.kr/cm/openApi/call/wk/callOpenApiSvcInfo210L01.do?${queryParams.toString()}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const xmlData = await response.text();
    
    // XML 파싱
    const parser = new XMLParser({
      ignoreAttributes: false,
      parseTagValue: true,
    });
    
    const result = parser.parse(xmlData);
    
    // 데이터 추출
    if (result.wantedRoot) {
      const wantedData = result.wantedRoot.wanted;
      const jobs = Array.isArray(wantedData) ? wantedData : wantedData ? [wantedData] : [];
      const totalCount = result.wantedRoot.total || 0;
      
      return {
        jobs,
        totalCount
      };
    }

    return {
      jobs: [],
      totalCount: 0
    };
  } catch (error) {
    console.error('워크넷 API 호출 오류:', error);
    return {
      jobs: [],
      totalCount: 0
    };
  }
}

// 날짜 포맷팅 함수
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  // YYYYMMDD 형식을 YYYY.MM.DD로 변환
  if (dateString.length === 8) {
    return `${dateString.substring(0, 4)}.${dateString.substring(4, 6)}.${dateString.substring(6, 8)}`;
  }
  
  return dateString;
}

// 마감일까지 남은 일수 계산
export function getDaysUntilClose(closeDt: string): number {
  if (!closeDt || closeDt.length !== 8) return 999;
  
  const year = parseInt(closeDt.substring(0, 4));
  const month = parseInt(closeDt.substring(4, 6)) - 1;
  const day = parseInt(closeDt.substring(6, 8));
  
  const closeDate = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = closeDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// 급여 포맷팅
export function formatSalary(sal: string, salTpNm: string): string {
  if (!sal) return '급여 협의';
  
  return `${sal} (${salTpNm || ''})`;
}
