'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Activity, Scale, Target, TrendingDown, ArrowUpRight, Plus, Loader2 } from 'lucide-react'

export default function TrackerPage() {
    const [loading, setLoading] = useState(true)
    const [logging, setLogging] = useState(false)
    const [saving, setSaving] = useState(false)
    const [weightLogs, setWeightLogs] = useState<any[]>([])
    const [currentWeight, setCurrentWeight] = useState('')
    const [targetWeight, setTargetWeight] = useState('75.0')
    const [profile, setProfile] = useState<any>(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const { createClient } = await import('@/utils/supabase/client')
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Fetch profile for target weight (goal)
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()
            setProfile(profileData)

            // Fetch weight logs
            const { data: logs } = await supabase
                .from('progress')
                .select('date, weight')
                .eq('user_id', user.id)
                .order('date', { ascending: true })
                .limit(30)

            if (logs && logs.length > 0) {
                const formatted = logs.map(l => ({
                    date: new Date(l.date).toLocaleDateString('en-US', { weekday: 'short' }),
                    fullDate: l.date,
                    weight: Number(l.weight)
                }))
                setWeightLogs(formatted)
                setCurrentWeight(formatted[formatted.length - 1].weight.toString())
            }
        } catch (e) {
            console.error('Fetch error:', e)
        } finally {
            setLoading(false)
        }
    }

    const saveWeight = async () => {
        if (!currentWeight || isNaN(Number(currentWeight))) return
        setSaving(true)
        try {
            const { createClient } = await import('@/utils/supabase/client')
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const today = new Date().toISOString().split('T')[0]
            
            const { error } = await supabase
                .from('progress')
                .upsert({
                    user_id: user.id,
                    date: today,
                    weight: Number(currentWeight)
                }, { onConflict: 'user_id, date' })

            if (error) throw error
            await fetchData()
            setLogging(false)
        } catch (e) {
            console.error('Save error:', e)
        } finally {
            setSaving(false)
        }
    }

    const stats = {
        current: weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : '--',
        initial: weightLogs.length > 0 ? weightLogs[0].weight : '--',
        diff: weightLogs.length > 1 ? (weightLogs[weightLogs.length - 1].weight - weightLogs[0].weight).toFixed(1) : '0.0'
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 text-apex-accent animate-spin" />
        </div>
    )

    return (
        <div className="max-w-5xl mx-auto py-8 px-6 animate-fade-up">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="font-display text-4xl mb-2 flex items-center gap-3">
                        <Activity className="text-apex-accent w-8 h-8" />
                        Transformation <span className="text-apex-accent">Tracker</span>
                    </h1>
                    <p className="text-apex-muted text-sm font-inter">Monitoring results for {profile?.name || 'Athlete'}.</p>
                </div>
                <button 
                    onClick={() => setLogging(!logging)}
                    className="btn-primary px-5 py-2.5 text-sm rounded-xl flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> {logging ? 'Cancel' : 'Log Weight'}
                </button>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="card-glass p-5 border-b-2 border-b-apex-info">
                    <div className="flex justify-between items-start mb-2">
                        <Scale className="w-5 h-5 text-apex-muted" />
                        <span className={`text-xs font-mono flex items-center gap-1 ${Number(stats.diff) <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {Number(stats.diff) > 0 ? '+' : ''}{stats.diff}
                        </span>
                    </div>
                    <div className="font-display text-3xl">{stats.current} <span className="text-lg text-apex-dim">kg</span></div>
                    <div className="text-[0.65rem] font-mono text-apex-dim uppercase tracking-widest mt-1">Current Weight</div>
                </div>

                <div className="card-glass p-5 border-b-2 border-b-white/10">
                    <div className="flex justify-between items-start mb-2">
                        <Target className="w-5 h-5 text-apex-muted" />
                        <span className="text-xs font-mono text-apex-dim uppercase">Goal</span>
                    </div>
                    <div className="font-display text-3xl">{targetWeight} <span className="text-lg text-apex-dim">kg</span></div>
                    <div className="text-[0.65rem] font-mono text-apex-dim uppercase tracking-widest mt-1">Target Weight</div>
                </div>

                <div className="card-glass p-5 border-b-2 border-b-apex-warn">
                    <div className="flex justify-between items-start mb-2">
                        <Activity className="w-5 h-5 text-apex-muted" />
                        <span className="text-xs font-mono text-apex-dim">Status</span>
                    </div>
                    <div className="font-display text-2xl uppercase tracking-tighter">On Track</div>
                    <div className="text-[0.65rem] font-mono text-apex-dim uppercase tracking-widest mt-1">Transformation Phase</div>
                </div>

                <div className="card-glass p-5 bg-apex-accent/10 border-apex-accent/20">
                    <div className="text-apex-accent font-mono text-xs uppercase tracking-widest mb-2">Apex Rating</div>
                    <div className="font-display text-4xl text-apex-accent">A+</div>
                    <div className="text-xs font-inter text-apex-text mt-1">Consistently Logging</div>
                </div>
            </div>

            {/* Logging Panel */}
            {logging && (
                <div className="card-glass p-6 mb-8 border border-apex-accent/40 bg-apex-accent/5">
                    <h3 className="font-display uppercase tracking-wider mb-4 text-sm">Update Daily Metrics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[0.6rem] font-mono text-apex-muted uppercase tracking-wider mb-1.5 block">Weight (kg)</label>
                            <input 
                                type="number" 
                                step="0.1"
                                value={currentWeight}
                                onChange={e => setCurrentWeight(e.target.value)}
                                placeholder="e.g. 80.5"
                                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-lg font-display focus:border-apex-accent focus:outline-none transition-all"
                            />
                        </div>
                        <div className="flex items-end">
                            <button 
                                disabled={saving}
                                className="btn-primary w-full py-3.5 text-sm rounded-xl font-display uppercase tracking-widest" 
                                onClick={saveWeight}
                            >
                                {saving ? 'Saving...' : 'Secure Entry'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Chart */}
            <div className="card-glass p-6 mb-8 min-h-[400px]">
                <div className="flex justify-between items-center mb-10">
                    <h3 className="font-display text-xl uppercase tracking-wide">
                        Weight <span className="text-apex-accent">Trajectory</span>
                    </h3>
                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[0.65rem] font-mono text-apex-dim uppercase">
                        Real-time Data Sync
                    </div>
                </div>
                
                {weightLogs.length < 2 ? (
                    <div className="h-[300px] flex flex-col items-center justify-center text-center px-10">
                        <div className="p-4 rounded-full bg-white/5 mb-4">
                            <Activity className="w-8 h-8 text-apex-dim" />
                        </div>
                        <p className="text-apex-muted text-sm font-inter">
                            Logging data for at least 2 days will generate your performance trajectory.
                        </p>
                    </div>
                ) : (
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weightLogs}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="date" stroke="#444" tick={{ fill: '#666', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px' }}
                                    itemStyle={{ color: '#FFD400', fontWeight: 'bold' }}
                                    labelStyle={{ color: '#888', marginBottom: '4px', fontSize: '10px' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="weight" 
                                    stroke="#FFD400" 
                                    strokeWidth={4} 
                                    dot={{ fill: '#FFD400', r: 4, strokeWidth: 0 }} 
                                    activeDot={{ r: 6, fill: '#fff', stroke: '#FFD400', strokeWidth: 2 }} 
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
            <div className="card-glass p-6 mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-display text-xl uppercase tracking-wide">
                        Progress <span className="text-apex-accent">Timeline</span>
                    </h3>
                    <button className="btn-ghost text-xs font-mono uppercase px-4 py-2 rounded-xl">
                        Add Photo
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-[3/4] bg-white/3 border border-white/8 rounded-2xl flex flex-col items-center justify-center">
                        <div className="text-apex-dim text-[0.65rem] font-mono uppercase tracking-wider">Start Photo</div>
                        <div className="text-apex-dim text-[0.55rem] mt-1">Upload to begin tracking</div>
                    </div>
                    <div className="aspect-[3/4] bg-white/3 border border-white/8 rounded-2xl flex flex-col items-center justify-center">
                        <div className="text-apex-accent text-[0.65rem] font-mono uppercase tracking-wider">Latest</div>
                        <div className="text-apex-dim text-[0.55rem] mt-1">Upload current photo</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
