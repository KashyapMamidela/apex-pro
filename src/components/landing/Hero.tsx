'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const GymCanvas = dynamic(() => import('./GymCanvas'), { ssr: false })

const words = ['STRONGER', 'LEANER', 'FASTER', 'ELITE']

export default function Hero() {
    const [wordIdx, setWordIdx] = useState(0)
    const [visible, setVisible] = useState(true)
    const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 })
    const [hoveringBtn, setHoveringBtn] = useState(false)

    // Cycling word
    useEffect(() => {
        const id = setInterval(() => {
            setVisible(false)
            setTimeout(() => { setWordIdx(i => (i + 1) % words.length); setVisible(true) }, 300)
        }, 2000)
        return () => clearInterval(id)
    }, [])

    // Custom cursor
    useEffect(() => {
        const fn = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY })
        window.addEventListener('mousemove', fn)
        return () => window.removeEventListener('mousemove', fn)
    }, [])

    // Tilt for stats card
    const [tilt, setTilt] = useState({ x: 0, y: 0 })
    const statsRef = useRef<HTMLDivElement>(null)
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!statsRef.current) return
        const rect = statsRef.current.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        setTilt({ x: ((e.clientY - cy) / rect.height) * 10, y: -((e.clientX - cx) / rect.width) * 10 })
    }

    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24">
            {/* 3D gym canvas background */}
            <GymCanvas />

            {/* Custom cursor */}
            <div
                className="fixed pointer-events-none z-[9999] rounded-full mix-blend-difference"
                style={{
                    width: hoveringBtn ? '52px' : '10px',
                    height: hoveringBtn ? '52px' : '10px',
                    background: '#c8ff00',
                    left: cursorPos.x,
                    top: cursorPos.y,
                    transform: 'translate(-50%, -50%)',
                    boxShadow: hoveringBtn ? '0 0 24px rgba(200,255,0,0.5)' : 'none',
                    transition: 'width 0.25s, height 0.25s, box-shadow 0.25s, left 0.04s linear, top 0.04s linear',
                }}
            />

            {/* Radial glow spots */}
            <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px] pointer-events-none" style={{ background: '#c8ff00' }} />
            <div className="absolute bottom-1/4 -right-24 w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[100px] pointer-events-none" style={{ background: '#00d4ff' }} />

            <div className="relative z-10 px-6 md:px-16 lg:px-24 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-center max-w-[1400px] mx-auto w-full">
                {/* LEFT */}
                <div>
                    {/* Eyebrow */}
                    <div
                        className="glass-accent inline-flex items-center gap-2 px-4 py-2 mb-8 animate-fade-up"
                        style={{ animationDelay: '0.05s', animationFillMode: 'forwards', opacity: 0 }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-apex-accent animate-pulse" />
                        <span className="font-mono text-[0.6rem] tracking-[3px] text-apex-accent uppercase">Elite Performance System · India</span>
                    </div>

                    {/* Main headline */}
                    <h1
                        className="font-impact text-[clamp(3.5rem,10vw,9rem)] leading-[0.88] uppercase mb-4 animate-fade-up"
                        style={{ animationDelay: '0.15s', animationFillMode: 'forwards', opacity: 0 }}
                    >
                        BECOME
                        <br />
                        <span
                            className="text-apex-accent relative inline-block"
                            style={{
                                transition: 'opacity 0.3s, transform 0.3s',
                                opacity: visible ? 1 : 0,
                                transform: visible ? 'translateY(0)' : 'translateY(16px)',
                            }}
                        >
                            {words[wordIdx]}
                        </span>
                    </h1>

                    <p
                        className="text-apex-muted text-[1rem] leading-[1.8] max-w-md mb-10 animate-fade-up"
                        style={{ animationDelay: '0.3s', animationFillMode: 'forwards', opacity: 0 }}
                    >
                        Science-backed training + AI-calibrated South Indian nutrition — tailored to your exact body. Track streaks, earn XP, and dominate your physique goals.
                    </p>

                    <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards', opacity: 0 }}>
                        <Link
                            href="/signup"
                            onMouseEnter={() => setHoveringBtn(true)}
                            onMouseLeave={() => setHoveringBtn(false)}
                            className="relative overflow-hidden group px-9 py-4 bg-apex-accent text-bg font-display font-bold text-[0.9rem] tracking-[2px] uppercase rounded-xl"
                        >
                            <span className="relative z-10 flex items-center gap-2 group-hover:gap-3 transition-all">START FREE <span className="text-xl leading-none">→</span></span>
                            <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-xl" />
                        </Link>
                        <Link
                            href="#features"
                            onMouseEnter={() => setHoveringBtn(true)}
                            onMouseLeave={() => setHoveringBtn(false)}
                            className="px-9 py-4 glass border-apex-accent/20 text-apex-muted hover:text-apex-text font-medium text-[0.85rem] tracking-[1px] transition-all rounded-xl hover:border-apex-accent/40"
                        >
                            View System ↓
                        </Link>
                    </div>

                    {/* Social proof */}
                    <div className="flex items-center gap-5 mt-10 animate-fade-up" style={{ animationDelay: '0.55s', animationFillMode: 'forwards', opacity: 0 }}>
                        <div className="flex -space-x-2">
                            {['#ff9d00', '#00d4ff', '#9d4edd', '#4ade80', '#ff4545'].map((c, i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-bg flex items-center justify-center font-bold text-bg text-[0.65rem]" style={{ background: c, zIndex: 5 - i }}>
                                    {['R', 'A', 'P', 'K', 'S'][i]}
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="text-apex-text text-[0.82rem] font-semibold">50K+ athletes</div>
                            <div className="text-apex-dim text-[0.68rem] font-mono">already forged</div>
                        </div>
                        <div className="flex gap-0.5 text-apex-accent">
                            {'★★★★★'.split('').map((s, i) => <span key={i} className="text-sm">{s}</span>)}
                        </div>
                    </div>
                </div>

                {/* RIGHT — glass tilt stats card */}
                <div
                    ref={statsRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setTilt({ x: 0, y: 0 })}
                    className="relative animate-fade-up hidden lg:block"
                    style={{
                        animationDelay: '0.5s', animationFillMode: 'forwards', opacity: 0,
                        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                        transition: 'transform 0.2s ease-out',
                    }}
                >
                    <div className="glass-dark relative overflow-hidden p-7">
                        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: '#c8ff00' }} />

                        <div className="text-[0.6rem] font-mono tracking-[3px] text-apex-muted uppercase mb-5">LIVE TRACKER</div>

                        {[
                            { label: 'ATHLETES ACTIVE TODAY', value: '12,483', color: '#c8ff00', bar: 0.82 },
                            { label: 'AVG WEIGHT LOST (12 WEEKS)', value: '8.2 KG', color: '#00d4ff', bar: 0.68 },
                            { label: 'WORKOUTS COMPLETED TODAY', value: '94,221', color: '#ff9d00', bar: 0.91 },
                        ].map((item, i) => (
                            <div key={i} className="mb-5 last:mb-0">
                                <div className="flex justify-between mb-1.5">
                                    <span className="text-[0.58rem] font-mono text-apex-dim uppercase tracking-wider">{item.label}</span>
                                    <span className="text-[0.82rem] font-display font-bold" style={{ color: item.color }}>{item.value}</span>
                                </div>
                                <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full" style={{ width: `${item.bar * 100}%`, background: `linear-gradient(90deg, ${item.color}88, ${item.color})` }} />
                                </div>
                            </div>
                        ))}

                        <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                            <div>
                                <div className="text-[0.6rem] font-mono text-apex-muted uppercase mb-0.5">YOUR STREAK</div>
                                <div className="font-impact text-[2rem] text-apex-accent">7 DAYS 🔥</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[0.6rem] font-mono text-apex-muted uppercase mb-0.5">XP LEVEL</div>
                                <div className="font-impact text-[1.5rem] text-apex-accent">ROOKIE</div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -top-4 -right-4 glass-accent text-apex-accent px-3 py-1.5 text-[0.62rem] font-bold font-mono uppercase tracking-wider animate-pulse rounded-lg">
                        LIVE DATA
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 animate-bounce">
                <div className="w-px h-12 bg-apex-muted" />
                <span className="text-[0.55rem] font-mono uppercase tracking-[3px] text-apex-muted">Scroll</span>
            </div>
        </section>
    )
}
