import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 py-16">
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-8 tracking-tight">
            소개
          </h1>
          
          <div className="space-y-8 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-2xl font-light text-gray-900 mb-4">
                Alba Scholarship
              </h2>
              <p>
                대한민국의 모든 채용 정보와 장학금 정보를 한 곳에서 확인할 수 있는 플랫폼입니다.
                검증된 정보만을 제공하여 안전하고 효율적인 구직 활동을 지원합니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-gray-900 mb-4">
                우리의 미션
              </h2>
              <p>
                모든 사람에게 공평한 기회를 제공하고, 꿈을 향한 든든한 지원이 되는 것이 우리의 목표입니다.
                신뢰할 수 있는 정보를 통해 여러분의 성공을 돕겠습니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-light text-gray-900 mb-4">
                제공 서비스
              </h2>
              <ul className="space-y-3 list-disc list-inside">
                <li>워크넷 실시간 채용 정보</li>
                <li>다양한 장학금 프로그램 안내</li>
                <li>실제 경험자들의 솔직한 후기</li>
                <li>기관별, 채용구분별 맞춤 검색</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-light text-gray-900 mb-4">
                문의하기
              </h2>
              <div className="space-y-2">
                <p>이메일: rkdwnsghk12@naver.com</p>
                <p>전화: 010-3180-5728</p>
                <p>주소: 부산광역시 동의대학교</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
