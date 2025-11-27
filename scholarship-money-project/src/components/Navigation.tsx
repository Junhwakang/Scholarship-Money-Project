"use client";

import { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("로그아웃 에러:", error);
    }
  };

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

            {/* 로그인/로그아웃 버튼 */}
            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  href="/profile" 
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>{userProfile?.name || '프로필'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>로그아웃</span>
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
              >
                로그인
              </Link>
            )}
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
            
            {user ? (
              <>
                <Link href="/profile" className="block text-gray-600" onClick={() => setIsMenuOpen(false)}>
                  프로필
                </Link>
                <button onClick={handleLogout} className="block text-gray-600 text-left w-full">
                  로그아웃
                </button>
              </>
            ) : (
              <Link href="/login" className="block text-gray-900 font-medium" onClick={() => setIsMenuOpen(false)}>
                로그인
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
