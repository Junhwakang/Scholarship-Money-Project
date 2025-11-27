"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link href="/" className="text-xl font-light text-gray-900 tracking-tight">
            ALBA SCHOLARSHIP
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="/jobs" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              채용
            </Link>

            <Link href="/scholarship" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              장학금
            </Link>

            <Link href="/reviews" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              후기
            </Link>

            <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              소개
            </Link>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-900"
            aria-label="메뉴"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden py-6 space-y-4 border-t border-gray-100">
            <Link href="/jobs" className="block text-gray-900" onClick={() => setIsMenuOpen(false)}>채용</Link>
            <Link href="/scholarship" className="block text-gray-600" onClick={() => setIsMenuOpen(false)}>장학금</Link>
            <Link href="/reviews" className="block text-gray-600" onClick={() => setIsMenuOpen(false)}>후기</Link>
            <Link href="/about" className="block text-gray-600" onClick={() => setIsMenuOpen(false)}>소개</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
