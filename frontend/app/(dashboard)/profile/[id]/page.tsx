'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Shield, MapPin, Award, UserPlus, MessageSquare } from 'lucide-react'
import DeadliftLoader from '@/components/ui/DeadliftLoader'

export default function PublicProfile() {
    const params = useParams()
    const id = params?.id

    const [profile, setProfile] = useState<any>(null)
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (id) fetchPublicData()
    }, [id])

    const fetchPublicData = async () => {
        try {
            const { createClient } = await import('@/utils/supabase/client')
            const supabase = createClient()
            
            // In a real app we'd fetch actual public data here
            // For demo, we are mocking a public lookup
            
            setTimeout(() => {
                setProfile({
                    id,
                    name: 'Alex Reynolds',
                    bio: 'No excuses. Just execution.',
                    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
                    instagram_handle: 'alex.lifts'
                })
                setStats({
                    level: 24,
                    level_label: 'VETERAN',
                    total_workouts: 142
                })
                setLoading(false)
            }, 1000)

        } catch (e) {
            console.error('Failed to load profile', e)
            setLoading(false)
        }
    }

    if (loading) return <DeadliftLoader message="Locating Athlete Data..." />
    if (!profile) return <div className="py-20 text-center text-apex-muted">Athlete not found.</div>

    return (
        <div className="max-w-4xl mx-auto py-8 px-6">
            
            {/* Header Banner area */}
            <div className="card-glass overflow-hidden mb-8">
                <div className="h-48 bg-gradient-to-r from-bg via-black to-bg border-b border-white/5 relative">
                    <div className="absolute inset-0 bg-grid-white/[0.02]" />
                </div>

                <div className="px-8 pb-8 flex flex-col sm:flex-row gap-6 items-start sm:items-end relative -mt-16">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-32 h-32 rounded-2xl bg-black border-4 border-bg overflow-hidden relative">
                            <img src={profile.avatar_url} alt={profile.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-apex-warn text-black rounded-lg transform rotate-3 flex items-center justify-center font-display text-xl border-2 border-bg shadow-lg">
                            {stats?.level}
                        </div>
                    </div>

                    <div className="flex-1 w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-4 sm:mt-0">
                        <div>
                            <h1 className="font-display text-4xl mb-1 flex items-center gap-3">
                                {profile.name}
                                {stats?.level > 20 && <Shield className="w-6 h-6 text-apex-info" />}
                            </h1>
                            <div className="font-mono text-xs text-apex-accent tracking-[3px] uppercase">
                                {stats?.level_label}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="btn-primary px-6 py-2 rounded-xl text-sm flex items-center gap-2">
                                <UserPlus className="w-4 h-4" /> Follow
                            </button>
                            <button className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-sm border border-white/10 transition-colors">
                                <MessageSquare className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                <div className="space-y-6 md:col-span-1">
                    <div className="card-glass p-6">
                        <h3 className="font-mono text-xs text-apex-dim uppercase tracking-[2px] mb-4">About</h3>
                        <p className="font-inter text-sm text-apex-text/90 mb-6">{profile.bio}</p>
                        
                        <div className="space-y-4 border-t border-white/5 pt-4 text-sm font-inter text-apex-muted">
                            <div className="flex items-center gap-3">
                                <MapPin className="w-4 h-4 text-apex-dim" /> <span>Los Angeles, CA</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Award className="w-4 h-4 text-apex-dim" /> <span>{stats.total_workouts} Workouts Logged</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 md:col-span-2">
                     <div className="glass-dark p-6 text-center py-20">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-white/20" />
                        </div>
                        <h3 className="text-apex-text font-inter font-medium mb-1">Activity is hidden</h3>
                        <p className="text-apex-muted text-sm max-w-sm mx-auto">Follow this athlete to see their public workout logs and nutrition PRs.</p>
                     </div>
                </div>

            </div>

        </div>
    )
}
