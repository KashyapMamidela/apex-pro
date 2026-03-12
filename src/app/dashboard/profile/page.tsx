'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Activity, Utensils, User, Star, Zap, Target, TrendingUp } from 'lucide-react'

// ── Rank system ───────────────────────────────────────────────────────────────
function getRank(xp: number) {
    if (xp < 100) return { label: 'Rookie', cls: 'badge-rookie', color: '#4ade80', next: 100, banner: 'from-green-950 to-bg' }
    if (xp < 500) return { label: 'Beginner', cls: 'badge-beginner', color: '#00d4ff', next: 500, banner: 'from-cyan-950 to-bg' }
    if (xp < 1500) return { label: 'Intermediate', cls: 'badge-intermediate', color: '#FFD400', next: 1500, banner: 'from-yellow-950 to-bg' }
    if (xp < 3500) return { label: 'Advanced', cls: 'badge-advanced', color: '#ff9d00', next: 3500, banner: 'from-orange-950 to-bg' }
    return { label: 'Elite', cls: 'badge-elite', color: '#9d4edd', next: 20000, banner: 'from-purple-950 to-bg' }
}

const TABS = [
    { id: 'info', label: 'Profile Info', icon: <User className="w-4 h-4" /> },
    { id: 'workouts', label: 'Workout Progress', icon: <Activity className="w-4 h-4" /> },
    { id: 'nutrition', label: 'Nutrition Plan', icon: <Utensils className="w-4 h-4" /> },
    { id: 'achieve', label: 'Achievements', icon: <Trophy className="w-4 h-4" /> },
]

const achievements = [
    { icon: '🔥', label: 'First Workout', desc: 'Completed your first session', earned: true },
    { icon: '💪', label: '7-Day Streak', desc: '7 consecutive training days', earned: true },
    { icon: '🏋️', label: 'Iron Rookie', desc: 'Hit 50kg on any compound lift', earned: false },
    { icon: '⚡', label: 'Speed Demon', desc: 'Sub-30 min HIIT session', earned: false },
    { icon: '🌱', label: 'Clean Eater', desc: 'Hit macros 5 days in a row', earned: false },
    { icon: '🏆', label: 'Elite Status', desc: 'Reach 3500 XP', earned: false },
]

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null)
    const [tab, setTab] = useState('info')
    const xp = 850
    const rank = getRank(xp)
    const xpPct = Math.min(100, Math.round(((xp - (rank.label === 'Rookie' ? 0 : xp < 500 ? 100 : xp < 1500 ? 500 : 1500)) / rank.next) * 100))
    const name = profile?.name || (typeof window !== 'undefined' ? localStorage.getItem('apex_athlete_name') : null) || 'Athlete'
    const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

    useEffect(() => {
        try {
            const saved = localStorage.getItem('apex_athlete_profile')
            if (saved) setProfile(JSON.parse(saved))
        } catch { /* ignore */ }
    }, [])

    return (
        <div className="min-h-screen bg-bg text-apex-text">

            {/* ── BANNER ─────────────────────────────────────────────────── */}
            <div className={`relative h-52 md:h-64 bg-gradient-to-b ${rank.banner} overflow-hidden`}>
                {/* Rank watermark */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="font-impact text-[8rem] md:text-[12rem] tracking-[0.3em] opacity-[0.04] text-white select-none pointer-events-none">
                        {rank.label.toUpperCase()}
                    </div>
                </div>
                {/* Rank badge top right */}
                <div className="absolute top-4 right-6">
                    <span className={`text-[0.7rem] font-mono px-3 py-1.5 rounded-full tracking-[2px] uppercase ${rank.cls}`}>
                        {rank.label}
                    </span>
                </div>
                {/* Glow orb */}
                <div className="absolute bottom-0 left-1/4 w-64 h-32 rounded-full blur-3xl opacity-20"
                    style={{ background: rank.color }} />
            </div>

            {/* ── AVATAR + NAME ─────────────────────────────────────────── */}
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end gap-5 -mt-16 mb-8 relative z-10">
                    {/* Avatar */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                        className="w-28 h-28 md:w-32 md:h-32 rounded-2xl border-4 border-bg flex items-center justify-center font-display text-[2rem] font-black text-black shadow-2xl shrink-0"
                        style={{ background: rank.color }}
                    >
                        {initials}
                    </motion.div>

                    <div className="flex-1 pb-2">
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                            <h1 className="font-display text-[1.8rem] font-black text-apex-text">{name}</h1>
                            <div className="flex items-center gap-3 mt-1.5">
                                <span className={`text-[0.65rem] font-mono px-2.5 py-1 rounded-full ${rank.cls}`}>
                                    {rank.label}
                                </span>
                                <div className="flex items-center gap-1 text-apex-accent text-[0.75rem] font-mono">
                                    <Zap className="w-3.5 h-3.5" /> {xp} XP
                                </div>
                            </div>
                        </motion.div>

                        {/* XP Bar */}
                        <motion.div className="mt-3 max-w-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                            <div className="flex justify-between text-[0.6rem] font-mono text-apex-dim mb-1.5">
                                <span>XP Progress</span>
                                <span>{xp} / {rank.next}</span>
                            </div>
                            <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ background: rank.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${xpPct}%` }}
                                    transition={{ duration: 1.2, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Stats mini row */}
                    <div className="flex gap-5 pb-2">
                        {[['6', 'Day Streak'], ['12', 'Workouts'], ['84%', 'Goal']].map(([v, l]) => (
                            <div key={l} className="text-center">
                                <div className="font-display text-[1.3rem] font-black text-apex-accent">{v}</div>
                                <div className="text-apex-dim text-[0.6rem] font-mono uppercase tracking-wide">{l}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── TABS ───────────────────────────────────────────────── */}
                <div className="flex gap-1 glass p-1 rounded-2xl mb-6">
                    {TABS.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[0.78rem] font-display font-semibold transition-all duration-200 ${tab === t.id
                                    ? 'bg-apex-accent text-black shadow-md'
                                    : 'text-apex-muted hover:text-apex-text'
                                }`}
                        >
                            {t.icon} <span className="hidden sm:inline">{t.label}</span>
                        </button>
                    ))}
                </div>

                {/* ── TAB CONTENT ────────────────────────────────────────── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.25 }}
                        className="pb-16"
                    >
                        {/* Profile Info */}
                        {tab === 'info' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    ['Goal', profile?.goal?.replace('_', ' ') || 'Muscle Gain', '#FFD400'],
                                    ['Experience', profile?.level || 'Intermediate', '#00d4ff'],
                                    ['Body Type', profile?.bodytype || 'Mesomorph', '#ff9d00'],
                                    ['Diet', profile?.diet || 'Non-Veg', '#22c55e'],
                                    ['Age', profile?.age ? `${profile.age} years` : '—', '#9d4edd'],
                                    ['Workout Days', profile?.days ? `${profile.days} days/week` : '—', '#ff4545'],
                                ].map(([label, value, color]) => (
                                    <div key={label} className="glass p-5 rounded-2xl flex items-center gap-4">
                                        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
                                        <div>
                                            <div className="text-apex-dim text-[0.65rem] font-mono uppercase tracking-[2px]">{label}</div>
                                            <div className="font-display font-semibold text-[0.95rem] text-apex-text capitalize mt-0.5">{value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Workout Progress */}
                        {tab === 'workouts' && (
                            <div className="space-y-4">
                                <div className="glass p-6 rounded-2xl">
                                    <h3 className="font-display font-bold text-[1rem] mb-4 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-apex-accent" /> Weekly Strength Progress
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[['Bench Press', '80 kg', '+5kg'], ['Squat', '100 kg', '+10kg'], ['Deadlift', '120 kg', '+7.5kg']].map(([ex, w, delta]) => (
                                            <div key={ex} className="text-center p-4 bg-white/4 rounded-xl">
                                                <div className="text-apex-muted text-[0.65rem] font-mono uppercase mb-1">{ex}</div>
                                                <div className="font-display font-black text-[1.4rem] text-apex-text">{w}</div>
                                                <div className="text-apex-green text-[0.7rem] font-mono">{delta}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="glass p-6 rounded-2xl text-center text-apex-dim font-inter text-[0.85rem]">
                                    📊 Full charts coming soon — connect your Supabase account to see history
                                </div>
                            </div>
                        )}

                        {/* Nutrition Plan */}
                        {tab === 'nutrition' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="glass p-6 rounded-2xl">
                                    <h3 className="font-display font-bold text-[1rem] mb-4 flex items-center gap-2">
                                        <Target className="w-4 h-4 text-apex-accent" /> Daily Targets
                                    </h3>
                                    {[['Calories', '2,400 kcal', '#FFD400'], ['Protein', '190g', '#ff9d00'], ['Carbs', '280g', '#00d4ff'], ['Fats', '70g', '#22c55e']].map(([n, v, c]) => (
                                        <div key={n} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ background: c }} />
                                                <span className="text-apex-muted font-inter text-[0.85rem]">{n}</span>
                                            </div>
                                            <span className="font-display font-bold text-apex-text">{v}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="glass p-6 rounded-2xl">
                                    <h3 className="font-display font-bold text-[1rem] mb-4">🍽️ Today's Meals</h3>
                                    {[['Breakfast', 'Idli with sambar + boiled eggs'], ['Lunch', 'Rice, dal, sabzi + grilled chicken'], ['Snack', 'Banana + peanut butter'], ['Dinner', 'Chapati + paneer or chicken curry']].map(([meal, food]) => (
                                        <div key={meal} className="py-2.5 border-b border-white/5 last:border-0">
                                            <div className="text-apex-dim text-[0.62rem] font-mono uppercase tracking-wider mb-0.5">{meal}</div>
                                            <div className="text-apex-muted font-inter text-[0.8rem]">{food}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Achievements */}
                        {tab === 'achieve' && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {achievements.map(({ icon, label, desc, earned }) => (
                                    <motion.div
                                        key={label}
                                        whileHover={{ scale: 1.03 }}
                                        className={`glass p-5 rounded-2xl text-center transition-all ${!earned ? 'opacity-40 grayscale' : ''}`}
                                    >
                                        <div className="text-[2rem] mb-2">{icon}</div>
                                        <div className="font-display font-bold text-[0.9rem] text-apex-text mb-1">{label}</div>
                                        <div className="text-apex-dim text-[0.7rem] font-inter leading-tight">{desc}</div>
                                        {earned && (
                                            <div className="mt-2">
                                                <Star className="w-3.5 h-3.5 text-apex-accent mx-auto" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
