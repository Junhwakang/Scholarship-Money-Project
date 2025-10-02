'use client'
import { motion } from 'framer-motion'


const LINES = [
'프로필 기반 맞춤 추천',
'마감 임박 · 거리 · 후기 점수 반영',
'콜드스타트도 전공 · 학년으로 시작'
]


export default function ValueProposition() {
return (
<section id="value" className="section-pad">
<div className="container-max">
<div className="grid md:grid-cols-3 gap-8">
{LINES.map((line, i) => (
<motion.h3
key={line}
initial={{ opacity: 0, y: 12 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.5, delay: i * 0.1 }}
className="text-2xl md:text-3xl font-extrabold"
>
{line}
</motion.h3>
))}
</div>
</div>
</section>
)
}