import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import SmartSearch from '@/components/SmartSearch'
import ValueProposition from '@/components/ValueProposition'
import FeedGrid from '@/components/FeedGrid'
import ReviewsMarquee from '@/components/ReviewsMarquee'
import HowItWorks from '@/components/HowItWorks'
import Footer from '@/components/Footer'


export default function Page() {
return (
<main>
<Navbar />
<Hero />
<SmartSearch />
<ValueProposition />
<FeedGrid />
<ReviewsMarquee />
<HowItWorks />
<section id="start" className="section-pad">
<div className="container-max text-center">
<h2 className="text-3xl md:text-4xl font-extrabold">지금 맞춤 추천 시작하기</h2>
<p className="text-gray-600 mt-2">간단한 프로필만 입력하면 바로 추천을 받을 수 있어요.</p>
<a href="#" className="btn-primary mt-6">시작하기</a>
</div>
</section>
<Footer />
</main>
)
}