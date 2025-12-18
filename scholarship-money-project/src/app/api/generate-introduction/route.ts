import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name,
      major,
      grade,
      desiredPosition,
      skills,
      experiences,
      strengths,
      goal
    } = body;

    console.log('=== AI 자기소개서 생성 시작 ===');

    // API 키 확인
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API 키가 설정되지 않았습니다.');
    }

    // SDK 초기화 (공식 문서 방식)
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `당신은 대기업 및 공공기관 자기소개서를 다수 첨삭·작성해온 전문 취업 컨설턴트입니다.  
단순히 문장을 나열하는 것이 아니라, 지원자의 경험과 강점을 하나의 이야기로 엮어  
“이 지원자는 왜 이 직무에 적합한가”가 자연스럽게 드러나는 자기소개서를 작성해야 합니다.

아래에 제시된 대학생 지원자의 정보를 바탕으로,  
진솔하면서도 설득력 있고, 실제 채용 담당자가 읽기에 신뢰감이 드는 자기소개서를 작성해주세요.

**지원자 정보:**
- 이름: ${name}
- 전공: ${major}
- 학년: ${grade}
- 희망 직무: ${desiredPosition}
- 보유 기술: ${skills || '없음'}
- 경력/경험: ${experiences || '없음'}
- 개인적 강점: ${strengths || '성실함, 책임감'}
- 향후 목표: ${goal || '지속적으로 성장하고 싶습니다'}

**작성 가이드:**
[전체 작성 분량 및 구조]
- 전체 분량: **최소 1,300자 이상 (권장 1,300~1,500자)**
- 문단 수: 총 3문단
- 문단 간 흐름이 자연스럽게 이어지도록 작성할 것

────────────────────
[문단별 상세 가이드]

① 1문단 - 지원 동기 및 직무 관심 계기 (약 350~400자)
- 해당 전공 또는 직무에 관심을 갖게 된 구체적인 계기를 서술
- 단순한 “관심이 생겼다”가 아니라:
  · 언제, 어떤 상황에서
  · 어떤 문제나 경험을 통해
  · 왜 이 직무를 선택하게 되었는지
- 개인적인 경험 → 직무 관심으로 연결되는 흐름을 명확히 할 것
- 지원자의 가치관이나 태도가 자연스럽게 드러나도록 작성

② 2문단 - 강점, 경험, 역량 증명 (약 550~650자)
- 가장 핵심이 되는 문단
- 다음 요소를 반드시 포함:
  · 전공 수업, 프로젝트, 대외활동, 아르바이트, 실습, 개인 학습 경험 중 1~2개 선택
  · 그 경험에서 맡았던 역할과 실제 행동
  · 문제 상황 또는 목표
  · 이를 해결하기 위해 어떤 노력을 했는지
  · 그 결과 무엇을 얻었는지
- 보유 기술이나 역량은 **나열하지 말고**, 경험 속에서 자연스럽게 드러나게 작성
- 실패, 시행착오, 부족함을 인식하고 개선한 경험이 있다면 적극 반영
- 해당 경험이 희망 직무와 어떻게 연결되는지 명확히 설명

③ 3문단 - 입사 후 포부 및 성장 계획 (약 350~450자)
- 입사 후 “막연히 열심히 하겠다”는 표현은 지양
- 다음 내용을 구체적으로 서술:
  · 초반에 어떤 자세로 업무를 배우고 싶은지
  · 어떤 역할을 수행하고 싶은지
  · 장기적으로 어떤 인재로 성장하고 싶은지
- 회사와 직무에 기여할 수 있는 방향을 중심으로 작성
- 지원자의 목표와 가치관이 조직과 어떻게 맞닿아 있는지 강조

────────────────────
[톤 & 스타일 가이드]
- 과장된 표현, 추상적인 미사여구 사용 금지
- 대학생다운 솔직함과 패기 유지
- 자신감은 있으되 근거 없는 자만은 피할 것
- 실제 사람이 작성한 것처럼 자연스럽고 읽기 쉬운 문장
- 문장은 너무 짧지 않게, 호흡감 있게 구성

────────────────────
[중요한 제한 사항]
- 반드시 **1,300자 이상** 작성할 것
- 마크다운, 기호, 번호 사용 금지
- 제목 없이 순수 본문 텍스트만 출력
- 한국어로만 작성
- 문단은 줄바꿈으로만 구분


이제 위 가이드를 충실히 반영하여  
완성도 높은 자기소개서를 작성해주세요.`;

    console.log('🚀 Gemini SDK 호출 중...');

    // SDK 방식으로 호출 (공식 문서 방식 - 2024 버전)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
        maxOutputTokens: 2000,
      }
    });

    // 새 SDK의 응답 구조
    const text: string = response.text || '';
    if (!text) {
      throw new Error('AI가 빈 응답을 반환했습니다.');
    }

    console.log('✅ 자기소개서 생성 완료');
    console.log('길이:', text.length, '자');

    return NextResponse.json({
      success: true,
      introduction: text.trim(),
    });

  } catch (error: any) {
    console.error('========================================');
    console.error('❌ 자기소개서 생성 에러');
    console.error('메시지:', error.message);
    console.error('========================================');
    
    let errorMessage = '자기소개서 생성 중 오류가 발생했습니다.';
    
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      errorMessage = 'AI 서비스 사용량이 초과되었습니다. 잠시 후 다시 시도해주세요.';
    } else if (error.message?.includes('404') || error.message?.includes('not found')) {
      errorMessage = 'AI 모델을 찾을 수 없습니다.';
    } else if (error.message?.includes('API') || error.message?.includes('key')) {
      errorMessage = 'AI 서비스 설정에 문제가 있습니다.';
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage 
      },
      { status: 500 }
    );
  }
}
