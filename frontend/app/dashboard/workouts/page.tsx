'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { generateWorkoutSession } from '@/lib/workout-engine'
import {
    Dumbbell,
    Flame,
    Target,
    ChevronRight,
    Play,
    RotateCcw,
    AlertCircle,
    CheckCircle2
} from 'lucide-react'

export default function WorkoutsPage() {
    const [profile, setProfile] = useState<any>(null)
    const [workout, setWorkout] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProfile()
    }, [])

    useEffect(() => {
        if (profile) {
            const dailyWorkout = generateWorkoutSession(
                (profile.goal || 'muscle_gain') as any,
                (profile.level || 'intermediate') as any,
                (profile.equipment || 'full_gym') as any,
                'full_body'
            )
            setWorkout(dailyWorkout)
        }
    }, [profile])

    const fetchProfile = async () => {
        setLoading(true)
        const saved = localStorage.getItem('apex_athlete_profile')
        if (saved) {
            try {
                const data = JSON.parse(saved)
                // Map UI display strings back to engine keys
                const mappedProfile = {
                    full_name: data.name || 'ATHLETE',
                    goal: (data.goal || 'Muscle Gain').toLowerCase().replace(' ', '_'),
                    level: (data.level || 'Intermediate').toLowerCase(),
                    equipment: (data.equipment || 'Full Gym').toLowerCase().replace(' ', '_')
                }
                setProfile(mappedProfile)
            } catch (e) {
                console.error("Error loading profile", e)
            }
        } else {
            // Default fallbacks
            setProfile({
                full_name: 'ATHLETE',
                goal: 'muscle_gain',
                level: 'intermediate',
                equipment: 'full_gym'
            })
        }
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-4 border-apex-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-fade-up">
            <header>
                <div className="text-[0.65rem] font-mono tracking-[3px] text-apex-accent uppercase mb-1.5">
                    ATHLETE TRAINING SYSTEM
                </div>
                <h1 className="font-display text-[2.6rem] tracking-[1px] uppercase">
                    WORKOUT <em className="text-apex-accent not-italic">FORGE</em>
                </h1>
            </header>

            {workout && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Current Workout Card */}
                        <div className="bg-card border border-border-main overflow-hidden">
                            <div className="p-7 border-b border-border-main flex justify-between items-center">
                                <div>
                                    <h2 className="font-display text-2xl tracking-[1px] uppercase">{workout.name}</h2>
                                    <p className="text-apex-muted text-xs font-mono uppercase tracking-[1px] mt-1">SYSTEM RECOMMENDED ROUTINE</p>
                                </div>
                                <button className="bg-apex-accent text-bg px-6 py-2.5 text-xs font-bold tracking-[2px] uppercase transition-all hover:bg-[#e0ff33]">
                                    START SESSION
                                </button>
                            </div>

                            <div className="divide-y divide-border-main">
                                {workout.exercises.map((ex: any, i: number) => (
                                    <div key={i} className="p-6 flex flex-col md:flex-row md:items-center gap-6 group hover:bg-white/[0.01] transition-colors">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="w-6 h-6 rounded-full bg-surface border border-border-main flex items-center justify-center text-[0.65rem] font-mono text-apex-accent">
                                                    {i + 1}
                                                </span>
                                                <h3 className="font-display text-xl tracking-[0.5px] uppercase">{ex.name}</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-4 mt-3">
                                                <div className="px-3 py-1 bg-surface border border-border-main rounded text-[0.65rem] font-mono whitespace-nowrap">
                                                    <span className="text-apex-muted">SETS:</span> {ex.sets}
                                                </div>
                                                <div className="px-3 py-1 bg-surface border border-border-main rounded text-[0.65rem] font-mono whitespace-nowrap">
                                                    <span className="text-apex-muted">REPS:</span> {ex.reps}
                                                </div>
                                                <div className="px-3 py-1 bg-surface border border-border-main rounded text-[0.65rem] font-mono whitespace-nowrap">
                                                    <span className="text-apex-muted">REST:</span> {ex.rest}s
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2.5 border border-border-main bg-surface text-apex-muted hover:text-apex-accent hover:border-apex-accent transition-all" title="View Alternatives">
                                                <RotateCcw className="w-4 h-4" />
                                            </button>
                                            <button className="p-2.5 border border-border-main bg-surface text-apex-muted hover:text-apex-accent hover:border-apex-accent transition-all" title="Video Guide">
                                                <Play className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Training Rules info */}
                        <div className="bg-surface border border-border-main p-7">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="w-5 h-5 text-apex-accent" />
                                <h3 className="font-display text-lg tracking-[1px] uppercase">SYSTEM RULES</h3>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-apex-accent mt-1.5 shrink-0" />
                                    <p className="text-[0.75rem] text-apex-muted leading-relaxed">
                                        <strong className="text-apex-text uppercase">Progressive Overload:</strong> Increase weight by 2.5kg if you hit all target reps in the final set.
                                    </p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-apex-accent mt-1.5 shrink-0" />
                                    <p className="text-[0.75rem] text-apex-muted leading-relaxed">
                                        <strong className="text-apex-text uppercase">Rest Periods:</strong> Stick to the 90s timer to maintain metabolic stress levels.
                                    </p>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-apex-accent mt-1.5 shrink-0" />
                                    <p className="text-[0.75rem] text-apex-muted leading-relaxed">
                                        <strong className="text-apex-text uppercase">Form Priority:</strong> Depth over weight. Reset if form breaks down before RPE 9.
                                    </p>
                                </li>
                            </ul>
                        </div>

                        {/* Weekly Schedule */}
                        <div className="bg-card border border-border-main p-7">
                            <h3 className="font-display text-lg tracking-[1px] uppercase mb-5">ROTATION SCHEDULE</h3>
                            <div className="space-y-3">
                                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day, i) => (
                                    <div key={day} className="flex items-center justify-between p-3 bg-surface border border-border-main rounded-sm">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[0.65rem] font-mono ${i === 4 ? 'text-apex-accent' : 'text-apex-muted'}`}>{day}</span>
                                            <span className="text-[0.8rem] font-semibold text-apex-text">
                                                {i === 4 ? 'CHEST & TRICEPS' : i === 5 ? 'REST DAY' : i === 6 ? 'LEG DAY' : 'UPPER BODY'}
                                            </span>
                                        </div>
                                        {i < 4 ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <div className="w-4 h-4 rounded-full border border-border-main" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
