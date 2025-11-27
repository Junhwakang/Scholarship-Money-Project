import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { db } from '@/lib/firebase/config';
import { collection, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 채용 크롤링 시작...');

    const metadataRef = doc(db, 'crawl-metadata', 'jobs');
    await setDoc(metadataRef, {
      status: 'running',
      lastCrawlTime: serverTimestamp(),
    }, { merge: true });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('API 키 없음');

    const ai = new GoogleGenAI({ apiKey });

    // 현재 날짜
    const today = new Date().toISOString().split('T')[0];

    const prompt = `오늘은 ${today}입니다. 2025년 현재 한국에서 **지원 가능한** 채용 공고 10개를 수집하세요.

**중요 요구사항:**
1. 마감일이 ${today} 이후이거나 "상시채용"인 공고만 포함
2. 실제로 채용 중인 공고만
3. website는 실제 채용 사이트 URL (saramin.co.kr, jobkorea.co.kr, 기업 공식 채용 페이지)
4. 다양한 직무와 분야 포함 (개발, 기획, 디자인, 마케팅 등)

**JSON 형식으로만 답변:**
{
  "jobs": [
    {
      "company": "삼성전자",
      "position": "소프트웨어 개발자",
      "description": "모바일 앱 개발",
      "requirements": ["학사 이상", "개발 경력 1년"],
      "preferred": ["React 경험", "TypeScript"],
      "salary": "5000~7000만원",
      "applicationMethod": "온라인 지원",
      "website": "https://www.samsungcareers.com",
      "deadline": "2025-12-31",
      "summary": "삼성전자 SW 개발자 채용",
      "imageUrl": ""
    }
  ]
}

deadline은 반드시 ${today} 이후 날짜(YYYY-MM-DD) 또는 "상시채용"으로 설정하세요.`;

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
    const jobs = data.jobs || [];

    // 날짜 검증 (한번 더 체크)
    const validJobs = jobs.filter((j: any) => {
      if (!j.deadline || j.deadline === '상시채용' || j.deadline === '상시') return true;
      const deadlineDate = new Date(j.deadline);
      return deadlineDate >= new Date(today);
    });

    console.log(`✅ ${validJobs.length}개 유효한 채용 공고 (총 ${jobs.length}개 중)`);

    const jobsRef = collection(db, 'jobs');
    let savedCount = 0;

    for (const job of validJobs) {
      const docId = `${job.company}-${job.position}`.replace(/\s+/g, '-').toLowerCase();
      await setDoc(doc(jobsRef, docId), {
        ...job,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      savedCount++;
    }

    await updateDoc(metadataRef, {
      status: 'success',
      jobCount: savedCount,
      lastCrawlTime: serverTimestamp(),
    });

    console.log(`✅ ${savedCount}개 채용 공고 저장 완료`);

    return NextResponse.json({
      success: true,
      count: savedCount,
    });

  } catch (error: any) {
    console.error('❌ 에러:', error.message);

    const metadataRef = doc(db, 'crawl-metadata', 'jobs');
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
