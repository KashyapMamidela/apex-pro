'use client'

import { useState, useEffect } from 'react'
import { Dumbbell, Flame, Clock, Zap, CheckCircle2, Circle, 
         RotateCcw, AlertCircle, Play, ChevronDown, ChevronUp } from 'lucide-react'
import DeadliftLoader from '@/components/ui/DeadliftLoader'

export default function WorkoutsPage() {
  const [profile, setProfile] = useState<any>(null)
  const [plan, setPlan] = useState<any>(null)
  const [planId, setPlanId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set())
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null)
  const [logging, setLogging] = useState(false)
  const [xpResult, setXpResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { init() }, [])

  const init = async () => {
    setLoading(true)
    try {
      const { createClient } = await import('@/utils/supabase/client')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('name, goal, experience_level, equipment, age, gender, body_type, height, weight, sport_type')
        .eq('id', user.id)
        .single()

      const localRaw = localStorage.getItem('apex_athlete_profile')
      const local = localRaw ? JSON.parse(localRaw) : {}

      const p = {
        name: profileData?.name || user.user_metadata?.name || local.name || 'Athlete',
        goal: profileData?.goal || local.goal || 'general_fitness',
        experience_level: profileData?.experience_level || local.level || 'beginner',
        equipment: profileData?.equipment || local.equipment || 'full_gym',
        age: profileData?.age || local.age || 25,
        gender: profileData?.gender || local.gender || 'unspecified',
        body_type: profileData?.body_type || local.activity || 'lightly_active',
        height: profileData?.height || local.height || 170,
        weight: profileData?.weight || local.weight || 70,
        session_duration: local.duration || '45-60',
        workout_days: local.days || 3,
        sport_type: (profileData as any)?.sport_type || local.sport_type || 'recreational',
        diet_preference: local.diet || 'flex',
      }
      setProfile(p)

      // Check for cached plan
      const { data: cached } = await supabase
        .from('ai_plans')
        .select('id, plan_json')
        .eq('user_id', user.id)
        .eq('plan_type', 'workout')
        .gt('expires_at', new Date().toISOString())
        .order('generated_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (cached?.plan_json) {
        setPlan(cached.plan_json)
        setPlanId(cached.id)
      }
    } catch (e) {
      console.error('Init error:', e)
    } finally {
      setLoading(false)
    }
  }

  const generateWorkout = async (force = false) => {
    if (!profile) return
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: profile,
          workoutType: profile.equipment === 'home_workout' ? 'home' : 'gym',
          weekNumber: 1,
          previousWorkouts: []
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate workout')
      setPlan(data.plan)
      setPlanId(data.plan_id)
      setCompletedExercises(new Set())
    } catch (e: any) {
      setError(e.message || 'Failed to generate workout. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const toggleExercise = (idx: number) => {
    setCompletedExercises(prev => {
      const next = new Set(prev)
      next.has(idx) ? next.delete(idx) : next.add(idx)
      return next
    })
  }

  const finishWorkout = async () => {
    if (!planId || !plan) return
    setLogging(true)
    try {
      const res = await fetch('/api/log-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          exercisesCompleted: plan.exercises.map((ex: any, i: number) => ({
            name: ex.name,
            completed: completedExercises.has(i)
          })),
          durationMinutes: plan.duration_minutes || 45,
          xpEarned: plan.xp_reward || 100
        })
      })
      const result = await res.json()
      if (result.success) setXpResult(result)
    } catch (e) {
      console.error('Log error:', e)
    } finally {
      setLogging(false)
    }
  }

  if (loading) return <DeadliftLoader message="Loading Training Protocol..." />
  if (generating) return <DeadliftLoader message="APEX AI is building your protocol..." />

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex justify-between items-end">
        <div>
          <div className="text-[0.65rem] font-mono tracking-[3px] text-apex-accent uppercase mb-1.5">
            AI TRAINING SYSTEM
          </div>
          <h1 className="font-display text-[2.6rem] tracking-[1px] uppercase">
            WORKOUT <em className="text-apex-accent not-italic">FORGE</em>
          </h1>
          {profile && (
            <p className="text-apex-muted text-xs mt-1 font-inter">
              {profile.name} · {profile.goal?.replace('_', ' ').toUpperCase()} · {profile.experience_level}
            </p>
          )}
        </div>
        {plan && (
          <button
            onClick={() => generateWorkout(true)}
            className="flex items-center gap-2 px-4 py-2 border border-border-main bg-surface text-apex-muted hover:text-apex-accent hover:border-apex-accent transition-all text-xs font-mono uppercase"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Regenerate
          </button>
        )}
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 text-red-400 text-sm font-inter rounded">
          {error}
        </div>
      )}

      {xpResult && (
        <div className="bg-apex-accent/10 border border-apex-accent/30 p-4 flex items-center gap-3">
          <Zap className="w-5 h-5 text-apex-accent" />
          <div>
            <div className="font-display text-lg text-apex-accent">+{xpResult.xpAwarded} XP EARNED</div>
            {xpResult.levelUp && (
              <div className="text-xs text-apex-muted font-mono">LEVEL UP → {xpResult.newLabel}</div>
            )}
          </div>
        </div>
      )}

      {!plan ? (
        <div className="text-center py-20 border border-dashed border-border-main">
          <Dumbbell className="w-16 h-16 text-apex-accent mx-auto mb-6 opacity-60" />
          <h2 className="font-display text-3xl mb-3 uppercase">Ready to Train?</h2>
          <p className="text-apex-muted text-sm font-inter mb-8 max-w-md mx-auto">
            Your personal AI coach will create a workout based on your goal 
            ({profile?.goal?.replace('_', ' ')}) and experience level ({profile?.experience_level}).
          </p>
          <button
            onClick={() => generateWorkout()}
            className="bg-apex-accent text-bg px-8 py-4 font-display text-lg tracking-[2px] uppercase hover:bg-apex-accent2 transition-colors inline-flex items-center gap-3"
          >
            <Flame className="w-5 h-5" /> Generate AI Workout
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Session Header */}
            <div className="card-glass p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="font-display text-2xl uppercase tracking-wide">{plan.session_name}</h2>
                  <p className="text-apex-muted text-xs font-mono uppercase tracking-[1px] mt-1">{plan.focus}</p>
                </div>
                <div className="flex gap-4 text-right">
                  <div>
                    <div className="font-mono font-bold text-apex-accent">{plan.duration_minutes}m</div>
                    <div className="text-[0.6rem] text-apex-dim uppercase">Duration</div>
                  </div>
                  <div>
                    <div className="font-mono font-bold text-apex-warn">{plan.estimated_calories}</div>
                    <div className="text-[0.6rem] text-apex-dim uppercase">Calories</div>
                  </div>
                  <div>
                    <div className="font-mono font-bold text-apex-info">{plan.xp_reward}</div>
                    <div className="text-[0.6rem] text-apex-dim uppercase">XP</div>
                  </div>
                </div>
              </div>

              {/* Warmup */}
              {plan.warmup?.length > 0 && (
                <div className="border-t border-border-main pt-4">
                  <div className="text-[0.6rem] font-mono tracking-[2px] text-apex-muted uppercase mb-2">Warmup</div>
                  <div className="flex flex-wrap gap-2">
                    {plan.warmup.map((w: any, i: number) => (
                      <span key={i} className="text-[0.7rem] font-mono bg-surface border border-border-main px-2 py-1 text-apex-muted">
                        {w.name} · {w.duration}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Exercises */}
            <div className="card-glass overflow-hidden">
              <div className="p-5 border-b border-border-main">
                <h3 className="font-display text-lg uppercase tracking-wide">
                  Exercises · {completedExercises.size}/{plan.exercises?.length} Done
                </h3>
              </div>
              <div className="divide-y divide-border-main">
                {plan.exercises?.map((ex: any, i: number) => {
                  const done = completedExercises.has(i)
                  const expanded = expandedExercise === i
                  return (
                    <div key={i} className={`transition-colors ${done ? 'bg-apex-accent/5' : 'hover:bg-white/[0.01]'}`}>
                      <div className="p-5 flex items-center gap-4">
                        <button
                          onClick={() => toggleExercise(i)}
                          className="shrink-0"
                        >
                          {done
                            ? <CheckCircle2 className="w-6 h-6 text-apex-accent" />
                            : <Circle className="w-6 h-6 text-border-sub hover:text-apex-accent transition-colors" />
                          }
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-display text-lg uppercase tracking-wide ${done ? 'text-apex-accent' : ''}`}>
                              {ex.name}
                            </h4>
                            {done && <span className="text-[0.6rem] font-mono text-apex-accent">DONE</span>}
                          </div>
                          <div className="flex flex-wrap gap-3 text-[0.65rem] font-mono text-apex-muted">
                            <span>{ex.sets} sets</span>
                            <span>{ex.reps} reps</span>
                            <span>{ex.rest_seconds}s rest</span>
                            {ex.weight_suggestion && <span className="text-apex-accent">{ex.weight_suggestion}</span>}
                          </div>
                        </div>
                        <button
                          onClick={() => setExpandedExercise(expanded ? null : i)}
                          className="p-2 text-apex-muted hover:text-apex-accent transition-colors"
                        >
                          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                      {expanded && (
                        <div className="px-5 pb-6 pt-2 ml-10 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Column 1: Form cues */}
                            <div className="card-glass p-4">
                              <div className="text-[0.6rem] font-mono text-apex-accent uppercase tracking-[2px] mb-3">Form Cues</div>
                              <ul className="space-y-2">
                                {(ex.form_cue || '').split(/[.!]/).filter(Boolean).slice(0, 3).map((cue: string, ci: number) => (
                                  <li key={ci} className="flex gap-2 items-start">
                                    <span className="w-4 h-4 rounded-full bg-apex-accent/20 text-apex-accent text-[0.6rem] flex items-center justify-center font-bold shrink-0 mt-0.5">{ci + 1}</span>
                                    <span className="text-[0.75rem] text-apex-muted font-inter leading-relaxed">{cue.trim()}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            {/* Column 2: Muscles */}
                            <div className="card-glass p-4">
                              <div className="text-[0.6rem] font-mono text-apex-accent uppercase tracking-[2px] mb-3">Muscles Targeted</div>
                              <div className="mb-3">
                                <div className="text-[0.58rem] text-apex-dim uppercase mb-1.5">Primary</div>
                                <span className="inline-block px-3 py-1 rounded-full bg-apex-accent/20 text-apex-accent text-[0.7rem] font-mono border border-apex-accent/30">{ex.muscle_group}</span>
                              </div>
                              {ex.secondary_muscles?.length > 0 && (
                                <div>
                                  <div className="text-[0.58rem] text-apex-dim uppercase mb-1.5">Secondary</div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {ex.secondary_muscles.map((m: string) => (
                                      <span key={m} className="px-2 py-0.5 rounded-full bg-white/5 text-apex-muted text-[0.65rem] font-mono border border-white/10">{m}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              <div className="mt-3 pt-3 border-t border-white/5">
                                <div className="text-[0.65rem] font-inter text-apex-dim"><span className="text-apex-muted">Equipment: </span>{ex.equipment_needed || 'Standard'}</div>
                              </div>
                            </div>
                            {/* Column 3: Body diagram */}
                            <div className="card-glass p-4 flex flex-col items-center">
                              <div className="text-[0.6rem] font-mono text-apex-accent uppercase tracking-[2px] mb-3 self-start">Target Zone</div>
                              <svg viewBox="0 0 80 160" className="w-20 h-40" fill="none">
                                <ellipse cx="40" cy="16" rx="12" ry="12" fill="#1c1c1c" stroke="#333" strokeWidth="1"/>
                                <rect x="36" y="28" width="8" height="8" rx="2" fill="#1c1c1c" stroke="#333" strokeWidth="1"/>
                                <rect x="24" y="36" width="32" height="22" rx="4"
                                  fill={['chest','pectorals','pecs'].some((k: string) => ex.muscle_group?.toLowerCase().includes(k)) ? '#FFD400' : ex.secondary_muscles?.some((m: string) => ['chest','pectorals'].some((k: string) => m.toLowerCase().includes(k))) ? '#ff9d00' : '#1c1c1c'}
                                  stroke="#333" strokeWidth="1"/>
                                <rect x="28" y="58" width="24" height="20" rx="3"
                                  fill={['abs','core','abdominal'].some((k: string) => ex.muscle_group?.toLowerCase().includes(k)) ? '#FFD400' : ex.secondary_muscles?.some((m: string) => ['abs','core'].some((k: string) => m.toLowerCase().includes(k))) ? '#ff9d00' : '#1c1c1c'}
                                  stroke="#333" strokeWidth="1"/>
                                <rect x="10" y="36" width="12" height="36" rx="5"
                                  fill={['bicep','tricep','arm','shoulder','delt'].some((k: string) => ex.muscle_group?.toLowerCase().includes(k)) ? '#FFD400' : ex.secondary_muscles?.some((m: string) => ['bicep','tricep','shoulder'].some((k: string) => m.toLowerCase().includes(k))) ? '#ff9d00' : '#1c1c1c'}
                                  stroke="#333" strokeWidth="1"/>
                                <rect x="58" y="36" width="12" height="36" rx="5"
                                  fill={['bicep','tricep','arm','shoulder','delt'].some((k: string) => ex.muscle_group?.toLowerCase().includes(k)) ? '#FFD400' : ex.secondary_muscles?.some((m: string) => ['bicep','tricep','shoulder'].some((k: string) => m.toLowerCase().includes(k))) ? '#ff9d00' : '#1c1c1c'}
                                  stroke="#333" strokeWidth="1"/>
                                <rect x="26" y="80" width="12" height="40" rx="5"
                                  fill={['quad','leg','thigh','glute'].some((k: string) => ex.muscle_group?.toLowerCase().includes(k)) ? '#FFD400' : ex.secondary_muscles?.some((m: string) => ['quad','leg','glute'].some((k: string) => m.toLowerCase().includes(k))) ? '#ff9d00' : '#1c1c1c'}
                                  stroke="#333" strokeWidth="1"/>
                                <rect x="42" y="80" width="12" height="40" rx="5"
                                  fill={['quad','leg','thigh','glute'].some((k: string) => ex.muscle_group?.toLowerCase().includes(k)) ? '#FFD400' : ex.secondary_muscles?.some((m: string) => ['quad','leg','glute'].some((k: string) => m.toLowerCase().includes(k))) ? '#ff9d00' : '#1c1c1c'}
                                  stroke="#333" strokeWidth="1"/>
                                <rect x="27" y="122" width="10" height="28" rx="4"
                                  fill={['calf','calves'].some((k: string) => ex.muscle_group?.toLowerCase().includes(k)) ? '#FFD400' : '#1c1c1c'}
                                  stroke="#333" strokeWidth="1"/>
                                <rect x="43" y="122" width="10" height="28" rx="4"
                                  fill={['calf','calves'].some((k: string) => ex.muscle_group?.toLowerCase().includes(k)) ? '#FFD400' : '#1c1c1c'}
                                  stroke="#333" strokeWidth="1"/>
                              </svg>
                              <div className="flex gap-3 mt-2 text-[0.55rem] font-mono">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#FFD400]"/>Primary</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#ff9d00]"/>Secondary</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Finish Button */}
            <button
              onClick={finishWorkout}
              disabled={logging || completedExercises.size === 0}
              className="w-full py-4 bg-apex-accent text-bg font-display text-lg tracking-[2px] uppercase hover:bg-apex-accent2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {logging ? 'Saving...' : `Finish Workout · Claim ${plan.xp_reward} XP`}
            </button>
          </div>

          <div className="space-y-6">
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
                    <strong className="text-apex-text uppercase">Rest Periods:</strong> Stick to the timer to maintain metabolic stress.
                  </p>
                </li>
                <li className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-apex-accent mt-1.5 shrink-0" />
                  <p className="text-[0.75rem] text-apex-muted leading-relaxed">
                    <strong className="text-apex-text uppercase">Form Priority:</strong> Depth over weight. Stop if form breaks.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

