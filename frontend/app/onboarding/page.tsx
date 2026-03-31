'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check, Zap } from 'lucide-react'

// ── Step definitions ─────────────────────────────────────────────────────────
const steps = [
    {
        id: 'name', title: "What should we call you?", subtitle: "Your name personalizes every plan we build for you.",
        type: 'text', field: { key: 'name', placeholder: 'Your first name' },
    },
    {
        id: 'age', title: 'How old are you?', subtitle: 'Helps us calibrate training intensity and recovery.',
        type: 'number', field: { key: 'age', label: 'Age', unit: 'years', min: 13, max: 80, placeholder: '25' },
    },
    {
        id: 'gender', title: "What's your gender?", subtitle: 'Affects calorie targets and hormonal considerations.',
        type: 'options',
        options: [
            { value: 'male', label: 'Male', color: '#00d4ff', emoji: '♂', desc: 'Biological male' },
            { value: 'female', label: 'Female', color: '#ff9d00', emoji: '♀', desc: 'Biological female' },
            { value: 'other', label: 'Other / Prefer not to say', color: '#9d4edd', emoji: '⚧', desc: '' },
        ],
    },
    {
        id: 'measurements', title: 'Your current measurements', subtitle: 'Used to calculate your exact calorie needs and BMI.',
        type: 'measurements',
    },
    {
        id: 'goal', title: "What's your primary goal?", subtitle: 'This shapes every workout, meal, and recovery plan.',
        type: 'options',
        gridCols: 2,
        options: [
            { value: 'muscle_gain', label: 'Build Muscle', color: '#FFD400', emoji: '💪', desc: 'Increase size and definition' },
            { value: 'fat_loss', label: 'Lose Fat', color: '#ff4545', emoji: '🔥', desc: 'Burn fat, get lean' },
            { value: 'strength', label: 'Get Stronger', color: '#ff9d00', emoji: '🏋️', desc: 'Increase raw power and lifts' },
            { value: 'general_fitness', label: 'General Fitness', color: '#22c55e', emoji: '🏃', desc: 'Improve overall health and energy' },
            { value: 'mobility', label: 'Mobility & Flexibility', color: '#00d4ff', emoji: '🧘', desc: 'Move better, reduce pain, improve posture' },
            { value: 'weight_gain', label: 'Gain Weight', color: '#9d4edd', emoji: '⬆️', desc: 'Healthy mass gain for thin frames' },
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
        id: 'sport_type', title: 'Any sport or athletic focus?', subtitle: 'This helps us add sport-specific conditioning to your plan.',
        type: 'options',
        options: [
            { value: 'recreational', label: 'Just Fitness', color: '#22c55e', emoji: '🏃', desc: 'No specific sport, general health' },
            { value: 'cricket_football', label: 'Team Sports', color: '#FFD400', emoji: '⚽', desc: 'Cricket, football, basketball, volleyball' },
            { value: 'running_cycling', label: 'Endurance', color: '#00d4ff', emoji: '🚴', desc: 'Running, cycling, swimming, triathlon' },
            { value: 'martial_arts', label: 'Combat Sports', color: '#ff4545', emoji: '🥊', desc: 'Boxing, MMA, wrestling, martial arts' },
            { value: 'yoga_mobility', label: 'Mind & Body', color: '#9d4edd', emoji: '🧘', desc: 'Yoga, pilates, flexibility, meditation' },
            { value: 'competitive_gym', label: 'Competitive Gym', color: '#ff9d00', emoji: '🏋️', desc: 'Powerlifting, bodybuilding, CrossFit' },
        ],
    },
    {
        id: 'activity', title: 'How active are you currently?', subtitle: 'Your daily movement outside the gym affects your calorie needs.',
        type: 'options',
        options: [
            { value: 'sedentary', label: 'Desk Job / Mostly Sitting', color: '#888', emoji: '💻', desc: 'Little to no daily movement' },
            { value: 'lightly_active', label: 'Lightly Active', color: '#22c55e', emoji: '🚶', desc: 'Walk or light activity most days' },
            { value: 'moderately_active', label: 'Moderately Active', color: '#FFD400', emoji: '🏃', desc: 'Active job or regular light exercise' },
            { value: 'very_active', label: 'Very Active', color: '#ff9d00', emoji: '⚡', desc: 'Physical job or intense daily exercise' },
        ],
    },
    {
        id: 'equipment', title: 'What equipment do you have access to?', subtitle: "We build workouts around what's actually available to you.",
        type: 'options',
        options: [
            { value: 'full_gym', label: 'Full Gym', color: '#FFD400', emoji: '🏋️', desc: 'Barbells, machines, cables, everything' },
            { value: 'dumbbells_only', label: 'Dumbbells Only', color: '#00d4ff', emoji: '🔵', desc: 'Dumbbell set at home or limited gym' },
            { value: 'home_workout', label: 'No Equipment', color: '#22c55e', emoji: '🏠', desc: 'Bodyweight only, no equipment' },
            { value: 'resistance_bands', label: 'Resistance Bands', color: '#9d4edd', emoji: '🟣', desc: 'Bands and bodyweight' },
        ],
    },
    {
        id: 'days', title: 'Workout days per week?', subtitle: 'Be realistic — consistency beats intensity.',
        type: 'slider', field: { key: 'days', min: 2, max: 7 },
    },
    {
        id: 'duration', title: 'How long can you train per session?', subtitle: 'We build efficient workouts that fit your real schedule.',
        type: 'options',
        options: [
            { value: '20-30', label: '20–30 min', color: '#22c55e', emoji: '⚡', desc: 'Short and intense' },
            { value: '30-45', label: '30–45 min', color: '#FFD400', emoji: '🕐', desc: 'Standard session' },
            { value: '45-60', label: '45–60 min', color: '#ff9d00', emoji: '🕐', desc: 'Full training block' },
            { value: '60+', label: '60+ min', color: '#ff4545', emoji: '🔥', desc: 'Extended session, serious training' },
        ],
    },
    {
        id: 'diet', title: "What's your diet preference?", subtitle: 'Your AI meal plan will be built around this. We include Indian and global cuisines.',
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
        if (cur.type === 'text') return !!answers[cur.field!.key] && answers[cur.field!.key].trim().length >= 2
        if (cur.type === 'measurements') return !!answers.height && Number(answers.height) > 0 && !!answers.weight && Number(answers.weight) > 0
        return !!answers[cur.id]
    }

    const go = (d: number) => {
        if (d > 0 && !canContinue()) return
        setDir(d)
        setTimeout(() => setStep(s => s + d), 0)
    }

    const finish = async () => {
        const { createClient } = await import('@/utils/supabase/client')
        const supabase = createClient()
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                await supabase.from('profiles').update({
                    name: answers.name || user.user_metadata?.name || 'Athlete',
                    age: Number(answers.age),
                    gender: answers.gender,
                    goal: answers.goal,
                    experience_level: answers.level,
                    height: Number(answers.height),
                    weight: Number(answers.weight),
                    body_type: answers.activity,
                    equipment: answers.equipment,
                    sport_type: answers.sport_type || 'recreational',
                    workout_days: Number(answers.days) || 3,
                    session_duration: answers.duration || '45-60',
                    diet_preference: answers.diet || 'flex',
                    is_profile_complete: true,
                }).eq('id', user.id)
            }
        } catch (e) {
            console.error('Failed to save profile', e)
        }
        localStorage.setItem('apex_athlete_profile', JSON.stringify({
            ...answers, onboarded: true
        }))
        router.push('/dashboard')
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

                        {/* Text input */}
                        {cur.type === 'text' && cur.field && (
                            <div className="flex flex-col items-center gap-3">
                                <div className="flex items-center gap-4 glass p-4 rounded-2xl w-full max-w-sm">
                                    <input
                                        type="text"
                                        value={answers[cur.field.key] || ''}
                                        onChange={e => setAnswers(a => ({ ...a, [cur.field!.key]: e.target.value }))}
                                        placeholder={cur.field.placeholder}
                                        className="input-glass w-full px-5 py-4 text-[1.4rem] font-display font-black text-center"
                                        autoFocus
                                        onKeyDown={e => { if (e.key === 'Enter' && canContinue()) isLast ? finish() : go(1) }}
                                    />
                                </div>
                            </div>
                        )}

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

                        {/* Measurements input */}
                        {cur.type === 'measurements' && (
                            <div className="flex gap-4 justify-center">
                                <div className="flex flex-col items-center gap-2 glass p-5 rounded-2xl flex-1">
                                    <label className="text-[0.6rem] font-mono text-apex-accent uppercase tracking-[2px]">Height</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min={100} max={250}
                                            value={answers.height || ''}
                                            onChange={e => setAnswers(a => ({ ...a, height: e.target.value }))}
                                            placeholder="170"
                                            className="input-glass w-24 px-3 py-3 text-[1.6rem] font-display font-black text-center"
                                        />
                                        <span className="text-apex-accent font-mono text-sm">cm</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2 glass p-5 rounded-2xl flex-1">
                                    <label className="text-[0.6rem] font-mono text-apex-accent uppercase tracking-[2px]">Weight</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            min={30} max={200}
                                            value={answers.weight || ''}
                                            onChange={e => setAnswers(a => ({ ...a, weight: e.target.value }))}
                                            placeholder="70"
                                            className="input-glass w-24 px-3 py-3 text-[1.6rem] font-display font-black text-center"
                                        />
                                        <span className="text-apex-accent font-mono text-sm">kg</span>
                                    </div>
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

                        {/* Option cards */}
                        {cur.type === 'options' && (
                            <div className={`grid gap-3 ${(cur as any).gridCols === 2 || cur.options!.length === 6 ? 'grid-cols-2' : cur.options!.length === 2 ? 'grid-cols-2' : cur.options!.length === 4 ? 'grid-cols-2' : 'grid-cols-1'}`}>
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
