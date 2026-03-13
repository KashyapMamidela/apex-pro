'use client'

import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Activity, Scale, Target, TrendingDown, ArrowUpRight, Plus } from 'lucide-react'

// Mock Data
const weightData = [
    { date: 'Mon', weight: 82.5 },
    { date: 'Tue', weight: 82.1 },
    { date: 'Wed', weight: 81.8 },
    { date: 'Thu', weight: 82.0 },
    { date: 'Fri', weight: 81.5 },
    { date: 'Sat', weight: 81.2 },
    { date: 'Sun', weight: 80.8 },
]

export default function TrackerPage() {
    const [logging, setLogging] = useState(false)
    const [currentWeight, setCurrentWeight] = useState('80.8')

    return (
        <div className="max-w-5xl mx-auto py-8 px-6">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="font-display text-4xl mb-2 flex items-center gap-3">
                        <Activity className="text-apex-accent w-8 h-8" />
                        Apex <span className="text-apex-accent">Tracker</span>
                    </h1>
                    <p className="text-apex-muted text-sm font-inter">Monitor your transformation metrics.</p>
                </div>
                <button 
                    onClick={() => setLogging(!logging)}
                    className="btn-primary px-4 py-2 text-sm rounded-xl flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Log Metrics
                </button>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="card-glass p-5">
                    <div className="flex justify-between items-start mb-2">
                        <Scale className="w-5 h-5 text-apex-muted" />
                        <span className="text-xs font-mono text-apex-info flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" /> 1.7
                        </span>
                    </div>
                    <div className="font-display text-3xl">80.8 <span className="text-lg text-apex-dim">kg</span></div>
                    <div className="text-[0.65rem] font-mono text-apex-dim uppercase tracking-widest mt-1">Current Weight</div>
                </div>

                <div className="card-glass p-5">
                    <div className="flex justify-between items-start mb-2">
                        <Target className="w-5 h-5 text-apex-muted" />
                        <span className="text-xs font-mono text-apex-dim">Goal</span>
                    </div>
                    <div className="font-display text-3xl">75.0 <span className="text-lg text-apex-dim">kg</span></div>
                    <div className="text-[0.65rem] font-mono text-apex-dim uppercase tracking-widest mt-1">Target Weight</div>
                </div>

                <div className="card-glass p-5">
                    <div className="flex justify-between items-start mb-2">
                        <Activity className="w-5 h-5 text-apex-muted" />
                        <span className="text-xs font-mono text-apex-warn flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> +12%
                        </span>
                    </div>
                    <div className="font-display text-3xl">840</div>
                    <div className="text-[0.65rem] font-mono text-apex-dim uppercase tracking-widest mt-1">Active Calories (Avg)</div>
                </div>

                <div className="card-glass p-5 bg-apex-accent/10 border-apex-accent/20">
                    <div className="text-apex-accent font-mono text-xs uppercase tracking-widest mb-2">Apex Score</div>
                    <div className="font-display text-4xl text-apex-accent">A+</div>
                    <div className="text-xs font-inter text-apex-text mt-1">Top 5% this week</div>
                </div>
            </div>

            {/* Logging Panel */}
            {logging && (
                <div className="card-glass p-6 mb-8 border border-white/20">
                    <h3 className="font-inter font-semibold mb-4 text-sm">Log Today's Metrics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="text-xs font-mono text-apex-muted uppercase tracking-wider mb-1 block">Weight (kg)</label>
                            <input 
                                type="number" 
                                value={currentWeight}
                                onChange={e => setCurrentWeight(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm font-inter focus:border-apex-accent focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-mono text-apex-muted uppercase tracking-wider mb-1 block">Body Fat %</label>
                            <input 
                                type="number" 
                                placeholder="Optional"
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm font-inter focus:border-apex-accent focus:outline-none"
                            />
                        </div>
                        <div className="flex items-end">
                            <button className="btn-primary w-full py-2 text-sm rounded-lg" onClick={() => setLogging(false)}>Save Data</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Chart */}
            <div className="card-glass p-6 mb-8">
                <h3 className="font-inter font-medium text-sm mb-6 flex justify-between items-center">
                    <span>Body Mass Trajectory</span>
                    <select className="bg-transparent text-xs text-apex-muted border-none outline-none cursor-pointer">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                    </select>
                </h3>
                
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={weightData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                            <XAxis dataKey="date" stroke="#666" tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                            <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#666" tick={{ fill: '#666', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }}
                                itemStyle={{ color: '#00d4ff' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="weight" 
                                stroke="#00d4ff" 
                                strokeWidth={3} 
                                dot={{ fill: '#00d4ff', strokeWidth: 2, r: 4 }} 
                                activeDot={{ r: 6, fill: '#fff' }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
        </div>
    )
}
