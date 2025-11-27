import { WorknetApiParams, WorknetJob } from '@/types/worknet';

// 워크넷 채용정보 API 호출 함수 (Next.js API Route 사용)
export async function fetchWorknetJobs(params: Partial<WorknetApiParams> = {}): Promise<{
  jobs: WorknetJob[];
  totalCount: number;
}> {
  try {
    // Next.js API Route로 요청
    const queryParams = new URLSearchParams();
    
    queryParams.append('startPage', String(params.startPage || 1));
    queryParams.append('display', String(params.display || 10));
    
    if (params.keyword) queryParams.append('keyword', params.keyword);
    if (params.region) queryParams.append('region', params.region);
    if (params.career) queryParams.append('career', params.career);
    if (params.salTp) queryParams.append('salTp', params.salTp);

    const apiUrl = `/api/worknet?${queryParams.toString()}`;
    
    console.log('API Route 호출:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API 호출 실패');
    }

    const xmlText = await response.text();
    
    // XML 파싱
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // 파싱 에러 체크
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      console.error('XML 파싱 에러:', parseError.textContent);
      throw new Error('XML 파싱 실패');
    }

    // total 추출
    const totalElement = xmlDoc.querySelector('total');
    const totalCount = totalElement ? parseInt(totalElement.textContent || '0') : 0;

    // wanted 노드들 추출
    const wantedNodes = xmlDoc.querySelectorAll('wanted');
    const jobs: WorknetJob[] = [];

    wantedNodes.forEach(node => {
      const job: WorknetJob = {
        wantedAuthNo: node.querySelector('wantedAuthNo')?.textContent || '',
        company: node.querySelector('company')?.textContent || '',
        busino: node.querySelector('busino')?.textContent || '',
        indTpNm: node.querySelector('indTpNm')?.textContent || '',
        title: node.querySelector('title')?.textContent || '',
        salTpNm: node.querySelector('salTpNm')?.textContent || '',
        sal: node.querySelector('sal')?.textContent || '',
        minSal: node.querySelector('minSal')?.textContent || '',
        maxSal: node.querySelector('maxSal')?.textContent || '',
        region: node.querySelector('region')?.textContent || '',
        holidayTpNm: node.querySelector('holidayTpNm')?.textContent || '',
        minEdubg: node.querySelector('minEdubg')?.textContent || '',
        maxEdubg: node.querySelector('maxEdubg')?.textContent || '',
        career: node.querySelector('career')?.textContent || '',
        regDt: node.querySelector('regDt')?.textContent || '',
        closeDt: node.querySelector('closeDt')?.textContent || '',
        infoSvc: node.querySelector('infoSvc')?.textContent || '',
        wantedInfoUrl: node.querySelector('wantedInfoUrl')?.textContent || '',
        wantedMobileInfoUrl: node.querySelector('wantedMobileInfoUrl')?.textContent || '',
        zipCd: node.querySelector('zipCd')?.textContent || '',
        strtnmCd: node.querySelector('strtnmCd')?.textContent || '',
        basicAddr: node.querySelector('basicAddr')?.textContent || '',
        detailAddr: node.querySelector('detailAddr')?.textContent || '',
        empTpCd: node.querySelector('empTpCd')?.textContent || '',
        jobsCd: node.querySelector('jobsCd')?.textContent || '',
        smodifyDtm: node.querySelector('smodifyDtm')?.textContent || '',
      };
      jobs.push(job);
    });

    console.log(`워크넷 데이터 파싱 완료: ${jobs.length}개`);

    return {
      jobs,
      totalCount
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
