import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { db } from '@/lib/firebase/config';
import { collection, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 장학금 크롤링 시작...');

    const metadataRef = doc(db, 'crawl-metadata', 'scholarships');
    await setDoc(metadataRef, {
      status: 'running',
      lastCrawlTime: serverTimestamp(),
    }, { merge: true });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('API 키 없음');

    const ai = new GoogleGenAI({ apiKey });

    // 현재 날짜
    const today = new Date().toISOString().split('T')[0];

    const prompt = `오늘은 ${today}입니다. 2025년 현재 한국에서 **신청 가능한** 장학금 10개를 수집하세요.

**중요 요구사항:**
1. 마감일이 ${today} 이후인 장학금만 포함
2. 실제로 존재하고 운영 중인 장학금만
3. website는 실제 접속 가능한 공식 URL만 (kosaf.go.kr, 대학.ac.kr, 재단 공식 사이트)
4. 다양한 소득분위와 학점 조건 포함

**JSON 형식으로만 답변:**
{
  "scholarships": [
    {
      "name": "국가장학금 1유형",
      "organization": "한국장학재단",
      "amount": "등록금 전액 (최대 연 520만원)",
      "requirements": ["소득분위 8분위 이하", "B학점 이상"],
      "applicationMethod": "한국장학재단 홈페이지 온라인 신청",
      "website": "https://www.kosaf.go.kr",
      "deadline": "2025-05-29",
      "summary": "저소득층 대학생 등록금 지원",
      "imageUrl": ""
    }
  ]
}

deadline은 반드시 ${today} 이후 날짜(YYYY-MM-DD) 또는 "상시"로 설정하세요.`;

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

    let jsonText = text.trim();
    if (jsonText.includes('```')) {
      const match = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match && match[1]) jsonText = match[1].trim();
    }

    const data = JSON.parse(jsonText);
    const scholarships = data.scholarships || [];

    // 날짜 검증 (한번 더 체크)
    const validScholarships = scholarships.filter((s: any) => {
      if (!s.deadline || s.deadline === '상시') return true;
      const deadlineDate = new Date(s.deadline);
      return deadlineDate >= new Date(today);
    });

    console.log(`✅ ${validScholarships.length}개 유효한 장학금 (총 ${scholarships.length}개 중)`);

    const scholarshipsRef = collection(db, 'scholarships');
    let savedCount = 0;

    for (const scholarship of validScholarships) {
      const docId = scholarship.name.replace(/\s+/g, '-').toLowerCase();
      await setDoc(doc(scholarshipsRef, docId), {
        ...scholarship,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      savedCount++;
    }

    await updateDoc(metadataRef, {
      status: 'success',
      scholarshipCount: savedCount,
      lastCrawlTime: serverTimestamp(),
    });

    console.log(`✅ ${savedCount}개 장학금 저장 완료`);

    return NextResponse.json({
      success: true,
      count: savedCount,
    });

  } catch (error: any) {
    console.error('❌ 에러:', error.message);

    const metadataRef = doc(db, 'crawl-metadata', 'scholarships');
    await setDoc(metadataRef, {
      status: 'failed',
      errorMessage: error.message,
      lastCrawlTime: serverTimestamp(),
    }, { merge: true });

    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
