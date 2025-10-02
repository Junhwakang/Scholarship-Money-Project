'use client'
import { motion } from 'framer-motion'
import RotatingWords from './RotatingWords'


export default function Hero() {
return (
<section id="hero" className="min-h-[100svh] flex items-center relative overflow-hidden">
<div className="container-max">
<motion.h1
initial={{ opacity: 0, y: 12 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
className="text-5xl md:text-7xl font-extrabold leading-tight"
>
대학생을 위한 <br className="hidden md:block" />
<span className="text-lemon-300">
<RotatingWords words={["장학금", "파트타임", "연구참여", "인턴십"]} />
</span>
</motion.h1>


<motion.p
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, delay: 0.1 }}
className="mt-6 text-lg text-gray-700 max-w-2xl"
>
학년·전공·위치·관심에 맞춰 기회를 추천합니다. 투명한 후기와 함께 공정한 정보 생태계를 경험하세요.
</motion.p>


<motion.div
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6, delay: 0.2 }}
className="mt-10 flex flex-wrap items-center gap-3"
>
<a href="#start" className="btn-primary">지금 맞춤 추천 받기</a>
<a href="#feed" className="btn-secondary">장학금만 보기</a>
<a href="#feed" className="btn-secondary">알바만 보기</a>
</motion.div>
</div>


{/* Subtle gradient blob */}
<motion.div
aria-hidden
className="pointer-events-none absolute -top-20 -right-24 h-[40rem] w-[40rem] rounded-full"
initial={{ opacity: 0 }}
animate={{ opacity: 0.35 }}
transition={{ duration: 1.2 }}
style={{
background: 'radial-gradient(circle, #FDE68A 0%, rgba(253,230,138,0.25) 40%, rgba(253,230,138,0) 70%)'
}}
/>
</section>
)
}