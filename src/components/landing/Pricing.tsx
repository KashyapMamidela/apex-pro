'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check } from 'lucide-react'

const plans = [
    {
        name: 'Free',
        price: '₹0',
        period: 'forever',
        desc: 'Get started and see what Apex can do.',
        accent: '#888888',
        features: ['1 AI workout plan', 'Basic nutrition targets', 'Community access', '7-day streak tracking'],
        cta: 'Start Free',
        href: '/signup',
        highlight: false,
    },
    {
        name: 'Pro',
        price: '₹499',
        period: 'per month',
        desc: 'Full access for serious athletes.',
        accent: '#FFD400',
        features: ['Unlimited AI plans', 'Full nutrition plans + meals', 'Progress charts & analytics', 'XP & ranking system', 'Priority support', 'Plan adapts weekly'],
        cta: 'Get Pro',
        href: '/signup',
        highlight: true,
    },
    {
        name: 'Annual',
        price: '₹3,999',
        period: 'per year (save 33%)',
        desc: 'Best value for committed athletes.',
        accent: '#ff9d00',
        features: ['Everything in Pro', '2 months free', 'Early access to new features', 'Dedicated coach chat'],
        cta: 'Get Annual',
        href: '/signup',
        highlight: false,
    },
]

export default function Pricing() {
    return (
        <section id="pricing" className="py-28 px-6 page-bg">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="text-[0.65rem] font-mono tracking-[3px] text-apex-accent uppercase mb-3">Pricing</div>
                    <h2 className="font-display text-[2.8rem] md:text-[3.5rem] font-black text-apex-text leading-tight">
                        Simple, <span className="text-apex-accent">Transparent</span> Pricing
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {plans.map(({ name, price, period, desc, accent, features, cta, href, highlight }, i) => (
                        <motion.div
                            key={name}
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={{ y: -5 }}
                            className={`relative glass p-7 rounded-2xl ${highlight ? 'shadow-xl' : ''}`}
                        >
                            {highlight && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[0.6rem] font-mono uppercase tracking-[2px] bg-apex-accent text-black px-3 py-1 rounded-full font-bold">
                                    Most Popular
                                </div>
                            )}
                            <div className="mb-5">
                                <div className="text-[0.65rem] font-mono tracking-[2px] uppercase mb-1" style={{ color: accent }}>{name}</div>
                                <div className="font-display text-[2.2rem] font-black text-apex-text">{price}</div>
                                <div className="text-apex-dim text-[0.7rem] font-mono">{period}</div>
                                <p className="text-apex-muted text-[0.78rem] font-inter mt-2 leading-relaxed">{desc}</p>
                            </div>
                            <ul className="space-y-2.5 mb-6">
                                {features.map(f => (
                                    <li key={f} className="flex items-start gap-2.5 text-[0.8rem] font-inter text-apex-muted">
                                        <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: accent }} />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href={href}
                                className={`block text-center py-3 rounded-xl text-[0.85rem] font-display font-bold transition-all ${highlight ? 'btn-primary' : 'btn-ghost'
                                    }`}
                            >
                                {cta}
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
