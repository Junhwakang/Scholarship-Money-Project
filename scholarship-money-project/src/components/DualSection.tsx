"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function DualSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      {/* 채용 섹션 */}
      <div className="relative h-[70vh] overflow-hidden group">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200"
            alt="Part-time jobs"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative h-full flex flex-col justify-end p-8 lg:p-12">
          <div className="text-white/60 text-xs tracking-[0.2em] mb-4">RECRUITMENT</div>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
            당신의 시간에<br />가치를 더하다
          </h2>
          <p className="text-white/80 text-sm mb-8 max-w-md leading-relaxed">
            검증된 채용 정보로 안전하고 효율적인 근무 환경을 찾아보세요.
            다양한 공공부문 일자리 기회가 기다립니다.
          </p>
          <a 
            href="/jobs" 
            className="inline-flex items-center gap-2 text-white text-sm hover:gap-4 transition-all group/link"
          >
            <span>채용 정보 둘러보기</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* 장학금 섹션 */}
      <div className="relative h-[70vh] overflow-hidden group">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=1200"
            alt="Scholarships"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative h-full flex flex-col justify-end p-8 lg:p-12">
          <div className="text-white/60 text-xs tracking-[0.2em] mb-4">SCHOLARSHIPS</div>
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
            꿈을 향한<br />든든한 지원
          </h2>
          <p className="text-white/80 text-sm mb-8 max-w-md leading-relaxed">
            놓치지 말아야 할 장학금 정보를 확인하세요.
            1,200개 이상의 장학 프로그램을 제공합니다.
          </p>
          <a 
            href="/scholarship" 
            className="inline-flex items-center gap-2 text-white text-sm hover:gap-4 transition-all group/link"
          >
            <span>장학금 확인하기</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
