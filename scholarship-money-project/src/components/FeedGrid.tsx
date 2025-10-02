'use client'
import { motion } from 'framer-motion'
import { sampleItems } from '@/lib/data'


export default function FeedGrid() {
const items = sampleItems
return (
<section id="feed" className="section-pad">
<div className="container-max">
<div className="flex items-end justify-between">
<div>
<h2 className="text-3xl md:text-4xl font-extrabold">추천 피드</h2>
<p className="text-gray-600 mt-1">당신을 위해 선별된 기회들</p>
</div>
<a href="#" className="btn-secondary">모두 보기</a>
</div>


<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
{items.map((item, idx) => (
<motion.article
key={item.id}
className="card p-5"
initial={{ opacity: 0, y: 14 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.45, delay: (idx % 6) * 0.03 }}
>
<div className="flex items-center justify-between">
<span className="text-xs uppercase tracking-wide text-gray-500">Card No. {idx + 1}</span>
<span className="rounded-full bg-lemon-100 text-xs px-2 py-1">{item.type}</span>
</div>
<h3 className="mt-2 font-bold text-lg">{item.title}</h3>
<p className="mt-2 text-sm text-gray-600 line-clamp-3">{item.summary}</p>
<div className="mt-4 grid grid-cols-3 gap-2 text-xs text-gray-700">
<div className="rounded-lg bg-lemon-100 px-2 py-1">마감 D-{item.due}</div>
<div className="rounded-lg bg-lemon-100 px-2 py-1">{item.city}</div>
<div className="rounded-lg bg-lemon-100 px-2 py-1">{item.reward}</div>
</div>
<a href="#" className="mt-5 inline-flex text-sm font-semibold hover:underline">자세히 보기 →</a>
</motion.article>
))}
</div>
</div>
</section>
)
}