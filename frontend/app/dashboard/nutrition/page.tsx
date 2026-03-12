'use client'

import { useState, useEffect } from 'react'
import { analyzeBody, generateWeeklyDiet, UserData, BodyAnalysis, DietPlan } from '@/lib/diet-engine'
import {
    Info, Calendar, Flame, Target, ChevronRight, ChevronLeft,
    Apple, Utensils, Zap, Clock, Lock, Plus, X, Trash2
} from 'lucide-react'
import Link from 'next/link'
import { SkeletonCard } from '@/components/ui/SkeletonCard'

// ── Calorie Barometer SVG ──
function CalorieBarometer({
    consumed,
    target,
}: {
    consumed: number
    target: number
}) {
    const pct = Math.min(1, consumed / target)
    const radius = 72
    const circumference = Math.PI * radius    // half circle
    const offset = circumference - pct * circumference

    const color = pct < 0.6 ? '#00d4ff' : pct < 0.9 ? '#c8ff00' : pct < 1 ? '#ff9d00' : '#ff4545'

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-48 h-24 overflow-hidden">
                <svg width="192" height="96" viewBox="0 0 192 96">
                    {/* Background arc */}
                    <path
                        d={`M 16 96 A 80 80 0 0 1 176 96`}
                        fill="none"
                        stroke="var(--color-surface-2)"
                        strokeWidth="14"
                        strokeLinecap="round"
                    />
                    {/* Gauge arc */}
                    <path
                        d={`M 16 96 A 80 80 0 0 1 176 96`}
                        fill="none"
                        stroke={color}
                        strokeWidth="14"
                        strokeLinecap="round"
                        strokeDasharray={`${circumference}`}
                        strokeDashoffset={`${circumference - pct * circumference}`}
                        style={{
                            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1), stroke 0.5s ease',
                            filter: `drop-shadow(0 0 6px ${color}88)`,
                        }}
                    />
                    {/* Tick marks */}
                    {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                        const angle = Math.PI * t
                        const x1 = 96 + 76 * Math.cos(Math.PI - angle)
                        const y1 = 96 - 76 * Math.sin(Math.PI - angle) + 96
                        const x2 = 96 + 64 * Math.cos(Math.PI - angle)
                        const y2 = 96 - 64 * Math.sin(Math.PI - angle) + 96
                        return (
                            <line
                                key={i}
                                x1={x1} y1={y1 - 96} x2={x2} y2={y2 - 96}
                                stroke="var(--color-border-sub)"
                                strokeWidth="2"
                            />
                        )
                    })}
                </svg>
                {/* Labels beneath arc */}
                <div className="absolute bottom-0 left-1 text-[0.55rem] font-mono text-apex-dim">0</div>
                <div className="absolute bottom-0 right-1 text-[0.55rem] font-mono text-apex-dim">{target}</div>
            </div>

            {/* Numbers */}
            <div className="text-center -mt-2">
                <div className="font-impact text-[2.8rem] leading-none" style={{ color }}>
                    {consumed}
                </div>
                <div className="text-[0.65rem] font-mono text-apex-muted mt-1">
                    / {target} kcal · {Math.max(0, target - consumed)} remaining
                </div>
                <div
                    className="text-[0.65rem] font-mono mt-1 uppercase tracking-wider"
                    style={{ color }}
                >
                    {pct < 0.6 ? '🔵 Under — eat more!' : pct < 0.9 ? '✅ On Track' : pct < 1 ? '⚠️ Almost there' : '🔴 Over target'}
                </div>
            </div>
        </div>
    )
}

type FoodLog = { name: string; calories: number; protein: number; id: string }

export default function NutritionPage() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [weekOffset, setWeekOffset] = useState(1)
    const [dietPlan, setDietPlan] = useState<DietPlan | null>(null)
    const [analysis, setAnalysis] = useState<BodyAnalysis | null>(null)
    const [foodLog, setFoodLog] = useState<FoodLog[]>([])
    const [showAddFood, setShowAddFood] = useState(false)
    const [newFood, setNewFood] = useState({ name: '', calories: '', protein: '' })
    const [activeDay, setActiveDay] = useState(0)

    useEffect(() => {
        const saved = localStorage.getItem('apex_athlete_profile')
        const savedLog = localStorage.getItem('apex_food_log_today')
        if (savedLog) setFoodLog(JSON.parse(savedLog))
        if (saved) {
            try {
                const data = JSON.parse(saved)
                setProfile(data)
                const userData: UserData = {
                    age: Number(data.age) || 25,
                    height: Number(data.height) || 175,
                    weight: Number(data.weight) || 70,
                    activityLevel: data.activityLevel || 'Moderate',
                    dietType: (data.dietType || 'Non-Veg') as any,
                }
                const bodyAnalysis = analyzeBody(userData)
                const plan = generateWeeklyDiet(userData, bodyAnalysis.goal, weekOffset)
                setAnalysis(bodyAnalysis)
                setDietPlan(plan)
            } catch (e) { console.error(e) }
        }
        setTimeout(() => setLoading(false), 500)
    }, [weekOffset])

    const loggedCalories = foodLog.reduce((s, f) => s + f.calories, 0)
    const loggedProtein = foodLog.reduce((s, f) => s + f.protein, 0)
    const caloriesTarget = Math.round(dietPlan?.calories || 2000)
    const proteinTarget = Math.round(dietPlan?.protein || 120)

    const addFood = () => {
        if (!newFood.name || !newFood.calories) return
        const entry: FoodLog = {
            id: Date.now().toString(),
            name: newFood.name,
            calories: Number(newFood.calories),
            protein: Number(newFood.protein) || 0,
        }
        const updated = [...foodLog, entry]
        setFoodLog(updated)
        localStorage.setItem('apex_food_log_today', JSON.stringify(updated))
        setNewFood({ name: '', calories: '', protein: '' })
        setShowAddFood(false)
    }

    const removeFood = (id: string) => {
        const updated = foodLog.filter(f => f.id !== id)
        setFoodLog(updated)
        localStorage.setItem('apex_food_log_today', JSON.stringify(updated))
    }

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    if (loading) return (
        <div className="space-y-6">
            <SkeletonCard className="h-20" />
            <div className="grid grid-cols-4 gap-4">{[0, 1, 2, 3].map(i => <SkeletonCard key={i} />)}</div>
            <SkeletonCard className="h-64" />
        </div>
    )

    if (!profile) return (
        <div className="p-12 text-center bg-surface border border-border-main animate-fade-up">
            <Apple className="w-10 h-10 text-apex-accent mx-auto mb-4" />
            <h2 className="font-display text-2xl uppercase font-bold mb-2">PROFILE DATA MISSING</h2>
            <p className="text-apex-muted mb-6 text-[0.85rem]">We need your stats to build your South Indian diet plan.</p>
            <Link href="/dashboard/profile" className="px-8 py-3 bg-apex-accent text-bg font-display font-bold uppercase tracking-[2px] hover:bg-apex-accent2 transition-colors inline-block">
                Setup Profile
            </Link>
        </div>
    )

    return (
        <div className="space-y-6 animate-fade-up">
            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="text-[0.6rem] font-mono tracking-[3px] text-apex-accent uppercase mb-1">ELITE NUTRITION ENGINE</div>
                    <h1 className="font-display text-[2rem] font-black uppercase tracking-tight">
                        WEEKLY <span className="text-apex-accent">FORGE</span>
                    </h1>
                    <p className="text-apex-muted text-[0.78rem] mt-0.5 font-mono uppercase tracking-wider">
                        For: {profile.name?.toUpperCase() || 'ATHLETE'}
                    </p>
                </div>
                <div className="flex items-center gap-1 bg-surface border border-border-main">
                    <button
                        onClick={() => setWeekOffset(p => Math.max(1, p - 1))}
                        disabled={weekOffset === 1}
                        className="p-2.5 text-apex-accent disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-mono text-[0.7rem] font-bold tracking-[2px] px-5 uppercase">
                        Week <span className="text-apex-accent">{weekOffset}</span>
                    </span>
                    <button
                        onClick={() => setWeekOffset(p => p + 1)}
                        className="p-2.5 text-apex-accent hover:bg-white/5 transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* === CALORIE BAROMETER + MACROS === */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Barometer */}
                <div className="bg-card border border-border-main p-6 flex flex-col items-center justify-between">
                    <div className="text-[0.6rem] font-mono tracking-[2px] text-apex-muted uppercase mb-4 self-start">TODAY'S CALORIES</div>
                    <CalorieBarometer consumed={loggedCalories} target={caloriesTarget} />

                    <div className="mt-5 w-full">
                        <div className="text-[0.6rem] font-mono tracking-[2px] text-apex-muted uppercase mb-2">PROTEIN</div>
                        <div className="h-2.5 bg-surface-2 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-400 rounded-full transition-all duration-700"
                                style={{ width: `${Math.min(100, (loggedProtein / proteinTarget) * 100)}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-1">
                            <span className="text-[0.6rem] font-mono text-apex-muted">{loggedProtein}g logged</span>
                            <span className="text-[0.6rem] font-mono text-apex-dim">{proteinTarget}g target</span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                    {[
                        { label: 'Body Type', val: analysis?.bodyType || '—', color: '#00d4ff', icon: <Info className="w-3.5 h-3.5" /> },
                        { label: 'Fitness Goal', val: analysis?.goal || '—', color: '#c8ff00', icon: <Target className="w-3.5 h-3.5" /> },
                        { label: 'Daily Calories', val: `${caloriesTarget} kcal`, color: '#ff9d00', icon: <Flame className="w-3.5 h-3.5" /> },
                        { label: 'Protein Target', val: `${proteinTarget}g`, color: '#4ade80', icon: <Zap className="w-3.5 h-3.5" /> },
                    ].map((item, i) => (
                        <div key={i} className="bg-card border border-border-main p-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0" style={{ background: `${item.color}18`, color: item.color }}>
                                {item.icon}
                            </div>
                            <div>
                                <div className="text-[0.58rem] font-mono text-apex-muted uppercase tracking-[1px]">{item.label}</div>
                                <div className="font-display text-[0.95rem] font-bold mt-0.5" style={{ color: item.color }}>{item.val}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Food Logger */}
                <div className="bg-card border border-border-main">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border-main">
                        <span className="text-[0.6rem] font-mono tracking-[2px] text-apex-muted uppercase">FOOD LOG — TODAY</span>
                        <button
                            onClick={() => setShowAddFood(true)}
                            className="flex items-center gap-1.5 text-[0.68rem] font-mono text-apex-accent uppercase hover:underline"
                        >
                            <Plus className="w-3 h-3" /> Add Food
                        </button>
                    </div>

                    {/* Add food modal-inline */}
                    {showAddFood && (
                        <div className="p-4 bg-surface-2 border-b border-border-main space-y-2">
                            <input
                                placeholder="Food name (e.g. Idli + Sambar)"
                                value={newFood.name}
                                onChange={e => setNewFood(p => ({ ...p, name: e.target.value }))}
                                className="w-full bg-card border border-border-sub px-3 py-2 text-[0.8rem] text-apex-text placeholder-apex-dim focus:outline-none focus:border-apex-accent"
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    placeholder="Calories (kcal)"
                                    value={newFood.calories}
                                    onChange={e => setNewFood(p => ({ ...p, calories: e.target.value }))}
                                    className="bg-card border border-border-sub px-3 py-2 text-[0.8rem] text-apex-text placeholder-apex-dim focus:outline-none focus:border-apex-accent"
                                />
                                <input
                                    type="number"
                                    placeholder="Protein (g)"
                                    value={newFood.protein}
                                    onChange={e => setNewFood(p => ({ ...p, protein: e.target.value }))}
                                    className="bg-card border border-border-sub px-3 py-2 text-[0.8rem] text-apex-text placeholder-apex-dim focus:outline-none focus:border-apex-accent"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={addFood} className="flex-1 py-2 bg-apex-accent text-bg text-[0.75rem] font-bold uppercase hover:bg-apex-accent2 transition-colors">
                                    LOG IT
                                </button>
                                <button onClick={() => setShowAddFood(false)} className="px-3 py-2 border border-border-sub text-apex-muted hover:text-apex-text transition-colors">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="divide-y divide-border-main max-h-64 overflow-y-auto">
                        {foodLog.length === 0 && (
                            <div className="p-6 text-center text-apex-dim text-[0.75rem] font-mono uppercase">
                                No food logged yet.<br />Tap "Add Food" above.
                            </div>
                        )}
                        {foodLog.map(f => (
                            <div key={f.id} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2 transition-colors group">
                                <div className="flex-1 min-w-0">
                                    <div className="text-[0.8rem] font-medium truncate">{f.name}</div>
                                    <div className="text-[0.65rem] font-mono text-apex-muted">
                                        <span className="text-apex-warn">{f.calories} kcal</span>
                                        {f.protein > 0 && <span className="text-green-400 ml-2">{f.protein}g protein</span>}
                                    </div>
                                </div>
                                <button onClick={() => removeFood(f.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-apex-dim hover:text-apex-danger">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {foodLog.length > 0 && (
                        <div className="px-4 py-2.5 border-t border-border-main bg-surface-2/50 flex justify-between">
                            <span className="text-[0.65rem] font-mono text-apex-muted">TOTAL</span>
                            <div className="flex gap-3">
                                <span className="text-[0.65rem] font-mono text-apex-warn">{loggedCalories} kcal</span>
                                <span className="text-[0.65rem] font-mono text-green-400">{loggedProtein}g protein</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Weekly Meal Plan */}
            <div className="bg-card border border-border-main">
                <div className="px-6 py-4 border-b border-border-main flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-apex-accent/10 border border-apex-accent/20">
                            <Calendar className="w-4 h-4 text-apex-accent" />
                        </div>
                        <div>
                            <h2 className="font-display text-[1.1rem] font-bold uppercase tracking-wide">SOUTH INDIAN ROTATING PLAN</h2>
                            <p className="text-[0.62rem] font-mono text-apex-muted uppercase tracking-wider">Telugu States · Local & Affordable</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[0.58rem] font-mono px-2 py-1 bg-green-400/10 text-green-400 border border-green-400/20 uppercase tracking-wider">
                            {profile.dietType?.toUpperCase() || 'NON-VEG'}
                        </span>
                        <span className="text-[0.58rem] font-mono px-2 py-1 bg-apex-accent/10 text-apex-accent border border-apex-accent/20 uppercase tracking-wider">
                            WEEK {weekOffset}
                        </span>
                    </div>
                </div>

                {/* Day tabs */}
                <div className="flex border-b border-border-main overflow-x-auto">
                    {days.map((d, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveDay(i)}
                            className={`flex-1 min-w-[56px] py-3 text-[0.65rem] font-mono uppercase tracking-wider transition-all border-b-2 ${activeDay === i
                                ? 'text-apex-accent border-apex-accent bg-apex-accent/5'
                                : 'text-apex-dim border-transparent hover:text-apex-muted hover:bg-surface/50'
                                }`}
                        >
                            {d}
                        </button>
                    ))}
                </div>

                {/* Day content */}
                {dietPlan?.weeklyPlan[activeDay] && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-border-main">
                        {[
                            { label: 'BREAKFAST', meal: dietPlan.weeklyPlan[activeDay].breakfast, icon: <Clock className="w-3.5 h-3.5" />, time: '8:00 AM', color: '#00d4ff' },
                            { label: 'LUNCH', meal: dietPlan.weeklyPlan[activeDay].lunch, icon: <Utensils className="w-3.5 h-3.5" />, time: '1:30 PM', color: '#c8ff00' },
                            { label: 'SNACK', meal: dietPlan.weeklyPlan[activeDay].snack, icon: <Apple className="w-3.5 h-3.5" />, time: '5:00 PM', color: '#ff9d00' },
                            { label: 'DINNER', meal: dietPlan.weeklyPlan[activeDay].dinner, icon: <Utensils className="w-3.5 h-3.5" />, time: '8:30 PM', color: '#9d4edd' },
                        ].map((m, idx) => (
                            <div key={idx} className="p-6 group hover:bg-surface-2/50 transition-colors">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2" style={{ color: m.color }}>
                                        {m.icon}
                                        <span className="text-[0.6rem] font-mono font-bold uppercase tracking-[2px]">{m.label}</span>
                                    </div>
                                    <span className="text-[0.55rem] font-mono text-apex-dim">{m.time}</span>
                                </div>
                                <div className="text-[0.9rem] font-semibold text-apex-text leading-relaxed min-h-[3.5rem]">
                                    {m.meal}
                                </div>
                                <button
                                    onClick={() => {
                                        setNewFood(p => ({
                                            ...p,
                                            name: m.meal,
                                            calories: m.label === 'LUNCH' ? '600' : m.label === 'BREAKFAST' ? '400' : m.label === 'SNACK' ? '200' : '450'
                                        }))
                                        setShowAddFood(true)
                                    }}
                                    className="mt-3 text-[0.62rem] font-mono text-apex-dim hover:text-apex-accent transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                                >
                                    <Plus className="w-3 h-3" /> Log this meal
                                </button>

                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Future weeks lock */}
            <div className="grid grid-cols-3 gap-4">
                {[weekOffset + 1, weekOffset + 2, weekOffset + 3].map(w => (
                    <div key={w} className="bg-surface border border-border-main p-5 flex items-center gap-4 opacity-50 grayscale">
                        <Lock className="w-4 h-4 text-apex-dim shrink-0" />
                        <div>
                            <div className="text-[0.58rem] font-mono text-apex-dim uppercase">Future Plan</div>
                            <div className="font-display text-lg uppercase font-bold">Week {w}</div>
                        </div>
                        <div className="text-[0.55rem] font-mono text-apex-dim ml-auto">Unlocks Monday</div>
                    </div>
                ))}
            </div>

            <footer className="p-5 bg-apex-accent/5 border border-apex-accent/10 flex items-start gap-3">
                <Info className="w-4 h-4 text-apex-accent shrink-0 mt-0.5" />
                <p className="text-[0.72rem] text-apex-muted leading-relaxed">
                    Plans are generated by APEX AI for South Indian users in Telangana & Andhra Pradesh. Always consult a nutritionist for specific health conditions.
                </p>
            </footer>
        </div>
    )
}
