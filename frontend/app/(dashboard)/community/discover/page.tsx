'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, UserPlus } from 'lucide-react'
import DeadliftLoader from '@/components/ui/DeadliftLoader'
import Link from 'next/link'

export default function DiscoverFriends() {
    const [searchQuery, setSearchQuery] = useState('')
    const [athletes, setAthletes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAthletes()
    }, [searchQuery])

    const fetchAthletes = async () => {
        setLoading(true)
        try {
            const { createClient } = await import('@/utils/supabase/client')
            const supabase = createClient()
            let query = supabase.from('profiles').select('*').limit(20)

            if (searchQuery.trim().length > 0) {
                query = query.ilike('display_name', `%${searchQuery}%`)
            }

            const { data, error } = await query
            if (error) throw error

            if (data) {
                setAthletes(data)
            }
        } catch (e) {
            console.error('Error fetching athletes:', e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-6">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="font-display text-4xl mb-2">Discover <span className="text-apex-accent">Athletes</span></h1>
                    <p className="text-apex-muted text-sm font-inter">Find workout partners, follow elites, and build your squad.</p>
                </div>
                <Link href="/community/feed" className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-inter transition-colors">
                    Back to Feed
                </Link>
            </header>

            <div className="card-glass p-4 mb-8 flex items-center gap-4 sticky top-4 z-20 backdrop-blur-md">
                <Search className="w-5 h-5 text-apex-muted" />
                <input 
                    title="Search Athletes"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name or Instagram handle..."
                    className="w-full bg-transparent border-none outline-none font-inter text-sm placeholder:text-apex-dim"
                />
            </div>

            {loading && athletes.length === 0 ? (
                <DeadliftLoader message="Scanning network..." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {athletes.map((athlete, i) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={athlete.id} 
                            className="card-glass p-6 text-center group"
                        >
                            <div className="w-20 h-20 mx-auto rounded-full bg-black border-2 border-white/10 mb-4 overflow-hidden relative">
                                <img src={athlete.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${athlete.display_name}`} alt={athlete.display_name || 'Athlete'} className="w-full h-full object-cover" />
                            </div>
                            
                            <Link href={`/profile/${athlete.id}`}>
                                <h3 className="font-display text-xl group-hover:text-apex-accent transition-colors">
                                    {athlete.display_name || 'Unknown Athlete'}
                                </h3>
                            </Link>
                            
                            <div className="flex justify-center flex-wrap gap-2 mt-3 mb-5">
                                {athlete.body_type && (
                                    <span className="text-[0.65rem] font-mono text-apex-info bg-apex-info/10 px-2 py-1 rounded-full uppercase tracking-widest">{athlete.body_type}</span>
                                )}
                            </div>

                            <button title="Follow User" className="w-full btn-primary py-2 rounded-xl text-sm flex items-center justify-center gap-2">
                                <UserPlus className="w-4 h-4" /> Follow
                            </button>
                        </motion.div>
                    ))}

                    {athletes.length === 0 && !loading && (
                        <div className="col-span-full text-center py-20 text-apex-muted font-inter">
                            No athletes found matching your search.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
