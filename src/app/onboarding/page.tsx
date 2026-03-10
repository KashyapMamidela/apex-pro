'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    Target, Flame, Heart, Activity, Dumbbell, Home, Zap, Leaf,
    ChevronRight, ChevronLeft, Check
} from 'lucide-react'

const steps = [
    {
        id: 'goal',
        title: "WHAT'S YOUR\nMISSION?",
        subtitle: 'Your goal shapes every workout and meal we create for you.',
        options: [
            { value: 'muscle_gain', label: 'Build Muscle', icon: <Dumbbell className="w-6 h-6" />, color: '#c8ff00', desc: 'Pack on lean mass' },
            { value: 'fat_loss', label: 'Lose Fat', icon: <Flame className="w-6 h-6" />, color: '#ff4545', desc: 'Burn and shred' },
            { value: 'maintain', label: 'Stay Fit', icon: <Heart className="w-6 h-6" />, color: '#00d4ff', desc: 'Maintain performance' },
        ]
    },
    {
        id: 'stats',
        title: 'YOUR BODY\nDATA',
        subtitle: 'Used to calculate your precise calorie and protein targets.',
        fields: [
            { key: 'age', label: 'Age', unit: 'years', type: 'number', min: 13, max: 80 },
            { key: 'height', label: 'Height', unit: 'cm', type: 'number', min: 140, max: 220 },
            { key: 'weight', label: 'Body Weight', unit: 'kg', type: 'number', min: 30, max: 200 },
        ]
    },
    {
        id: 'activity',
        title: 'HOW ACTIVE\nARE YOU?',
        subtitle: 'Be honest — this directly affects your calories.',
        options: [
            { value: 'low', label: 'Low', icon: <Activity className="w-6 h-6" />, color: '#ffd700', desc: 'Desk job, minimal movement' },
            { value: 'moderate', label: 'Moderate', icon: <Zap className="w-6 h-6" />, color: '#ff9d00', desc: '3–4 workouts per week' },
            { value: 'high', label: 'High', icon: <Flame className="w-6 h-6" />, color: '#ff4545', desc: 'Daily training, physical job' },
        ]
    },
    {
        id: 'diet',
        title: 'DIET\nPREFERENCE',
        subtitle: 'We\'ll build your South Indian meal plan around this.',
        options: [
            { value: 'veg', label: 'Vegetarian', icon: <Leaf className="w-6 h-6" />, color: '#4ade80', desc: 'Dal, paneer, sprouts' },
            { value: 'non_veg', label: 'Non-Veg', icon: <Dumbbell className="w-6 h-6" />, color: '#ff9d00', desc: 'Chicken, fish, eggs' },
        ]
    },
    {
        id: 'equipment',
        title: 'YOUR GYM\nSETUP',
        subtitle: 'We\'ll tailor your workouts to what you have access to.',
        options: [
            { value: 'full_gym', label: 'Full Gym', icon: <Dumbbell className="w-6 h-6" />, color: '#c8ff00', desc: 'Barbells, machines, cables' },
            { value: 'dumbbells', label: 'Dumbbells', icon: <Activity className="w-6 h-6" />, color: '#00d4ff', desc: 'Home setup with weights' },
            { value: 'home', label: 'Home/Bodyweight', icon: <Home className="w-6 h-6" />, color: '#9d4edd', desc: 'No equipment needed' },
        ]
    },
]

// Gym-creative background: floating squat silhouette
function GymWatermark() {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute -right-20 top-1/2 -translate-y-1/2 opacity-[0.035]">
                <svg width="400" height="500" viewBox="0 0 400 500" fill="white">
                    {/* Squat silhouette */}
                    <ellipse cx="200" cy="60" rx="35" ry="35" />
                    <path d="M200 95 L180 180 L160 250 L130 320 L170 320 L190 260 L210 260 L230 320 L270 320 L240 250 L220 180 Z" />
                    <rect x="60" y="200" width="280" height="18" rx="9" />
                    <rect x="40" y="188" width="50" height="42" rx="8" />
                    <rect x="310" y="188" width="50" height="42" rx="8" />
                </svg>
            </div>
            <div className="absolute -left-16 bottom-1/4 opacity-[0.025] rotate-[-15deg]">
                <svg width="200" height="50" viewBox="0 0 200 50" fill="white">
                    <rect x="0" y="14" width="24" height="22" rx="4" />
                    <rect x="24" y="18" width="14" height="14" rx="3" />
                    <rect x="38" y="20" width="124" height="10" rx="5" />
                    <rect x="162" y="18" width="14" height="14" rx="3" />
                    <rect x="176" y="14" width="24" height="22" rx="4" />
                </svg>
            </div>
        </div>
    )
}

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [answers, setAnswers] = useState<Record<string, any>>({})
    const [direction, setDirection] = useState<'fwd' | 'bwd'>('fwd')
    const [animating, setAnimating] = useState(false)

    const currentStep = steps[step]
    const isLast = step === steps.length - 1
    const progress = ((step) / steps.length) * 100

    const navigate = (dir: 'fwd' | 'bwd') => {
        if (animating) return
        setDirection(dir)
        setAnimating(true)
        setTimeout(() => {
            if (dir === 'fwd') setStep(s => Math.min(s + 1, steps.length - 1))
            else setStep(s => Math.max(s - 1, 0))
            setAnimating(false)
        }, 250)
    }

    const canContinue = () => {
        if (currentStep.fields) {
            return currentStep.fields.every(f => answers[f.key] && Number(answers[f.key]) > 0)
        }
        return !!answers[currentStep.id]
    }

    const handleFinish = () => {
        localStorage.setItem('apex_athlete_profile', JSON.stringify({
            ...answers,
            onboarded: true,
        }))
        router.push('/dashboard')
    }

    return (
        <div className="min-h-screen page-glass-bg flex flex-col items-center justify-center px-4 relative overflow-hidden">
            <GymWatermark />

            {/* Progress dots + bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-surface-2 z-10">
                <div
                    className="h-full bg-apex-accent transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Brand */}
            <div className="fixed top-6 left-1/2 -translate-x-1/2 font-impact text-xl text-apex-accent tracking-[4px] z-10">
                APEX
            </div>

            {/* Step card */}
            <div
                className="w-full max-w-lg z-10"
                style={{
                    animation: animating
                        ? 'none'
                        : 'slide-up-onboard 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards',
                    opacity: animating ? 0 : 1,
                    transition: animating ? 'opacity 0.25s ease' : 'none',
                }}
            >
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="text-[0.6rem] font-mono text-apex-accent tracking-[3px] uppercase mb-3">
                        STEP {step + 1} OF {steps.length}
                    </div>
                    <h1 className="font-impact text-[3rem] leading-[0.92] tracking-tight text-apex-text whitespace-pre-line">
                        {currentStep.title}
                    </h1>
                    <p className="text-apex-muted text-[0.85rem] font-grotesk mt-3 max-w-xs mx-auto leading-relaxed">
                        {currentStep.subtitle}
                    </p>
                </div>

                {/* Options */}
                {currentStep.options && (
                    <div className={`grid gap-3 ${currentStep.options.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {currentStep.options.map((opt) => {
                            const selected = answers[currentStep.id] === opt.value
                            return (
                                <button
                                    key={opt.value}
                                    onClick={() => setAnswers(a => ({ ...a, [currentStep.id]: opt.value }))}
                                    className={`flex items-center gap-4 p-5 border-2 text-left transition-all duration-200 rounded-2xl ${selected
                                        ? 'border-[var(--opt-color)] bg-[var(--opt-color)]/10 scale-[1.01] shadow-lg'
                                        : 'border-white/8 bg-white/4 hover:border-white/15 hover:bg-white/7 backdrop-blur-sm'
                                        }`}
                                    style={{ '--opt-color': opt.color } as any}
                                >
                                    <div
                                        className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center transition-colors"
                                        style={{ background: selected ? `${opt.color}22` : 'rgba(255,255,255,0.07)', color: selected ? opt.color : 'var(--color-apex-muted)' }}
                                    >
                                        {opt.icon}
                                    </div>
                                    <div>
                                        <div className={`font-grotesk text-[1rem] font-bold tracking-wide ${selected ? '' : 'text-apex-text'}`}
                                            style={selected ? { color: opt.color } : {}}
                                        >
                                            {opt.label}
                                        </div>
                                        <div className="text-apex-muted text-[0.72rem] mt-0.5">{opt.desc}</div>
                                    </div>
                                    {selected && (
                                        <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: opt.color }}>
                                            <Check className="w-3 h-3 text-bg" />
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                )}


                {/* Fields (stats step) */}
                {currentStep.fields && (
                    <div className="space-y-4">
                        {currentStep.fields.map((f) => (
                            <div key={f.key}>
                                <label className="block text-[0.65rem] font-mono text-apex-muted uppercase tracking-[2px] mb-2">
                                    {f.label}
                                </label>
                                <div className="flex gap-3 items-center">
                                    <input
                                        type="number"
                                        min={f.min}
                                        max={f.max}
                                        value={answers[f.key] || ''}
                                        onChange={e => setAnswers(a => ({ ...a, [f.key]: e.target.value }))}
                                        className="input-glass flex-1 px-4 py-3.5 text-apex-text text-[1.1rem] font-syne font-bold"
                                        placeholder={`e.g. ${f.min}`}
                                    />
                                    <span className="text-[0.75rem] font-mono text-apex-accent uppercase tracking-wider w-12 text-right">
                                        {f.unit}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                {/* Nav buttons */}
                <div className="flex gap-3 mt-8">
                    {step > 0 && (
                        <button
                            onClick={() => navigate('bwd')}
                            className="btn-glass-outline flex items-center gap-2 px-5 py-3.5 text-[0.8rem] font-grotesk font-medium"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                    )}
                    <button
                        onClick={isLast ? handleFinish : () => navigate('fwd')}
                        disabled={!canContinue()}
                        className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-grotesk font-bold text-[0.9rem] tracking-[2px] uppercase transition-all rounded-xl ${canContinue()
                            ? 'btn-glass'
                            : 'bg-surface-2 text-apex-dim cursor-not-allowed rounded-xl'
                            }`}
                    >
                        {isLast ? 'Enter Apex' : 'Continue'}
                        {!isLast && <ChevronRight className="w-4 h-4" />}
                        {isLast && <Zap className="w-4 h-4" />}
                    </button>
                </div>

                {/* Step dots */}
                <div className="flex items-center justify-center gap-2 mt-6">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className="rounded-full transition-all duration-300"
                            style={{
                                width: i === step ? '20px' : '6px',
                                height: '6px',
                                background: i <= step ? 'var(--color-apex-accent)' : 'var(--color-border-sub)',
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
