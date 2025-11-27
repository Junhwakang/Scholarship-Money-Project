import { NextRequest, NextResponse } from 'next/server';

// 동적 라우트로 설정
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // API 키
    const apiKey = '682e2bb1-b106-43ef-bcb7-45367d32f8bb';
    
    // 파라미터 구성
    const params = new URLSearchParams({
      authKey: apiKey,
      callTp: 'L',
      returnType: 'xml',
      startPage: searchParams.get('startPage') || '1',
      display: searchParams.get('display') || '10',
      sortOrderBy: 'DESC',
    });

    // 추가 파라미터
    const keyword = searchParams.get('keyword');
    const region = searchParams.get('region');
    const career = searchParams.get('career');
    const salTp = searchParams.get('salTp');

    if (keyword) params.append('keyword', keyword);
    if (region) params.append('region', region);
    if (career) params.append('career', career);
    if (salTp) params.append('salTp', salTp);

    const apiUrl = `https://www.work24.go.kr/cm/openApi/call/wk/callOpenApiSvcInfo210L01.do?${params.toString()}`;

    console.log('워크넷 API 호출:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/xml',
      },
    });

    if (!response.ok) {
      throw new Error(`워크넷 API 오류: ${response.status}`);
    }

    const xmlText = await response.text();
    console.log('워크넷 API 응답 받음:', xmlText.substring(0, 200));

    // XML을 그대로 반환 (클라이언트에서 파싱)
    return new NextResponse(xmlText, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });

  } catch (error: any) {
    console.error('워크넷 API Route 오류:', error);
    return NextResponse.json(
      { error: error.message || '워크넷 API 호출 실패' },
      { status: 500 }
    );
  }
}
