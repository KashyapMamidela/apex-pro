'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import Link from 'next/link'

// ── SVG gym icons ──────────────────────────────────────────────────────────
const DumbbellIcon = ({ size = 48 }: { size?: number }) => (
    <svg width={size} height={size * 0.45} viewBox="0 0 80 36" fill="none">
        <rect x="0" y="10" width="14" height="16" rx="4" fill="currentColor" opacity="0.9" />
        <rect x="14" y="13" width="9" height="10" rx="3" fill="currentColor" opacity="0.7" />
        <rect x="23" y="16" width="34" height="4" rx="2" fill="currentColor" />
        <rect x="57" y="13" width="9" height="10" rx="3" fill="currentColor" opacity="0.7" />
        <rect x="66" y="10" width="14" height="16" rx="4" fill="currentColor" opacity="0.9" />
    </svg>
)
const BarbellIcon = ({ size = 80 }: { size?: number }) => (
    <svg width={size} height={size * 0.28} viewBox="0 0 120 34" fill="none">
        <rect x="0" y="6" width="16" height="22" rx="5" fill="currentColor" opacity="0.9" />
        <rect x="16" y="10" width="10" height="14" rx="3" fill="currentColor" opacity="0.7" />
        <rect x="26" y="15" width="68" height="4" rx="2" fill="currentColor" />
        <rect x="94" y="10" width="10" height="14" rx="3" fill="currentColor" opacity="0.7" />
        <rect x="104" y="6" width="16" height="22" rx="5" fill="currentColor" opacity="0.9" />
    </svg>
)
const KettlebellIcon = ({ size = 44 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 50 50" fill="none">
        <path d="M25 8 C18 8 14 12 14 17.5 C11 18.5 9 21 9 24 C9 30 14 35 21 35 L29 35 C36 35 41 30 41 24 C41 21 39 18.5 36 17.5 C36 12 32 8 25 8Z" fill="currentColor" opacity="0.88" />
        <path d="M21 8 C21 5 23 3 25 3 C27 3 29 5 29 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
    </svg>
)
const PlateIcon = ({ size = 36 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.5" />
        <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.7" />
        <circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.9" />
    </svg>
)

// ── Floating icon data ─────────────────────────────────────────────────────
const ICONS = [
    { id: 0, Icon: DumbbellIcon, size: 64, x: '8%', y: '18%', depth: 0.4, rotate: -20, duration: 6.2, delay: 0 },
    { id: 1, Icon: KettlebellIcon, size: 52, x: '78%', y: '12%', depth: 0.7, rotate: 10, duration: 5.0, delay: 0.8 },
    { id: 2, Icon: PlateIcon, size: 80, x: '86%', y: '55%', depth: 0.3, rotate: 30, duration: 7.4, delay: 1.4 },
    { id: 3, Icon: BarbellIcon, size: 96, x: '5%', y: '62%', depth: 0.6, rotate: -12, duration: 5.8, delay: 0.4 },
    { id: 4, Icon: DumbbellIcon, size: 44, x: '55%', y: '82%', depth: 0.5, rotate: 20, duration: 6.6, delay: 1.1 },
    { id: 5, Icon: KettlebellIcon, size: 38, x: '42%', y: '5%', depth: 0.4, rotate: -8, duration: 8.0, delay: 2.0 },
    { id: 6, Icon: PlateIcon, size: 55, x: '20%', y: '82%', depth: 0.8, rotate: 55, duration: 5.5, delay: 0.6 },
    { id: 7, Icon: BarbellIcon, size: 72, x: '62%', y: '28%', depth: 0.3, rotate: -30, duration: 7.0, delay: 1.7 },
    { id: 8, Icon: DumbbellIcon, size: 36, x: '92%', y: '82%', depth: 0.6, rotate: 15, duration: 5.3, delay: 0.2 },
    { id: 9, Icon: PlateIcon, size: 42, x: '32%', y: '92%', depth: 0.5, rotate: -40, duration: 6.8, delay: 1.3 },
]

// ── Animated floating icon ─────────────────────────────────────────────────
function FloatingIcon({ Icon, size, x, y, depth, rotate, duration, delay }: typeof ICONS[0]) {
    const mx = useMotionValue(0)
    const my = useMotionValue(0)
    const sx = useSpring(mx, { stiffness: 60, damping: 25 })
    const sy = useSpring(my, { stiffness: 60, damping: 25 })

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const cx = window.innerWidth / 2
            const cy = window.innerHeight / 2
            mx.set(((e.clientX - cx) / cx) * 28 * depth)
            my.set(((e.clientY - cy) / cy) * 20 * depth)
        }
        window.addEventListener('mousemove', handler)
        return () => window.removeEventListener('mousemove', handler)
    }, [depth, mx, my])

    return (
        <motion.div
            className="absolute text-apex-accent pointer-events-none select-none"
            style={{ left: x, top: y, x: sx, y: sy, rotate }}
            animate={{ y: [0, -14, -6, -14, 0], rotate: [rotate, rotate + 4, rotate - 4, rotate] }}
            transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.18 }}
        >
            <Icon size={size} />
        </motion.div>
    )
}

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

            {/* Floating gym icons */}
            <div className="absolute inset-0 overflow-hidden">
                {ICONS.map(icon => <FloatingIcon key={icon.id} {...icon} />)}
            </div>

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
