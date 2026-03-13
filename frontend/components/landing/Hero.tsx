'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import Link from 'next/link'

import Hero3DScene from './Hero3DScene'

// ── Stat counter ────────────────────────────────────────────────────────────
const stats = [
    { value: '50K+', label: 'Athletes' },
    { value: 'AI', label: 'Powered Plans' },
    { value: '24/7', label: 'Support' },
    { value: '4.9★', label: 'App Rating' },
]

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg pt-24 pb-16">

            {/* 3D Interactive Background */}
            <Hero3DScene />

            {/* Yellow glow orb */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,212,0,0.06) 0%, transparent 70%)' }} />

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">

                {/* Eyebrow */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-accent text-[0.72rem] font-inter font-semibold tracking-[2.5px] uppercase text-apex-accent mb-8"
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-apex-accent animate-pulse" />
                    AI-Powered Fitness System
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, delay: 0.1 }}
                    className="font-display text-[3.8rem] md:text-[5.5rem] lg:text-[6.5rem] font-black leading-[0.92] tracking-tight text-apex-text mb-6"
                >
                    Train Smarter.{' '}
                    <br />
                    <span className="text-apex-accent">Eat Precise.</span>
                    <br />
                    Dominate.
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.22 }}
                    className="text-apex-muted text-[1.05rem] md:text-[1.15rem] font-inter leading-relaxed max-w-xl mx-auto mb-10"
                >
                    Science-backed workouts & precision nutrition built around your body.
                    Join 50,000+ athletes hitting new PRs every week.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.33 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Link
                        href="/signup"
                        className="btn-primary px-8 py-4 text-[1rem] rounded-2xl font-bold shadow-lg hover:shadow-yellow-500/20 transition-shadow"
                    >
                        Start Training — Free
                    </Link>
                    <Link
                        href="#how-it-works"
                        className="btn-ghost px-8 py-4 text-[0.95rem] rounded-2xl"
                    >
                        See How It Works →
                    </Link>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.55 }}
                    className="flex flex-wrap justify-center gap-8 mt-16 pt-10 border-t border-white/6"
                >
                    {stats.map(({ value, label }) => (
                        <div key={value} className="text-center">
                            <div className="font-display text-[1.8rem] font-black text-apex-accent leading-none">{value}</div>
                            <div className="text-apex-dim text-[0.7rem] font-inter uppercase tracking-[2px] mt-1">{label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
