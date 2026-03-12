import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import Community from '@/components/landing/Community'
import Pricing from '@/components/landing/Pricing'
import Footer from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main className="bg-bg text-apex-text">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Community />
      <Pricing />
      <Footer />
    </main>
  )
}
