import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

// 재시도 함수
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 2000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const isLastRetry = i === maxRetries - 1;
      const isRateLimitError = error.message?.includes('503') || 
                               error.message?.includes('overloaded') ||
                               error.message?.includes('UNAVAILABLE') ||
                               error.message?.includes('429');
      
      if (isLastRetry || !isRateLimitError) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, i);
      console.log(`⏳ 재시도 ${i + 1}/${maxRetries} (${delay}ms 대기 중...)`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries reached');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, userInfo } = body;

    console.log('=== AI 맞춤 추천 시작 ===');
    console.log('Type:', type);

    // 1. API 키 확인
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('❌ GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
      return NextResponse.json({
        success: false,
        error: 'AI 서비스 설정에 문제가 있습니다.'
      }, { status: 502 });
    }

    console.log('✅ API 키 존재 확인');

    // 2. Firestore에서 데이터 가져오기
    let allItems: any[] = [];
    
    if (type === 'scholarship') {
      const scholarshipsRef = collection(db, 'scholarships');
      const snapshot = await getDocs(scholarshipsRef);
      allItems = snapshot.docs.map(doc => doc.data());
      console.log(`✅ Firestore에서 ${allItems.length}개 장학금 조회`);
    } else {
      const jobsRef = collection(db, 'jobs');
      const snapshot = await getDocs(jobsRef);
      allItems = snapshot.docs.map(doc => doc.data());
      console.log(`✅ Firestore에서 ${allItems.length}개 채용 공고 조회`);
    }

    if (allItems.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Firestore에 데이터가 없습니다.'
      }, { status: 404 });
    }

    // 3. 유효한 항목 필터링
    const today = new Date();
    const validItems = allItems.filter(item => {
      if (!item.deadline) return true;
      if (item.deadline === '상시' || item.deadline === '상시모집' || item.deadline === '상시채용') {
        return true;
      }
      const deadlineDate = new Date(item.deadline);
      return deadlineDate >= today;
    });

    console.log(`✅ 유효한 항목: ${validItems.length}개`);

    if (validItems.length === 0) {
      return NextResponse.json({
        success: false,
        error: '현재 신청 가능한 공고가 없습니다.'
      }, { status: 404 });
    }

    // 4. Gemini SDK 초기화 (공식 문서 방식)
    const ai = new GoogleGenAI({ apiKey });

    let prompt = '';

    if (type === 'scholarship') {
      prompt = `당신은 장학금 추천 전문가입니다. 아래 학생에게 가장 적합한 장학금을 추천하세요.

**학생 정보:**
- 소득분위: ${userInfo.income}
- 학점: ${userInfo.gpa}
- 학년: ${userInfo.grade}
- 전공: ${userInfo.major}
- 대학: ${userInfo.university}
- 지역: ${userInfo.region}

**사용 가능한 장학금 목록:**
${JSON.stringify(validItems.slice(0, 10), null, 2)}

**출력 형식 (JSON):**
{
  "scholarships": [
    // 위 목록에서 학생에게 맞는 장학금만 선택 (최대 5개)
    // 각 장학금 객체를 그대로 복사하되, reason 필드에 추천 이유 추가
  ]
}

반드시 JSON 형식으로만 답변하세요.`;

    } else {
      prompt = `당신은 채용 추천 전문가입니다. 아래 구직자에게 가장 적합한 채용 공고를 추천하세요.

**구직자 정보:**
- 희망 분야: ${userInfo.desiredField}
- 희망 직무: ${userInfo.desiredPosition}
- 경력: ${userInfo.experience}
- 학력: ${userInfo.education}
- 기술: ${userInfo.skills?.join(', ') || '없음'}
- 지역: ${userInfo.region}

**사용 가능한 채용 공고 목록:**
${JSON.stringify(validItems.slice(0, 10), null, 2)}

**출력 형식 (JSON):**
{
  "jobs": [
    // 위 목록에서 구직자에게 맞는 채용 공고만 선택 (최대 5개)
    // 각 채용 객체를 그대로 복사하되, reason 필드에 추천 이유 추가
  ]
}

반드시 JSON 형식으로만 답변하세요.`;
    }

    console.log('🚀 Gemini API 호출 중...');

    // 5. SDK 방식으로 호출 (공식 문서 방식 - 2024 버전)
    const response = await retryWithBackoff(async () => {
      return await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          temperature: 0.3,
          maxOutputTokens: 4000,
        }
      });
    }, 3, 2000);

    // 새 SDK의 응답 구조
    const text: string = response.text || '';
    if (!text) throw new Error('AI 모델이 빈 응답을 반환했습니다.');

    console.log('📝 Gemini 응답 길이:', text.length);
    console.log('📝 응답 미리보기:', text.substring(0, 200));

    // JSON 추출
    let jsonText = text.trim();
    if (jsonText.includes('```')) {
      const match = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match && match[1]) jsonText = match[1].trim();
    }

    // JSON 파싱
    let parsedData;
    try {
      parsedData = JSON.parse(jsonText);
      console.log('✅ JSON 파싱 성공');
      
      const itemCount = type === 'scholarship' 
        ? (parsedData.scholarships?.length || 0)
        : (parsedData.jobs?.length || 0);
      
      console.log(`✅ ${itemCount}개 추천 완료`);
    } catch (parseError) {
      console.error('❌ JSON 파싱 실패:', parseError);
      parsedData = type === 'scholarship' 
        ? { scholarships: [] } 
        : { jobs: [] };
    }

    return NextResponse.json({
      success: true,
      data: parsedData,
    });

  } catch (error: any) {
    console.error('========================================');
    console.error('❌ AI 추천 에러 발생');
    console.error('에러 메시지:', error.message);
    console.error('에러 타입:', error.constructor.name);
    console.error('에러 스택:', error.stack);
    console.error('========================================');
    
    let errorMessage = '알 수 없는 오류가 발생했습니다.';
    let statusCode = 500;
    
    // 더 구체적인 에러 파싱
    if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      errorMessage = 'AI 서비스 사용량이 초과되었습니다. 잠시 후(1-2분) 다시 시도해주세요.';
      statusCode = 503;
    } else if (error.message?.includes('503') || error.message?.includes('overloaded') || error.message?.includes('UNAVAILABLE')) {
      errorMessage = 'AI 서버가 현재 과부하 상태입니다. 잠시 후 다시 시도해주세요.';
      statusCode = 503;
    } else if (error.message?.includes('404') || error.message?.includes('not found')) {
      errorMessage = 'AI 모델을 찾을 수 없습니다.';
      statusCode = 502;
      console.error('🔴 404 에러 - 모델명 확인 필요: gemini-2.5-flash');
    } else if (error.message?.includes('API 키')) {
      errorMessage = 'AI 서비스 설정에 문제가 있습니다.';
      statusCode = 502;
    } else if (error.message?.includes('Firestore')) {
      errorMessage = '데이터베이스 연결에 실패했습니다.';
      statusCode = 503;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        // 개발 환경에서는 상세 에러 표시
        debugInfo: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          stack: error.stack?.split('\n').slice(0, 3).join('\n'),
          apiKeyExists: !!process.env.GEMINI_API_KEY,
        } : undefined
      },
      { status: statusCode }
    );
  }
}
