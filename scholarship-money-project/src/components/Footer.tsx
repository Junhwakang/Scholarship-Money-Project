"use client";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-gray-400 py-16 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* 로고 및 설명 */}
          <div className="md:col-span-5">
            <div className="text-xl font-light text-white tracking-tight mb-4">
              ALBA SCHOLARSHIP
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              대한민국의 모든 알바 정보와 장학금 정보를<br />
              한 곳에서 확인하세요.
            </p>
            <div className="text-xs text-gray-500">
              © 2025 Alba Scholarship. All rights reserved.
            </div>
          </div>

          {/* 링크 섹션 1 */}
          <div className="md:col-span-2">
            <div className="text-sm text-white font-light mb-4">채용</div>
            <ul className="space-y-3 text-sm">
              <li><a href="#convenience" className="hover:text-white transition-colors">공기관</a></li>
            </ul>
          </div>

          {/* 링크 섹션 2 */}
          <div className="md:col-span-2">
            <div className="text-sm text-white font-light mb-4">장학금</div>
            <ul className="space-y-3 text-sm">
              <li><a href="#national" className="hover:text-white transition-colors">국가장학금</a></li>
              <li><a href="#corporate" className="hover:text-white transition-colors">기업장학금</a></li>
              <li><a href="#university" className="hover:text-white transition-colors">교내장학금</a></li>
              <li><a href="#local" className="hover:text-white transition-colors">지방자치단체</a></li>
            </ul>
          </div>

          {/* 링크 섹션 3 */}
          <div className="md:col-span-3">
            <div className="text-sm text-white font-light mb-4">고객센터</div>
            <ul className="space-y-3 text-sm">
              <li><a href="#faq" className="hover:text-white transition-colors">자주 묻는 질문</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">문의하기</a></li>
              <li><a href="#terms" className="hover:text-white transition-colors">이용약관</a></li>
              <li><a href="#privacy" className="hover:text-white transition-colors">개인정보처리방침</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-xs text-gray-500">
            부산광역시 동의대학교 · rkdwnsghk12@naver.com · 010-3180-5728
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Facebook</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
