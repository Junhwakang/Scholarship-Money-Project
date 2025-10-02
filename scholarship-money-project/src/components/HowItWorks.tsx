'use client'
import { motion } from 'framer-motion'
import { Fingerprint, Sparkles, SendHorizonal } from 'lucide-react'


const STEPS = [
{ icon: Fingerprint, title: '프로필 설정', text: '학년·전공·위치·관심을 간단히 입력합니다.' },
{ icon: Sparkles, title: '추천 받기', text: '콘텐츠+협업 필터링으로 개인 맞춤 기회를 제안합니다.' },
{ icon: SendHorizonal, title: '지원 & 후기', text: '지원하고, 투명한 후기 생태계에 참여하세요.' },
]


export default function HowItWorks() {
return (
<section id="how" className="section-pad">
<div className="container-max text-center">
<h2 className="text-3xl md:text-4xl font-extrabold">어떻게 작동하나요</h2>
<p className="text-gray-600 mt-2">3단계로 끝!</p>


<div className="mt-10 grid md:grid-cols-3 gap-6">
{STEPS.map((s, i) => (
<motion.div
key={s.title}
className="card p-8"
initial={{ opacity: 0, y: 12 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.45, delay: i * 0.05 }}
>
<s.icon className="w-8 h-8 text-lemon-300 mx-auto" aria-hidden />
<h3 className="mt-4 text-xl font-bold">{s.title}</h3>
<p className="text-gray-600 mt-2 text-sm">{s.text}</p>
</motion.div>
))}
</div>
</div>
</section>
)
}