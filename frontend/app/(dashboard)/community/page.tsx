'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Heart, Share2, Flame, UserPlus } from 'lucide-react'
import DeadliftLoader from '@/components/ui/DeadliftLoader'
import CreatePostModal from '@/components/dashboard/CreatePostModal'
import Link from 'next/link'

export default function CommunityFeed() {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        fetchPosts()

        let channel: any;
        const setupRealtime = async () => {
            const { createClient } = await import('@/utils/supabase/client')
            const supabase = createClient()
            channel = supabase.channel('realtime_posts')
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_posts' }, () => {
                    fetchPosts()
                })
                .subscribe()
        }
        setupRealtime()

        return () => {
            if (channel) channel.unsubscribe()
        }
    }, [])

    const fetchPosts = async () => {
        try {
            const { createClient } = await import('@/utils/supabase/client')
            const supabase = createClient()
            
            // Format: select post data and perform a join on the profiles table using author_id
            const { data, error } = await supabase
                .from('community_posts')
                .select(`
                    id,
                    content,
                    post_type,
                    created_at,
                    profiles:author_id (
                        id,
                        display_name,
                        avatar_url
                    )
                `)
                .order('created_at', { ascending: false })
                .limit(20)
                
            if (error) throw error

            if (data) {
                const formattedPosts = data.map(post => {
                    const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
                    return {
                        id: post.id,
                        author: { 
                            name: profile?.display_name || 'Unknown Athlete', 
                            rank: 'CHALLENGER', // We'll compute this later 
                            avatar: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.id}` 
                        },
                        content: post.content,
                        likes: 0, // Need likes table join
                        comments: 0, // Need comments table
                        timeAgo: new Date(post.created_at).toLocaleDateString(),
                        type: post.post_type || 'general'
                    }
                })
                setPosts(formattedPosts)
            }
        } catch (e) {
            console.error('Error fetching posts:', e)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <DeadliftLoader message="Loading Feed..." />

    return (
        <div className="max-w-2xl mx-auto py-8">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="font-display text-4xl mb-2">The Forge <span className="text-apex-accent">Feed</span></h1>
                    <p className="text-apex-muted text-sm font-inter">See what other athletes are crushing right now.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary px-4 py-2 flex items-center gap-2 rounded-xl text-sm"
                    >
                        <Flame className="w-4 h-4" /> Drop Update
                    </button>
                    <Link href="/community/discover" className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-inter transition-colors flex items-center gap-2">
                        <UserPlus className="w-4 h-4" /> Discover Hub
                    </Link>
                </div>
            </header>

            <CreatePostModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchPosts(); }} />

            {/* Feed */}
            <div className="space-y-6">
                {posts.map((post, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={post.id} 
                        className="card-glass p-5"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 border border-white/10">
                                    <img src={post.author.avatar} alt={post.author.name} />
                                </div>
                                <div>
                                    <div className="font-inter font-semibold text-sm">{post.author.name}</div>
                                    <div className="font-mono text-[0.6rem] text-apex-accent uppercase tracking-widest">{post.author.rank}</div>
                                </div>
                            </div>
                            <span className="text-xs text-apex-dim font-inter">{post.timeAgo}</span>
                        </div>

                        <p className="font-inter text-sm text-apex-text/90 leading-relaxed mb-4">
                            {post.content}
                        </p>

                        {post.type === 'progress' && (
                            <div className="w-full h-48 bg-white/5 rounded-xl mb-4 border border-white/5 flex items-center justify-center">
                                <span className="text-apex-dim text-xs font-mono">[Photo attached]</span>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t border-white/5 text-apex-muted">
                            <button className="flex items-center gap-2 hover:text-apex-warn transition-colors text-sm">
                                <Heart className="w-4 h-4" /> {post.likes}
                            </button>
                            <button className="flex items-center gap-2 hover:text-apex-text transition-colors text-sm">
                                <MessageSquare className="w-4 h-4" /> {post.comments}
                            </button>
                            <button className="flex items-center gap-2 hover:text-apex-info transition-colors text-sm">
                                <Share2 className="w-4 h-4" /> Share
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
