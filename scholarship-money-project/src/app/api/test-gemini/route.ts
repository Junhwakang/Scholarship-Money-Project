import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'GEMINI_API_KEY가 설정되지 않았습니다.'
      }, { status: 500 });
    }

    console.log('🔍 Gemini API 모델 목록 조회 시작...');
    console.log('API Key 존재:', !!apiKey);
    console.log('API Key 길이:', apiKey.length);

    // Google AI (Gemini) API - ListModels 호출
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Gemini API 에러:', data);
      return NextResponse.json({
        success: false,
        error: data.error?.message || '모델 목록 조회 실패',
        details: data
      }, { status: response.status });
    }

    console.log('✅ 사용 가능한 모델 개수:', data.models?.length || 0);

    // generateContent 지원하는 모델만 필터링
    const generateContentModels = data.models?.filter((model: any) => 
      model.supportedGenerationMethods?.includes('generateContent')
    ) || [];

    console.log('✅ generateContent 지원 모델:', generateContentModels.length);

    return NextResponse.json({
      success: true,
      totalModels: data.models?.length || 0,
      generateContentModels: generateContentModels.length,
      models: generateContentModels.map((model: any) => ({
        name: model.name,
        displayName: model.displayName,
        description: model.description,
        supportedMethods: model.supportedGenerationMethods,
      })),
      rawData: data
    });

  } catch (error: any) {
    console.error('❌ 테스트 에러:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
