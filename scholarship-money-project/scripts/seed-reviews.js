const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

// Firebase 설정
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

// 후기 데이터
const reviews = [
  // 웨딩홀 뷔페 알바
  {
    type: 'job',
    title: '웨딩홀 뷔페 알바 후기 - 힘들지만 뷔페 무한리필!',
    company: '그랜드 웨딩홀',
    position: '홀 서빙 & 식기 관리',
    location: '서울 강남구',
    workPeriod: '2023.03 ~ 2023.08',
    workType: '아르바이트',
    salary: '시급 10,000원 (주급)',
    pros: [
      '뷔페 음식을 자유롭게 먹을 수 있음',
      '출근 일정이 자유로워 다른 일정과 병행 가능',
      '주급으로 빠르게 돈을 받을 수 있음',
      '친구와 같이 출근 가능'
    ],
    cons: [
      '손님과의 접점이 많아 실수에 대한 부담이 큼',
      '체력 소모가 매우 심함 (하루종일 그릇 치우고 식기 세척)',
      '진상 손님을 자주 마주침',
      '혼자 가면 외로울 수 있음 (친구랑 같이 가는 걸 추천)'
    ],
    mainTasks: [
      '비워진 그릇과 식기 수거 및 테이블 정리',
      '그릇통 운반',
      '식기 세척 및 건조 (기물)',
      '테이블 세팅 및 정리',
      '홀 청소',
      '하객 응대'
    ],
    overallReview: `태어나서 처음으로 도전한 알바가 웨딩홀 뷔페였습니다. 대부분 결혼식이 많은 주말에 일하게 되고, 보통 전날 정해주는 시간에 출근해서 저녁쯤 퇴근했어요.

가장 큰 장점은 일하면서 점심시간과 저녁시간에 뷔페 음식을 자유롭게 먹을 수 있다는 것입니다! 비싼 뷔페를 원하는 대로 먹을 수 있어서 좋았어요.

하지만 하루종일 그릇을 치우거나 식기 청소를 하는 것은 정말 힘들었습니다. 결혼식 특성상 회전율이 매우 빠르고, 식기가 항상 부족해서 '기물' 파트에 자주 불려갔어요.

가장 조심해야 할 점은 손님들과의 접점이 많다는 것입니다. 그릇을 치우다가 음식물을 흘리거나 옷에 얼룩을 남기면 큰일나요. 실제로 몇 번 큰 사건을 목격했습니다.

친구와 동행이 가능하다면 한 번쯤 도전해볼 만한 알바입니다!`,
    ratings: {
      salary: 3,
      workLifeBalance: 4,
      culture: 4,
      growth: 2,
      welfare: 3,
      overall: 3.5
    },
    tips: '친구와 꼭 같이 가세요! 혼자 가면 정말 외롭습니다. 그리고 편한 신발은 필수입니다.',
    recommendFor: ['대학생', '체력이 좋은 사람', '주말에만 일하고 싶은 사람'],
    notRecommendFor: ['체력이 약한 사람', '손님 응대가 부담스러운 사람'],
    category: '식당/뷔페',
    tags: ['체력소모', '뷔페무료', '주말근무', '주급'],
    author: '알바러버',
    authorId: 'user123',
    isVerified: true,
    viewCount: 1250,
    likeCount: 89,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },

  // 프랜차이즈 카페 알바
  {
    type: 'job',
    title: '프랜차이즈 카페 알바 1년 반 후기 - 음료 만드는 재미는 있지만...',
    company: '스타벅스',
    position: '바리스타',
    location: '부산 해운대구',
    workPeriod: '2022.06 ~ 2024.01',
    workType: '아르바이트',
    salary: '시급 9,620원 → 10,500원',
    pros: [
      '음료 만드는 재미가 있음',
      '내 마음대로 음료를 만들어 먹을 수 있음',
      '커피에 대해 많이 배울 수 있음',
      '좋은 동료들과 함께 일할 수 있었음'
    ],
    cons: [
      '손님이 몰리는 타임에는 정신이 매우 없음',
      '컴플레인이 정말 많음',
      '시급에 비해 업무가 많음',
      '암기해야 하는 레시피가 너무 많음',
      '오래 하다보면 일태기가 옴'
    ],
    mainTasks: [
      '음료 제조',
      '고객 응대 및 주문 받기',
      '홀 청소 및 테이블 정리',
      '설거지',
      '재료 준비 (펄 끓이기 등)',
      '마감 업무 (커피 머신, 파우더/시럽 채우기)'
    ],
    overallReview: `제가 가장 오래 일한 알바입니다. 1년 반 이상 근무했고 지금도 가끔 나가고 있어요.

영화관 옆에 위치해있어서 특히 바빴던 지점이었습니다. 주말 마감 타임을 주로 나갔는데, 손님이 몰리는 시간에는 정말 정신이 없었어요. 라벨 종이가 바닥에 칭칭 감길 정도로 주문이 계속 들어왔습니다.

음료 만드는 건 처음엔 재미있었는데, 레시피가 너무 많고 신메뉴가 자주 나와서 힘들었습니다. 특히 SNS에서 핫한 신메뉴가 나오면... 주문이 미친듯이 들어와서 눈물이 나더라고요.

컴플레인도 정말 많았습니다. 영화 시간에 맞춰서 왔는데 앞에 주문이 밀려 음료가 늦게 나오면 짜증내고 가시는 분들이 많았어요.

일이 익숙해지면 음료 만드는 재미가 있지만, 체력 소모가 크고 카페 내 환경과 팀워크가 정말 중요합니다. 저는 여기서 함께한 직원분들이 너무 좋아서 오래 다닐 수 있었어요.`,
    ratings: {
      salary: 2.5,
      workLifeBalance: 2,
      culture: 4.5,
      growth: 3,
      welfare: 3,
      overall: 3
    },
    tips: '체력이 중요합니다. 그리고 좋은 팀원들을 만나는 게 정말 중요해요. 혼자 버티기 힘든 알바입니다.',
    interviewTips: '밝은 모습으로 면접 보시고, 왜 카페에서 일하고 싶은지 진솔하게 말씀하세요. 경력보다 태도를 더 중요하게 봅니다.',
    recommendFor: ['커피에 관심있는 사람', '체력이 좋은 사람', '좋은 동료와 일하고 싶은 사람'],
    notRecommendFor: ['체력이 약한 사람', '컴플레인에 민감한 사람', '단기만 생각하는 사람'],
    category: '카페',
    tags: ['힘듦', '팀워크중요', '컴플레인많음', '음료제조'],
    author: '카페마스터',
    authorId: 'user456',
    isVerified: true,
    viewCount: 2340,
    likeCount: 156,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },

  // 올리브영 알바
  {
    type: 'job',
    title: '올리브영 알바 후기 - 화장품 덕후라면 추천!',
    company: '올리브영',
    position: '매장 관리',
    location: '서울 강남구',
    workPeriod: '2023.09 ~ 2024.02',
    workType: '아르바이트',
    salary: '시급 9,620원',
    pros: [
      '화장품 트렌드를 빠르게 파악할 수 있음',
      '테스터 제품을 써볼 수 있음',
      '고객님께 제품 추천해드리고 감사 인사 받을 때 보람참',
      '좋은 점장님을 만나면 정말 좋음'
    ],
    cons: [
      '체력 소모가 매우 큼 (계속 서있거나 쭈그려 앉아야 함)',
      '행사 날이 특히 바쁨 (블랙프라이데이 등)',
      '고객 응대가 힘들 때가 있음',
      '제품 지식이 부족하면 응대하기 어려움'
    ],
    mainTasks: [
      '상품 진열 및 정리',
      '고객 응대 및 제품 추천',
      '계산 업무',
      '매장 관리 (청소, 테스터 정리)',
      '재고 관리'
    ],
    overallReview: `스킨케어나 화장품에 관심있는 사람이라면 해볼 만한 알바라고 생각해요!

테스터 제품들을 닦고 고객을 응대하면서 많은 제품을 알고 써볼 수 있었어요. 같이 일하는 분들과도 꿀정보를 주고받으면서 다양한 제품들을 알아갈 수 있었습니다.

가장 보람찬 순간은 제가 추천해드린 제품을 믿고 사주시는 고객님이 계실 때였어요. 감사하다고 말씀해주시면 정말 뿌듯했습니다.

하지만 체력 소모는 생각보다 심했어요. 몇 시간 동안 앉지 못하고 쭈그려 앉았다가 돌아다니기를 반복해야 합니다. 처음엔 다리가 정말 아팠어요.

블랙프라이데이 같은 행사 날에는 특히 바빴습니다. 제품 재고도 확인해야 하고, 같은 제품이더라도 특전이 다르거나 단품/기획 제품을 다르게 찾으시는 분들이 계셔서 신경 쓸 게 많았습니다.

제일 큰 실수는 일한 지 2주차쯤에 테스터 제품을 그대로 결제해서 드렸던 거예요... 다행히 점장님이 처음엔 누구나 실수할 수 있다고 격려해주셨습니다.`,
    ratings: {
      salary: 3,
      workLifeBalance: 3,
      culture: 4,
      growth: 4,
      welfare: 3,
      overall: 3.5
    },
    tips: '화장품에 대한 기본 지식이 있으면 좋아요. 그리고 편한 신발은 필수! 점장님이 어떤 분인지가 정말 중요합니다.',
    recommendFor: ['화장품에 관심있는 사람', '고객 응대를 좋아하는 사람', '체력이 좋은 사람'],
    notRecommendFor: ['체력이 약한 사람', '화장품에 관심없는 사람'],
    category: '뷰티/화장품',
    tags: ['화장품', '고객응대', '체력소모', '제품할인'],
    author: '뷰티러버',
    authorId: 'user789',
    isVerified: true,
    viewCount: 1890,
    likeCount: 134,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },

  // 우리은행 면접 후기
  {
    type: 'company',
    title: '우리은행 신입 채용 1차~3차 면접 최종 합격 후기',
    company: '우리은행',
    position: '개인금융 (텔러)',
    location: '서울 본점',
    workPeriod: '2024.01 ~ 현재',
    workType: '정규직',
    salary: '연봉 3,500만원 (초봉)',
    pros: [
      '체계적인 면접 프로세스',
      '면접비 총 17만원 지급',
      '안성연수원에서 커피챗, 인형뽑기 등 배려',
      '복지가 좋음',
      '안정적인 직장'
    ],
    cons: [
      '면접이 총 3번이라 준비할 게 많음',
      '서류 전형이 어려움',
      '경쟁률이 높음'
    ],
    mainTasks: [
      '고객 응대',
      '예금/출금 업무',
      '금융상품 상담',
      '영업'
    ],
    overallReview: `3일 전만 해도 대학생이었는데 은행원이 되었습니다!

우리은행은 필기시험이 없는 대신 면접을 3번 봅니다.

**1차 면접 (역량 면접)**
본사에서 진행하고, 5인 1조로 2명의 면접관과 인당 7분 정도 심층 질문을 받습니다. 직무에 관한 질문, 자소서 기반 질문, 왜 우리은행인지에 대한 검증이 주를 이룹니다.

**2차 면접 (실무진 면접)**
안성연수원에서 진행되며, 하루 종일 여러 면접을 봅니다:
1. 심층인성면접 (9인 1조, 8분)
2. 참여형 팀워크 프로젝트
3. PT & 세일즈 면접

대기하는 동안 커피챗, 인형뽑기, 우리네컷 등을 할 수 있어서 심심하지 않았어요. 배려를 많이 하신 게 느껴졌습니다.

**3차 면접 (임원 면접)**
부행장급 3명 + 외부면접관 1명과 6인 1조로 면접을 봅니다. 우리은행의 로열티와 비전에 대한 생각을 확인하는 질문이 많았습니다.

취준 기간 중 힘든 시간도 있었지만, 나를 믿고 포기하지 않고 계속 부딪히다 보니 좋은 결과를 얻을 수 있었던 것 같아요!`,
    ratings: {
      salary: 4,
      workLifeBalance: 3.5,
      culture: 4,
      growth: 4,
      welfare: 4.5,
      overall: 4
    },
    tips: '자소서가 가장 중요합니다! 그리고 각 면접마다 철저히 준비하세요.',
    interviewTips: `1차 면접: 자소서와 직무 관련 질문 준비. 왜 우리은행인지 명확히 답변할 수 있어야 함.
2차 면접: PT 주제와 세일즈 상품에 대해 30분 준비 시간 주어짐. 상황 대응 능력 중요.
3차 면접: 우리은행에 대한 로열티 보여주기. 긴장하지 말고 자연스럽게.`,
    recommendFor: ['금융권 취준생', '안정적인 직장을 원하는 사람', '영업에 자신있는 사람'],
    notRecommendFor: ['면접 준비 시간이 부족한 사람'],
    category: '금융',
    tags: ['은행', '정규직', '면접3회', '면접비지급', '신입채용'],
    author: '은행원감자',
    authorId: 'user101',
    isVerified: true,
    viewCount: 3420,
    likeCount: 287,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },

  // 토스 인턴 후기
  {
    type: 'intern',
    title: '토스쇼핑 Sales Specialist 8기 최종 합격 후기',
    company: '토스 (비바리퍼블리카)',
    position: 'Sales Specialist (MD)',
    location: '서울 역삼 아크플레이스',
    workPeriod: '2024.10 ~ 2025.01 (3개월 계약)',
    workType: '인턴',
    salary: '시급 12,000원 (3개월 계약직)',
    pros: [
      '토스라는 좋은 기업 경험',
      '영업 경험 쌓을 수 있음',
      '젊은 문화',
      '복지가 좋음 (사내 카페 등)',
      '역삼 오피스가 멋짐'
    ],
    cons: [
      '3개월 계약직',
      '전화영업이 주 업무 (MD 경험 기대하면 실망)',
      '정규직 전환은 어려움'
    ],
    mainTasks: [
      '전화 영업 (주 업무)',
      '세일즈',
      'MD 업무 보조'
    ],
    overallReview: `인스타를 보다가 토스쇼핑 Sales Specialist 대규모 채용 광고를 보고 지원했습니다.

**서류 전형**
자기소개서 2문항 (각 700자):
1. 토스쇼핑 합류 이유와 포부, 실행계획
2. 세일즈 중요 역량과 경험

이력서는 잡코리아 양식으로 작성. 마감일에 제출했는데 3일 만에 유선으로 합격 통보 받았습니다.

**면접**
역삼 아크플레이스 토스 본사에서 1:1 면접, 약 30분 소요. 이력서와 자소서 기반으로 질문하시고, 예상치 못한 질문도 많이 하셔서 당황했습니다. 제가 기재한 경험에 대해 디테일하게 파고드셨어요.

기본 답변(자기소개, 지원동기, 포부)은 꼭 준비하고 가세요!

**최종 합격**
면접 보고 하루 뒤에 010 번호로 최종 합격 통보 받았습니다.

토스가 직원 복지가 굉장히 좋다는 말을 많이 들었는데, 오피스를 직접 보면서 실감했어요. 사내 카페도 있고 직원분들 표정도 좋았습니다.

3개월 계약직이지만 토스라는 좋은 기업에서 경험을 쌓을 수 있어서 만족합니다!`,
    ratings: {
      salary: 3,
      workLifeBalance: 3.5,
      culture: 5,
      growth: 4,
      welfare: 5,
      overall: 4
    },
    tips: 'MD 경험만 기대하고 들어가면 실망할 수 있어요. 세일즈에 초점을 두고 있는 직군입니다.',
    interviewTips: '밝은 모습으로 면접 보시고, 이력서에 적은 경험에 대해 디테일하게 준비하세요. 예상치 못한 질문이 많이 나옵니다.',
    recommendFor: ['영업 경험 쌓고 싶은 사람', '토스 문화를 경험하고 싶은 사람', '금융권 이직 준비하는 사람'],
    notRecommendFor: ['MD 경험만 원하는 사람', '전화영업이 부담스러운 사람'],
    category: 'IT/스타트업',
    tags: ['토스', '인턴', '영업', '계약직', '역삼'],
    author: '토스인턴',
    authorId: 'user202',
    isVerified: true,
    viewCount: 2890,
    likeCount: 198,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

async function seedReviews() {
  console.log('🌱 후기 데이터 시딩 시작...');
  
  try {
    for (const review of reviews) {
      await addDoc(collection(db, 'reviews'), review);
      console.log(`✅ 후기 추가됨: ${review.title}`);
    }
    
    console.log('🎉 모든 후기 데이터 시딩 완료!');
    process.exit(0);
  } catch (error) {
    console.error('❌ 에러 발생:', error);
    process.exit(1);
  }
}

seedReviews();
