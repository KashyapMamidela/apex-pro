"use client";

import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import Pricing from '@/components/landing/Pricing'
import Footer from '@/components/landing/Footer'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-apex-text selection:bg-apex-accent selection:text-bg overflow-x-hidden">
      <Navbar />
      <Hero />

      {/* Ticker */}
      <div className="ticker bg-apex-accent py-3 overflow-hidden whitespace-nowrap border-y border-apex-accent/30">
        <div className="ticker-inner inline-block animate-tick font-mono text-[0.65rem] font-black tracking-[4px] uppercase text-bg">
          TRAIN. EAT. DOMINATE. &nbsp;•&nbsp; SCIENTIFIC PRECISION &nbsp;•&nbsp; ELITE PERFORMANCE &nbsp;•&nbsp; BEYOND LIMITS &nbsp;•&nbsp; AI-POWERED NUTRITION &nbsp;•&nbsp; FORGE YOUR APEX &nbsp;•&nbsp;
          TRAIN. EAT. DOMINATE. &nbsp;•&nbsp; SCIENTIFIC PRECISION &nbsp;•&nbsp; ELITE PERFORMANCE &nbsp;•&nbsp; BEYOND LIMITS &nbsp;•&nbsp; AI-POWERED NUTRITION &nbsp;•&nbsp; FORGE YOUR APEX &nbsp;•&nbsp;
        </div>
      </div>

      <Features />
      <HowItWorks />
      <Pricing />

      {/* CTA Band */}
      <section className="relative overflow-hidden py-24 px-6 md:px-16 bg-apex-accent">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#0008 1px, transparent 1px), linear-gradient(90deg, #0008 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div className="relative z-10 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          <div>
            <div className="text-black/40 text-[0.65rem] font-mono tracking-[3px] uppercase mb-3">Join 50K+ athletes</div>
            <h2 className="font-impact text-[clamp(2.5rem,7vw,6rem)] leading-[0.88] uppercase text-bg">
              FORGE YOUR<br /><span className="text-bg/70">APEX</span>
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link
              href="/signup"
              className="relative overflow-hidden group px-12 py-5 bg-bg text-apex-accent font-display font-black text-[0.9rem] tracking-[2px] uppercase transition-all hover:-translate-y-1 shadow-2xl"
            >
              <span className="relative z-10">START FOR FREE →</span>
              <span className="absolute inset-0 bg-zinc-900 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            <div className="text-black/50 text-[0.72rem] font-mono">No credit card required</div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
