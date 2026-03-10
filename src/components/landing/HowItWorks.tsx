'use client'

import { useState } from 'react'

const steps = [
    {
        num: '01',
        title: 'Create Your Profile',
        desc: 'Sign up in 60 seconds — then breeze through our 5-step onboarding to dial in your goal, body stats, activity level, and diet preference.',
        note: 'Google Sign-In available',
        color: '#c8ff00',
    },
    {
        num: '02',
        title: 'Get Your Plan',
        desc: 'Our engine calculates your TDEE, protein targets, and the perfect South Indian 7-day rotating meal plan. Your first full-week workout is ready instantly.',
        note: 'No waiting — plan generated in seconds',
        color: '#00d4ff',
    },
    {
        num: '03',
        title: 'Train. Log. Streak.',
        desc: 'Check in daily, mark your sets, log your meals with the calorie barometer. Each session grows your streak and earns XP toward your next tier.',
        note: 'AI-verified gym check-in photo',
        color: '#ff9d00',
    },
    {
        num: '04',
        title: 'Rise Through Ranks',
        desc: 'From Beginner to Elite — every rep, every meal, every logged day pushes you up the ladder. Share PRs with your community and unlock badges.',
        note: 'Beginner → Rookie → Amateur → Pro → Elite',
        color: '#9d4edd',
    },
]

const stats = [
    { value: '50K+', label: 'Active Athletes', sub: 'and growing daily' },
    { value: '98%', label: 'Hit Their Goal', sub: 'within 12 weeks' },
    { value: '2.1M', label: 'Workouts Logged', sub: 'since launch' },
    { value: '8.2kg', label: 'Avg Fat Loss', sub: 'in 12-week plan' },
]

export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState(0)

    return (
        <>
            {/* Stats band */}
            <section id="stats" className="py-20 px-6 md:px-16 lg:px-24 bg-surface border-y border-border-main">
                <div className="max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((s, i) => (
                        <div
                            key={i}
                            className="group text-center cursor-default"
                        >
                            <div
                                className="font-impact text-[clamp(3rem,6vw,5rem)] leading-none text-apex-accent group-hover:scale-110 transition-transform duration-300 inline-block"
                                style={{ textShadow: '0 0 30px rgba(200,255,0,0.2)' }}
                            >
                                {s.value}
                            </div>
                            <div className="text-[0.78rem] font-semibold text-apex-text uppercase tracking-[1px] mt-2">{s.label}</div>
                            <div className="text-[0.65rem] font-mono text-apex-dim mt-0.5">{s.sub}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works */}
            <section id="how" className="py-28 px-6 md:px-16 lg:px-24">
                <div className="max-w-[1400px] mx-auto">
                    <div className="text-[0.6rem] font-mono tracking-[4px] text-apex-accent uppercase mb-4">The Process</div>
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
                        <h2 className="font-impact text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] uppercase">
                            HOW IT<br />
                            <span className="text-apex-accent">WORKS</span>
                        </h2>
                        <p className="text-apex-muted text-[0.88rem] max-w-xs leading-relaxed">
                            Four simple steps from sign-up to elite-tier body transformation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Left — Step list */}
                        <div className="space-y-3">
                            {steps.map((step, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveStep(i)}
                                    className={`w-full text-left p-6 border rounded-2xl transition-all duration-300 group ${activeStep === i
                                        ? 'border-apex-accent/40 bg-apex-accent/5'
                                        : 'border-border-main bg-card hover:border-border-sub'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="font-impact text-[2rem] leading-none w-12 shrink-0 transition-colors"
                                            style={{ color: activeStep === i ? step.color : 'var(--color-apex-dim)' }}
                                        >
                                            {step.num}
                                        </div>
                                        <div className="font-display text-[1rem] font-bold uppercase tracking-wide">
                                            {step.title}
                                        </div>
                                        <div className="ml-auto shrink-0 text-apex-dim group-hover:text-apex-muted transition-colors">
                                            <svg className={`w-4 h-4 transition-transform duration-300 ${activeStep === i ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Right — Active step detail */}
                        <div
                            className="bg-card border border-border-main p-10 relative overflow-hidden rounded-2xl"
                            key={activeStep}
                            style={{ animation: 'fade-up-sm 0.3s ease forwards' }}
                        >
                            <div
                                className="absolute top-0 right-0 w-40 h-40 rounded-bl-full blur-3xl opacity-10 pointer-events-none"
                                style={{ background: steps[activeStep].color }}
                            />
                            <div
                                className="font-impact text-[4rem] leading-none mb-6 opacity-20"
                                style={{ color: steps[activeStep].color }}
                            >
                                {steps[activeStep].num}
                            </div>
                            <h3 className="font-display text-[1.6rem] font-black uppercase mb-4">
                                {steps[activeStep].title}
                            </h3>
                            <p className="text-apex-muted leading-[1.85] text-[0.9rem] mb-8">
                                {steps[activeStep].desc}
                            </p>
                            <div
                                className="flex items-center gap-2 text-[0.65rem] font-mono uppercase tracking-[2px] px-3 py-2 border w-fit"
                                style={{
                                    color: steps[activeStep].color,
                                    borderColor: `${steps[activeStep].color}44`,
                                    background: `${steps[activeStep].color}10`,
                                }}
                            >
                                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: steps[activeStep].color }} />
                                {steps[activeStep].note}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
