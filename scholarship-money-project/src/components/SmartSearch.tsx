'use client'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { sampleItems } from '@/lib/data'


export default function SmartSearch() {
const [query, setQuery] = useState('서울 · 컴퓨터공학 · 주3일 · 시급 12000↑')
const preview = sampleItems.slice(0, 6)


return (
<section id="search" className="section-pad">
<div className="container-max">
<div className="max-w-3xl mx-auto text-center">
<h2 className="text-3xl md:text-4xl font-extrabold">무엇을 찾고 있나요?</h2>
<p className="text-gray-600 mt-3">자연어로 검색하고, 태그로 빠르게 좁혀보세요.</p>
</div>


<div className="mt-8 max-w-3xl mx-auto">
<label className="sr-only" htmlFor="smart-search">검색</label>
<div className="flex items-center gap-3 card p-3">
<Search className="w-5 h-5 text-gray-500" aria-hidden />
<input
id="smart-search"
value={query}
onChange={(e) => setQuery(e.target.value)}
placeholder="예) 서울 컴퓨터공학 주3일 알바 시급 12000"
className="flex-1 bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
/>
<button className="btn-primary" aria-label="검색 실행">검색</button>
</div>


{/* Quick tags */}
<div className="flex flex-wrap gap-2 mt-3 text-sm">
{['서울', '부산', '장학금', '알바', '마감 D-7', '시급 12000↑', '전공 일치'].map((t) => (
<button key={t} className="btn-secondary" onClick={() => setQuery(prev => (prev ? prev + ' ' + t : t))}>{t}</button>
))}
</div>
</div>


{/* Preview grid */}
<div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-live="polite">
{preview.map((item) => (
<motion.article
key={item.id}
className="card p-5"
initial={{ opacity: 0, y: 10 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: '-50px' }}
transition={{ duration: 0.4 }}
>
<div className="text-xs uppercase tracking-wide text-gray-500">{item.type}</div>
<h3 className="mt-1 font-bold text-lg">{item.title}</h3>
<p className="mt-2 text-sm text-gray-600 line-clamp-2">{item.summary}</p>
<div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-700">
<span className="rounded-full bg-lemon-100 px-2.5 py-1">마감 D-{item.due}</span>
<span className="rounded-full bg-lemon-100 px-2.5 py-1">{item.city}</span>
<span className="rounded-full bg-lemon-100 px-2.5 py-1">{item.reward}</span>
</div>
<a href="#" className="mt-5 inline-flex text-sm font-semibold hover:underline">자세히 보기 →</a>
</motion.article>
))}
</div>
</div>
</section>
)
}