"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-24 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-gray-900" />
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
              이용약관
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            본 약관은 본 서비스가 제공하는 모든 서비스의 이용과 관련하여 서비스와 이용자 간의 권리, 의무 및 책임 사항을 규정합니다.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제1조 (목적)</h2>
            <p className="text-gray-700">
              본 약관은 이용자가 본 서비스를 이용함에 있어 필요한 기본적인 사항을 규정합니다.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제2조 (정의)</h2>
            <div className="space-y-2 text-gray-700">
              <p>1. &quot;서비스&quot;란 본 플랫폼을 통해 제공되는 모든 정보 및 기능을 말합니다.</p>
              <p>2. &quot;이용자&quot;란 본 약관에 따라 서비스를 이용하는 모든 자를 말합니다.</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제3조 (약관의 효력 및 변경)</h2>
            <div className="space-y-2 text-gray-700">
              <p>1. 본 약관은 웹사이트에 게시함으로써 효력이 발생합니다.</p>
              <p>2. 서비스는 관련 법령을 위반하지 않는 범위 내에서 약관을 변경할 수 있으며, 변경 시 사전 공지합니다.</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제4조 (서비스 제공)</h2>
            <div className="space-y-2 text-gray-700">
              <p>1. 서비스는 연중무휴, 1일 24시간 제공을 원칙으로 합니다.</p>
              <p>2. 시스템 점검, 장애 발생 등의 경우 서비스 제공이 일시 중단될 수 있습니다.</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제5조 (이용자의 의무)</h2>
            <p className="text-gray-700 mb-2">이용자는 다음 행위를 하여서는 안 됩니다.</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              <li>타인의 정보 도용</li>
              <li>서비스 운영을 방해하는 행위</li>
              <li>부정 또는 불법적인 목적으로 서비스를 이용하는 행위</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제6조 (지적재산권)</h2>
            <p className="text-gray-700">
              서비스의 모든 콘텐츠 및 프로그램은 서비스 또는 정당한 권리자에게 저작권이 있으며, 무단 복제나 배포를 금지합니다.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제7조 (책임의 제한)</h2>
            <p className="text-gray-700">
              서비스는 제공되는 정보의 정확도, 완전성에 대해 보증하지 않으며, 이를 이용함으로써 발생한 손해에 대해 책임을 지지 않습니다.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제8조 (서비스 이용 제한)</h2>
            <p className="text-gray-700">
              이용자가 본 약관을 위반한 경우, 서비스는 사전 통지 없이 이용을 제한하거나 중단할 수 있습니다.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제9조 (분쟁 해결)</h2>
            <p className="text-gray-700">
              서비스와 이용자 간 발생한 분쟁은 상호 합의로 원만히 해결하며, 필요 시 대한민국 법률에 따라 해결합니다.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">제10조 (준거법 및 관할)</h2>
            <p className="text-gray-700">
              본 약관은 대한민국 법률을 준거법으로 하며, 분쟁 발생 시 관할 법원은 대한민국 법률에 따라 정합니다.
            </p>
          </section>

          <div className="mt-12 p-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              시행일자: 2025년 1월 1일
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
