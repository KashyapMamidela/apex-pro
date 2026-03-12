'use client'

import { useState } from 'react'
import {
    LineChart,
    TrendingUp,
    Scale,
    Activity,
    Camera,
    Plus,
    Calendar,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react'

export default function ProgressPage() {
    const stats = [
        { label: 'Current Weight', val: '84.2kg', change: '-1.2kg', trend: 'down' },
        { label: 'Body Fat', val: '14.5%', change: '-0.3%', trend: 'down' },
        { label: 'Muscle Mass', val: '68.4kg', change: '+0.5kg', trend: 'up' },
        { label: 'Bench Press', val: '105kg', change: '+2.5kg', trend: 'up' },
    ]

    return (
        <div className="space-y-8 animate-fade-up">
            <header className="flex justify-between items-end">
                <div>
                    <div className="text-[0.65rem] font-mono tracking-[3px] text-apex-accent uppercase mb-1.5">
                        BIOMETRIC TRACKING
                    </div>
                    <h1 className="font-display text-[2.6rem] tracking-[1px] uppercase">
                        PROGRESS <em className="text-apex-accent not-italic">ANALYTICS</em>
                    </h1>
                </div>
                <button className="bg-apex-accent text-bg px-6 py-3 text-xs font-bold tracking-[2px] uppercase flex items-center gap-2 hover:bg-[#e0ff33] transition-all">
                    <Plus className="w-4 h-4" /> NEW MEASUREMENT
                </button>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <div key={i} className="bg-card border border-border-main p-6 group">
                        <div className="text-[0.6rem] font-mono text-apex-muted tracking-[1px] uppercase mb-2">
                            {s.label}
                        </div>
                        <div className="flex items-end justify-between">
                            <div className="font-display text-3xl text-apex-text leading-none">{s.val}</div>
                            <div className={`flex items-center text-[0.7rem] font-bold ${s.trend === 'up' ? 'text-green-400' : 'text-apex-danger'
                                }`}>
                                {s.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {s.change}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weight Graph Placeholder */}
                <div className="bg-card border border-border-main p-7">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2">
                            <Scale className="w-5 h-5 text-apex-accent" />
                            <h3 className="font-display text-xl tracking-[1px] uppercase">WEIGHT TREND</h3>
                        </div>
                        <div className="flex gap-2">
                            {['1M', '3M', '6M', '1Y'].map(t => (
                                <button key={t} className={`px-3 py-1 text-[0.6rem] font-mono rounded-sm border ${t === '1M' ? 'bg-apex-accent text-bg border-apex-accent' : 'bg-surface text-apex-muted border-border-main hover:text-apex-text'
                                    }`}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-64 flex items-end gap-1 px-2 relative border-b border-l border-border-main/50">
                        {/* Mock Graph Bars */}
                        {[40, 45, 42, 48, 52, 50, 55, 58, 54, 60, 62, 59].map((h, i) => (
                            <div key={i} className="flex-1 bg-apex-accent/10 hover:bg-apex-accent/40 transition-colors border-t border-apex-accent/20" style={{ height: `${h}%` }}>
                                <div className="absolute -top-1 left-0 right-0 h-[1px] bg-apex-accent opacity-20" />
                            </div>
                        ))}
                        <div className="absolute inset-x-0 top-1/2 border-t border-border-main/20 border-dashed" />
                        <div className="absolute inset-x-0 top-1/4 border-t border-border-main/10 border-dashed" />
                    </div>
                    <div className="flex justify-between mt-4 text-[0.6rem] font-mono text-apex-dim uppercase tracking-wider">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                    </div>
                </div>

                {/* Progress Photos */}
                <div className="bg-card border border-border-main p-7">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Camera className="w-5 h-5 text-apex-accent" />
                            <h3 className="font-display text-xl tracking-[1px] uppercase">VISUAL TIMELINE</h3>
                        </div>
                        <button className="text-[0.65rem] font-mono text-apex-accent hover:underline uppercase tracking-[1px]">VIEW GALLERY</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-[3/4] bg-surface border border-border-main flex flex-col items-center justify-center relative overflow-hidden group">
                            <div className="text-[0.55rem] font-mono text-apex-muted absolute top-3 left-3 bg-bg/80 p-1 px-2 backdrop-blur-sm z-10 border border-white/5 uppercase">Jan 12, 2026</div>
                            <Activity className="w-10 h-10 text-border-main group-hover:text-apex-accent transition-colors duration-500" />
                            <div className="text-[0.6rem] font-mono text-apex-dim mt-4 uppercase">BASELINE_IMAGE</div>
                            <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="aspect-[3/4] bg-surface border border-border-main flex flex-col items-center justify-center relative overflow-hidden group">
                            <div className="text-[0.55rem] font-mono text-apex-accent absolute top-3 left-3 bg-bg/80 p-1 px-2 backdrop-blur-sm z-10 border border-apex-accent/20 uppercase">Mar 08, 2026</div>
                            <Activity className="w-10 h-10 text-apex-accent" />
                            <div className="text-[0.6rem] font-mono text-apex-text mt-4 uppercase">LATEST_SCAN</div>
                            <div className="absolute inset-0 border-2 border-apex-accent shadow-[inset_0_0_20px_rgba(200,255,0,0.1)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
