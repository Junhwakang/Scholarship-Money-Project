"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  category: string;
  question: string;
  answer: string;
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    // 공통 FAQ
    {
      category: "공통 FAQ ",
      question: "Q1. 이 사이트에서 제공하는 정보는 무료인가요?",
      answer: "A. 네, 모든 알바 및 장학금 정보는 무료로 제공됩니다. 별도의 이용료나 수수료는 발생하지 않습니다."
    },
    {
      category: "공통 FAQ ",
      question: "Q2. 회원가입을 해야만 이용할 수 있나요?",
      answer: "A. 기본적인 정보 열람은 회원가입 없이 가능합니다. 다만 맞춤 추천, 관심 공고 저장 등의 기능은 회원가입을 통해 이용할 수 있습니다."
    },
    {
      category: "공통 FAQ ",
      question: "Q3. 정보는 얼마나 자주 업데이트되나요?",
      answer: "A. 알바 및 장학금 정보는 정기적으로 최신화되며, 공고 마감 여부를 수시로 확인합니다."
    },
    {
      category: "공통 FAQ ",
      question: "Q4. 실제 공식 공고인가요?",
      answer: "A. 본 서비스는 공공기관, 학교, 기업 등에서 공개한 공식 공고를 기반으로 정보를 제공합니다. 최종 지원 전에는 반드시 원본 공고를 확인해 주세요."
    },
    {
      category: "공통 FAQ ",
      question: "Q5. 잘못된 정보가 있을 경우 어떻게 하나요?",
      answer: "A. 오류가 발견될 경우 빠 편리를 통해 주시면 빠른 시일 내에 확인 및 수정하겠습니다."
    },

    // 장학금 FAQ
    {
      category: "장학금 FAQ ",
      question: "Q6. 모든 대학생이 지원할 수 있나요?",
      answer: "A. 장학금마다 지원 조건(학년, 성적, 소득, 전공 등)이 다르므로 각 공고의 자격 요건을 확인하여 합니다."
    },
    {
      category: "장학금 FAQ ",
      question: "Q7. 중복으로 장학금을 받을 수 있나요?",
      answer: "A. 일부 장학금은 중복 수혜가 가능하지만, 국가장학금 등은 제한이 있을 수 있습니다. 반드시 해당 장학금의 중복 수령 규정을 확인하세요."
    },
    {
      category: "장학금 FAQ ",
      question: "Q8. 성적 기준이 없는 장학금도 있나요?",
      answer: "A. 네, 통사회동, 소득 수준, 특정 조건(저소득·전공 등)을 기준으로 하는 장학금도 있습니다."
    },
    {
      category: "장학금 FAQ ",
      question: "Q9. 장학금 지급 시기는 언제인가요?",
      answer: "A. 장학금마다 지급 시기가 다르며, 보통 학기 중 또는 학기 시작 전 지급됩니다. 정확한 일정은 공고문을 참고해 주세요."
    },

    // 알바 FAQ
    {
      category: "알바 FAQ ",
      question: "Q10. 알바 지원은 어디서 하나요?",
      answer: "A. 본 사이트에서는 알바 정보를 제공하며, 지원은 각 공고의 공식 채용 페이지 또는 연락처를 통해 진행됩니다."
    },
    {
      category: "알바 FAQ ",
      question: "Q11. 급무 조건은 확실한가요?",
      answer: "A. 게재하는 급무 조건은 공고 기준 정보이며, 실제 급여는 조금에 따라 달라질 수 있습니다. 지원하는 꼭 조건을 확인하세요."
    },
    {
      category: "알바 FAQ ",
      question: "Q12. 최저임금은 보장되나요?",
      answer: "A. 모든 알바 공고는 최저임금법을 준수하는 것을 원칙으로 합니다. 의심스러운 경우 전에 반드시 확인하세요."
    },
    {
      category: "알바 FAQ ",
      question: "Q13. 단기 알바나 주말 알바도 있나요?",
      answer: "A. 네, 단기/주말 방식 등 다양한 종류의 알바 정보를 제공합니다."
    },

    // 신화-안전 FAQ
    {
      category: "신화-안전 FAQ ",
      question: "Q14. 개인정보는 안전하게 보호되나요?",
      answer: "A. 이용자의 개인정보는 관련 법령에 따라 안전하게 관리되며, 동의 없이 외부에 제공되지 않습니다."
    },
    {
      category: "신화-안전 FAQ ",
      question: "Q15. 사기 알바나 허위 공고는 없나요?",
      answer: "A. 공고 검증을 통해 허위 가능성이 있는 정보는 배제 , 그 외나, 의심되는 경우 반드시 신고해 주세요."
    },

    // 추가 FAQ
    {
      category: "확인하기",
      question: "※ 본 사이트는 정보 제공을 목적으로 하며, 지원 및 자액 권리 쟁점 등은 각 공고에서 직접 진행하시기 바랍니다.",
      answer: ""
    }
  ];

  const categories = Array.from(new Set(faqData.map(item => item.category)));

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="pt-24 pb-12 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-8 h-8 text-gray-900" />
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight">
              자주 묻는 질문
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            자주 묻는 질문들에 대한 답변을 확인하세요.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-12 py-12">
        {categories.map((category, catIndex) => (
          <div key={catIndex} className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b-2 border-purple-600">
              {category}
            </h2>
            <div className="space-y-4">
              {faqData
                .filter(item => item.category === category)
                .map((item, itemIndex) => {
                  const globalIndex = faqData.indexOf(item);
                  const isOpen = openIndex === globalIndex;
                  
                  // 주의사항인 경우 다르게 렌더링
                  if (item.question.startsWith("※")) {
                    return (
                      <div key={itemIndex} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">{item.question}</p>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={itemIndex}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:border-purple-300 transition-colors"
                    >
                      <button
                        onClick={() => toggleAccordion(globalIndex)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-purple-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}

        {/* 추가 문의 안내 */}
        <div className="mt-12 p-6 bg-purple-50 rounded-lg text-center">
          <h3 className="font-semibold text-gray-900 mb-2">더 궁금한 사항이 있으신가요?</h3>
          <p className="text-gray-600 mb-4">문의하기를 통해 질문해 주시면 빠르게 답변 드리겠습니다.</p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            문의하기
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
