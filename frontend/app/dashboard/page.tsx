'use client'

import { useEffect, useState } from 'react'
import { generateWorkoutSession } from '@/lib/workout-engine'
import {
    Activity, Flame, Target, TrendingUp, Trophy, Medal, Star,
    Dumbbell, Info, ChevronRight, Camera, Users, Zap, Clock,
    CheckCircle, Circle, ArrowUpRight, Utensils
} from 'lucide-react'
import Link from 'next/link'
import { SkeletonDashboard } from '@/components/ui/SkeletonCard'

// Level system
function getLevel(xp: number) {
    if (xp < 500) return { label: 'BEGINNER', color: '#4ade80', next: 500 }
    if (xp < 1500) return { label: 'ROOKIE', color: '#00d4ff', next: 1500 }
    if (xp < 3500) return { label: 'AMATEUR', color: '#ffd700', next: 3500 }
    if (xp < 7000) return { label: 'INTERMEDIATE', color: '#ff9d00', next: 7000 }
    if (xp < 15000) return { label: 'PRO', color: '#ff4545', next: 15000 }
    return { label: 'ELITE', color: '#c8ff00', next: 20000 }
}

// Fake friends stories
const friendStories = [
    { name: 'Ravi', initial: 'R', color: '#ff9d00', workout: 'Chest Day' },
    { name: 'Arjun', initial: 'A', color: '#00d4ff', workout: 'Leg Press' },
    { name: 'Priya', initial: 'P', color: '#9d4edd', workout: 'HIIT' },
    { name: 'Karthik', initial: 'K', color: '#4ade80', workout: 'Pull Day' },
    { name: 'Sai', initial: 'S', color: '#ffd700', workout: 'Deadlift' },
]

export default function DashboardOverview() {
    const [workout, setWorkout] = useState<any>(null)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [completedSets, setCompletedSets] = useState<Record<number, boolean[]>>({})
    const [xp, setXp] = useState(0)
    const [streakDays, setStreakDays] = useState(0)
    const [caloriesConsumed, setCaloriesConsumed] = useState(0)

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })

    const level = getLevel(xp)
    const xpPct = Math.min(100, Math.round((xp / level.next) * 100))
    const caloriesTarget = 2400
    const caloriePct = Math.min(100, Math.round((caloriesConsumed / caloriesTarget) * 100))

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { createClient } = await import('@/utils/supabase/client')
                const supabase = createClient()
                const { data: { user } } = await supabase.auth.getUser()
                
                // Fallback name/data from localStorage
                let localData: any = {}
                const saved = localStorage.getItem('apex_athlete_profile')
                if (saved) {
                    try { localData = JSON.parse(saved) } catch (e) { console.error(e) }
                }

                if (user) {
                    // Try to get profile from Supabase
                    const { data: dbProfile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single()

                    const mapped = {
                        name: dbProfile?.name || user.user_metadata?.name || user.user_metadata?.full_name || localData.name || 'ATHLETE',
                        goal: dbProfile?.goal || (localData.goal || 'muscle_gain').toLowerCase().replace(/ /g, '_'),
                        level: dbProfile?.experience_level || (localData.level || 'intermediate').toLowerCase(),
                        equipment: dbProfile?.equipment || (localData.equipment || 'full_gym').toLowerCase().replace(/ /g, '_')
                    }
                    setProfile(mapped)
                    
                    // Generate workout based on profile
                    const session = generateWorkoutSession(mapped.goal as any, mapped.level as any, mapped.equipment as any, 'full_body')
                    setWorkout(session)

                    // Fetch other stats
                    const { data: stats } = await supabase
                        .from('user_stats')
                        .select('xp')
                        .eq('user_id', user.id)
                        .single()
                    
                    if (stats) {
                        setXp(stats.xp || 0)
                        setStreakDays(0)
                    }

                    const todayStr = new Date().toISOString().split('T')[0]
                    const { data: nutrition } = await supabase
                        .from('nutrition_logs')
                        .select('total_calories')
                        .eq('user_id', user.id)
                        .eq('date', todayStr)

                    if (nutrition) {
                        const totalCals = nutrition.reduce((sum, log) => sum + (log.total_calories || 0), 0)
                        setCaloriesConsumed(totalCals)
                    }
                } else if (localData.name) {
                    // Guest/Local mode if not logged in
                    setProfile({
                        name: localData.name,
                        goal: (localData.goal || 'Muscle Gain').toLowerCase().replace(/ /g, '_'),
                        level: (localData.level || 'Intermediate').toLowerCase(),
                        equipment: (localData.equipment || 'Full Gym').toLowerCase().replace(/ /g, '_')
                    })
                }
            } catch (err) {
                console.error("Dashboard error:", err)
            } finally {
                setLoading(false)
            }
        }
        
        fetchDashboardData()
    }, [])

    const toggleSet = (exIdx: number, setIdx: number) => {
        setCompletedSets(prev => {
            const exSets = prev[exIdx] ? [...prev[exIdx]] : Array(workout.exercises[exIdx]?.sets || 4).fill(false)
            exSets[setIdx] = !exSets[setIdx]
            return { ...prev, [exIdx]: exSets }
        })
    }

    if (loading) return (
        <div className="p-8">
            <SkeletonDashboard />
        </div>
    )

    return (
        <div className="space-y-6 animate-fade-up">
            {/* Profile incomplete warning */}
            {!profile && (
                <div className="bg-apex-warn/10 border border-apex-warn/30 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Info className="w-4 h-4 text-apex-warn" />
                        <span className="text-[0.78rem] font-mono uppercase tracking-[1px] text-apex-warn">
                            Profile incomplete — AI using default settings
                        </span>
                    </div>
                    <Link href="/dashboard/profile" className="text-[0.7rem] font-bold text-apex-warn border-b border-apex-warn/50 hover:text-white transition-colors uppercase">
                        Setup Profile →
                    </Link>
                </div>
            )}

            {/* Header */}
            <header className="flex justify-between items-start">
                <div>
                    <div className="text-[0.6rem] font-mono tracking-[3px] text-apex-accent uppercase mb-1">
                        DASHBOARD OVERVIEW
                    </div>
                    <h1 className="font-display text-[2.2rem] font-black tracking-tight uppercase leading-none">
                        WELCOME BACK,{' '}
                        <span className="text-neon">{profile?.name || 'ATHLETE'}</span>
                    </h1>
                </div>
                <div className="text-right hidden sm:block">
                    <div className="text-[0.6rem] font-mono text-apex-muted uppercase tracking-wider">SYSTEM DATE</div>
                    <div className="text-[0.8rem] font-medium text-apex-text mt-0.5">{today}</div>
                </div>
            </header>

            {/* Friends Stories Strip */}
            <div className="bg-card border border-border-main p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Users className="w-3.5 h-3.5 text-apex-accent" />
                    <span className="text-[0.65rem] font-mono tracking-[2px] text-apex-muted uppercase">FRIENDS TRAINING TODAY</span>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-1">
                    {friendStories.map((f, i) => (
                        <button
                            key={i}
                            className="flex flex-col items-center gap-1.5 shrink-0 group"
                            style={{ animationDelay: `${i * 0.08}s` }}
                        >
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center font-display text-lg font-bold text-bg ring-2 ring-offset-2 ring-offset-card transition-all group-hover:scale-110"
                                style={{ background: f.color, boxShadow: `0 0 16px ${f.color}55` }}
                            >
                                {f.initial}
                            </div>
                            <span className="text-[0.6rem] font-mono text-apex-muted group-hover:text-apex-text transition-colors">{f.name}</span>
                            <span className="text-[0.55rem] text-apex-dim max-w-[52px] text-center leading-tight">{f.workout}</span>
                        </button>
                    ))}
                    <Link href="/dashboard/community" className="flex flex-col items-center gap-1.5 shrink-0 group">
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-border-sub flex items-center justify-center text-apex-dim group-hover:border-apex-accent group-hover:text-apex-accent transition-all">
                            <span className="text-xl font-light">+</span>
                        </div>
                        <span className="text-[0.6rem] font-mono text-apex-dim group-hover:text-apex-accent transition-colors">MORE</span>
                    </Link>
                </div>
            </div>

            {/* === BENTO GRID === */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Streak Card — large (2 cols) */}
                <div className="lg:col-span-2 bg-card border border-border-main p-6 relative overflow-hidden group hover:border-border-glow transition-colors">
                    {/* Background deadlift silhouette watermark */}
                    <div className="absolute right-4 bottom-0 opacity-[0.04] pointer-events-none select-none">
                        <svg width="110" height="140" viewBox="0 0 110 140" fill="currentColor">
                            <ellipse cx="55" cy="18" rx="12" ry="12" />
                            <rect x="45" y="30" width="20" height="50" rx="4" />
                            <rect x="0" y="55" width="110" height="10" rx="5" />
                            <rect x="0" y="52" width="18" height="16" rx="3" />
                            <rect x="92" y="52" width="18" height="16" rx="3" />
                            <rect x="30" y="80" width="12" height="45" rx="4" />
                            <rect x="68" y="80" width="12" height="45" rx="4" />
                        </svg>
                    </div>
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="text-[0.6rem] font-mono tracking-[2px] text-apex-muted uppercase mb-1.5">WORKOUT STREAK</div>
                            <div className="flex items-end gap-2">
                                <span className="font-impact text-[3.5rem] leading-none text-apex-text">{streakDays}</span>
                                <span className="text-apex-muted text-sm font-medium mb-2">days</span>
                            </div>
                        </div>
                        <div
                            className="w-14 h-14 rounded-full bg-orange-500/15 flex items-center justify-center"
                            style={{ animation: 'flame-pulse 1.2s ease-in-out infinite' }}
                        >
                            <Flame className="w-7 h-7 text-orange-400" />
                        </div>
                    </div>
                    <div className="flex gap-1.5 mt-2">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 h-1.5 rounded-full transition-all ${i < streakDays ? 'bg-orange-400' : 'bg-surface-2'}`}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-1.5">
                        <span className="text-[0.58rem] font-mono text-apex-dim">MON</span>
                        <span className="text-[0.58rem] font-mono text-apex-dim">SUN</span>
                    </div>
                    <div className="mt-3 text-[0.7rem] text-apex-muted">
                        📸 <span className="text-apex-accent font-medium">Post today's gym photo</span> to keep your streak alive!
                    </div>
                    <Link
                        href="/dashboard/streak"
                        className="mt-3 inline-flex items-center gap-1.5 text-[0.7rem] font-mono text-apex-accent uppercase tracking-wider hover:underline"
                    >
                        <Camera className="w-3 h-3" /> Upload Proof
                    </Link>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-apex-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>

                {/* Daily Score Ring */}
                <div className="bg-card border border-border-main p-6 flex flex-col items-center group hover:border-border-glow transition-colors">
                    <div className="text-[0.6rem] font-mono tracking-[2px] text-apex-muted uppercase mb-4 self-start">DAILY SCORE</div>
                    <div className="relative w-32 h-32">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="64" cy="64" r="54" fill="none" stroke="currentColor" strokeWidth="10" className="text-surface-2" />
                            <circle
                                cx="64" cy="64" r="54" fill="none" stroke="currentColor" strokeWidth="10"
                                strokeDasharray="339" strokeDashoffset={339 - (339 * 0.82)}
                                className="text-apex-accent"
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-impact text-[2.2rem] leading-none">82</span>
                            <span className="text-[0.58rem] font-mono text-apex-accent tracking-wide">/ 100</span>
                        </div>
                    </div>
                    <div className="mt-3 flex flex-col gap-1.5 w-full">
                        {[
                            { task: 'Workout', done: true, pts: '+40' },
                            { task: 'Diet', done: true, pts: '+32' },
                            { task: 'Steps', done: false, pts: '+10' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-[0.68rem]">
                                {item.done
                                    ? <CheckCircle className="w-3 h-3 text-green-400 shrink-0" />
                                    : <Circle className="w-3 h-3 text-apex-dim shrink-0" />
                                }
                                <span className={item.done ? 'text-apex-text' : 'text-apex-muted'}>{item.task}</span>
                                <span className={`ml-auto font-mono ${item.done ? 'text-apex-accent' : 'text-apex-dim'}`}>{item.pts}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calories Ring */}
                <div className="bg-card border border-border-main p-6 flex flex-col items-center group hover:border-border-glow transition-colors">
                    <div className="text-[0.6rem] font-mono tracking-[2px] text-apex-muted uppercase mb-4 self-start">CALORIES TODAY</div>
                    <div className="relative w-32 h-32">
                        <svg className="w-full h-full -rotate-90">
                            <circle cx="64" cy="64" r="54" fill="none" stroke="currentColor" strokeWidth="10" className="text-surface-2" />
                            <circle
                                cx="64" cy="64" r="54" fill="none" stroke="#ff9d00" strokeWidth="10"
                                strokeDasharray="339" strokeDashoffset={339 - (339 * caloriePct / 100)}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)' }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="font-impact text-[1.5rem] leading-none" style={{ color: '#ff9d00' }}>{caloriesConsumed}</span>
                            <span className="text-[0.55rem] font-mono text-apex-muted tracking-wide">kcal</span>
                        </div>
                    </div>
                    <div className="mt-3 text-center">
                        <div className="text-[0.68rem] text-apex-muted">Target: <span className="text-apex-text font-semibold">{caloriesTarget} kcal</span></div>
                        <div className="text-[0.65rem] text-apex-dim mt-0.5">{caloriesTarget - caloriesConsumed} kcal remaining</div>
                    </div>
                    <Link href="/dashboard/nutrition" className="mt-3 text-[0.65rem] font-mono text-apex-accent uppercase tracking-wider flex items-center gap-1 hover:underline">
                        <Utensils className="w-3 h-3" /> Log Food
                    </Link>
                </div>
            </div>

            {/* === Today's Workout + XP === */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Workout — 2 cols */}
                <div className="lg:col-span-2 bg-card border border-border-main">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border-main">
                        <div className="flex items-center gap-3">
                            <Dumbbell className="w-4 h-4 text-apex-accent" />
                            <h3 className="font-display text-[1.1rem] font-bold uppercase tracking-wide">TODAY'S WORKOUT</h3>
                        </div>
                        {workout && (
                            <span className="text-[0.58rem] font-mono text-apex-accent tracking-[2px] uppercase bg-apex-accent/10 px-2 py-1 border border-apex-accent/20">
                                {workout.name}
                            </span>
                        )}
                    </div>

                    {/* Day strip */}
                    <div className="grid grid-cols-7 gap-0 border-b border-border-main">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
                            const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
                            return (
                                <div
                                    key={i}
                                    className={`text-center py-2.5 text-[0.6rem] font-mono tracking-[1px] ${i === todayIdx
                                        ? 'bg-apex-accent text-bg font-bold'
                                        : i < todayIdx ? 'bg-surface-2 text-apex-accent/60' : 'bg-surface text-apex-dim'
                                        }`}
                                >
                                    {d}
                                </div>
                            )
                        })}
                    </div>

                    <div className="p-4 space-y-2">
                        {workout?.exercises.map((ex: any, i: number) => {
                            const sets = completedSets[i] || Array(ex.sets).fill(false)
                            const allDone = sets.every(Boolean)
                            return (
                                <div
                                    key={i}
                                    className={`flex flex-col sm:flex-row sm:items-center gap-3 p-[12px_14px] border transition-all ${allDone
                                        ? 'bg-apex-accent/5 border-apex-accent/30'
                                        : 'bg-surface border-border-main hover:border-border-sub'
                                        }`}
                                >
                                    <div className="flex gap-3 items-start flex-1">
                                        <Dumbbell className={`w-4 h-4 mt-0.5 shrink-0 ${allDone ? 'text-apex-accent' : 'text-apex-muted'}`} />
                                        <div>
                                            <div className={`text-[0.85rem] font-semibold ${allDone ? 'text-apex-accent' : ''}`}>
                                                {ex.name}
                                                {allDone && <span className="ml-2 text-[0.6rem] text-apex-accent font-mono">✓ DONE</span>}
                                            </div>
                                            <div className="text-[0.68rem] text-apex-muted font-mono mt-0.5">
                                                {ex.sets} SETS · {ex.reps} REPS · {ex.rest}s REST
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1.5 sm:ml-0 ml-7">
                                        {sets.map((done: boolean, s: number) => (
                                            <button
                                                key={s}
                                                onClick={() => toggleSet(i, s)}
                                                className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center text-[0.6rem] font-bold ${done
                                                    ? 'bg-apex-accent border-apex-accent text-bg'
                                                    : 'border-border-sub hover:border-apex-accent/50 text-transparent hover:text-apex-accent/50'
                                                    }`}
                                            >
                                                ✓
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                        {!workout && (
                            <div className="text-center py-10 border border-dashed border-border-main text-apex-muted text-[0.75rem] font-mono uppercase">
                                INITIALIZING TRAINING SESSION...
                            </div>
                        )}
                    </div>

                    <div className="px-4 pb-4">
                        <Link
                            href="/dashboard/workouts"
                            className="flex items-center justify-center gap-2 w-full py-3 bg-apex-accent text-bg font-display font-bold text-[0.85rem] tracking-[2px] uppercase hover:bg-apex-accent2 transition-colors"
                        >
                            START SESSION <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Right column: XP + Badges */}
                <div className="space-y-4">

                    {/* XP Level Card */}
                    <div className="bg-card border border-border-main p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-[0.6rem] font-mono tracking-[2px] text-apex-muted uppercase">YOUR LEVEL</div>
                            <Zap className="w-4 h-4" style={{ color: level.color }} />
                        </div>
                        <div className="font-impact text-[1.8rem] leading-none mb-0.5" style={{ color: level.color }}>
                            {level.label}
                        </div>
                        <div className="text-[0.68rem] text-apex-muted mb-4">{xp} XP · {level.next - xp} to next</div>

                        {/* XP bar */}
                        <div className="h-2.5 bg-surface-2 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={{
                                    width: `${xpPct}%`,
                                    background: `linear-gradient(90deg, ${level.color}88, ${level.color})`,
                                    boxShadow: `0 0 10px ${level.color}55`
                                }}
                            />
                        </div>
                        <div className="flex justify-between mt-1">
                            <span className="text-[0.58rem] font-mono text-apex-dim">{xp} XP</span>
                            <span className="text-[0.58rem] font-mono text-apex-dim">{level.next} XP</span>
                        </div>

                        <div className="mt-4 space-y-1.5">
                            <div className="text-[0.62rem] font-mono text-apex-dim uppercase tracking-wider mb-2">XP GAINS</div>
                            {[
                                { label: 'Log workout', pts: '+50 XP' },
                                { label: 'Streak photo', pts: '+30 XP' },
                                { label: 'Log meals', pts: '+20 XP' },
                                { label: '7-day streak', pts: '+100 XP' },
                            ].map((g, i) => (
                                <div key={i} className="flex justify-between text-[0.68rem]">
                                    <span className="text-apex-muted">{g.label}</span>
                                    <span className="font-mono text-apex-accent">{g.pts}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="bg-card border border-border-main p-6">
                        <h3 className="text-[0.6rem] font-mono tracking-[2px] text-apex-muted uppercase mb-4">STREAK BADGES</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { icon: <Trophy className="w-5 h-5" />, label: 'Bronze', sub: '3 Days', color: '#cd7f32', earned: true },
                                { icon: <Medal className="w-5 h-5" />, label: 'Silver', sub: '7 Days', color: '#c0c0c0', earned: true },
                                { icon: <Star className="w-5 h-5" />, label: 'Elite', sub: '30 Days', color: '#ffd700', earned: false },
                            ].map((b, i) => (
                                <div
                                    key={i}
                                    className={`flex flex-col items-center p-2.5 border text-center transition-all ${b.earned
                                        ? 'border-border-sub bg-surface'
                                        : 'border-border-main bg-surface opacity-40 grayscale'
                                        }`}
                                    style={b.earned ? { boxShadow: `0 0 10px ${b.color}22` } : {}}
                                >
                                    <span style={{ color: b.color }}>{b.icon}</span>
                                    <span className="text-[0.58rem] font-bold uppercase tracking-wider mt-1" style={{ color: b.color }}>{b.label}</span>
                                    <span className="text-[0.55rem] text-apex-muted">{b.sub}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
