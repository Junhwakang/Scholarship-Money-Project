import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

// 동의대학교 장학금 데이터 (50개)
const deuScholarships = [
  {
    name: "2026년도 (재)부산 중구장학회 장학생 선발 안내",
    organization: "동의대학교 / (재)부산중구장학회",
    amount: "미정",
    requirements: ["부산 중구 3년 이상 거주", "학생 또는 학부모"],
    applicationMethod: "동의대학교 장학지원팀 문의",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-12-17",
    summary: "부산 중구장학회 장학생 선발",
    imageUrl: ""
  },
  {
    name: "한국장학재단 통합돌봄 안내",
    organization: "한국장학재단",
    amount: "미정",
    requirements: ["통합돌봄 대상자"],
    applicationMethod: "한국장학재단 홈페이지",
    website: "https://www.kosaf.go.kr",
    deadline: "2025-12-15",
    summary: "통합돌봄 학생 지원",
    imageUrl: ""
  },
  {
    name: "2026년 1학기 농어촌희망재단 청년희망농장학금",
    organization: "농어촌희망재단",
    amount: "미정",
    requirements: ["농어촌 출신"],
    applicationMethod: "농어촌희망재단 홈페이지",
    website: "https://www.rhof.or.kr",
    deadline: "2025-12-15",
    summary: "농어촌 출신 청년 장학금",
    imageUrl: ""
  },
  {
    name: "복지멤버십 신규 가입 이벤트",
    organization: "한국사회보장정보원",
    amount: "이벤트",
    requirements: ["국가장학금 신청자"],
    applicationMethod: "복지멤버십 가입",
    website: "https://www.ssis.or.kr",
    deadline: "2025-02-28",
    summary: "복지멤버십 신규 가입 이벤트",
    imageUrl: ""
  },
  {
    name: "2025년 하반기 IBK기업은행 장학생",
    organization: "IBK기업은행",
    amount: "미정",
    requirements: ["성적 우수자"],
    applicationMethod: "동의대학교 장학지원팀",
    website: "https://www.ibk.co.kr",
    deadline: "2025-12-09",
    summary: "IBK기업은행 장학생 선발",
    imageUrl: ""
  },
  {
    name: "2025-2학기 동계방학 집중근로",
    organization: "동의대학교",
    amount: "근로장학금",
    requirements: ["재학생"],
    applicationMethod: "동의대학교 장학지원팀",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-12-03",
    summary: "동계방학 집중근로 장학생",
    imageUrl: ""
  },
  {
    name: "2026년 협성문화재단 장학생",
    organization: "(재)협성문화재단",
    amount: "미정",
    requirements: ["신입생 또는 재학생"],
    applicationMethod: "동의대학교 장학지원팀",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-12-01",
    summary: "협성문화재단 장학생 선발",
    imageUrl: ""
  },
  {
    name: "취업 후 상환 학자금대출 신고 안내",
    organization: "한국장학재단",
    amount: "안내사항",
    requirements: ["취업후상환학자금대출 이용자"],
    applicationMethod: "한국장학재단",
    website: "https://www.kosaf.go.kr",
    deadline: "상시",
    summary: "학자금대출 신고 의무 안내",
    imageUrl: ""
  },
  {
    name: "2026-1학기 교내 나눔·희망장학금",
    organization: "동의대학교",
    amount: "미정",
    requirements: ["재학생"],
    applicationMethod: "동의대학교 포털",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-12-12",
    summary: "교내 나눔·희망장학금",
    imageUrl: ""
  },
  {
    name: "거창군 대학생 등록금 지원",
    organization: "거창군",
    amount: "등록금 지원",
    requirements: ["거창군 출신"],
    applicationMethod: "거창군청",
    website: "https://www.geochang.go.kr",
    deadline: "2025-11-11",
    summary: "거창군 대학생 등록금 지원",
    imageUrl: ""
  },
  {
    name: "성파인재상 및 마일리지 장학금",
    organization: "동의대학교",
    amount: "미정",
    requirements: ["재학생"],
    applicationMethod: "동의대학교 포털",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-11-10",
    summary: "성파인재상 및 마일리지 장학금",
    imageUrl: ""
  },
  {
    name: "북한이탈주민 지원 장학금",
    organization: "동의대학교",
    amount: "미정",
    requirements: ["북한이탈주민"],
    applicationMethod: "동의대학교 장학지원팀",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-11-07",
    summary: "북한이탈주민 장학금",
    imageUrl: ""
  },
  {
    name: "국가근로 동계방학 집중근로",
    organization: "동의대학교",
    amount: "근로장학금",
    requirements: ["국가근로 장학생"],
    applicationMethod: "동의대학교 포털",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-11-06",
    summary: "동계방학 국가근로 집중근로",
    imageUrl: ""
  },
  {
    name: "익산시 다다익산 장학금",
    organization: "익산시",
    amount: "미정",
    requirements: ["익산시 거주"],
    applicationMethod: "익산시청",
    website: "https://www.iksan.go.kr",
    deadline: "2025-10-27",
    summary: "익산시 다다익산 장학금",
    imageUrl: ""
  },
  {
    name: "전기공사공제조합 장학금",
    organization: "전기공사공제조합",
    amount: "미정",
    requirements: ["전기공학 관련 전공"],
    applicationMethod: "동의대학교 장학지원팀",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-10-27",
    summary: "전기공사공제조합 장학금",
    imageUrl: ""
  },
  {
    name: "대학혁신지원사업 혁신인재장학금",
    organization: "동의대학교",
    amount: "미정",
    requirements: ["혁신인재"],
    applicationMethod: "동의대학교 포털",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-11-10",
    summary: "대학혁신지원사업 장학금",
    imageUrl: ""
  },
  {
    name: "강화군 대학생 등록금 지원",
    organization: "강화군",
    amount: "등록금 지원",
    requirements: ["강화군 출신"],
    applicationMethod: "강화군청",
    website: "https://www.ganghwa.go.kr",
    deadline: "2025-10-24",
    summary: "강화군 대학생 등록금 지원",
    imageUrl: ""
  },
  {
    name: "동영시 저소득 대학생 장학금",
    organization: "동영시",
    amount: "미정",
    requirements: ["저소득층", "동영시 거주"],
    applicationMethod: "동영시청",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-10-24",
    summary: "동영시 저소득 대학생 장학금",
    imageUrl: ""
  },
  {
    name: "인천 공익인재 장학금",
    organization: "(재)인천인재평생교육진흥원",
    amount: "미정",
    requirements: ["인천 거주"],
    applicationMethod: "인천인재평생교육진흥원",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-10-22",
    summary: "인천 공익인재 장학금",
    imageUrl: ""
  },
  {
    name: "안산시 등록금 반값 지원",
    organization: "안산시",
    amount: "등록금 반값",
    requirements: ["안산시 거주"],
    applicationMethod: "안산시청",
    website: "https://www.iansan.net",
    deadline: "2025-10-17",
    summary: "안산시 등록금 반값 지원",
    imageUrl: ""
  },
  {
    name: "한국지도자육성장학재단 장학금",
    organization: "한국지도자육성장학재단",
    amount: "미정",
    requirements: ["신입생 또는 재학생"],
    applicationMethod: "동의대학교 장학지원팀",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-10-17",
    summary: "한국지도자육성장학재단 장학금",
    imageUrl: ""
  },
  {
    name: "빙그레 특별유공자 후손 장학금",
    organization: "빙그레공익재단",
    amount: "미정",
    requirements: ["특별유공자 후손"],
    applicationMethod: "동의대학교 장학지원팀",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-10-16",
    summary: "빙그레 특별유공자 후손 장학금",
    imageUrl: ""
  },
  {
    name: "인천인재 하반기 장학금",
    organization: "(재)인천인재평생교육진흥원",
    amount: "미정",
    requirements: ["인천 거주"],
    applicationMethod: "인천인재평생교육진흥원",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-10-16",
    summary: "인천인재 하반기 장학금",
    imageUrl: ""
  },
  {
    name: "중소기업 희망사다리 장학금",
    organization: "한국장학재단",
    amount: "미정",
    requirements: ["중소기업 취업 희망"],
    applicationMethod: "한국장학재단",
    website: "https://www.kosaf.go.kr",
    deadline: "2025-10-15",
    summary: "중소기업 희망사다리 장학금",
    imageUrl: ""
  },
  {
    name: "아산 북한이탈청소년 장학금",
    organization: "아산사회복지재단",
    amount: "미정",
    requirements: ["북한이탈청소년"],
    applicationMethod: "아산사회복지재단",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-10-14",
    summary: "북한이탈청소년 장학금",
    imageUrl: ""
  },
  {
    name: "논산시장학회 장학금",
    organization: "(재)논산시장학회",
    amount: "미정",
    requirements: ["논산시 출신"],
    applicationMethod: "논산시장학회",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-09-29",
    summary: "논산시장학회 장학금",
    imageUrl: ""
  },
  {
    name: "해운대구 장학금",
    organization: "해운대구",
    amount: "미정",
    requirements: ["해운대구 거주"],
    applicationMethod: "해운대구청",
    website: "https://www.haeundae.go.kr",
    deadline: "2025-09-26",
    summary: "해운대구 장학금",
    imageUrl: ""
  },
  {
    name: "서울 은평구 장학금",
    organization: "서울 은평구",
    amount: "미정",
    requirements: ["은평구 거주"],
    applicationMethod: "은평구청",
    website: "https://www.ep.go.kr",
    deadline: "2025-09-26",
    summary: "서울 은평구 장학금",
    imageUrl: ""
  },
  {
    name: "부산지역인재 장학금",
    organization: "부산광역시",
    amount: "미정",
    requirements: ["IT 및 상경 전공", "부산 거주"],
    applicationMethod: "동의대학교 장학지원팀",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-09-30",
    summary: "부산지역인재 장학금",
    imageUrl: ""
  },
  {
    name: "희망사다리 일자리박람회",
    organization: "한국장학재단",
    amount: "안내사항",
    requirements: ["희망사다리 장학생"],
    applicationMethod: "한국장학재단",
    website: "https://www.kosaf.go.kr",
    deadline: "2025-09-23",
    summary: "일자리박람회 안내",
    imageUrl: ""
  },
  {
    name: "울산연구원 장학금",
    organization: "(재)울산연구원",
    amount: "미정",
    requirements: ["울산시 고등학교 졸업"],
    applicationMethod: "울산연구원",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-09-22",
    summary: "울산연구원 장학금",
    imageUrl: ""
  },
  {
    name: "장학사정관제 추가 장학금",
    organization: "동의대학교",
    amount: "미정",
    requirements: ["재학생"],
    applicationMethod: "동의대학교 포털",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-09-22",
    summary: "장학사정관제 추가 장학금",
    imageUrl: ""
  },
  {
    name: "장학금 부정청구 자가점검",
    organization: "한국장학재단",
    amount: "안내사항",
    requirements: ["전체 학생"],
    applicationMethod: "한국장학재단",
    website: "https://www.kosaf.go.kr",
    deadline: "상시",
    summary: "부정청구 자가점검 안내",
    imageUrl: ""
  },
  {
    name: "춘천시 봄내장학금",
    organization: "(재)춘천시민장학재단",
    amount: "미정",
    requirements: ["춘천시 출신"],
    applicationMethod: "춘천시민장학재단",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-09-16",
    summary: "춘천시 봄내장학금",
    imageUrl: ""
  },
  {
    name: "독의사랑 장학식비",
    organization: "동의대학교",
    amount: "장학식비",
    requirements: ["재학생"],
    applicationMethod: "동의대학교 장학지원팀",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-09-10",
    summary: "독의사랑 장학식비",
    imageUrl: ""
  },
  {
    name: "고속도로 사고 피해가정 장학금",
    organization: "(재)고속도로장학재단",
    amount: "미정",
    requirements: ["고속도로 사고 피해가정"],
    applicationMethod: "고속도로장학재단",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-09-08",
    summary: "고속도로 사고 피해가정 장학금",
    imageUrl: ""
  },
  {
    name: "인천인재 하반기 장학금 2",
    organization: "(재)인천인재평생교육진흥원",
    amount: "미정",
    requirements: ["인천 거주"],
    applicationMethod: "인천인재평생교육진흥원",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-09-04",
    summary: "인천인재 하반기 장학금",
    imageUrl: ""
  },
  {
    name: "경원장학재단 장학금",
    organization: "경원장학재단",
    amount: "미정",
    requirements: ["재학생"],
    applicationMethod: "동의대학교 장학지원팀",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-09-03",
    summary: "경원장학재단 장학금",
    imageUrl: ""
  },
  {
    name: "경주시장학회 장학금",
    organization: "(재)경주시장학회",
    amount: "미정",
    requirements: ["경주시 거주"],
    applicationMethod: "경주시장학회",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-09-03",
    summary: "경주시장학회 장학금",
    imageUrl: ""
  },
  {
    name: "익산시 학자금 대출이자 지원",
    organization: "익산시",
    amount: "대출이자 지원",
    requirements: ["익산시 거주"],
    applicationMethod: "익산시청",
    website: "https://www.iksan.go.kr",
    deadline: "2025-09-03",
    summary: "익산시 학자금 대출이자 지원",
    imageUrl: ""
  },
  {
    name: "국가장학금 가구원 동의",
    organization: "한국장학재단",
    amount: "국가장학금",
    requirements: ["가구원 동의 필요"],
    applicationMethod: "한국장학재단 홈페이지",
    website: "https://www.kosaf.go.kr",
    deadline: "2025-09-03",
    summary: "국가장학금 가구원 동의",
    imageUrl: ""
  },
  {
    name: "희망사다리Ⅲ 장학금",
    organization: "한국장학재단",
    amount: "미정",
    requirements: ["고졸 후학습자"],
    applicationMethod: "한국장학재단",
    website: "https://www.kosaf.go.kr",
    deadline: "2025-09-24",
    summary: "희망사다리Ⅲ 장학금",
    imageUrl: ""
  },
  {
    name: "포항시장학회 장학금",
    organization: "(재)포항시장학회",
    amount: "미정",
    requirements: ["포항시 거주"],
    applicationMethod: "포항시장학회",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-09-01",
    summary: "포항시장학회 장학금",
    imageUrl: ""
  },
  {
    name: "희망사다리Ⅱ 장학금",
    organization: "한국장학재단",
    amount: "미정",
    requirements: ["중소기업 취업 희망"],
    applicationMethod: "한국장학재단",
    website: "https://www.kosaf.go.kr",
    deadline: "2025-09-24",
    summary: "희망사다리Ⅱ 장학금",
    imageUrl: ""
  },
  {
    name: "고연장학재단 장학금",
    organization: "(재)고연장학재단",
    amount: "미정",
    requirements: ["재학생"],
    applicationMethod: "동의대학교 장학지원팀",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-09-01",
    summary: "고연장학재단 장학금",
    imageUrl: ""
  },
  {
    name: "통영시 학자금 이자 지원",
    organization: "통영시",
    amount: "학자금 이자 지원",
    requirements: ["통영시 고등학교 졸업"],
    applicationMethod: "통영시청",
    website: "https://www.tongyeong.go.kr",
    deadline: "2025-09-01",
    summary: "통영시 학자금 이자 지원",
    imageUrl: ""
  },
  {
    name: "달서인재육성 장학금",
    organization: "(재)달서인재육성장학재단",
    amount: "미정",
    requirements: ["대구 달서구 거주"],
    applicationMethod: "달서인재육성장학재단",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-09-01",
    summary: "달서인재육성 장학금",
    imageUrl: ""
  },
  {
    name: "통영시 등록금 전액 지원",
    organization: "통영시",
    amount: "등록금 전액",
    requirements: ["통영시 거주", "2~4학년"],
    applicationMethod: "통영시청",
    website: "https://www.tongyeong.go.kr",
    deadline: "2025-08-28",
    summary: "통영시 등록금 전액 지원",
    imageUrl: ""
  },
  {
    name: "북한이탈주민 국가근로",
    organization: "한국장학재단",
    amount: "국가근로장학금",
    requirements: ["북한이탈주민"],
    applicationMethod: "한국장학재단",
    website: "https://www.kosaf.go.kr",
    deadline: "2025-08-27",
    summary: "북한이탈주민 국가근로",
    imageUrl: ""
  },
  {
    name: "대동장학재단 장학금",
    organization: "대동장학재단",
    amount: "미정",
    requirements: ["재학생"],
    applicationMethod: "동의대학교 장학지원팀",
    website: "https://www.deu.ac.kr/www/deu-scholarship.do",
    deadline: "2025-08-27",
    summary: "대동장학재단 장학금",
    imageUrl: ""
  }
];

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 동의대학교 장학금 50개 저장 시작...');

    const scholarshipsRef = collection(db, 'scholarships');
    let savedCount = 0;

    for (const scholarship of deuScholarships) {
      const docId = `deu-${savedCount + 1}`;

      await setDoc(doc(scholarshipsRef, docId), {
        ...scholarship,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      savedCount++;
      console.log(`✅ ${savedCount}. ${scholarship.name}`);
    }

    // 메타데이터 업데이트
    const metadataRef = doc(db, 'crawl-metadata', 'scholarships');
    await setDoc(metadataRef, {
      status: 'success',
      scholarshipCount: savedCount,
      lastCrawlTime: serverTimestamp(),
      source: '동의대학교 장학지원팀'
    }, { merge: true });

    console.log(`✅ 총 ${savedCount}개 장학금 저장 완료!`);

    return NextResponse.json({
      success: true,
      message: `${savedCount}개 장학금이 성공적으로 저장되었습니다!`,
      count: savedCount,
    });

  } catch (error: any) {
    console.error('❌ 에러:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
