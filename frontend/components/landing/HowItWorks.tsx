'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Dumbbell, LineChart, Trophy } from 'lucide-react'

const steps = [
    {
        num: '01',
        title: 'Create Your Profile',
        desc: 'Answer 7 quick questions about your body, goal, and lifestyle. Takes under 2 minutes.',
        icon: <Download className="w-6 h-6" />,
        detail: [
            'Age, gender, height, weight',
            'Body type selection with illustrations',
            'Fitness goal + experience level',
            'Equipment availability + diet preference',
        ],
    },
    {
        num: '02',
        title: 'Get Your AI Plan',
        desc: 'Our AI engine generates a fully personalised workout and nutrition plan instantly.',
        icon: <Dumbbell className="w-6 h-6" />,
        detail: [
            'Custom workout split (3–6 days)',
            'Exercise-by-exercise programming',
            'Daily calorie & macro targets',
            'South Indian meal options built in',
        ],
    },
    {
        num: '03',
        title: 'Train & Track',
        desc: 'Log every session directly in the app. Check off sets and earn XP as you go.',
        icon: <LineChart className="w-6 h-6" />,
        detail: [
            'Built-in set/rep tracker',
            'Rest timer with audio alerts',
            'Automatic progress graphs',
            'Weekly plan adaptation',
        ],
    },
    {
        num: '04',
        title: 'Level Up',
        desc: 'Hit your targets, earn XP, climb the rank ladder from Rookie to Elite.',
        icon: <Trophy className="w-6 h-6" />,
        detail: [
            'XP rewards for every workout',
            'Rank badges: Rookie → Elite',
            'Achievement unlock system',
            'Community leaderboard',
        ],
    },
]

export default function HowItWorks() {
    const [active, setActive] = useState(0)

    return (
        <section id="how-it-works" className="py-28 px-6 page-bg">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                    className="text-center mb-16"
                >
                    <div className="text-[0.65rem] font-mono tracking-[3px] text-apex-accent uppercase mb-3">
                        Simple process
                    </div>
                    <h2 className="font-display text-[2.8rem] md:text-[3.5rem] font-black text-apex-text leading-tight">
                        How <span className="text-apex-accent">Apex</span> Works
                    </h2>
                </motion.div>

                {/* Step selector + detail */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Steps list */}
                    <div className="space-y-3">
                        {steps.map((step, i) => (
                            <motion.button
                                key={step.num}
                                initial={{ opacity: 0, x: -24 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.4 }}
                                onClick={() => setActive(i)}
                                className={`w-full text-left p-5 rounded-2xl transition-all duration-300 border ${active === i
                                        ? 'bg-apex-accent/8 border-apex-accent/35 shadow-lg shadow-yellow-500/5'
                                        : 'border-white/6 bg-white/3 hover:bg-white/5 hover:border-white/10'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`font-impact text-[1.5rem] tracking-wide transition-colors ${active === i ? 'text-apex-accent' : 'text-apex-dim'
                                            }`}
                                    >
                                        {step.num}
                                    </div>
                                    <div
                                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${active === i
                                                ? 'bg-apex-accent text-black'
                                                : 'bg-white/6 text-apex-muted'
                                            }`}
                                    >
                                        {step.icon}
                                    </div>
                                    <div>
                                        <div className={`font-display font-bold text-[0.95rem] ${active === i ? 'text-apex-text' : 'text-apex-muted'}`}>
                                            {step.title}
                                        </div>
                                        <div className="text-apex-dim text-[0.75rem] font-inter mt-0.5 line-clamp-1">
                                            {step.desc}
                                        </div>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Detail card */}
                    <div className="relative min-h-[240px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={active}
                                initial={{ opacity: 0, x: 20, scale: 0.98 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -20, scale: 0.98 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="glass p-8 rounded-2xl sticky top-28"
                            >
                                <div className="w-12 h-12 bg-apex-accent/15 rounded-xl flex items-center justify-center text-apex-accent mb-5">
                                    {steps[active].icon}
                                </div>
                                <h3 className="font-display text-[1.4rem] font-black text-apex-text mb-2">
                                    {steps[active].title}
                                </h3>
                                <p className="text-apex-muted text-[0.88rem] font-inter leading-relaxed mb-5">
                                    {steps[active].desc}
                                </p>
                                <ul className="space-y-2.5">
                                    {steps[active].detail.map(d => (
                                        <li key={d} className="flex items-start gap-3 text-[0.82rem] font-inter text-apex-muted">
                                            <span className="w-1.5 h-1.5 rounded-full bg-apex-accent mt-1.5 shrink-0" />
                                            {d}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}
