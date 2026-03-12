'use client'

import { useState } from 'react'
import { Camera, Calendar, ArrowUpRight, ArrowDownRight, Minus, Ruler } from 'lucide-react'
import Link from 'next/link'

// Quick Mock Data
const history = [
    { date: 'Oct 1', weight: 85, chest: 104, waist: 88, arms: 38, thighs: 62 },
    { date: 'Oct 15', weight: 84.1, chest: 104, waist: 86.5, arms: 38.5, thighs: 62 },
    { date: 'Nov 1', weight: 83.5, chest: 104.5, waist: 85, arms: 39, thighs: 62.5 },
    { date: 'Nov 15', weight: 82.8, chest: 105, waist: 83.5, arms: 39.5, thighs: 63 }
]

export default function ProgressTracking() {
    const [view, setView] = useState<'log' | 'history'>('history')

    const currentStats = history[history.length - 1]
    const pastStats = history[0]

    const getTrend = (current: number, past: number, isGoodWhenDown = false) => {
        const diff = current - past
        if (Math.abs(diff) < 0.1) return { icon: <Minus className="w-4 h-4 text-apex-muted" />, text: '0', color: 'text-apex-muted' }
        if (diff > 0) return { icon: <ArrowUpRight className={`w-4 h-4 ${isGoodWhenDown ? 'text-apex-danger' : 'text-green-400'}`} />, text: `+${diff.toFixed(1)}`, color: isGoodWhenDown ? 'text-apex-danger' : 'text-green-400' }
        return { icon: <ArrowDownRight className={`w-4 h-4 ${isGoodWhenDown ? 'text-green-400' : 'text-apex-danger'}`} />, text: diff.toFixed(1), color: isGoodWhenDown ? 'text-green-400' : 'text-apex-danger' }
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-24">
            <header className="flex justify-between items-end border-b border-border-main pb-6">
                <div>
                    <div className="text-[0.65rem] font-mono tracking-[3px] text-apex-accent uppercase mb-1.5 flex items-center gap-2">
                        <Ruler className="w-3.5 h-3.5" /> ANTHROPOMETRY
                    </div>
                    <h1 className="font-display text-[2.6rem] tracking-[1px] uppercase leading-none">
                        BODY TRACKING
                    </h1>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setView('history')}
                        className={`px-6 py-3 font-mono text-[0.7rem] uppercase tracking-[2px] transition-colors border ${view === 'history' ? 'bg-white text-bg border-white' : 'bg-surface text-apex-dim border-border-main hover:bg-white/5'}`}
                    >
                        Timeline
                    </button>
                    <button
                        onClick={() => setView('log')}
                        className={`px-6 py-3 font-mono text-[0.7rem] uppercase tracking-[2px] transition-colors border ${view === 'log' ? 'bg-apex-accent text-bg border-apex-accent' : 'bg-surface text-apex-dim border-border-main hover:bg-white/5'}`}
                    >
                        Log Metrics
                    </button>
                </div>
            </header>

            {view === 'history' ? (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { label: 'WEIGHT', val: currentStats.weight, unit: 'kg', trend: getTrend(currentStats.weight, pastStats.weight, true) },
                            { label: 'CHEST', val: currentStats.chest, unit: 'cm', trend: getTrend(currentStats.chest, pastStats.chest) },
                            { label: 'WAIST', val: currentStats.waist, unit: 'cm', trend: getTrend(currentStats.waist, pastStats.waist, true) },
                            { label: 'ARMS', val: currentStats.arms, unit: 'cm', trend: getTrend(currentStats.arms, pastStats.arms) },
                            { label: 'THIGHS', val: currentStats.thighs, unit: 'cm', trend: getTrend(currentStats.thighs, pastStats.thighs) }
                        ].map((stat, i) => (
                            <div key={i} className="bg-card border border-border-main p-4 flex flex-col justify-between">
                                <div className="text-[0.6rem] font-mono tracking-[2px] text-apex-muted uppercase">{stat.label}</div>
                                <div className="mt-3 flex items-baseline gap-1">
                                    <span className="font-display text-[2rem] leading-none">{stat.val}</span>
                                    <span className="text-[0.6rem] font-mono text-apex-muted">{stat.unit}</span>
                                </div>
                                <div className={`flex items-center gap-1 mt-2 text-[0.7rem] font-mono ${stat.trend.color}`}>
                                    {stat.trend.icon}
                                    {stat.trend.text} since start
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-card border border-border-main p-8 relative overflow-hidden h-[300px] flex items-end">
                        <div className="absolute top-8 left-8">
                            <h3 className="font-display text-[1.25rem] tracking-[1px] uppercase">WEIGHT TREND</h3>
                            <div className="text-[0.65rem] font-mono text-apex-muted uppercase tracking-[1px] mt-1">LAST 8 WEEKS</div>
                        </div>

                        {/* Dummy CSS Graph */}
                        <div className="w-full flex items-end justify-between h-[150px] relative z-10 px-[10%] border-b border-border-main pl-[8%]">
                            {history.map((h, i) => {
                                const min = 80;
                                const max = 90;
                                const percent = ((h.weight - min) / (max - min)) * 100;
                                return (
                                    <div key={i} className="relative flex flex-col items-center group w-8">
                                        <div
                                            className="w-3 bg-apex-accent/40 border border-apex-accent/80 transition-all duration-1000 group-hover:bg-apex-accent"
                                            style={{ height: `${percent}%` }}
                                        />
                                        <div className="absolute -bottom-8 text-[0.6rem] font-mono text-apex-muted transform -rotate-45 origin-top-left">{h.date}</div>
                                        <div className="absolute -top-8 bg-surface border border-border-main px-2 py-1 text-[0.6rem] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                            {h.weight} kg
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="bg-card border border-border-main p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-display text-[1.25rem] tracking-[1px] uppercase">PROGRESS ARCHIVE</h3>
                            <button className="flex items-center gap-2 text-[0.7rem] font-mono uppercase tracking-[1px] border border-border-main px-4 py-2 hover:bg-surface transition-colors">
                                <Calendar className="w-4 h-4" /> Filter
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Two dummy progress shots side by side */}
                            <div className="bg-surface border border-border-main relative aspect-[4/5] overflow-hidden group">
                                <div className="absolute inset-0 bg-neutral-800 flex flex-col items-center justify-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500">
                                    <Camera className="w-12 h-12 text-white/50 mb-4" />
                                    <p className="text-[0.8rem] font-mono text-white/70">PHOTO_OCT_01.JPG</p>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                    <div className="font-display text-[1.5rem] tracking-[1px] uppercase">WEEK 1</div>
                                    <div className="text-[0.7rem] font-mono text-apex-muted">85.0 KG • 104 CM CHEST</div>
                                </div>
                            </div>

                            <div className="bg-surface border border-border-main relative aspect-[4/5] overflow-hidden group">
                                <div className="absolute inset-0 bg-neutral-800 flex flex-col items-center justify-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500">
                                    <Camera className="w-12 h-12 text-white/50 mb-4" />
                                    <p className="text-[0.8rem] font-mono text-white/70">PHOTO_NOV_15.JPG</p>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                    <div className="font-display text-[1.5rem] tracking-[1px] uppercase">WEEK 8</div>
                                    <div className="text-[0.7rem] font-mono text-apex-accent">82.8 KG • 105 CM CHEST</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-card border border-border-main p-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h3 className="font-display text-[1.75rem] tracking-[1px] uppercase mb-1">LOG MEASUREMENTS</h3>
                    <p className="text-[0.75rem] text-apex-muted mb-8">Record your bi-weekly anthropometric data to visualize your transformation.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-[0.6rem] font-mono tracking-[2px] text-apex-muted uppercase mb-2">Weight (KG)</label>
                            <input type="number" step="0.1" className="w-full bg-surface border border-border-main px-4 py-3 font-display text-[1.25rem] focus:outline-none focus:border-white transition-colors" placeholder="85.0" />
                        </div>
                        <div>
                            <label className="block text-[0.6rem] font-mono tracking-[2px] text-apex-muted uppercase mb-2">Chest (CM)</label>
                            <input type="number" step="0.5" className="w-full bg-surface border border-border-main px-4 py-3 font-display text-[1.25rem] focus:outline-none focus:border-white transition-colors" placeholder="104.0" />
                        </div>
                        <div>
                            <label className="block text-[0.6rem] font-mono tracking-[2px] text-apex-muted uppercase mb-2">Waist (CM)</label>
                            <input type="number" step="0.5" className="w-full bg-surface border border-border-main px-4 py-3 font-display text-[1.25rem] focus:outline-none focus:border-white transition-colors" placeholder="85.0" />
                        </div>
                        <div>
                            <label className="block text-[0.6rem] font-mono tracking-[2px] text-apex-muted uppercase mb-2">Arms (CM)</label>
                            <input type="number" step="0.5" className="w-full bg-surface border border-border-main px-4 py-3 font-display text-[1.25rem] focus:outline-none focus:border-white transition-colors" placeholder="38.0" />
                        </div>
                        <div>
                            <label className="block text-[0.6rem] font-mono tracking-[2px] text-apex-muted uppercase mb-2">Thighs (CM)</label>
                            <input type="number" step="0.5" className="w-full bg-surface border border-border-main px-4 py-3 font-display text-[1.25rem] focus:outline-none focus:border-white transition-colors" placeholder="62.0" />
                        </div>
                    </div>

                    <div className="mb-8 p-6 border border-dashed border-border-main bg-surface/50 text-center hover:border-apex-accent hover:bg-surface transition-all cursor-pointer group">
                        <Camera className="w-10 h-10 mx-auto mb-3 text-apex-muted group-hover:text-apex-accent transition-colors" />
                        <div className="font-mono text-[0.8rem] text-white">UPLOAD PROGRESS PHOTO</div>
                        <div className="text-[0.65rem] text-apex-muted mt-1">JPEG or PNG. Strict frontal lightning recommended.</div>
                    </div>

                    <button
                        onClick={() => setView('history')}
                        className="w-full py-4 bg-apex-accent text-bg font-display text-[1.2rem] tracking-[1px] uppercase hover:bg-white transition-colors"
                    >
                        SAVE LOG
                    </button>
                </div>
            )}
        </div>
    )
}
