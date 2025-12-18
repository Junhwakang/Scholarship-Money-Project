const admin = require('firebase-admin');

// Firebase Admin SDK 초기화
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

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

async function addWageViolations() {
  try {
    const batch = db.batch();
    const collectionRef = db.collection('wageViolations');

    for (const violation of wageViolations) {
      const docRef = collectionRef.doc();
      batch.set(docRef, {
        ...violation,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    await batch.commit();
    console.log(`✅ ${wageViolations.length}개의 임금체불 사업주 데이터가 추가되었습니다.`);
  } catch (error) {
    console.error('❌ 데이터 추가 중 오류 발생:', error);
  } finally {
    process.exit();
  }
}

addWageViolations();
