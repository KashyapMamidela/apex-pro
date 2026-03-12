'use client'

import { useEffect, useState } from 'react'
import { Play, Check, Flame, ArrowRightLeft, Timer, ArrowLeft, Info } from 'lucide-react'
import Link from 'next/link'
import { generateWorkoutSession } from '@/lib/workout-engine'

export default function WorkoutSessionUI() {
    const [session, setSession] = useState<any>(null)
    const [activeTab, setActiveTab] = useState<'warmup' | 'workout'>('warmup')
    const [checkedWarmups, setCheckedWarmups] = useState<number[]>([])
    const [activeExerciseIdx, setActiveExerciseIdx] = useState(0)
    const [showAlternativesFor, setShowAlternativesFor] = useState<string | null>(null)
    const [logs, setLogs] = useState<Record<string, Record<number, { w: string, r: string }>>>({})

    useEffect(() => {
        const saved = localStorage.getItem('apex_athlete_profile')
        if (saved) {
            try {
                const data = JSON.parse(saved)
                const mapped = {
                    goal: (data.goal || 'Muscle Gain').toLowerCase().replace(' ', '_'),
                    level: (data.level || 'Intermediate').toLowerCase(),
                    equipment: (data.equipment || 'Full Gym').toLowerCase().replace(' ', '_')
                }

                const newSession = generateWorkoutSession(
                    mapped.goal as any,
                    mapped.level as any,
                    mapped.equipment as any,
                    'full_body' // Default for now
                )
                setSession(newSession)
            } catch (e) {
                console.error("Session profile load error", e)
            }
        } else {
            // Default session
            setSession(generateWorkoutSession('muscle_gain', 'intermediate', 'full_gym', 'full_body'))
        }
    }, [])

    const handleLog = (exId: string, setNum: number, field: 'w' | 'r', val: string) => {
        setLogs(prev => ({
            ...prev,
            [exId]: {
                ...(prev[exId] || {}),
                [setNum]: {
                    ...(prev[exId]?.[setNum] || { w: '', r: '' }),
                    [field]: val
                }
            }
        }))
    }

    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-apex-accent border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="font-mono text-[0.8rem] text-apex-muted uppercase tracking-[2px]">INITIALIZING SESSION...</p>
                </div>
            </div>
        )
    }

    const currentExercise = session.exercises[activeExerciseIdx]
    const warmup = [
        'Dynamic Stretching (2 mins)',
        'Joint Mobilization (2 mins)',
        `Light Sets of ${session.exercises[0]?.name || 'first exercise'} (1 min)`
    ]

    return (
        <div className="space-y-6 max-w-3xl mx-auto pb-24">
            <header className="flex items-center gap-4 border-b border-border-main pb-4">
                <Link href="/dashboard" className="p-2 border border-border-main bg-surface hover:bg-white/5 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                    <div className="text-[0.65rem] font-mono tracking-[3px] text-apex-accent uppercase mb-1">
                        ACTIVE SESSION • 45-60 MIN
                    </div>
                    <h1 className="font-display text-[2rem] tracking-[1px] uppercase leading-none">
                        {session.name}
                    </h1>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex gap-2 p-1 border border-border-main bg-surface">
                <button
                    onClick={() => setActiveTab('warmup')}
                    className={`flex-1 py-2.5 text-[0.7rem] font-mono tracking-[2px] uppercase transition-colors ${activeTab === 'warmup' ? 'bg-white text-bg' : 'text-apex-muted hover:text-white'}`}
                >
                    1. WARM-UP (5 MIN)
                </button>
                <button
                    onClick={() => setActiveTab('workout')}
                    className={`flex-1 py-2.5 text-[0.7rem] font-mono tracking-[2px] uppercase transition-colors ${activeTab === 'workout' ? 'bg-apex-accent text-bg' : 'text-apex-muted hover:text-white'}`}
                >
                    2. WORKOUT
                </button>
            </div>

            {/* Warmup View */}
            {activeTab === 'warmup' && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-orange-500/10 border border-orange-500/20 p-4 flex gap-3 items-start">
                        <Flame className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-semibold text-[0.9rem] text-orange-500 mb-1">Prep your CNS</h4>
                            <p className="text-[0.75rem] text-apex-muted">Complete these dynamic movements to prepare your muscles and joints for the upcoming load.</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {warmup.map((move, i) => (
                            <div
                                key={i}
                                onClick={() => setCheckedWarmups(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                                className={`flex items-center gap-4 p-4 border transition-all cursor-pointer ${checkedWarmups.includes(i) ? 'bg-green-400/10 border-green-400/30' : 'bg-card border-border-main hover:border-border-sub'}`}
                            >
                                <div className={`w-6 h-6 rounded-sm border flex items-center justify-center transition-colors ${checkedWarmups.includes(i) ? 'bg-green-400 border-green-400 text-bg' : 'border-border-sub'}`}>
                                    {checkedWarmups.includes(i) && <Check className="w-4 h-4" />}
                                </div>
                                <span className={`font-mono text-[0.85rem] ${checkedWarmups.includes(i) ? 'text-green-400' : 'text-apex-text'}`}>
                                    {move}
                                </span>
                            </div>
                        ))}
                    </div>

                    {checkedWarmups.length === warmup.length && (
                        <button
                            onClick={() => setActiveTab('workout')}
                            className="w-full mt-6 py-4 bg-apex-accent text-bg font-display text-[1.2rem] tracking-[1px] uppercase hover:bg-white transition-colors"
                        >
                            START WORKOUT
                        </button>
                    )}
                </div>
            )}

            {/* Workout View */}
            {activeTab === 'workout' && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    {/* Exercise Navigator */}
                    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                        {session.exercises.map((ex: any, i: number) => (
                            <button
                                key={ex.id || i}
                                onClick={() => setActiveExerciseIdx(i)}
                                className={`flex-shrink-0 px-4 py-2 border font-mono text-[0.65rem] tracking-[1px] uppercase transition-colors ${i === activeExerciseIdx ? 'bg-white text-bg border-white' : 'bg-surface border-border-main text-apex-muted hover:border-white'}`}
                            >
                                {i + 1}. {ex.name.split(' ').pop()}
                            </button>
                        ))}
                    </div>

                    {/* Active Exercise Card */}
                    <div className="bg-card border border-border-main relative overflow-hidden">
                        {/* Header */}
                        <div className="bg-surface border-b border-border-main p-5 flex justify-between items-start">
                            <div>
                                <h2 className="font-display text-[2rem] leading-none mb-2">{currentExercise.name}</h2>
                                <div className="flex gap-4">
                                    <div className="text-[0.7rem] font-mono text-apex-muted">
                                        REST: <span className="text-white">{currentExercise.rest}s</span>
                                    </div>
                                    <div className="text-[0.7rem] font-mono text-apex-muted">
                                        TARGET: <span className="text-white">{currentExercise.reps} REPS</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowAlternativesFor(currentExercise.name)}
                                className="flex items-center gap-1.5 p-2 border border-border-main bg-card hover:bg-white/5 transition-colors text-[0.65rem] font-mono uppercase tracking-[1px]"
                            >
                                <ArrowRightLeft className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Swap</span>
                            </button>
                        </div>

                        {/* Sets Logger */}
                        <div className="p-5">
                            <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 mb-3 px-2">
                                <div className="text-[0.6rem] font-mono text-apex-muted uppercase tracking-[1px] w-8">Set</div>
                                <div className="text-[0.6rem] font-mono text-apex-muted uppercase tracking-[1px] text-center">KG</div>
                                <div className="text-[0.6rem] font-mono text-apex-muted uppercase tracking-[1px] text-center">Reps</div>
                                <div className="w-8"></div>
                            </div>

                            <div className="space-y-3">
                                {Array.from({ length: currentExercise.sets }).map((_, s) => (
                                    <div key={s} className="group grid grid-cols-[auto_1fr_1fr_auto] gap-4 items-center p-2 bg-surface border border-border-main focus-within:border-apex-accent/50 transition-colors">
                                        <div className="w-8 text-center font-mono text-[0.85rem] text-apex-muted">
                                            {s + 1}
                                        </div>
                                        <input
                                            type="number"
                                            placeholder="—"
                                            value={logs[currentExercise.name]?.[s]?.w || ''}
                                            onChange={e => handleLog(currentExercise.name, s, 'w', e.target.value)}
                                            className="w-full bg-transparent text-center font-display text-[1.4rem] focus:outline-none placeholder:text-border-main"
                                        />
                                        <input
                                            type="number"
                                            placeholder="—"
                                            value={logs[currentExercise.name]?.[s]?.r || ''}
                                            onChange={e => handleLog(currentExercise.name, s, 'r', e.target.value)}
                                            className="w-full bg-transparent text-center font-display text-[1.4rem] focus:outline-none placeholder:text-border-main"
                                        />
                                        <button className={`w-8 h-8 flex items-center justify-center border transition-colors ${logs[currentExercise.name]?.[s]?.w && logs[currentExercise.name]?.[s]?.r ? 'bg-apex-accent border-apex-accent text-bg hover:bg-white' : 'border-border-sub text-apex-dim hover:border-white hover:text-white'}`}>
                                            <Check className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-6">
                        <button
                            onClick={() => setActiveExerciseIdx(Math.max(0, activeExerciseIdx - 1))}
                            disabled={activeExerciseIdx === 0}
                            className="px-6 py-3 border border-border-main bg-card hover:bg-surface transition-colors disabled:opacity-50 disabled:pointer-events-none text-[0.7rem] font-mono uppercase tracking-[2px]"
                        >
                            Previous
                        </button>

                        {activeExerciseIdx < session.exercises.length - 1 ? (
                            <button
                                onClick={() => setActiveExerciseIdx(activeExerciseIdx + 1)}
                                className="px-6 py-3 bg-white text-bg hover:bg-gray-200 transition-colors text-[0.7rem] font-mono uppercase tracking-[2px] font-bold"
                            >
                                Next Exercise
                            </button>
                        ) : (
                            <button className="px-6 py-3 bg-apex-accent text-bg hover:bg-white transition-colors text-[0.7rem] font-mono uppercase tracking-[2px] font-bold">
                                Finish Session
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Alternatives Modal (Simple Version) */}
            {showAlternativesFor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/90 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-card w-full max-w-md border border-border-main shadow-2xl">
                        <div className="p-5 border-b border-border-main flex justify-between items-center">
                            <h3 className="font-display text-[1.25rem] tracking-[1px] uppercase">Swap Exercise</h3>
                            <button onClick={() => setShowAlternativesFor(null)} className="text-apex-muted hover:text-white transition-colors text-xl leading-none">
                                ×
                            </button>
                        </div>
                        <div className="p-4 text-center text-apex-muted text-[0.8rem]">
                            Alternative generation is locked in preview mode.
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

