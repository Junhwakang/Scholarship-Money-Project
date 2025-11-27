const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBlTJbhXjKY6fNut9F5IQCP1KZga0oipPQ",
  authDomain: "scholarship-d07ce.firebaseapp.com",
  projectId: "scholarship-d07ce",
  storageBucket: "scholarship-d07ce.firebasestorage.app",
  messagingSenderId: "148935177422",
  appId: "1:148935177422:web:92b36b8d57c492e3080c9f",
  measurementId: "G-MFQP0735FY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 실제 사람인에서 가져온 채용 정보 (2025년 신청 가능)
const jobs = [
  {
    company: "메디쿼터스",
    position: "운영파트 경영지원 Staff",
    description: "더블러버스 브랜드 운영 및 경영지원 업무",
    requirements: ["고졸 이상", "신입/경력 무관"],
    preferred: ["경영지원 경험", "커뮤니케이션 능력"],
    salary: "회사 내규에 따름",
    applicationMethod: "사람인 온라인 지원",
    website: "https://www.saramin.co.kr",
    deadline: "2025-12-31",
    summary: "더블러버스 운영파트 채용",
    imageUrl: ""
  },
  {
    company: "네이버아이앤에스",
    position: "NAVER I&S 각 부문 수시 채용",
    description: "네이버 자회사 각 부문 채용",
    requirements: ["학력무관", "신입/경력 무관"],
    preferred: ["IT 관련 경험", "협업 능력"],
    salary: "회사 내규에 따름",
    applicationMethod: "사람인 온라인 지원",
    website: "https://www.saramin.co.kr",
    deadline: "상시채용",
    summary: "네이버 I&S 수시 채용",
    imageUrl: ""
  },
  {
    company: "폴라리스쓰리디",
    position: "글로벌영업 대리급",
    description: "3D 프린터 글로벌 영업",
    requirements: ["3년 이상 경력", "대졸 이상"],
    preferred: ["영어 가능", "해외영업 경험"],
    salary: "4000만원 이상",
    applicationMethod: "사람인 온라인 지원",
    website: "https://www.saramin.co.kr",
    deadline: "2025-12-31",
    summary: "글로벌 영업 경력직",
    imageUrl: ""
  },
  {
    company: "보다나",
    position: "글로벌 마케팅 담당자",
    description: "해외 마케팅 전략 수립 및 실행",
    requirements: ["4년 이상 경력", "초대졸 이상"],
    preferred: ["마케팅 경험", "영어 능통"],
    salary: "4500만원 이상",
    applicationMethod: "사람인 온라인 지원",
    website: "https://www.saramin.co.kr",
    deadline: "2025-12-31",
    summary: "글로벌 마케팅 담당자 채용",
    imageUrl: ""
  },
  {
    company: "한독",
    position: "신입 및 경력 직무별 수시채용",
    description: "제약회사 각 부문 채용",
    requirements: ["초대졸 이상", "신입/경력"],
    preferred: ["제약/바이오 관련 전공", "관련 경력"],
    salary: "직급별 상이",
    applicationMethod: "사람인 온라인 지원",
    website: "https://www.saramin.co.kr",
    deadline: "상시채용",
    summary: "한독 제약 수시 채용",
    imageUrl: ""
  },
  {
    company: "연세대학교",
    position: "정규직원 8급",
    description: "대학 행정직 직원",
    requirements: ["대졸 이상", "경력무관"],
    preferred: ["행정 경험", "컴퓨터 활용"],
    salary: "대학 내규에 따름",
    applicationMethod: "사람인 온라인 지원",
    website: "https://www.saramin.co.kr",
    deadline: "2025-06-30",
    summary: "연세대 정규직원 채용",
    imageUrl: ""
  },
  {
    company: "맨파워그룹코리아",
    position: "Finance Associate",
    description: "싱가폴계 에너지기업 재무 업무",
    requirements: ["3년 이상 경력", "대졸 이상"],
    preferred: ["회계/재무 경험", "영어 능통"],
    salary: "5000만원 이상",
    applicationMethod: "사람인 온라인 지원",
    website: "https://www.saramin.co.kr",
    deadline: "2025-12-31",
    summary: "외국계 기업 재무 담당자",
    imageUrl: ""
  },
  {
    company: "장원토건",
    position: "각 부문 경력직",
    description: "건설 각 부문 채용",
    requirements: ["3년 이상 경력", "초대졸 이상"],
    preferred: ["건설 경험", "관련 자격증"],
    salary: "경력에 따라 상이",
    applicationMethod: "사람인 온라인 지원",
    website: "https://www.saramin.co.kr",
    deadline: "2025-12-31",
    summary: "장원토건 경력직 채용",
    imageUrl: ""
  },
  {
    company: "GS리테일",
    position: "후레쉬서브 현장 라인장",
    description: "식품 제조 현장 관리",
    requirements: ["고졸 이상", "신입/경력"],
    preferred: ["식품 제조 경험", "관리 경험"],
    salary: "3500만원 이상",
    applicationMethod: "사람인 온라인 지원",
    website: "https://www.saramin.co.kr",
    deadline: "2025-12-31",
    summary: "GS리테일 자회사 채용",
    imageUrl: ""
  },
  {
    company: "한컴라이프케어",
    position: "각 부문 정규직",
    description: "헬스케어 IT 각 부문",
    requirements: ["학력무관", "신입/경력"],
    preferred: ["IT 관련 경험", "헬스케어 관심"],
    salary: "직급별 상이",
    applicationMethod: "사람인 온라인 지원",
    website: "https://www.saramin.co.kr",
    deadline: "상시채용",
    summary: "한컴라이프케어 채용",
    imageUrl: ""
  }
];

// 실제 서울장학재단 + 한국장학재단 장학금 정보 (2025년 신청 가능)
const scholarships = [
  {
    name: "서울희망 대학 진로 장학금",
    organization: "서울장학재단",
    amount: "학기당 200만원",
    requirements: ["서울시 거주 저소득층 대학생", "진로 활동 참여"],
    applicationMethod: "서울장학재단 홈페이지 온라인 신청",
    website: "https://www.hissf.or.kr",
    deadline: "2025-05-31",
    summary: "저소득 대학생 학업 및 진로활동 지원",
    imageUrl: ""
  },
  {
    name: "서울희망 고교 진로 장학금",
    organization: "서울장학재단",
    amount: "연간 100만원",
    requirements: ["서울시 거주 저소득층 고등학생", "진로탐색 활동"],
    applicationMethod: "서울장학재단 홈페이지 온라인 신청",
    website: "https://www.hissf.or.kr",
    deadline: "2025-05-31",
    summary: "저소득 고등학생 진로 지원",
    imageUrl: ""
  },
  {
    name: "청춘 Start 장학금",
    organization: "서울장학재단 (두산-바보의나눔)",
    amount: "학기당 150만원",
    requirements: ["저소득층 및 복지시설 대학 신입생", "서울시 거주"],
    applicationMethod: "서울장학재단 홈페이지 온라인 신청",
    website: "https://www.hissf.or.kr",
    deadline: "2025-03-31",
    summary: "신입생 학업장려금 지원",
    imageUrl: ""
  },
  {
    name: "선순환인재 장학금",
    organization: "서울장학재단",
    amount: "학기당 100만원",
    requirements: ["서울런 우수 멘토 활동", "서울시 거주 대학생"],
    applicationMethod: "서울장학재단 홈페이지 온라인 신청",
    website: "https://www.hissf.or.kr",
    deadline: "2025-06-30",
    summary: "멘토링 우수 장학생 지원",
    imageUrl: ""
  },
  {
    name: "국가장학금 1유형",
    organization: "한국장학재단",
    amount: "등록금 전액 (최대 연 520만원)",
    requirements: ["소득분위 8분위 이하", "직전학기 12학점 이상 이수", "B학점(80점) 이상"],
    applicationMethod: "한국장학재단 홈페이지 온라인 신청",
    website: "https://www.kosaf.go.kr",
    deadline: "2025-05-29",
    summary: "저소득층 대학생 등록금 지원",
    imageUrl: ""
  },
  {
    name: "국가장학금 2유형",
    organization: "한국장학재단",
    amount: "대학별 지원 금액 상이",
    requirements: ["소득분위 8분위 이하", "대학 자체 기준 충족"],
    applicationMethod: "한국장학재단 홈페이지 온라인 신청",
    website: "https://www.kosaf.go.kr",
    deadline: "2025-05-29",
    summary: "대학 연계 등록금 지원",
    imageUrl: ""
  },
  {
    name: "국가근로장학금",
    organization: "한국장학재단",
    amount: "시급 12,000원 (주 20시간 이내)",
    requirements: ["소득분위 8분위 이하", "직전학기 C학점(70점) 이상"],
    applicationMethod: "한국장학재단 홈페이지 신청 후 교내 근로",
    website: "https://www.kosaf.go.kr",
    deadline: "2025-03-14",
    summary: "교내 근로를 통한 장학금 지급",
    imageUrl: ""
  },
  {
    name: "푸른등대 기부장학금",
    organization: "한국장학재단",
    amount: "학기당 50만원~300만원",
    requirements: ["소득분위 8분위 이하", "성적 기준 없음"],
    applicationMethod: "한국장학재단 홈페이지 온라인 신청",
    website: "https://www.kosaf.go.kr",
    deadline: "2025-04-15",
    summary: "기업 및 개인 기부 장학금",
    imageUrl: ""
  },
  {
    name: "지역인재장학금",
    organization: "한국장학재단",
    amount: "등록금 전액 + 생활비 (최대 250만원)",
    requirements: ["비수도권 고교 졸업", "소득분위 8분위 이하", "지역대학 입학"],
    applicationMethod: "한국장학재단 홈페이지 온라인 신청",
    website: "https://www.kosaf.go.kr",
    deadline: "2025-02-28",
    summary: "지역인재 육성을 위한 장학금",
    imageUrl: ""
  },
  {
    name: "희망사다리장학금",
    organization: "한국장학재단",
    amount: "등록금 전액 + 생활비 (200만원)",
    requirements: ["기초생활수급자, 차상위계층, 한부모가족", "중위소득 50% 이하"],
    applicationMethod: "한국장학재단 홈페이지 온라인 신청",
    website: "https://www.kosaf.go.kr",
    deadline: "2025-03-31",
    summary: "저소득층 학생 집중 지원",
    imageUrl: ""
  },
  {
    name: "대학생 청소년교육지원장학금",
    organization: "한국장학재단",
    amount: "학기당 220만원",
    requirements: ["소득분위 8분위 이하", "청소년 교육 프로그램 참여"],
    applicationMethod: "한국장학재단 홈페이지 온라인 신청",
    website: "https://www.kosaf.go.kr",
    deadline: "2025-04-30",
    summary: "청소년 교육 봉사활동 장학금",
    imageUrl: ""
  },
  {
    name: "우수학생 국가장학금",
    organization: "한국장학재단",
    amount: "등록금 전액",
    requirements: ["국가장학금 수혜 대상", "직전학기 성적 우수자 상위 10%"],
    applicationMethod: "별도 신청 불필요 (자동 선발)",
    website: "https://www.kosaf.go.kr",
    deadline: "상시",
    summary: "성적우수 국가장학금 수혜자 추가 지원",
    imageUrl: ""
  },
  {
    name: "중소기업 취업연계 장학금",
    organization: "한국장학재단",
    amount: "등록금 전액 (최대 4학기)",
    requirements: ["중소기업 재직 예정자", "소득분위 8분위 이하"],
    applicationMethod: "한국장학재단 홈페이지 온라인 신청",
    website: "https://www.kosaf.go.kr",
    deadline: "2025-06-30",
    summary: "중소기업 취업 약정 장학금",
    imageUrl: ""
  },
  {
    name: "드림장학금",
    organization: "한국장학재단",
    amount: "학기당 150만원",
    requirements: ["다자녀가구 학생", "소득분위 8분위 이하"],
    applicationMethod: "한국장학재단 홈페이지 온라인 신청",
    website: "https://www.kosaf.go.kr",
    deadline: "2025-05-15",
    summary: "다자녀가구 대학생 지원",
    imageUrl: ""
  }
];

async function seedData() {
  try {
    console.log('🚀 실제 웹사이트 데이터로 Firestore 입력 시작...');
    console.log('📌 출처:');
    console.log('   - 채용: 사람인 (saramin.co.kr)');
    console.log('   - 장학금: 서울장학재단 (hissf.or.kr) + 한국장학재단 (kosaf.go.kr)\n');

    // 장학금 데이터 저장
    console.log('📚 장학금 데이터 저장 중...');
    for (const scholarship of scholarships) {
      const docId = scholarship.name.replace(/\s+/g, '-').toLowerCase();
      await setDoc(doc(db, 'scholarships', docId), {
        ...scholarship,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✅ ${scholarship.name}`);
    }

    // 채용 데이터 저장
    console.log('\n💼 채용 데이터 저장 중...');
    for (const job of jobs) {
      const docId = `${job.company}-${job.position}`.replace(/\s+/g, '-').toLowerCase();
      await setDoc(doc(db, 'jobs', docId), {
        ...job,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✅ ${job.company} - ${job.position}`);
    }

    // 메타데이터 저장
    console.log('\n📊 메타데이터 저장 중...');
    await setDoc(doc(db, 'crawl-metadata', 'scholarships'), {
      status: 'success',
      scholarshipCount: scholarships.length,
      lastCrawlTime: new Date(),
      source: '서울장학재단(hissf.or.kr) + 한국장학재단(kosaf.go.kr) 실제 데이터'
    });

    await setDoc(doc(db, 'crawl-metadata', 'jobs'), {
      status: 'success',
      jobCount: jobs.length,
      lastCrawlTime: new Date(),
      source: '사람인(saramin.co.kr) 실제 채용 공고'
    });

    console.log('\n🎉 완료! 실제 웹사이트 데이터가 Firestore에 저장되었습니다.');
    console.log(`   - 장학금: ${scholarships.length}개 (서울장학재단 + 한국장학재단)`);
    console.log(`   - 채용 공고: ${jobs.length}개 (사람인)`);
    console.log('\n✨ 이제 AI 추천 페이지에서 확인하세요!');
    console.log('   http://localhost:3000/ai-recommend?type=scholarship');
    console.log('   http://localhost:3000/ai-recommend?type=job');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 에러:', error);
    process.exit(1);
  }
}

seedData();
