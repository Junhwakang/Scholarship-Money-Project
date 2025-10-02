// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scholarship Money Project",
  description: "장학금 및 아르바이트 추천 플랫폼",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body
        className="bg-lemon-50 text-gray-900 antialiased"
        style={{ backgroundImage: "var(--bg-noise)" }}
      >
        {children}
      </body>
    </html>
  );
}