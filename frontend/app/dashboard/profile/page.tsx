'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Instagram, Award, Zap, Shield, Image as ImageIcon, Check } from 'lucide-react'
import DeadliftLoader from '@/components/ui/DeadliftLoader'

export default function ProfilePage() {
    const [profile, setProfile] = useState<any>(null)
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [formData, setFormData] = useState({ name: '', bio: '', instagram: '' })
    const [bannerTagline, setBannerTagline] = useState('')
    
    // Play SFX on certain interactions
    const playLevelClick = () => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
            const osc = ctx.createOscillator()
            const gainNode = ctx.createGain()
            
            osc.connect(gainNode)
            gainNode.connect(ctx.destination)
            
            osc.type = 'triangle'
            osc.frequency.setValueAtTime(440, ctx.currentTime)
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1)
            
            gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
            
            osc.start()
            osc.stop(ctx.currentTime + 0.1)
        } catch (e) {
            console.log('Audio not supported or enabled')
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const { createClient } = await import('@/utils/supabase/client')
            const supabase = createClient()
            
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
            const { data: statsData } = await supabase.from('user_stats').select('*').eq('user_id', user.id).single()

            if (profileData) {
                setProfile(profileData)
                setFormData({
                    name: profileData.name || '',
                    bio: profileData.bio || '',
                    instagram: profileData.instagram_handle || ''
                })
            }
            if (statsData) setStats(statsData)

            if (profileData && statsData) {
                const level = statsData.level_label || 'BEGINNER'
                const taglines: Record<string, string> = {
                    'BEGINNER': 'Every champion was once a beginner.',
                    'CHALLENGER': 'The grind is where legends are forged.',
                    'VETERAN': 'Consistency built this. Discipline will take it further.',
                    'ELITE': 'You have outworked most. Now outwork yourself.',
                    'APEX PREDATOR': 'You are the standard. Raise it again.',
                }
                setBannerTagline(taglines[level] || 'The journey has just begun.')
            }
            
        } catch (e) {
            console.error('Failed to load profile', e)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setLoading(true)
        try {
            const { createClient } = await import('@/utils/supabase/client')
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            
            if (user) {
                await supabase.from('profiles').update({
                    name: formData.name,
                    bio: formData.bio,
                    instagram_handle: formData.instagram
                }).eq('id', user.id)
                await fetchData()
            }
        } catch (e) {
            console.error(e)
        } finally {
            setEditing(false)
            setLoading(false)
        }
    }

    if (loading && !profile) return <DeadliftLoader message="Loading Profile Data..." />

    return (
        <div className="max-w-4xl mx-auto py-8 px-6">
            
            {/* Header / Banner area */}
            <div className="card-glass overflow-hidden mb-8 relative">
                {/* Banner Image */}
                <div className="h-48 relative overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, ${
                            stats?.level_label === 'ELITE' || stats?.level_label === 'APEX PREDATOR' ? '#1a0f00' :
                            stats?.level_label === 'VETERAN' ? '#0d1a00' :
                            stats?.level_label === 'CHALLENGER' ? '#001a1a' :
                            '#0b0b0b'
                        } 0%, #0b0b0b 100%)`
                    }}>
                    <div className="absolute inset-0 flex flex-col justify-center px-10 pb-4">
                        <div className="font-mono text-[0.6rem] tracking-[4px] text-apex-accent uppercase mb-2 opacity-70">
                            APEX ATHLETE
                        </div>
                        <div className="font-display text-[2.5rem] font-black leading-none mb-2 uppercase"
                            style={{
                                color: stats?.level_label === 'ELITE' ? '#ff9d00' :
                                       stats?.level_label === 'VETERAN' ? '#ffd700' :
                                       stats?.level_label === 'CHALLENGER' ? '#00d4ff' :
                                       '#FFD400'
                            }}>
                            {stats?.level_label || 'INITIATE'}
                        </div>
                        <div className="text-apex-muted text-sm font-inter italic">
                            {bannerTagline}
                        </div>
                    </div>
                    <button className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-inter transition-colors flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Change Banner
                    </button>
                </div>

                <div className="px-8 pb-8 flex flex-col sm:flex-row gap-6 items-start sm:items-end relative -mt-16">
                    {/* Avatar */}
                    <div className="relative group cursor-pointer">
                        <div className="w-32 h-32 rounded-2xl bg-black border-4 border-bg overflow-hidden relative">
                            {profile?.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt={profile.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div
                                    className="w-full h-full flex items-center justify-center font-display text-5xl font-black"
                                    style={{
                                        background: `linear-gradient(135deg, ${
                                            stats?.level_label === 'ELITE' ? '#ff9d00' :
                                            stats?.level_label === 'VETERAN' ? '#ffd700' :
                                            stats?.level_label === 'CHALLENGER' ? '#00d4ff' :
                                            '#FFD400'
                                        } 0%, rgba(0,0,0,0.8) 100%)`,
                                        color: '#000',
                                    }}
                                >
                                    {(profile?.name || 'A')[0].toUpperCase()}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        {stats && (
                            <div 
                                onClick={playLevelClick}
                                className="absolute -bottom-3 -right-3 w-10 h-10 bg-apex-warn text-black rounded-lg transform rotate-3 flex items-center justify-center font-display text-xl border-2 border-bg hover:scale-110 hover:rotate-6 transition-all shadow-lg shadow-apex-warn/20"
                            >
                                {stats.level || 1}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-4 sm:mt-0">
                        <div>
                            <h1 className="font-display text-4xl mb-1 flex items-center gap-3">
                                {profile?.name || 'Athlete'}
                                {stats?.level > 10 && <Shield className="w-6 h-6 text-apex-info" />}
                            </h1>
                            <div className="font-mono text-xs text-apex-accent tracking-[3px] uppercase">
                                {stats?.level_label || 'INITIATE'}
                            </div>
                        </div>
                        <button 
                            onClick={() => setEditing(!editing)}
                            className="btn-ghost px-6 py-2 rounded-xl text-sm"
                        >
                            {editing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Info & Edit */}
                <div className="lg:col-span-1 space-y-6">
                    <AnimatePresence mode="wait">
                        {editing ? (
                            <motion.div 
                                key="edit"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="card-glass p-6 space-y-4"
                            >
                                <div>
                                    <label className="text-[0.6rem] font-mono text-apex-muted tracking-[2px] uppercase">Display Name</label>
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm mt-1 focus:border-apex-accent focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[0.6rem] font-mono text-apex-muted tracking-[2px] uppercase">Bio</label>
                                    <textarea 
                                        value={formData.bio}
                                        onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm mt-1 focus:border-apex-accent focus:outline-none h-24 resize-none"
                                        placeholder="Tell the community about your goals..."
                                    />
                                </div>
                                <div className="relative">
                                    <label className="text-[0.6rem] font-mono text-apex-muted tracking-[2px] uppercase">Instagram</label>
                                    <div className="flex items-center mt-1">
                                        <div className="bg-black/60 border border-white/10 border-r-0 rounded-l-lg py-2 pl-3 pr-2 text-apex-muted">@</div>
                                        <input 
                                            type="text" 
                                            value={formData.instagram}
                                            onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-r-lg px-3 py-2 text-sm focus:border-apex-accent focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <button onClick={handleSave} className="btn-primary w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm mt-4">
                                    {loading ? <span className="animate-pulse">Saving...</span> : <><Check className="w-4 h-4" /> Save Changes</>}
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="view"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="card-glass p-6"
                            >
                                <h3 className="font-mono text-xs text-apex-dim uppercase tracking-[2px] mb-4">About</h3>
                                <p className="font-inter text-sm leading-relaxed mb-6 text-apex-text/90">
                                    {profile?.bio || "This athlete prefers to let their workouts do the talking."}
                                </p>

                                <div className="space-y-4 border-t border-white/5 pt-4">
                                    <div className="flex justify-between text-sm font-inter">
                                        <span className="text-apex-muted">Goal</span>
                                        <span className="capitalize">{profile?.goal || 'Unknown'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-inter">
                                        <span className="text-apex-muted">Focus</span>
                                        <span className="capitalize">{profile?.body_type || 'Unknown'} Builder</span>
                                    </div>
                                    {profile?.instagram_handle && (
                                        <a href={`https://instagram.com/${profile.instagram_handle}`} target="_blank" rel="noreferrer" className="flex items-center justify-between text-sm font-inter hover:text-apex-info transition-colors group">
                                            <span className="flex items-center gap-2 text-apex-muted group-hover:text-apex-info"><Instagram className="w-4 h-4" /> Instagram</span>
                                            <span>@{profile.instagram_handle}</span>
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Column: Achievements & Stats */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card-glass p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-mono text-xs text-apex-dim uppercase tracking-[3px]">Trophy Case</h3>
                            <button className="text-xs font-inter text-apex-accent hover:underline">View All</button>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {/* Badges UI mock */}
                            {[
                                { title: 'First Blood', icon: <Zap className="w-6 h-6 text-apex-warn" />, desc: 'Completed 1st workout' },
                                { title: 'Consistency', icon: <Award className="w-6 h-6 text-apex-info" />, desc: '7 Day Streak' },
                                { title: 'Locked In', icon: <Shield className="w-6 h-6 text-apex-accent" />, desc: 'Profile 100% Complete' },
                                { title: 'Iron Will', icon: <div className="font-display text-2xl text-white/20">?</div>, desc: 'Locked' },
                            ].map((b, i) => (
                                <div key={i} className={`bg-white/5 border border-white/10 p-4 rounded-xl text-center ${i === 3 ? 'opacity-50 grayscale' : ''}`}>
                                    <div className="w-12 h-12 mx-auto rounded-full bg-black/40 flex items-center justify-center mb-3">
                                        {b.icon}
                                    </div>
                                    <div className="font-inter font-semibold text-xs mb-1">{b.title}</div>
                                    <div className="text-[0.6rem] text-apex-dim">{b.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card-glass p-6">
                        <h3 className="font-mono text-xs text-apex-dim uppercase tracking-[3px] mb-6">Recent Activity</h3>
                        <div className="text-center py-10 text-apex-muted font-inter text-sm border-2 border-dashed border-white/5 rounded-xl">
                            No recent public activity to display.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
