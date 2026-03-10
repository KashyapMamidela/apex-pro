'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Lock, ArrowRight } from 'lucide-react'

const plans = [
    {
        n: 'CORE',
        price: '₹0',
        per: 'Forever Free',
        feats: [
            { text: 'Full Workout Library', locked: false },
            { text: 'Calorie Barometer', locked: false },
            { text: '7-Day Meal Plan', locked: false },
            { text: 'Community Access', locked: true },
            { text: 'AI Streak Verification', locked: true },
            { text: 'Elite Forge', locked: true },
        ],
        featured: false,
        color: '#4ade80',
        cta: 'Start Free',
    },
    {
        n: 'PRO',
        price: '₹799',
        per: 'per month',
        badge: 'MOST POPULAR',
        feats: [
            { text: 'Everything in Core', locked: false },
            { text: 'AI Streak Photo Verification', locked: false },
            { text: 'Community + Social Feed', locked: false },
            { text: 'Rotating Weekly Plans', locked: false },
            { text: 'Priority Support', locked: false },
            { text: 'Elite Forge (coming soon)', locked: true },
        ],
        featured: true,
        color: '#c8ff00',
        cta: 'Go Pro Now',
    },
    {
        n: 'ELITE',
        price: '₹2,499',
        per: 'per month',
        feats: [
            { text: 'Everything in Pro', locked: false },
            { text: 'Custom 1-on-1 Coaching', locked: false },
            { text: 'Full Metabolic Screening', locked: false },
            { text: 'Elite Forge Access', locked: false },
            { text: 'Private Mastermind Group', locked: false },
            { text: 'Unlimited AI Diet Adjustments', locked: false },
        ],
        featured: false,
        color: '#ff9d00',
        cta: 'Apply Now',
    },
]

export default function Pricing() {
    const [hovered, setHovered] = useState<number | null>(null)

    return (
        <section id="pricing" className="py-28 px-6 md:px-16 lg:px-24 border-t border-border-main bg-surface/30">
            <div className="max-w-[1400px] mx-auto">
                <div className="text-[0.6rem] font-mono tracking-[4px] text-apex-accent uppercase mb-4">Membership</div>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <h2 className="font-impact text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] uppercase">
                        CHOOSE YOUR<br />
                        <span className="text-apex-accent">TIER</span>
                    </h2>
                    <p className="text-apex-muted text-[0.88rem] max-w-xs leading-relaxed">
                        Start free, upgrade when you're ready. Cancel anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {plans.map((plan, i) => (
                        <div
                            key={i}
                            onMouseEnter={() => setHovered(i)}
                            onMouseLeave={() => setHovered(null)}
                            className={`relative transition-all duration-300 group ${plan.featured
                                ? 'scale-[1.02]'
                                : hovered === i ? '-translate-y-2' : ''
                                }`}
                        >
                            {plan.badge && (
                                <div
                                    className="absolute -top-[13px] left-1/2 -translate-x-1/2 text-bg text-[0.6rem] font-bold tracking-[2px] px-4 py-1 uppercase z-10"
                                    style={{ background: plan.color }}
                                >
                                    {plan.badge}
                                </div>
                            )}

                            <div
                                className={`relative h-full p-9 border overflow-hidden rounded-2xl ${plan.featured
                                    ? 'border-apex-accent/60 bg-card shadow-2xl shadow-apex-accent/10'
                                    : 'border-border-main bg-card hover:border-border-sub'
                                    }`}
                            >
                                {/* Subtle glow corner */}
                                {plan.featured && (
                                    <div className="absolute top-0 right-0 w-40 h-40 rounded-bl-full blur-3xl opacity-10 pointer-events-none" style={{ background: plan.color }} />
                                )}

                                {/* Plan label */}
                                <div className="text-[0.6rem] font-mono tracking-[3px] uppercase mb-5" style={{ color: plan.color }}>
                                    {plan.n} PLAN
                                </div>

                                {/* Price */}
                                <div className="mb-6">
                                    <div className="font-impact text-[3.5rem] leading-none text-apex-text">{plan.price}</div>
                                    <div className="text-[0.7rem] text-apex-muted font-mono mt-1">{plan.per}</div>
                                </div>

                                {/* Features */}
                                <ul className="space-y-3 mb-8 border-t border-border-main pt-6">
                                    {plan.feats.map((feat, j) => (
                                        <li key={j} className={`flex items-center gap-3 text-[0.82rem] ${feat.locked ? 'opacity-35' : ''}`}>
                                            {feat.locked
                                                ? <Lock className="w-3 h-3 shrink-0 text-apex-dim" />
                                                : <div className="w-3 h-3 shrink-0 rounded-full flex items-center justify-center" style={{ background: `${plan.color}33`, color: plan.color }}>
                                                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: plan.color }} />
                                                </div>
                                            }
                                            <span className={feat.locked ? 'text-apex-dim' : 'text-apex-muted'}>{feat.text}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA */}
                                <Link
                                    href="/signup"
                                    className="group/btn flex items-center justify-center gap-2 w-full py-3.5 text-[0.82rem] font-bold tracking-[2px] uppercase transition-all duration-200 border rounded-xl"
                                    style={plan.featured
                                        ? { background: plan.color, color: '#000', borderColor: plan.color }
                                        : { background: 'transparent', color: plan.color, borderColor: `${plan.color}44` }
                                    }
                                    onMouseEnter={e => {
                                        if (!plan.featured) {
                                            (e.currentTarget as HTMLElement).style.background = `${plan.color}15`
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (!plan.featured) {
                                            (e.currentTarget as HTMLElement).style.background = 'transparent'
                                        }
                                    }}
                                >
                                    {plan.cta}
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
