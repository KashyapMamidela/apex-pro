'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Flame, Target, Zap, Activity, Trophy } from 'lucide-react'
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function DashboardOverview({ user }: { user: any }) {
    const [stats, setStats] = useState<any>(null)
    const [history, setHistory] = useState<any[]>([])

    useEffect(() => {
        if (user) {
            fetchStats()
        }
    }, [user])

    const fetchStats = async () => {
        try {
            const { createClient } = await import('@/utils/supabase/client')
            const supabase = createClient()
            
            // Get overall stats
            const { data } = await supabase
                .from('user_stats')
                .select('*')
                .eq('user_id', user.id)
                .single()

            if (data) setStats(data)

            // Get recent workout history for chart
            const { data: logs } = await supabase
                .from('workout_logs')
                .select('date, xp_earned')
                .eq('user_id', user.id)
                .order('date', { ascending: false })
                .limit(7)

            if (logs) {
                // Formatting for recharts
                const chartData = logs.map(l => ({
                    date: new Date(l.date).toLocaleDateString('en-US', { weekday: 'short' }),
                    xp: l.xp_earned
                })).reverse() // Oldest to newest for x-axis
                
                // Fallback dummy data if new user
                if (chartData.length === 0) {
                    setHistory([
                         { date: 'Mon', xp: 0 }, { date: 'Tue', xp: 0 }, 
                         { date: 'Wed', xp: 0 }, { date: 'Thu', xp: 0 }, 
                         { date: 'Fri', xp: 0 }, { date: 'Sat', xp: 0 }, { date: 'Sun', xp: 0 }
                    ])
                } else {
                    setHistory(chartData)
                }
            }

        } catch (e) {
            console.error('Failed fetching overview stats', e)
        }
    }

    const xpLabel = stats?.level_label || 'INITIATE'
    const lvl = stats?.level || 1
    const xp = stats?.xp || 0
    // Rough calc for next level requirement
    const requiredXp = Math.floor(1000 * Math.pow(1.5, lvl - 1))
    const progressPercent = Math.min(100, Math.round((xp / requiredXp) * 100))

    return (
        <div className="space-y-6">
            
            {/* Top Row: Rank & Level Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="card-glass p-6 md:col-span-2 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-2 h-full bg-apex-accent" />
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <div className="text-apex-accent font-display tracking-widest text-sm uppercase">{xpLabel}</div>
                            <h2 className="text-4xl font-display mt-1">Level {lvl}</h2>
                        </div>
                        <div className="bg-white/5 px-4 py-2 rounded-xl text-center">
                            <Zap className="w-5 h-5 text-apex-warn mx-auto mb-1" />
                            <div className="font-mono text-sm">{stats?.total_workouts || 0} Sessions</div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono uppercase text-apex-muted">
                            <span>Current XP: {xp}</span>
                            <span>Next Rank: {requiredXp} XP</span>
                        </div>
                        <div className="h-2 bg-black rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                                className="h-full bg-gradient-to-r from-apex-warn to-apex-accent"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                            />
                        </div>
                    </div>
                </div>

                <div className="card-glass p-6 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-apex-warn/10 flex items-center justify-center mb-4">
                        <Flame className="w-8 h-8 text-apex-warn animate-pulse" />
                    </div>
                    <div className="text-4xl font-display tracking-wide">0 Day</div>
                    <div className="font-mono text-[0.6rem] uppercase tracking-widest text-apex-muted mt-1">Active Streak</div>
                </div>
            </div>

            {/* Bottom Row: Charts & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="card-glass p-6 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-inter font-medium text-apex-muted text-sm flex items-center gap-2">
                            <Activity className="w-4 h-4" /> Weekly Output (XP)
                        </h3>
                    </div>
                    
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FFD400" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#FFD400" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} dy={10} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }}
                                    itemStyle={{ color: '#FFD400' }}
                                />
                                <Area type="monotone" dataKey="xp" stroke="#FFD400" strokeWidth={2} fillOpacity={1} fill="url(#colorXp)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card-glass p-6">
                    <h3 className="font-inter font-medium text-apex-muted text-sm flex items-center gap-2 mb-6">
                        <Target className="w-4 h-4" /> Next Milestone
                    </h3>
                    
                    <div className="text-center py-6">
                        <div className="inline-block p-4 rounded-full bg-white/5 border border-white/10 mb-4">
                            <Trophy className="w-8 h-8 text-white/40" />
                        </div>
                        <h4 className="font-display text-2xl">Hit Level 5</h4>
                        <p className="text-sm font-inter text-apex-dim mt-2 max-w-[200px] mx-auto">Complete 4 more elite protocols to unlock Veteran status.</p>
                    </div>
                </div>

            </div>

        </div>
    )
}
