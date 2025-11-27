import { NextRequest, NextResponse } from 'next/server';

// 동적 라우트로 설정
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // 공공데이터포털 API 키 (일반 인증키)
    const serviceKey = '195a040fe3deffc304ac8e3a10c7a72fcf3a2493a4c1e6e27129c15d5f02ec53';
    
    // ✅ 필수 파라미터
    const params: { [key: string]: string } = {
      serviceKey: serviceKey,
      pageNo: searchParams.get('pageNo') || '1',
      numOfRows: searchParams.get('numOfRows') || '100',
      type: 'json',
    };

    // ✅ 선택 파라미터 - 값이 있을 때만 추가
    const univNm = searchParams.get('UNIV_NM');
    const ctpvNm = searchParams.get('CTPV_NM');
    const univSeNm = searchParams.get('UNIV_SE_NM');
    const schlshipTypeSeNm = searchParams.get('SCHLSHIP_TYPE_SE_NM');

    if (univNm) params.UNIV_NM = univNm;
    if (ctpvNm) params.CTPV_NM = ctpvNm;
    if (univSeNm) params.UNIV_SE_NM = univSeNm;
    if (schlshipTypeSeNm) params.SCHLSHIP_TYPE_SE_NM = schlshipTypeSeNm;

    // URLSearchParams로 쿼리 생성
    const queryString = new URLSearchParams(params).toString();
    
    // ✅ 이미지에 있는 정확한 End Point 사용
    const apiUrl = `https://api.data.go.kr/openapi/tn_pubr_public_univ_schlship_amt_api?${queryString}`;

    console.log('=== 장학금 API 호출 ===');
    console.log('URL:', apiUrl);
    console.log('ServiceKey 체크:', serviceKey === '195a040fe3deffc304ac8e3a10c7a72fcf3a2493a4c1e6e27129c15d5f02ec53' ? 'OK' : 'MISMATCH');

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, application/xml',
      },
    });

    console.log('응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 에러 응답:', errorText);
      throw new Error(`API 오류: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    console.log('Content-Type:', contentType);

    if (contentType?.includes('application/json')) {
      const data = await response.json();
      console.log('=== 서버: JSON 응답 받음 ===');
      
      // 응답 헤더 체크
      if (data.response?.header) {
        console.log('resultCode:', data.response.header.resultCode);
        console.log('resultMsg:', data.response.header.resultMsg);
        
        // 에러 코드별 처리
        if (data.response.header.resultCode !== '00') {
          console.error('❌ API 에러 발생!');
          console.error('에러 코드:', data.response.header.resultCode);
          console.error('에러 메시지:', data.response.header.resultMsg);
          
          // 에러 코드별 안내
          const errorMessages: { [key: string]: string } = {
            '30': 'API 키가 등록되지 않았거나 아직 활성화 대기 중입니다. 승인 후 30분~1시간 대기 필요',
            '31': 'API 키 기한이 만료되었습니다',
            '32': '등록되지 않은 IP 주소입니다',
            '12': '해당 Open API 서비스가 없거나 폐기되었습니다',
            '22': '서비스 요청 제한 횟수를 초과했습니다',
          };
          
          const userMessage = errorMessages[data.response.header.resultCode] || data.response.header.resultMsg;
          console.error('안내:', userMessage);
        }
      }
      
      console.log('응답 데이터:', JSON.stringify(data, null, 2).substring(0, 1000));
      return NextResponse.json(data);
      
    } else {
      const xmlText = await response.text();
      console.log('=== 서버: XML 응답 받음 ===');
      console.log('XML 내용:', xmlText.substring(0, 500));
      return new NextResponse(xmlText, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=UTF-8',
        },
      });
    }

  } catch (error: any) {
    console.error('=== 장학금 API Route 에러 ===');
    console.error(error);
    
    return NextResponse.json(
      { 
        error: error.message || '장학금 API 호출 실패',
        detail: error.toString()
      },
      { status: 500 }
    );
  }
}
