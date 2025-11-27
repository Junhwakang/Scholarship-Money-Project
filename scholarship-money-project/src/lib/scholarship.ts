import { ScholarshipApiParams, ScholarshipApiResponse, Scholarship } from '@/types/scholarship';

// 전국대학별 장학금 API 호출 함수
export async function fetchScholarships(params: Partial<ScholarshipApiParams> = {}): Promise<{
  scholarships: Scholarship[];
  totalCount: number;
}> {
  const apiKey = process.env.NEXT_PUBLIC_SCHOLARSHIP_API_KEY || '195a040fe3deffc304ac8e3a10c7a72fcf3a2493a4c1e6e27129c15d5f02ec53';
  
  // 기본 파라미터
  const defaultParams: any = {
    serviceKey: decodeURIComponent(apiKey),
    pageNo: params.pageNo || 0,
    numOfRows: params.numOfRows || 100,
    type: 'json',
  };

  // 추가 파라미터
  if (params.UNIV_NM) defaultParams.UNIV_NM = params.UNIV_NM;
  if (params.CTPV_NM) defaultParams.CTPV_NM = params.CTPV_NM;
  if (params.UNIV_SE_NM) defaultParams.UNIV_SE_NM = params.UNIV_SE_NM;
  if (params.SCHLSHIP_TYPE_SE_NM) defaultParams.SCHLSHIP_TYPE_SE_NM = params.SCHLSHIP_TYPE_SE_NM;

  // URL 파라미터 생성
  const queryParams = new URLSearchParams();
  Object.entries(defaultParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  const apiUrl = `https://api.data.go.kr/openapi/tn_pubr_public_univ_schlship_amt_api?${queryParams.toString()}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`API 요청 실패: ${response.status}`);
      return {
        scholarships: [],
        totalCount: 0
      };
    }

    const data: ScholarshipApiResponse = await response.json();
    
    // 데이터 추출
    if (data.response?.body?.items && Array.isArray(data.response.body.items)) {
      const scholarships = data.response.body.items;
      const totalCount = data.response.body.totalCount || scholarships.length;
      
      return {
        scholarships,
        totalCount
      };
    }

    return {
      scholarships: [],
      totalCount: 0
    };
  } catch (error) {
    console.error('장학금 API 호출 오류:', error);
    return {
      scholarships: [],
      totalCount: 0
    };
  }
}

// 금액 포맷팅 함수
export function formatAmount(amount: string): string {
  if (!amount) return '정보 없음';
  
  const num = parseInt(amount);
  if (isNaN(num)) return amount;
  
  // 억 단위
  if (num >= 100000000) {
    const billion = Math.floor(num / 100000000);
    const remainder = num % 100000000;
    if (remainder === 0) {
      return `${billion}억원`;
    } else {
      const million = Math.floor(remainder / 10000);
      return `${billion}억 ${million}만원`;
    }
  }
  
  // 만 단위
  if (num >= 10000) {
    const million = Math.floor(num / 10000);
    return `${million}만원`;
  }
  
  return `${num.toLocaleString()}원`;
}

// 장학금 유형 옵션
export const scholarshipTypes = [
  { value: '', label: '전체' },
  { value: '국가장학금', label: '국가장학금' },
  { value: '지방자치단체장학금', label: '지방자치단체장학금' },
  { value: '교내장학금', label: '교내장학금' },
  { value: '교외장학금', label: '교외장학금' },
];

// 대학 구분 옵션
export const universityTypes = [
  { value: '', label: '전체' },
  { value: '국립', label: '국립' },
  { value: '공립', label: '공립' },
  { value: '사립', label: '사립' },
];

// 시도 목록
export const regions = [
  { value: '', label: '전체' },
  { value: '서울', label: '서울특별시' },
  { value: '부산', label: '부산광역시' },
  { value: '대구', label: '대구광역시' },
  { value: '인천', label: '인천광역시' },
  { value: '광주', label: '광주광역시' },
  { value: '대전', label: '대전광역시' },
  { value: '울산', label: '울산광역시' },
  { value: '세종', label: '세종특별자치시' },
  { value: '경기', label: '경기도' },
  { value: '강원', label: '강원도' },
  { value: '충북', label: '충청북도' },
  { value: '충남', label: '충청남도' },
  { value: '전북', label: '전라북도' },
  { value: '전남', label: '전라남도' },
  { value: '경북', label: '경상북도' },
  { value: '경남', label: '경상남도' },
  { value: '제주', label: '제주특별자치도' },
];
