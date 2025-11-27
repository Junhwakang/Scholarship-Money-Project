// 전국대학별 장학금 정보 API 응답 타입
export interface Scholarship {
  CRTR_YR: string;                   // 기준연도
  CTPV_CD: string;                   // 시도코드
  CTPV_NM: string;                   // 시도명
  UNIV_NM: string;                   // 대학교명
  UNIV_SE_NM: string;                // 대학구분명
  SCHLSHIP_TYPE_SE_NM: string;       // 장학금유형구분명
  SCHLJO_SE_NM: string;              // 교내외구분명
  SCHLSHIP: string;                  // 장학금액
  CRTR_YMD: string;                  // 데이터기준일자
  instt_code: string;                // 제공기관코드
  instt_nm: string;                  // 제공기관명
}

export interface ScholarshipApiResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: Scholarship[] | Scholarship;
      } | Scholarship[];
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

// API 요청 파라미터 타입
export interface ScholarshipApiParams {
  serviceKey: string;
  pageNo?: number;
  numOfRows?: number;
  type?: 'xml' | 'json';
  CRTR_YR?: string;                  // 기준연도
  CTPV_CD?: string;                  // 시도코드
  CTPV_NM?: string;                  // 시도명
  UNIV_NM?: string;                  // 대학교명
  UNIV_SE_NM?: string;               // 대학구분명
  SCHLSHIP_TYPE_SE_NM?: string;      // 장학금유형구분명
  SCHLJO_SE_NM?: string;             // 교내외구분명
  SCHLSHIP?: string;                 // 장학금액
  CRTR_YMD?: string;                 // 데이터기준일자
  instt_code?: string;               // 제공기관코드
  instt_nm?: string;                 // 제공기관명
}
