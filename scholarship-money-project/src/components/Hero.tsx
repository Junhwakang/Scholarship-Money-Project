"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative h-screen">
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1752920299210-0b727800ea50?w=1920"
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>
      </div>

      {/* 콘텐츠 */}
      <div className="relative h-full flex items-center justify-center text-center px-6">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6 tracking-tight">
            Opportunity Driven<br />Success
          </h1>
          <p className="text-white/90 text-xl font-light tracking-wide mb-8">
            모든 기회의 시작, 채용과 장학금
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/jobs" 
              className="px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 transition-colors text-sm font-medium tracking-wide"
            >
              채용 찾기
            </a>
            <a 
              href="/scholarship" 
              className="px-8 py-4 bg-transparent text-white border border-white hover:bg-white hover:text-gray-900 transition-colors text-sm font-medium tracking-wide"
            >
              장학금 보기
            </a>
          </div>
        </div>
      </div>

      {/* 스크롤 인디케이터 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
