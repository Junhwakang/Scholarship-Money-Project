import { ScholarshipApiParams, Scholarship } from '@/types/scholarship';

// 전국대학별 장학금 API 호출 함수 (Next.js API Route 사용)
export async function fetchScholarships(params: Partial<ScholarshipApiParams> = {}): Promise<{
  scholarships: Scholarship[];
  totalCount: number;
}> {
  try {
    // Next.js API Route로 요청
    const queryParams = new URLSearchParams();
    
    queryParams.append('pageNo', String(params.pageNo || 1));
    queryParams.append('numOfRows', String(params.numOfRows || 100));
    
    if (params.UNIV_NM) queryParams.append('UNIV_NM', params.UNIV_NM);
    if (params.CTPV_NM) queryParams.append('CTPV_NM', params.CTPV_NM);
    if (params.UNIV_SE_NM) queryParams.append('UNIV_SE_NM', params.UNIV_SE_NM);
    if (params.SCHLSHIP_TYPE_SE_NM) queryParams.append('SCHLSHIP_TYPE_SE_NM', params.SCHLSHIP_TYPE_SE_NM);

    const apiUrl = `/api/scholarship?${queryParams.toString()}`;
    
    console.log('장학금 API Route 호출:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('장학금 API 에러:', errorData);
      throw new Error(errorData.error || 'API 호출 실패');
    }

    const contentType = response.headers.get('content-type');
    console.log('응답 Content-Type:', contentType);

    let scholarships: Scholarship[] = [];
    let totalCount = 0;

    if (contentType?.includes('application/xml')) {
      // XML 응답 처리
      const xmlText = await response.text();
      console.log('XML 응답 받음:', xmlText.substring(0, 300));
      
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        console.error('XML 파싱 에러:', parseError.textContent);
        throw new Error('XML 파싱 실패');
      }

      // totalCount 추출
      const totalElement = xmlDoc.querySelector('totalCount');
      totalCount = totalElement ? parseInt(totalElement.textContent || '0') : 0;

      // item 노드들 추출
      const itemNodes = xmlDoc.querySelectorAll('item');
      console.log('XML item 개수:', itemNodes.length);

      itemNodes.forEach(node => {
        const scholarship: Scholarship = {
          CRTR_YR: node.querySelector('CRTR_YR')?.textContent || '',
          CTPV_CD: node.querySelector('CTPV_CD')?.textContent || '',
          CTPV_NM: node.querySelector('CTPV_NM')?.textContent || '',
          UNIV_NM: node.querySelector('UNIV_NM')?.textContent || '',
          UNIV_SE_NM: node.querySelector('UNIV_SE_NM')?.textContent || '',
          SCHLSHIP_TYPE_SE_NM: node.querySelector('SCHLSHIP_TYPE_SE_NM')?.textContent || '',
          SCHLJO_SE_NM: node.querySelector('SCHLJO_SE_NM')?.textContent || '',
          SCHLSHIP: node.querySelector('SCHLSHIP')?.textContent || '',
          CRTR_YMD: node.querySelector('CRTR_YMD')?.textContent || '',
          instt_code: node.querySelector('instt_code')?.textContent || '',
          instt_nm: node.querySelector('instt_nm')?.textContent || '',
        };
        scholarships.push(scholarship);
      });

    } else {
      // JSON 응답 처리
      const data = await response.json();
      console.log('=== JSON 응답 전체 ===');
      console.log(JSON.stringify(data, null, 2));
      
      // 다양한 응답 구조 처리
      if (data.response) {
        console.log('response 객체 있음');
        
        if (data.response.body) {
          console.log('body 객체 있음');
          console.log('body 내용:', data.response.body);
          
          totalCount = data.response.body.totalCount || 0;
          console.log('totalCount:', totalCount);
          
          if (data.response.body.items) {
            console.log('items 있음:', typeof data.response.body.items);
            
            // items가 배열인 경우
            if (Array.isArray(data.response.body.items)) {
              scholarships = data.response.body.items;
              console.log('items는 배열:', scholarships.length);
            }
            // items.item이 있는 경우
            else if (data.response.body.items.item) {
              const items = data.response.body.items.item;
              scholarships = Array.isArray(items) ? items : [items];
              console.log('items.item:', scholarships.length);
            }
            // items가 객체인 경우
            else {
              console.log('items가 이상한 구조:', data.response.body.items);
            }
          } else {
            console.log('items 없음!');
          }
        } else {
          console.log('body 없음!');
        }
        
        // header 확인
        if (data.response.header) {
          console.log('API 응답 코드:', data.response.header.resultCode);
          console.log('API 응답 메시지:', data.response.header.resultMsg);
        }
      } 
      // response 객체가 없는 경우
      else if (Array.isArray(data)) {
        scholarships = data;
        totalCount = data.length;
        console.log('data가 바로 배열:', scholarships.length);
      }
      else {
        console.log('알 수 없는 응답 구조:', Object.keys(data));
      }
    }

    console.log(`장학금 데이터 파싱 완료: ${scholarships.length}개`);
    
    return {
      scholarships,
      totalCount
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
