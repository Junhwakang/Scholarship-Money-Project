'use client'
import { motion } from 'framer-motion'


const REVIEWS = [
{ name: '홍*진/3학년', text: '학교 전공과 딱 맞는 연구참여를 추천받아 바로 합격했어요!' },
{ name: '김*우/2학년', text: '마감 임박 순으로 정리되어 지원 타이밍을 놓치지 않았습니다.' },
{ name: '이*영/4학년', text: '후기 신뢰도 지표 덕분에 가짜 공고를 거르기 쉬웠어요.' },
]


export default function ReviewsMarquee() {
return (
<section id="reviews" className="section-pad bg-lemon-100/50">
<div className="container-max">
<div className="flex items-end justify-between">
<div>
<h2 className="text-3xl md:text-4xl font-extrabold">투명성 & 후기</h2>
<p className="text-gray-600 mt-1">재학 인증과 이상탐지, 신고 처리로 신뢰도 관리</p>
</div>
</div>


<div className="mt-8 grid md:grid-cols-3 gap-6">
{REVIEWS.map((r, i) => (
<motion.blockquote
key={r.name}
className="card p-6"
initial={{ opacity: 0, y: 10 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.4, delay: i * 0.05 }}
>
<p className="text-gray-800">“{r.text}”</p>
<footer className="mt-4 text-sm text-gray-600">— {r.name}</footer>
</motion.blockquote>
))}
</div>
</div>
</section>
)
}