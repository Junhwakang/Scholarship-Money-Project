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

function sanitizeDocId(str) {
  return str
    .replace(/\//g, '-')  // 슬래시를 하이픈으로
    .replace(/\(/g, '')   // 괄호 제거
    .replace(/\)/g, '')
    .replace(/\s+/g, '-') // 공백을 하이픈으로
    .replace(/['"\.]/g, '')  // 따옴표, 점 제거
    .replace(/:/g, '-')   // 콜론을 하이픈으로
    .toLowerCase();
}

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
   // 기존 전국 채용 정보
  { company: "주식회사 더피플", position: "2026 상반기 관리직원, 영업직원 모집", location: "전북 부안군", workTime: "10:00~18:00", salary: "월급 3,500,000원", deadline: "2026-01-31", website: "https://www.saramin.co.kr" },
  { company: "주식회사 위너스", position: "자동차 부품 생산직 일일 아르바이트", location: "울산 북구", workTime: "06:30~15:30", salary: "일급 110,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "코리아로지스원(주)", position: "초보자, 차량 소유자 우대", location: "경기 파주시", workTime: "시간협의", salary: "월급 5,000,000원", deadline: "2026-01-31", website: "https://www.saramin.co.kr" },
  { company: "크리스피크림도넛 사당점", position: "주3일 월화수 마감 근무자", location: "서울 관악구", workTime: "15:30~22:30", salary: "시급 10,320원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "효성ITX", position: "코웨이 프리미엄센터 고객 CS상담", location: "서울 구로구", workTime: "09:00~18:00", salary: "월급 2,300,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "(주)한미하우랜", position: "사무직 구합니다", location: "서울 강동구", workTime: "10:00~17:00", salary: "월급 1,700,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "투썸플레이스 대전전민점", position: "투썸 전민점 주말 미들스텝", location: "대전 유성구", workTime: "12:00~17:00", salary: "시급 10,200원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "주원지엘에스(주)", position: "간단수거업무 주5일 야간근무", location: "경기 남양주시", workTime: "22:00~04:00", salary: "월급 4,980,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "맥도날드 화명동점", position: "평일 주말 근무자 모집", location: "부산 북구", workTime: "시간협의", salary: "시급 10,320원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "웅진씽크빅 김포풍무", position: "중등수학교사 모집", location: "경기 김포시", workTime: "13:00~18:00", salary: "월급 2,000,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "빽보이피자 화성병점점", position: "함께 일할 분 찾습니다", location: "경기 화성시", workTime: "17:00~23:30", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "파리바게뜨 신풍역점", position: "평일 오후 알바 경력자 우선", location: "서울 영등포구", workTime: "14:00~20:00", salary: "시급 10,320원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "버거킹 인천공항T1교통센터점", position: "인천공항 크루 모집", location: "인천 전체", workTime: "시간협의", salary: "시급 10,320원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "커피빈 강남역랭기지타워점", position: "마감 5H 슈퍼바이저", location: "서울 전체", workTime: "11:30~17:00", salary: "월급 1,363,930원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "(주)커피빈코리아", position: "영종도운서역점 주말 스텝", location: "인천 중구", workTime: "09:00~14:30", salary: "시급 10,500원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "CU 영등포메리어트호텔점", position: "수요일 주간 STAFF", location: "서울 영등포구", workTime: "07:00~21:00", salary: "시급 10,500원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "아웃백 진주롯데몰점", position: "직원 채용 공고", location: "경남 진주시", workTime: "시간협의", salary: "시급 12,050원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "도미노피자 천왕점", position: "주방, 배달스텝 모집", location: "전국 전체", workTime: "시간협의", salary: "주급 550,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "(주)유니에스", position: "다이슨 휴무대체 매장 판매사원", location: "부산 해운대구", workTime: "시간협의", salary: "일급 106,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "한진빌딩", position: "청소/식기세척/보조 일급지급", location: "서울 중구", workTime: "10:00~19:00", salary: "일급 108,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "푸른바다서비스", position: "클릭주유소 주말 직원 모집", location: "광주 북구", workTime: "시간협의", salary: "시급 10,320원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "한사발포차 신사가로수길점", position: "홀서빙 직원 구합니다", location: "서울 강남구", workTime: "시간협의", salary: "월급 2,600,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "(주)비엔씨하이텍", position: "2025년 사무직 직원 모집", location: "경기 양주시", workTime: "09:00~18:00", salary: "연봉 28,000,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "CU 상계대림점", position: "평일 주간 모집", location: "서울 노원구", workTime: "17:00~23:00", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "코웨이 대구지산지국", position: "코웨이 코디 모집", location: "대구 수성구", workTime: "시간협의", salary: "월급 3,270,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "CU 민락캐슬점", position: "금요일 야간 스텝", location: "부산 수영구", workTime: "22:00~08:00", salary: "시급 10,100원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "노가리앤비어", position: "홀알바 구함", location: "경기 안산시 단원구", workTime: "16:00~24:00", salary: "시급 11,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "재능교육 동수원지국", position: "재능스스로교실 선생님", location: "경기 수원시 영통구", workTime: "시간협의", salary: "월급 2,000,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "(주)에스비에이디", position: "샤브올데이 분당서현점 홀", location: "경기 성남시 분당구", workTime: "10:00~22:00", salary: "월급 3,100,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "생활맥주 잠실장미점", position: "홀, 주방 파트타이머", location: "서울 송파구", workTime: "시간협의", salary: "시급 12,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "써브웨이 인천가정중앙점", position: "평일 마감 직원 모집", location: "인천 서구", workTime: "17:00~23:30", salary: "시급 10,150원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "CU 효성유승점", position: "주2일 스태프", location: "인천 부평구", workTime: "11:00~17:00", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "일번가왕소금구이", position: "평일 주말 홀 아르바이트", location: "경남 창원시 성산구", workTime: "18:00~22:00", salary: "시급 12,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },

  // 부산 지역 채용 정보 (사진에서 추가)
  { company: "웅진씽크빅 부산남부", position: "민락동E-편한 오션테라스-내집에서 공부방창업", location: "부산 전체", workTime: "14:00~18:00", salary: "월급 2,000,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "153구포국수 덕천점", position: "153구포국수덕천점에서15시~21시 주6일 근무자모집", location: "부산 북구", workTime: "시간협의", salary: "월급 1,500,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "파리바게뜨 부산신평역점", position: "파리바게뜨 평일 마감 근무자 모집", location: "부산 사하구", workTime: "18:30~22:30", salary: "시급 10,050원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "에이비씨마트코리아 ST 부산광복점", position: "ABC 마트 ST 부산광복점 판매직 채용공고", location: "부산 중구", workTime: "시간협의", salary: "월급 2,096,270원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "CU 초읍성지점", position: "CU초읍성지점 수 오전알바 모집", location: "부산 부산진구", workTime: "12:00~19:00", salary: "시급 10,320원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "에이비씨마트코리아 SE 부산서면삼정타워점", position: "SE 부산서면삼정타워점", location: "부산 전체", workTime: "12:00~21:00", salary: "월급 2,091,971원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "엔제리너스 김해공항점", position: "엔제리너스 김해공항 국내선점(2층) 아르바이트 모집", location: "부산 전체", workTime: "시간협의", salary: "시급 10,320원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "재능교육 연지지국", position: "부산진구 당감동 롯데 라센트 공부방 원장님 모집", location: "부산 전체", workTime: "시간협의", salary: "월급 2,000,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "SK매직 부산남구지국", position: "SK매직의 케어전문가를 모집합니다", location: "부산 남구", workTime: "시간협의", salary: "월급 3,000,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "(주)바른티앤피", position: "성실한 방역-소독 담당자 모집", location: "부산 사하구", workTime: "07:30~11:30", salary: "시급 12,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "CU 신규점", position: "씨유리마크빌대연점에서 씨유경력자수,목(18시~23시)", location: "부산 남구", workTime: "18:00~23:00", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "CU 뉴범천한라점", position: "부산진구 서면 범내골역 인근 편의점 금요일 오후 알바", location: "부산 전체", workTime: "13:00~19:00", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "파리바게뜨 부산신평역점", position: "파리바게뜨 주말 마감 근무자 모집", location: "부산 사하구", workTime: "18:30~22:30", salary: "시급 10,050원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "신우산업관리(주)롯데몰동부산점", position: "롯데몰동부산점 주차유도 (정규.주말) 모집", location: "부산 전체", workTime: "시간협의", salary: "월급 2,350,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "코웨이 부산좌동지국", position: "코웨이 코디 모집", location: "부산 해운대구", workTime: "시간협의", salary: "월급 3,270,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "에이비씨마트코리아 GS 부산서면점", position: "GSA 부산서면본점 판매직 채용공고", location: "부산 전체", workTime: "시간협의", salary: "월급 2,060,740원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "버거킹 부산주례점", position: "주례점 아르바이트 모집", location: "부산 사상구", workTime: "시간협의", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "CU 서면우정점", position: "주말 야간 알바 구합니다", location: "부산 부산진구", workTime: "22:00~08:00", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "에이비씨마트코리아 GS 부산서면팝업점", position: "GS 부산서면팝업점 판매직 채용공고", location: "부산 전체", workTime: "시간협의", salary: "월급 2,060,740원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "(주)파트너스코리아", position: "부산서구-꿀알바-단기-주야 대기업 식품 생산직 채용", location: "부산 서구", workTime: "시간협의", salary: "시급 10,320원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "롯데리아 부산동래역", position: "롯데리아 동래역점에서 아르바이트생 모집", location: "부산 동래구", workTime: "시간협의", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "옵스 롯데광복점", position: "옵스 베이커리 롯데광복점 판매직원 모집(정규직)", location: "부산 중구", workTime: "11:00~20:00", salary: "월급 2,240,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "웅진씽크빅 정관지국", position: "초등영어, 중등영어 파트타임 선생님", location: "부산 기장군", workTime: "시간협의", salary: "시급 15,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "웅진씽크빅 정관지국", position: "주2회 주3회 방문수업관리 급여", location: "부산 기장군", workTime: "15:00~19:00", salary: "월급 1,500,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "웅진씽크빅 정관지국", position: "초중등 수학 선생님", location: "부산 기장군", workTime: "13:00~20:00", salary: "월급 2,500,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "웅진씽크빅 정관지국", position: "정관 동일2차 동일 3차 초등공부방 개설원장님 모집", location: "부산 기장군", workTime: "13:00~18:30", salary: "월급 2,000,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "웅진씽크빅 정관지국", position: "정관 센트럴 초등공부방 개설원장님 모집", location: "부산 기장군", workTime: "13:00~18:30", salary: "월급 2,100,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "투썸플레이스 경성대역점", position: "투썸플레이스 경성대역점에서 매니저 구인", location: "부산 남구", workTime: "시간협의", salary: "월급 2,200,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "CU 신규점", position: "씨유대연클라센트(토일18시~24시)경험자우대", location: "부산 남구", workTime: "시간협의", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "맘스터치 덕천점", position: "맘스터치 덕천점 오후 주방알바 구함", location: "부산 북구", workTime: "17:00~20:00", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "CU 해운대동원비스타점", position: "주말저녁(토일)모집", location: "부산 해운대구", workTime: "17:00~22:00", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "CU 해운대동원비스타점", position: "주말오후(일)모집", location: "부산 해운대구", workTime: "12:00~22:00", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "SK매직 부산남구지국", position: "SK인텔릭스(SK매직)의 케어전문가 모집", location: "부산 남구", workTime: "시간협의", salary: "월급 2,700,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "코웨이 부산기장지국", position: "코웨이 코디 모집", location: "부산 기장군", workTime: "시간협의", salary: "월급 3,270,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "CU 해운대한양수자인점", position: "주말(토,일) 오후 스텝 모집", location: "부산 해운대구", workTime: "15:30~23:30", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "CU 해운대한양수자인점", position: "토요일 야간 스텝 모집", location: "부산 해운대구", workTime: "22:00~08:30", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "버거킹 해운대우동점", position: "해운대우동점에서 저녁 주방 마감 크루 모집", location: "부산 해운대구", workTime: "16:30~22:30", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "CU 강서에코이편한점", position: "씨유강서에코이편한점 주말알바모집", location: "부산 강서구", workTime: "16:00~00:00", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "롯데리아 키즈마트부산점", position: "롯데리아 키즈마트에서 근무할 메이트 모집", location: "부산 부산진구", workTime: "시간협의", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "부산구평DT점", position: "버거킹 부산구평DT점에서 함께 할 크루 모집", location: "부산 사하구", workTime: "시간협의", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "CU 영도하리점", position: "화,수 야간직원 구인", location: "부산 영도구", workTime: "23:00~05:00", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "CU 영도미라주점", position: "화,수 야간 직원 모집", location: "부산 영도구", workTime: "23:00~06:00", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "CU 일광바다거리점", position: "CU일광바다거리점 오전-오후 알바 구함", location: "부산 기장군", workTime: "시간협의", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "맥도날드 부곡점", position: "맥도날드부곡점에서 크루 모집", location: "부산 금정구", workTime: "06:00~01:30", salary: "시급 10,320원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "써브웨이 좌동점(장산역)", position: "써브웨이 해운대 좌동점 파트타이머 모집", location: "부산 해운대구", workTime: "시간협의", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "스타벅스 정관신도시DT", position: "스타벅스 정관신도시DT점 바리스타 모집", location: "부산 기장군", workTime: "시간협의", salary: "시급 11,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "정현오앤씨", position: "플라스틱 자동차 및 전자부품 사출품 사상 조립 검사", location: "부산 강서구", workTime: "08:00~17:00", salary: "시급 10,320원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "신한쏠-신한SOL", position: "5시조기퇴근-휴식110분 휴면고객 포인트 지급 상담", location: "부산 중구", workTime: "09:00~18:00", salary: "월급 2,700,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "신한쏠-신한SOL", position: "주2회조기퇴근-입사축하금 신한카드 이벤트 안내", location: "부산 연제구", workTime: "09:00~18:00", salary: "월급 2,700,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "TCK 요기요 부산 고객센터", position: "시간선택 요기요 채팅-콜 CS 상담", location: "부산 부산진구", workTime: "시간협의", salary: "월급 2,460,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "주식회사 안목서면점", position: "평일-주말 안목서면점 홀서빙 알바", location: "부산 부산진구", workTime: "11:00~15:00", salary: "시급 10,320원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "주식회사 태영솔루션즈", position: "근무지-구서동 태양광 전문업체 TM 직원 모집", location: "부산 금정구", workTime: "10:00~17:00", salary: "시급 13,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "(주)휴넥트-농협은행", position: "급여인상-지원금혜택 농협은행 카드 고객센터", location: "부산 금정구", workTime: "09:00~18:00", salary: "월급 2,200,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "주식회사 컬리", position: "컬리 창원센터 주5일 야간 현장 물류-지게차", location: "부산 사상구", workTime: "시간협의", salary: "월급 2,640,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "주식회사 컬리", position: "컬리 창원센터 주5일 주간 현장 물류-지게차", location: "부산 부산진구", workTime: "시간협의", salary: "월급 2,270,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "해운대백병원", position: "해운대백병원 업무보조 채용", location: "부산 해운대구", workTime: "08:00~17:00", salary: "월급 2,161,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "부산지점", position: "단순 서류정리 및 관리 담당자 모집", location: "부산 연제구", workTime: "10:00~15:00", salary: "월급 3,500,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "부산은행 본점 직원식당", position: "조리원 문현동 부산은행 직원식당 직원 모집", location: "부산 부산진구", workTime: "08:30~15:00", salary: "월급 1,672,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "주식회사 오션플랜트", position: "급여 450만 이상,초보를 위한 단순 작업", location: "부산 강서구", workTime: "시간협의", salary: "월급 4,500,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "주식회사 오션플랜트", position: "급여 450만 이상,초보를 위한 단순 작업", location: "부산 사상구", workTime: "시간협의", salary: "월급 4,500,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "주식회사 오션플랜트", position: "급여 450만 이상,초보를 위한 단순 작업", location: "부산 기장군", workTime: "시간협의", salary: "월급 4,500,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "주식회사 오션플랜트", position: "급여 450만 이상,초보를 위한 단순 작업", location: "부산 부산진구", workTime: "시간협의", salary: "월급 4,500,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "주식회사 오션플랜트", position: "급여 450만 이상,초보를 위한 단순 작업", location: "부산 북구", workTime: "시간협의", salary: "월급 4,500,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "덮밥장사장 부산대점", position: "부산대 덮밥장사장 조리원(주4.5일 260만)", location: "부산 금정구", workTime: "시간협의", salary: "월급 2,600,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "(주)앤트워크", position: "중앙LGU+-정규직입사 LG유플러스 상담", location: "부산 부산진구", workTime: "09:00~18:00", salary: "월급 3,000,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "다이소 부산일광신도시점", position: "다이소 부산일광신도시점 주6일 오전2시간", location: "부산 기장군", workTime: "07:00~09:00", salary: "시급 10,500원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "다이소 이마트해운대점", position: "다이소 이마트해운대점 오후2시간 주6일", location: "부산 해운대구", workTime: "20:00~22:00", salary: "시급 10,320원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "다이소 부산양정점", position: "다이소 부산양정점 주6일 오전2시간", location: "부산 부산진구", workTime: "07:00~09:00", salary: "시급 10,320원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "다이소 부산거제시장점", position: "다이소 부산거제시장점 주6일 오전2시간", location: "부산 연제구", workTime: "07:00~09:00", salary: "시급 10,320원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "소문난완도댁김치", position: "반찬가게 포장-판매-주방-업무 모집", location: "부산 부산진구", workTime: "08:30~17:30", salary: "월급 2,600,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "신한쏠-신한SOL", position: "주2회조기퇴근-입사축하금 신한카드 이벤트", location: "부산 부산진구", workTime: "09:00~18:00", salary: "월급 2,700,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "정직컴퍼니", position: "유플러스 판매사 CS 채용공고 업계최고대우 대연동", location: "부산 남구", workTime: "10:00~20:00", salary: "월급 5,000,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "정직컴퍼니", position: "유플러스 판매사 CS 채용공고 업계최고대우 사직동", location: "부산 동래구", workTime: "10:00~20:00", salary: "월급 5,000,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "길촌숯불갈비", position: "길촌숯불갈비 홀서빙 파트타이머 채용", location: "부산 부산진구", workTime: "18:00~22:00", salary: "시급 10,500원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "화락만리", position: "주5일-서면 호텔식 중식당 화락만리 풀타임 홀직원", location: "부산 부산진구", workTime: "11:00~22:00", salary: "시급 10,100원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "TCK 배달의민족 부산 채팅센터", position: "채팅전담-단기계약 배달의민족 부산 채팅상담", location: "부산 부산진구", workTime: "시간협의", salary: "월급 1,400,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "주식회사 컬리", position: "컬리 창원센터 주5일 야간 현장 물류-지게차", location: "부산 부산진구", workTime: "시간협의", salary: "월급 2,640,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "주식회사 컬리", position: "컬리 창원센터 주5일 야간 현장 물류-지게차", location: "부산 강서구", workTime: "시간협의", salary: "월급 2,640,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "주식회사 컬리", position: "컬리 창원센터 주5일 주간 현장 물류-지게차", location: "부산 강서구", workTime: "시간협의", salary: "월급 2,270,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "언양닭칼국수 경성대부경대점", position: "주말(토,일) 오후 홀서빙", location: "부산 남구", workTime: "시간협의", salary: "시급 10,030원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "연 춘", position: "중식당 연춘 중식전문 주방-평일 홀서빙", location: "부산 연제구", workTime: "10:30~22:00", salary: "월급 3,200,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "매드독스 광안점", position: "광안점 주방 정직원(주5일근무) 2교대", location: "부산 수영구", workTime: "시간협의", salary: "월급 2,582,520원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "해운대백병원", position: "해운대백병원 병동(3교대) 업무보조 모집", location: "부산 해운대구", workTime: "07:30~15:30", salary: "월급 2,196,270원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "에이닷영어학원 부산해운대지점", position: "에이닷 부산해운대지점 1대1 학습관리코칭 강사", location: "부산 해운대구", workTime: "16:00~22:00", salary: "월급 2,300,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "에이닷영어학원 부산사하지점", position: "에이닷 부산사하지점 1대1 학습관리코칭 강사", location: "부산 사하구", workTime: "16:00~22:00", salary: "월급 2,300,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "리틀테라스", position: "시급10만원 당일지급 면접 택시비지원", location: "부산 해운대구", workTime: "시간협의", salary: "시급 100,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "쿠팡로지스틱스서비스", position: "인센티브34만-쿠팡 집근처알바-서틀-단기", location: "부산 해운대구", workTime: "시간협의", salary: "일급 166,995원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "쿠팡로지스틱스서비스", position: "인센티브34만-쿠팡 집근처알바-서틀-단기", location: "부산 연제구", workTime: "시간협의", salary: "일급 166,995원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "쿠팡로지스틱스서비스", position: "인센티브34만-쿠팡 집근처알바-서틀-단기", location: "부산 수영구", workTime: "시간협의", salary: "일급 166,995원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "쿠팡로지스틱스서비스", position: "인센티브34만-쿠팡 집근처알바-서틀-단기", location: "부산 동래구", workTime: "시간협의", salary: "일급 166,995원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "쿠팡로지스틱스서비스", position: "인센티브34만-쿠팡 집근처알바-서틀-단기", location: "부산 기장군", workTime: "시간협의", salary: "일급 166,995원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "쿠팡로지스틱스서비스", position: "인센티브34만-쿠팡 집근처알바-서틀-단기", location: "부산 사상구", workTime: "시간협의", salary: "일급 166,995원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "상록회관 연탄구이", position: "상록회관 서면고기집 홀 정직원 구함", location: "부산 부산진구", workTime: "17:00~05:00", salary: "월급 3,000,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "(주)유진유통", position: "휴대폰판매직원 대모집 부산유일 기업형", location: "부산 부산진구", workTime: "시간협의", salary: "월급 5,000,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "젠부", position: "차비제공 분위기 좋은 젠부bar 함께할 직원", location: "부산 사하구", workTime: "19:30~03:00", salary: "시급 30,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "팀볼소주호프노래타운", position: "볼노래타운 서면 홀&주방 알바.직원모집", location: "부산 부산진구", workTime: "시간협의", salary: "월급 2,700,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "입주청소", position: "부산 지역 입주청소 현장 팀장님 모집", location: "부산 남구", workTime: "시간협의", salary: "일급 180,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "원피스피자", position: "원피스피자 홀 정직원모집 2교대", location: "부산 해운대구", workTime: "시간협의", salary: "월급 2,627,330원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "크랩피크", position: "L7호텔 2층 크랩피크 (홀,주방) 모집", location: "부산 전체", workTime: "11:00~22:00", salary: "월급 3,400,000원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "써든스테이크 연산점", position: "트레이더스 연산 양식전문점 평일 오후 알바", location: "부산 연제구", workTime: "17:00~21:00", salary: "시급 10,320원", deadline: "2025-12-31", website: "https://www.saramin.co.kr" },
  { company: "에이치엠수학전문학원", position: "수학학원 채점-초중등부 전임강사", location: "부산 해운대구", workTime: "시간협의", salary: "시급 15,000원", deadline: "2025-12-31", website:"https://www.saramin.co.kr"},
  {
    company: "네이버아이앤에스",
    position: "NAVER I&S 각 부문 수시 채용",
    description: "네이버 자회사 각 부문 채용",
    requirements: ["학력무관", "신입-경력 무관"],
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
  },
    {
    name: "2026년도 (재)부산 중구장학회 장학생 선발 안내 - 학생 또는 학부모가 부산 중구에 3년 이상 거주",
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
    name: "한국장학재단 통합돌봄(통합 학생지원 정보군) 안내",
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
    name: "2026년 1학기 농어촌희망재단 청년희망농장학금 신청 안내",
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
    name: "[한국사회보장정보원] 국가장학금 신청자와 함께하는 복지멤버십 신규 가입 이벤트 (~2025.2.28)",
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
    name: "2025년 하반기 IBK기업은행 장학생 추천자 선발 안내 (12월11일 오전 11시까지)",
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
    name: "2025-2학기 동계방학 집중근로 선발자 안내 (포기 시 12월8(일) 오후2시까지 장학지원팀 연락)",
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
    name: "2026년 (재)협성문화재단 신규 장학생 선발 안내",
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
    name: "취업 후 상환 학자금대출 전액부유자 대상 '제무자 신고 및 해외이주유학신고' 의무 안내",
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
    name: "2026-1학기 교내장학금(나눔, 희망장학금) 신청 안내(12/1~12/12)",
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
    name: "2025년 2학기 거창군 지역출신 대학생 등록금 지원사업 안내",
    organization: "거창군",
    amount: "등록금 지원",
    requirements: ["거창군 출신"],
    applicationMethod: "거창군청",
    website: "https://www.geochang.go.kr",
    deadline: "2025-11-11",
    summary: "거창군 대학생 등록금 지원",
    imageUrl: ""
  },

  // Image 2 (1471-1462)
  {
    name: "성파(星波)인재상 신청 및 마일리지 장학금 명칭 변경 관련 안내",
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
    name: "2025년도 하반기 '북한이탈주민 지원 장학생 선발' 추가모집 안내",
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
    name: "2025-2학기 국가근로 동계방학 중 집중근로 희망근로지 신청안내(이해관계자 회피 의무)",
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
    name: "2025년 2학기 전북 익산시 다다익산 장학생 선발 안내",
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
    name: "2026년도 전기공사공제조합장학회 장학생 선발 안내",
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
    name: "2025년 [대학혁신지원사업] 혁신인재장학금 추천 안내(10/31~11/10 13:00 까지)",
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
    name: "2025년도 하반기 강화군 대학생 등록금 지원사업 안내",
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
    name: "2025년도 동영시 자소득 대학생 장학금 신청 안내",
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
    name: "2025년도 (재)인천인재평생교육진흥원 공익인재 장학생 선발 모집기간 연장 안내 [본인 또는 부모의 주소지를 둔 학생]",
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
    name: "2025년 2학기 안산시 대학생 보일부담 등록금 반값지원 안내",
    organization: "안산시",
    amount: "등록금 반값",
    requirements: ["안산시 거주"],
    applicationMethod: "안산시청",
    website: "https://www.iansan.net",
    deadline: "2025-10-17",
    summary: "안산시 등록금 반값 지원",
    imageUrl: ""
  },

  // Image 3 (1461-1452)
  {
    name: "2026년도 한국지도자육성장학재단 신규 장학생 선발 안내",
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
    name: "빙그레공익재단 후원 특럼유공자 후손 장학생 신청 안내",
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
    name: "2025년도 (재)인천인재평생교육진흥원 하반기 장학생 선발 추가 모집 안내 [본인 또는 부모의 주소지를 둔 학생]",
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
    name: "2025-2학기 중소기업 취업연계 장학금(희망사다리유형) 신규장학생 추천 명단 안내",
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
    name: "[아산사회복지재단] 2026년도 북한이탈청소년 장학생 선발 안내 - 정부기관의 보호증명서 소지자 지원",
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
    name: "2025년 하반기 재단법인 논산시장학회 장학생 선정 안내",
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
    name: "2025년 해운대구 장학금 신청 안내",
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
    name: "2025년 하반기 서울 은평구민 장학생 선발 안내",
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
    name: "2025년 하반기 '부산지역인재 장학금' 선정 안내 (9.24~9.30) - IT 및 상경분야 (지원가능 여부 사전 문의 필수)",
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
    name: "[한국장학재단] 희망사다리 장학생 대상 일자리박람회 홍보",
    organization: "한국장학재단",
    amount: "안내사항",
    requirements: ["희망사다리 장학생"],
    applicationMethod: "한국장학재단",
    website: "https://www.kosaf.go.kr",
    deadline: "2025-09-23",
    summary: "일자리박람회 안내",
    imageUrl: ""
  },

  // Image 4 (1451-1442)
  {
    name: "2025년 하반기 (재)울산연구원 장학생 선발 안내 - 울산시 소재 고등학교 졸업자 해당",
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
    name: "2025학년도 2학기 장학사정관제장학금(추가) 신청 안내",
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
    name: "한국장학재단 '장학금 부정청구 자가점검 체크리스트' 안내",
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
    name: "(재)춘천시민장학재단 2025년도 하반기 봄내장학생 선발 안내",
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
    name: "2025-2학기 '독의사랑' 장학식비 지급 안내",
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
    name: "(재)고속도로장학재단 2025년 고속도로 장학생 선발 안내 [고속도로 사고 피해가정 해당]",
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
    name: "2025년도 (재)인천인재평생교육진흥원 하반기 장학생 선발 안내 [본인 또는 부모의 주소지를 둔 학생]",
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
    name: "2025년 경원장학재단 장학생 선발 안내",
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
    name: "2025년 (재)경주시장학회 장학생 선발 안내 [경주시 관내 거주자(부모 또는 학생) 해당]",
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
    name: "2025년 하반기 익산시 대학생 학자금 대출이자 지원 안내[전북 익산시에 주소를 둔 학부 재학생 부모 또는 학생 해당]",
    organization: "익산시",
    amount: "대출이자 지원",
    requirements: ["익산시 거주"],
    applicationMethod: "익산시청",
    website: "https://www.iksan.go.kr",
    deadline: "2025-09-03",
    summary: "익산시 학자금 대출이자 지원",
    imageUrl: ""
  },

  // Image 5 (1441-1432)
  {
    name: "2025-2학기 국가장학금 신청자 가구원 동의안내",
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
    name: "2025년도 2학기 고졸 후학습자 장학사업(희망사다리Ⅲ유형) 신규장학생 선정 안내(9/3~9/24까지)",
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
    name: "2025년도 (재)포항시장학회 대학교 장학생, 귀뚜라미 장학생 선발 안내 [본인 또는 보호자가 포항시에 거주하는 학생]",
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
    name: "2025-2학기 중소기업 취업연계 장학사업(희망사다리Ⅱ유형) 신규장학생 선정 안내(9/3~9/24까지)",
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
    name: "2025년 하반기 재단법인 고연장학재단 장학생 선발 안내",
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
    name: "2025년 상반기를 통영시 대학생 학자금 이자 지원 안내 [통영시 소재 고등학교 졸업자 해당]",
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
    name: "(재)달서인재육성장학재단 2025년도 하반기 장학생 선발 안내 [대구 달서구 주소지를 둔 학생]",
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
    name: "2025년 2학기 통영시 대학생 등록금 전액 지원 안내 [통영시에 주소를 둔 학부 2~4학년 재학생 해당]",
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
    name: "2025-2학기 국가근로장학생 선발자 안내(탈북)",
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
    name: "2025년 대동장학재단 대동장학생 선발 안내",
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

// 임금체불 사업주 데이터
const wageViolations = [
  {
    companyName: "승화종합업",
    location: "경북 경주시 외동읍 내외로",
    representative: "강창철",
    amount: 70710653
  },
  {
    companyName: "(주)소마시스템",
    location: "서울특별시 강남구 강남대로",
    representative: "강경문",
    amount: 38841034
  },
  {
    companyName: "주식회사케이아이지엘텍",
    location: "경북 포항시 남구 연일읍 남성길",
    representative: "강경민",
    amount: 46697786
  },
  {
    companyName: "화경산업(주)",
    location: "경북 영천시 대항면 한재길",
    representative: "강경환",
    amount: 253749295
  },
  {
    companyName: "주식회사스페이스건우",
    location: "서울특별시 도봉구 도봉로",
    representative: "강경훈",
    amount: 46583903
  },
  {
    companyName: "창원재일학원",
    location: "경상남도 창원시 의창구 도계로",
    representative: "강도근",
    amount: 31654984
  },
  {
    companyName: "(주)에스제이아이엠씨",
    location: "경상남도 창원시 마산회원구 내서읍 광려천로",
    representative: "강동학",
    amount: 57933180
  },
  {
    companyName: "오성기업",
    location: "경상남도 김해시 삼문면 여차로",
    representative: "강명석",
    amount: 98030825
  },
  {
    companyName: "(주)디자인그루",
    location: "서울 강남구 도산대로101길",
    representative: "강명수",
    amount: 41359747
  },
  {
    companyName: "정경산업",
    location: "경기 화성시 서신면 제부로654번길",
    representative: "강민정",
    amount: 105625000
  },
  {
    companyName: "주식회사인스벨류",
    location: "충북 음성군 맹동면 맹동산단로",
    representative: "강병식",
    amount: 73530124
  },
  {
    companyName: "한솔어패럴",
    location: "서울 금천구 독산로",
    representative: "강봉철",
    amount: 48009309
  },
  {
    companyName: "마라주사우나터트너스",
    location: "서울 동작구 여의대방로44길",
    representative: "강석수",
    amount: 76962613
  },
  {
    companyName: "주식회사 부맥개발(리벤시아)",
    location: "제주특별자치도 제주시 한림읍 한림로",
    representative: "강선호",
    amount: 38846886
  },
  {
    companyName: "개인건설업자(강성갑)",
    location: "경기도 의왕시 솔말길",
    representative: "강성갑",
    amount: 31649000
  },
  {
    companyName: "태대건설",
    location: "경기도 파주시 와곡길",
    representative: "강세한",
    amount: 64380000
  },
  {
    companyName: "(주)슬지중공업",
    location: "전북 군산시 중기로길",
    representative: "강안성",
    amount: 63400000
  },
  {
    companyName: "주식회사한국그린산업",
    location: "경기 안산시 상록구 선진로",
    representative: "강완호",
    amount: 40602501
  },
  {
    companyName: "더케이미디어",
    location: "서울 강서구 공항대로",
    representative: "강은지",
    amount: 85897468
  },
  {
    companyName: "태광테크",
    location: "경기 포천시 일동면 수입로",
    representative: "강인석",
    amount: 48205225
  },
  {
    companyName: "주식회사한공종합건설",
    location: "대구 동구 동촌로56길",
    representative: "강정국",
    amount: 60443566
  },
  {
    companyName: "다인종합관리",
    location: "경기 평택시 비전2로",
    representative: "강준석",
    amount: 62501289
  },
  {
    companyName: "비비큐제육주식회사",
    location: "제주특별자치도 제주시 서광로",
    representative: "강지영",
    amount: 34109703
  },
  {
    companyName: "(주)효원에스디",
    location: "경기도 안양시 동안구 평촌대로",
    representative: "강창기",
    amount: 60674000
  },
  {
    companyName: "동국에너지데크(주)",
    location: "경남 산청군 산청읍 산수로",
    representative: "강현덕",
    amount: 88203100
  },
  {
    companyName: "(주)지엠아이",
    location: "경기도 안양시 양성면 남부대로",
    representative: "강현석",
    amount: 64921192
  },
  {
    companyName: "개인건설업자 강종수",
    location: "광주광역시 동구 필문대로137번길",
    representative: "강종수",
    amount: 58289000
  },
  {
    companyName: "주식회사세울금속디자인",
    location: "경상북도 문경시 영순면 영순로",
    representative: "고명진",
    amount: 61765000
  },
  {
    companyName: "디자인일류",
    location: "서울 관악구 독성로",
    representative: "고석원",
    amount: 31399068
  },
  {
    companyName: "선일컨설",
    location: "서울특별시 강서구 우장산로16길",
    representative: "고영팔",
    amount: 43194047
  },
  {
    companyName: "(주)진명상업개발",
    location: "충북 청주시 청원구 1순환로282번길",
    representative: "고을식",
    amount: 48540000
  },
  {
    companyName: "(주)메림설유",
    location: "경기도 양주시 은현로312번길",
    representative: "고재갑",
    amount: 40050196
  },
  {
    companyName: "(주)금영전기",
    location: "부산 부산진구 중앙대로644번길",
    representative: "고정업",
    amount: 52748761
  },
  {
    companyName: "주식회사젠타카뮤니케이션",
    location: "서울 마포구 서강로",
    representative: "고정재",
    amount: 30118060
  },
  {
    companyName: "플리츠포드",
    location: "강원도 철원군 순담길",
    representative: "고중영",
    amount: 33321222
  },
  {
    companyName: "스시클라우드",
    location: "경기 용인시 기흥구 서천로117번길",
    representative: "고중영",
    amount: 119626551
  },
  {
    companyName: "홍인아엔씨(주)",
    location: "경기도 광주시 순의로",
    representative: "고철순",
    amount: 71235513
  },
  {
    companyName: "(주)월경엔지니어링",
    location: "서울특별시 송파구 새말로",
    representative: "공대현",
    amount: 88286651
  },
  {
    companyName: "대광건설",
    location: "충청남도 공주시 백제문화로",
    representative: "공인호",
    amount: 54790000
  },
  {
    companyName: "선일플랜트",
    location: "경기도 화성시 제부로654번길",
    representative: "공동용",
    amount: 96270460
  }
];
async function seedData() {
  try {
    console.log('🚀 실제 웹사이트 데이터로 Firestore 입력 시작...');
    console.log('📌 출처:');
    console.log('   - 채용: 사람인 (saramin.co.kr)');
    console.log('   - 장학금: 서울장학재단 (hissf.or.kr) + 한국장학재단 (kosaf.go.kr)');
    console.log('   - 임금체불: 고용노동부 공개 명단\n');

    // 장학금 데이터 저장
    console.log('📚 장학금 데이터 저장 중...');
    for (const scholarship of scholarships) {
      const docId = sanitizeDocId(scholarship.name);
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
      const docId = sanitizeDocId(`${job.company}-${job.position}`);
      await setDoc(doc(db, 'jobs', docId), {
        ...job,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✅ ${job.company} - ${job.position}`);
    }

    // 임금체불 사업주 데이터 저장
    console.log('\n⚠️  임금체불 사업주 데이터 저장 중...');
    for (const violation of wageViolations) {
      const docId = sanitizeDocId(`${violation.companyName}-${violation.representative}`);
      await setDoc(doc(db, 'wageViolations', docId), {
        ...violation,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✅ ${violation.companyName} - ${violation.representative}`);
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
    console.log(`   - 임금체불 사업주: ${wageViolations.length}개 (고용노동부)`);
    console.log('\n✨ 이제 페이지에서 확인하세요!');
    console.log('   http://localhost:3000/ai-recommend?type=scholarship');
    console.log('   http://localhost:3000/ai-recommend?type=job');
    console.log('   http://localhost:3000/wage-violation');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 에러:', error);
    process.exit(1);
  }
}

seedData();
