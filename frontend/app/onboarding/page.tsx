'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check, Zap } from 'lucide-react'

// ── Body type SVG illustrations ──────────────────────────────────────────────
const EctomorphSVG = () => (
    <svg viewBox="0 0 80 160" fill="none" className="w-full h-full">
        <ellipse cx="40" cy="22" rx="14" ry="14" fill="currentColor" opacity="0.9" />
        {/* Neck */}
        <rect x="36" y="36" width="8" height="10" rx="3" fill="currentColor" opacity="0.8" />
        {/* Narrow torso */}
        <path d="M28 46 L52 46 L50 95 L30 95 Z" fill="currentColor" opacity="0.85" />
        {/* Left arm */}
        <rect x="20" y="47" width="8" height="42" rx="4" fill="currentColor" opacity="0.8" />
        {/* Right arm */}
        <rect x="52" y="47" width="8" height="42" rx="4" fill="currentColor" opacity="0.8" />
        {/* Slim waist connector */}
        <rect x="30" y="88" width="20" height="10" rx="3" fill="currentColor" opacity="0.75" />
        {/* Left leg */}
        <rect x="30" y="97" width="9" height="50" rx="4" fill="currentColor" opacity="0.85" />
        {/* Right leg */}
        <rect x="41" y="97" width="9" height="50" rx="4" fill="currentColor" opacity="0.85" />
    </svg>
)

const MesomorphSVG = () => (
    <svg viewBox="0 0 80 160" fill="none" className="w-full h-full">
        <ellipse cx="40" cy="20" rx="16" ry="16" fill="currentColor" opacity="0.9" />
        <rect x="35" y="36" width="10" height="9" rx="3" fill="currentColor" opacity="0.8" />
        {/* V-taper torso — wider shoulders narrow waist */}
        <path d="M20 45 L60 45 L53 95 L27 95 Z" fill="currentColor" opacity="0.9" />
        {/* Thick arms */}
        <rect x="11" y="46" width="10" height="40" rx="5" fill="currentColor" opacity="0.85" />
        <rect x="59" y="46" width="10" height="40" rx="5" fill="currentColor" opacity="0.85" />
        {/* Hips */}
        <rect x="27" y="88" width="26" height="12" rx="4" fill="currentColor" opacity="0.8" />
        {/* Legs */}
        <rect x="27" y="99" width="11" height="48" rx="5" fill="currentColor" opacity="0.9" />
        <rect x="42" y="99" width="11" height="48" rx="5" fill="currentColor" opacity="0.9" />
    </svg>
)

const EndomorphSVG = () => (
    <svg viewBox="0 0 80 160" fill="none" className="w-full h-full">
        <ellipse cx="40" cy="20" rx="18" ry="18" fill="currentColor" opacity="0.9" />
        <rect x="35" y="38" width="10" height="8" rx="3" fill="currentColor" opacity="0.8" />
        {/* Rounder torso */}
        <path d="M16 46 L64 46 L62 98 L18 98 Z" fill="currentColor" opacity="0.88" />
        {/* Round arms */}
        <rect x="8" y="47" width="11" height="38" rx="5" fill="currentColor" opacity="0.8" />
        <rect x="61" y="47" width="11" height="38" rx="5" fill="currentColor" opacity="0.8" />
        {/* Wide hips */}
        <rect x="18" y="91" width="44" height="14" rx="5" fill="currentColor" opacity="0.8" />
        {/* Thicker legs */}
        <rect x="20" y="104" width="14" height="44" rx="6" fill="currentColor" opacity="0.85" />
        <rect x="46" y="104" width="14" height="44" rx="6" fill="currentColor" opacity="0.85" />
    </svg>
)

// ── Step definitions ─────────────────────────────────────────────────────────
const steps = [
    {
        id: 'age', title: 'How old are you?', subtitle: 'Helps us calibrate training intensity and recovery.',
        type: 'number', field: { key: 'age', label: 'Age', unit: 'years', min: 13, max: 80, placeholder: '25' },
    },
    {
        id: 'gender', title: 'What\'s your gender?', subtitle: 'Affects calorie targets and hormonal considerations.',
        type: 'options',
        options: [
            { value: 'male', label: 'Male', color: '#00d4ff', emoji: '♂' },
            { value: 'female', label: 'Female', color: '#ff9d00', emoji: '♀' },
            { value: 'other', label: 'Other', color: '#9d4edd', emoji: '⚧' },
        ],
    },
    {
        id: 'goal', title: 'What\'s your fitness goal?', subtitle: 'Your mission shapes every workout and meal we create.',
        type: 'options',
        options: [
            { value: 'fat_loss', label: 'Lose Fat', color: '#ff4545', emoji: '🔥' },
            { value: 'muscle', label: 'Build Muscle', color: '#FFD400', emoji: '💪' },
            { value: 'strength', label: 'Improve Strength', color: '#ff9d00', emoji: '🏋️' },
            { value: 'fitness', label: 'General Fitness', color: '#22c55e', emoji: '🏃' },
        ],
    },
    {
        id: 'level', title: 'Experience level?', subtitle: 'Determines exercise complexity and progression speed.',
        type: 'options',
        options: [
            { value: 'beginner', label: 'Beginner', color: '#22c55e', emoji: '🌱', desc: 'Less than 6 months' },
            { value: 'intermediate', label: 'Intermediate', color: '#FFD400', emoji: '⚡', desc: '6 months — 2 years' },
            { value: 'advanced', label: 'Advanced', color: '#ff4545', emoji: '🔺', desc: '2+ years training' },
        ],
    },
    {
        id: 'bodytype', title: 'Select your body type', subtitle: 'Choose the shape that best matches your natural build.',
        type: 'bodytype',
        options: [
            { value: 'ectomorph', label: 'Ectomorph', color: '#00d4ff', svg: EctomorphSVG, desc: 'Lean & long, hard to gain weight' },
            { value: 'mesomorph', label: 'Mesomorph', color: '#FFD400', svg: MesomorphSVG, desc: 'Athletic build, gains muscle easily' },
            { value: 'endomorph', label: 'Endomorph', color: '#ff9d00', svg: EndomorphSVG, desc: 'Wider frame, gains weight easily' },
        ],
    },
    {
        id: 'days', title: 'Workout days per week?', subtitle: 'Be realistic — consistency beats intensity.',
        type: 'slider', field: { key: 'days', min: 2, max: 7 },
    },
    {
        id: 'diet', title: 'Diet preference?', subtitle: 'We\'ll build your South Indian meal plan around this.',
        type: 'options',
        options: [
            { value: 'veg', label: 'Vegetarian', color: '#22c55e', emoji: '🥗', desc: 'Dal, paneer, sprouts, tofu' },
            { value: 'non_veg', label: 'Non-Veg', color: '#ff9d00', emoji: '🍗', desc: 'Chicken, fish, eggs included' },
            { value: 'flex', label: 'Flexible', color: '#9d4edd', emoji: '🍽️', desc: 'Whatever works best' },
        ],
    },
]

const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0, scale: 0.97 }),
}

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [dir, setDir] = useState(1)
    const [answers, setAnswers] = useState<Record<string, any>>({})

    const cur = steps[step]
    const isLast = step === steps.length - 1
    const progress = ((step + 1) / steps.length) * 100

    const canContinue = () => {
        if (cur.type === 'number') return !!answers[cur.field!.key] && Number(answers[cur.field!.key]) > 0
        if (cur.type === 'slider') return !!answers[cur.field!.key]
        return !!answers[cur.id]
    }

    const go = (d: number) => {
        if (d > 0 && !canContinue()) return
        setDir(d)
        setTimeout(() => setStep(s => s + d), 0)
    }

    const finish = async () => {
        // Save to Supabase instead of localStorage
        const { createClient } = await import('@/utils/supabase/client')
        const supabase = createClient()
        
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                // Determine workout preference from existing steps if not explicit
                const workout_type = answers.workout_type || 'gym'
                const body_type = answers.bodytype
                
                await supabase.from('profiles').update({
                    age: Number(answers.age),
                    gender: answers.gender,
                    goal: answers.goal,
                    experience_level: answers.level,
                    body_type: body_type,
                    is_profile_complete: true
                }).eq('id', user.id)
            }
        } catch (e) {
            console.error('Failed to save profile', e)
        }

        // Just in case, still keep the local name for immediate UI feedback if needed
        localStorage.setItem('apex_athlete_profile', JSON.stringify({ ...answers, onboarded: true }))
        router.push('/dashboard/profile')
    }

    return (
        <div className="min-h-screen page-bg flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Yellow glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(255,212,0,0.05) 0%, transparent 70%)' }} />

            {/* Progress bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-white/5 z-10">
                <motion.div
                    className="h-full bg-apex-accent"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                />
            </div>

            {/* Brand */}
            <div className="fixed top-5 left-1/2 -translate-x-1/2 font-impact text-xl text-apex-accent tracking-[4px] z-10">APEX</div>

            {/* Step card */}
            <div className="w-full max-w-lg z-10 mt-16">
                <AnimatePresence mode="wait" custom={dir}>
                    <motion.div
                        key={step}
                        custom={dir}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="text-[0.6rem] font-mono text-apex-accent tracking-[3px] uppercase mb-3">
                                Step {step + 1} of {steps.length}
                            </div>
                            <h1 className="font-display text-[2.2rem] md:text-[2.6rem] font-black text-apex-text leading-tight mb-2">
                                {cur.title}
                            </h1>
                            <p className="text-apex-muted text-[0.85rem] font-inter max-w-xs mx-auto leading-relaxed">
                                {cur.subtitle}
                            </p>
                        </div>

                        {/* Number input */}
                        {cur.type === 'number' && cur.field && (
                            <div className="flex flex-col items-center gap-3">
                                <div className="flex items-center gap-4 glass p-4 rounded-2xl">
                                    <input
                                        type="number"
                                        min={cur.field.min}
                                        max={cur.field.max}
                                        value={answers[cur.field.key] || ''}
                                        onChange={e => setAnswers(a => ({ ...a, [cur.field!.key]: e.target.value }))}
                                        placeholder={cur.field.placeholder}
                                        className="input-glass w-36 px-5 py-4 text-[2rem] font-display font-black text-center"
                                    />
                                    <span className="text-apex-accent font-mono text-[0.85rem] uppercase tracking-wider">{cur.field.unit}</span>
                                </div>
                            </div>
                        )}

                        {/* Slider (days) */}
                        {cur.type === 'slider' && cur.field && (
                            <div className="glass p-8 rounded-2xl text-center">
                                <div className="font-display text-[4rem] font-black text-apex-accent mb-2">
                                    {answers[cur.field.key] || cur.field.min}
                                </div>
                                <div className="text-apex-muted font-inter text-[0.85rem] mb-6">days per week</div>
                                <input
                                    type="range"
                                    min={cur.field.min}
                                    max={cur.field.max}
                                    value={answers[cur.field.key] || cur.field.min}
                                    onChange={e => setAnswers(a => ({ ...a, [cur.field!.key]: e.target.value }))}
                                    className="w-full accent-apex-accent cursor-pointer"
                                />
                                <div className="flex justify-between text-apex-dim font-mono text-[0.7rem] mt-1">
                                    <span>{cur.field.min}</span>
                                    <span>{cur.field.max}</span>
                                </div>
                            </div>
                        )}

                        {/* Regular option cards */}
                        {cur.type === 'options' && (
                            <div className={`grid gap-3 ${cur.options!.length === 2 ? 'grid-cols-2' : cur.options!.length === 4 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                {cur.options!.map(opt => {
                                    const sel = answers[cur.id] === opt.value
                                    return (
                                        <motion.button
                                            key={opt.value}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setAnswers(a => ({ ...a, [cur.id]: opt.value }))}
                                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${sel
                                                    ? 'border-[var(--opt-c)] bg-[var(--opt-c)]/10 shadow-lg'
                                                    : 'border-white/8 bg-white/3 hover:bg-white/5 hover:border-white/14'
                                                }`}
                                            style={{ '--opt-c': opt.color } as any}
                                        >
                                            <div
                                                className="w-11 h-11 rounded-xl flex items-center justify-center text-[1.3rem] shrink-0"
                                                style={{ background: sel ? `${opt.color}20` : 'rgba(255,255,255,0.07)' }}
                                            >
                                                {(opt as any).emoji}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-display font-bold text-[0.92rem]" style={{ color: sel ? opt.color : '#f5f5f5' }}>
                                                    {opt.label}
                                                </div>
                                                {(opt as any).desc && (
                                                    <div className="text-apex-dim text-[0.7rem] font-inter mt-0.5">{(opt as any).desc}</div>
                                                )}
                                            </div>
                                            {sel && (
                                                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: opt.color }}>
                                                    <Check className="w-3 h-3 text-black" />
                                                </div>
                                            )}
                                        </motion.button>
                                    )
                                })}
                            </div>
                        )}

                        {/* Body type cards */}
                        {cur.type === 'bodytype' && (
                            <div className="grid grid-cols-3 gap-4">
                                {cur.options!.map(opt => {
                                    const sel = answers[cur.id] === opt.value
                                    const Svg = (opt as any).svg
                                    return (
                                        <motion.button
                                            key={opt.value}
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={() => setAnswers(a => ({ ...a, [cur.id]: opt.value }))}
                                            className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-200 ${sel
                                                    ? 'border-[var(--opt-c)] bg-[var(--opt-c)]/12 shadow-lg'
                                                    : 'border-white/8 bg-white/3 hover:bg-white/6'
                                                }`}
                                            style={{ '--opt-c': opt.color } as any}
                                        >
                                            <div
                                                className="w-full h-28 mb-3"
                                                style={{ color: sel ? opt.color : 'rgba(255,255,255,0.5)' }}
                                            >
                                                <Svg />
                                            </div>
                                            <div className="font-display font-bold text-[0.8rem]" style={{ color: sel ? opt.color : '#888' }}>
                                                {opt.label}
                                            </div>
                                            <div className="text-apex-dim text-[0.6rem] font-inter mt-0.5 text-center leading-tight">
                                                {(opt as any).desc}
                                            </div>
                                        </motion.button>
                                    )
                                })}
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex gap-3 mt-8">
                            {step > 0 && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                    onClick={() => go(-1)}
                                    className="btn-ghost flex items-center gap-2 px-5 py-3.5 text-[0.85rem] font-inter rounded-xl"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Back
                                </motion.button>
                            )}
                            <motion.button
                                whileHover={{ scale: canContinue() ? 1.02 : 1 }}
                                whileTap={{ scale: canContinue() ? 0.97 : 1 }}
                                onClick={isLast ? finish : () => go(1)}
                                disabled={!canContinue()}
                                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-display font-bold text-[0.92rem] transition-all ${canContinue() ? 'btn-primary' : 'bg-white/5 text-apex-dim cursor-not-allowed'
                                    }`}
                            >
                                {isLast ? 'Enter Apex' : 'Continue'}
                                {isLast ? <Zap className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </motion.button>
                        </div>

                        {/* Dots */}
                        <div className="flex items-center justify-center gap-2 mt-6">
                            {steps.map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        width: i === step ? 20 : 6,
                                        background: i <= step ? '#FFD400' : '#333333',
                                    }}
                                    className="h-[6px] rounded-full"
                                    transition={{ duration: 0.3 }}
                                />
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
