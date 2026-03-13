'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { Check, Flame, Clock, Brain } from 'lucide-react'
import MuscleMap3D from '@/components/workout/MuscleMap3D'
import DeadliftLoader from '@/components/ui/DeadliftLoader'
import WorkoutCheckPoint from '@/components/workout/WorkoutCheckPoint'

function ActiveWorkoutContent() {
    const searchParams = useSearchParams()
    const planId = searchParams?.get('id')
    const [plan, setPlan] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [activeExerciseIndex, setActiveExerciseIndex] = useState(0)

    useEffect(() => {
        if (planId) {
            fetchWorkoutPlan()
        }
    }, [planId])

    const fetchWorkoutPlan = async () => {
        try {
            const { createClient } = await import('@/utils/supabase/client')
            const supabase = createClient()
            
            const { data, error } = await supabase
                .from('ai_plans')
                .select('plan_json')
                .eq('id', planId)
                .single()

            if (data?.plan_json) {
                setPlan(data.plan_json)
            }
        } catch (e) {
            console.error('Failed to load plan', e)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <DeadliftLoader message="Loading Protocol..." />
    if (!plan) return <div className="text-center py-20">Workout not found.</div>

    // Get active muscle for 3D map based on current exercise
    const activeExercise = plan.exercises[activeExerciseIndex]
    const primaryMuscles = activeExercise ? [activeExercise.muscle_group] : []
    const secondaryMuscles = activeExercise ? activeExercise.secondary_muscles : []

    return (
        <div className="max-w-4xl mx-auto py-8 px-6 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
            
            {/* Left: Workout Details */}
            <div className="space-y-8">
                <header>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-apex-accent/10 text-apex-accent text-xs font-mono uppercase tracking-widest mb-4">
                        <Brain className="w-3.5 h-3.5" /> AI Generated
                    </div>
                    <h1 className="font-display text-4xl mb-2">{plan.session_name}</h1>
                    
                    <div className="flex items-center gap-6 text-sm font-inter text-apex-muted">
                        <span className="flex items-center gap-2"><Flame className="w-4 h-4 text-apex-warn" /> {plan.estimated_calories} kcal</span>
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-apex-info" /> {plan.duration_minutes} min</span>
                        <span>XP: +{plan.xp_reward}</span>
                    </div>
                </header>

                <div className="space-y-4">
                    <h2 className="font-mono text-xs text-apex-dim uppercase tracking-[2px]">Exercises ({plan.exercises.length})</h2>
                    
                    {plan.exercises.map((ex: any, i: number) => (
                        <motion.button
                            key={ex.id || i}
                            onClick={() => setActiveExerciseIndex(i)}
                            className={`w-full text-left p-5 rounded-2xl glass-panel transition-all duration-300 border-l-4
                                ${i === activeExerciseIndex ? 'border-apex-accent bg-white/5 shadow-lg shadow-apex-accent/10' : 'border-transparent hover:border-white/20'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-display text-xl tracking-wide">{ex.name}</h3>
                                <div className="font-mono text-sm bg-black/40 px-3 py-1 rounded-lg">
                                    {ex.sets} <span className="text-apex-muted">x</span> {ex.reps}
                                </div>
                            </div>
                            
                            <p className="text-sm font-inter text-apex-muted line-clamp-2">{ex.form_cue}</p>
                            
                            {i === activeExerciseIndex && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="pt-4 mt-4 border-t border-white/10 grid grid-cols-2 gap-4 font-inter text-sm"
                                >
                                    <div>
                                        <span className="text-apex-dim block mb-1">Rest</span>
                                        {ex.rest_seconds}s
                                    </div>
                                    <div>
                                        <span className="text-apex-dim block mb-1">Suggested Weight</span>
                                        {ex.weight_suggestion}
                                    </div>
                                </motion.div>
                            )}
                        </motion.button>
                    ))}
                </div>
                
                <WorkoutCheckPoint
                    planId={planId as string}
                    duration={plan.duration_minutes || 45}
                    xpEst={plan.xp_reward || 150}
                    onComplete={() => {}}
                />
            </div>

            {/* Right: 3D Visualization */}
            <div className="sticky top-24 self-start">
                <div className="card-glass overflow-hidden border border-white/10">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center">
                        <span className="font-mono text-xs tracking-widest uppercase">Target Muscles</span>
                        <span className="w-2 h-2 rounded-full bg-apex-accent animate-pulse" />
                    </div>
                    
                    {/* The 3D Component */}
                    <MuscleMap3D primaryMuscles={primaryMuscles} secondaryMuscles={secondaryMuscles} />
                    
                    <div className="p-4 space-y-3 font-inter text-sm">
                        <div>
                            <span className="text-apex-dim text-xs block mb-1">Primary</span>
                            <div className="flex flex-wrap gap-2">
                                {primaryMuscles.map((m: string) => (
                                    <span key={m} className="px-2 py-1 bg-apex-accent/20 text-apex-accent rounded">{m}</span>
                                ))}
                            </div>
                        </div>
                        {secondaryMuscles.length > 0 && (
                            <div>
                                <span className="text-apex-dim text-xs block mb-1">Secondary</span>
                                <div className="flex flex-wrap gap-2">
                                    {secondaryMuscles.map((m: string) => (
                                        <span key={m} className="px-2 py-1 bg-white/10 rounded">{m}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default function Page() {
    return (
        <Suspense fallback={<DeadliftLoader message="Loading Matrix..." />}>
            <ActiveWorkoutContent />
        </Suspense>
    )
}
