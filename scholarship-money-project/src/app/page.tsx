import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import DualSection from '@/components/DualSection'
import Statistics from '@/components/Statistics'
import FeaturedJobs from '@/components/FeaturedJobs'
import ScholarshipGrid from '@/components/ScholarshipGrid'
import ReviewShowcase from '@/components/ReviewShowcase'
import Footer from '@/components/Footer'

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <DualSection />
      <Statistics />
      <FeaturedJobs />
      <ScholarshipGrid />
      <ReviewShowcase />
      <Footer />
    </main>
  )
}
