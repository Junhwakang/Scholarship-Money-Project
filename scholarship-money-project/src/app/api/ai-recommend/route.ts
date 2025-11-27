import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { db } from '@/lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, userInfo } = body;

    console.log('=== AI 맞춤 추천 시작 ===');
    console.log('Type:', type);
    console.log('UserInfo:', userInfo);

    // 1. Firestore에서 모든 데이터 가져오기
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
        error: 'Firestore에 데이터가 없습니다. 먼저 크롤링을 실행하세요.'
      }, { status: 404 });
    }

    // 2. 현재 날짜 기준 유효한 것만 필터링
    const today = new Date();
    const validItems = allItems.filter(item => {
      if (!item.deadline) return true;
      
      // "상시" 등은 통과
      if (item.deadline === '상시' || item.deadline === '상시모집' || item.deadline === '상시채용') {
        return true;
      }
      
      // 날짜 파싱
      const deadlineDate = new Date(item.deadline);
      return deadlineDate >= today;
    });

    console.log(`✅ 유효한 항목: ${validItems.length}개 (날짜 지난 것 제외)`);

    if (validItems.length === 0) {
      return NextResponse.json({
        success: false,
        error: '현재 신청 가능한 공고가 없습니다.'
      }, { status: 404 });
    }

    // 3. Gemini API로 사용자 맞춤 추천
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('Gemini API 키 없음');

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
${JSON.stringify(validItems, null, 2)}

**추천 기준:**
1. 소득분위가 학생의 소득분위보다 높거나 같은 것
2. 학점 요구사항이 학생 학점보다 낮거나 같은 것
3. 지역, 전공, 학년 조건 부합하는 것
4. 학생에게 가장 유리한 순서로 정렬

**출력 형식 (JSON):**
{
  "scholarships": [
    // 위 목록에서 학생에게 맞는 장학금만 선택 (최대 5개)
    // 각 장학금 객체를 그대로 복사하되, reason 필드에 추천 이유 추가
  ]
}

반드시 위 목록에 있는 장학금만 사용하고, 새로운 장학금을 만들지 마세요.
JSON 형식으로만 답변하세요.`;

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
${JSON.stringify(validItems, null, 2)}

**추천 기준:**
1. 희망 직무와 일치하는 것
2. 필수 요건이 구직자 경력/학력과 부합하는 것
3. 우대 요건 중 구직자가 가진 기술과 매칭되는 것
4. 구직자에게 가장 적합한 순서로 정렬

**출력 형식 (JSON):**
{
  "jobs": [
    // 위 목록에서 구직자에게 맞는 채용 공고만 선택 (최대 5개)
    // 각 채용 객체를 그대로 복사하되, reason 필드에 추천 이유 추가
  ]
}

반드시 위 목록에 있는 채용 공고만 사용하고, 새로운 공고를 만들지 마세요.
JSON 형식으로만 답변하세요.`;
    }

    console.log('🚀 Gemini API 호출 중...');

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 4000,
      }
    });

    const text: string = result.text || '';
    if (!text) throw new Error('빈 응답');

    console.log('📝 Gemini 응답 길이:', text.length);

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
      console.error('원본 텍스트:', text);
      
      // 파싱 실패시 빈 배열
      parsedData = type === 'scholarship' 
        ? { scholarships: [] } 
        : { jobs: [] };
    }

    return NextResponse.json({
      success: true,
      data: parsedData,
    });

  } catch (error: any) {
    console.error('❌ 에러:', error.message);
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
