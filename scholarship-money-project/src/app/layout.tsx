import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alba Scholarship - 모든 기회의 시작",
  description: "대한민국의 모든 알바 정보와 장학금 정보를 한 곳에서 확인하세요.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
