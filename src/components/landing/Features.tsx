'use client'

import React, { useState } from 'react'
import { Activity, Target, Cpu, Users, Trophy, Zap, ArrowUpRight } from 'lucide-react'

const features = [
    {
        icon: <Activity className="w-7 h-7" />,
        n: '01',
        name: 'Elite Workouts',
        desc: 'Science-backed split programs — PPL, Upper/Lower, Full Body — fully adaptive to your equipment and level.',
        detail: '450+ exercises · Video guides · Progressive overload tracking',
        color: '#c8ff00',
    },
    {
        icon: <Target className="w-7 h-7" />,
        n: '02',
        name: 'AI Diet Engine',
        desc: 'Precision South Indian meal plans — from Idli to Chicken Curry — calibrated to your exact TDEE and macros.',
        detail: '7-day rotating plans · Calorie barometer · Custom food logging',
        color: '#ff9d00',
    },
    {
        icon: <Cpu className="w-7 h-7" />,
        n: '03',
        name: 'Streak System',
        desc: 'AI-powered gym attendance verification via photo analysis. Keep your streak, earn XP, level up your rank.',
        detail: 'Gemini Vision AI · Daily check-in · Badge unlocks',
        color: '#00d4ff',
    },
    {
        icon: <Users className="w-7 h-7" />,
        n: '04',
        name: 'Community',
        desc: 'Find athletes, follow their progress, react to PRs. Social accountability that actually drives results.',
        detail: 'Activity feed · Follow system · Group challenges',
        color: '#9d4edd',
    },
    {
        icon: <Trophy className="w-7 h-7" />,
        n: '05',
        name: 'XP & Ranking',
        desc: 'A 6-tier progression system from Beginner to Elite. Every workout, meal, and streak earns you points.',
        detail: 'Beginner → Rookie → Amateur → Pro → Elite',
        color: '#ffd700',
    },
    {
        icon: <Zap className="w-7 h-7" />,
        n: '06',
        name: 'Apex Engine',
        desc: 'The dashboard that makes elite performance feel simple. Track everything in one cinematic interface.',
        detail: 'Bento grid · Real-time rings · Progress analytics',
        color: '#ff4545',
    },
]

export default function Features() {
    const [hovered, setHovered] = useState<number | null>(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }

    return (
        <section id="features" className="py-28 px-6 md:px-16 lg:px-24">
            {/* Header */}
            <div className="max-w-[1400px] mx-auto mb-16">
                <div className="text-[0.6rem] font-mono tracking-[4px] text-apex-accent uppercase mb-4">Core System</div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <h2 className="font-impact text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.9] uppercase">
                        ARCHITECTED FOR<br />
                        <span className="text-apex-accent">DOMINATION</span>
                    </h2>
                    <p className="text-apex-muted text-[0.88rem] leading-[1.75] max-w-xs">
                        Every feature engineered with one goal: getting you to your peak physique, faster than anything else.
                    </p>
                </div>
            </div>

            {/* Feature grid */}
            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((feat, i) => (
                    <div
                        key={i}
                        className="relative bg-card rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 border border-border-main/60"
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                        onMouseMove={e => handleMouseMove(e, i)}
                        style={{ background: hovered === i ? `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, ${feat.color}10, var(--color-card))` : undefined }}
                    >

                        {/* Hover glow spot that follows mouse */}
                        {hovered === i && (
                            <div
                                className="absolute pointer-events-none rounded-full blur-3xl opacity-20 transition-none"
                                style={{
                                    width: '200px', height: '200px',
                                    left: mousePos.x - 100,
                                    top: mousePos.y - 100,
                                    background: feat.color,
                                }}
                            />
                        )}

                        {/* Top row */}
                        <div className="flex items-start justify-between mb-8">
                            <div
                                className="w-12 h-12 flex items-center justify-center transition-all duration-300"
                                style={{
                                    background: hovered === i ? `${feat.color}20` : 'var(--color-surface-2)',
                                    color: hovered === i ? feat.color : 'var(--color-apex-muted)',
                                    border: `1px solid ${hovered === i ? `${feat.color}44` : 'transparent'}`,
                                }}
                            >
                                {feat.icon}
                            </div>
                            <span className="font-mono text-[0.65rem] text-apex-dim opacity-50 group-hover:opacity-100 transition-opacity">{feat.n}</span>
                        </div>

                        <h3 className="font-display text-[1.35rem] font-black uppercase tracking-wide mb-3 group-hover:text-apex-text transition-colors">
                            {feat.name}
                        </h3>
                        <p className="text-apex-muted text-[0.83rem] leading-[1.7] mb-5">{feat.desc}</p>

                        <div className="text-[0.65rem] font-mono text-apex-dim border-t border-border-main/50 pt-4 group-hover:text-apex-muted transition-colors">
                            {feat.detail}
                        </div>

                        {/* Arrow icon on hover */}
                        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                            <ArrowUpRight className="w-4 h-4" style={{ color: feat.color }} />
                        </div>

                        {/* Bottom accent line */}
                        <div
                            className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500"
                            style={{ background: feat.color }}
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}
