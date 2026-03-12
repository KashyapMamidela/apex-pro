'use client'

import React from 'react'
import { useState } from 'react'
import { Search, UserPlus, Check, Flame, Dumbbell, Heart, MessageCircle, Trophy } from 'lucide-react'

const friendSuggestions = [
    { id: 1, name: 'Ravi Kumar', username: 'ravifits', level: 'Pro', color: '#ff9d00', xp: 8200, following: false },
    { id: 2, name: 'Arjun Reddy', username: 'arjunfit', level: 'Intermediate', color: '#00d4ff', xp: 4100, following: true },
    { id: 3, name: 'Priya Sharma', username: 'priyaapex', level: 'Amateur', color: '#9d4edd', xp: 2800, following: false },
    { id: 4, name: 'Karthik V', username: 'karthikv', level: 'Rookie', color: '#4ade80', xp: 1200, following: true },
    { id: 5, name: 'Sai Mohan', username: 'sai_gym', level: 'Amateur', color: '#ffd700', xp: 3500, following: false },
]

const activityFeed = [
    { user: 'Ravi Kumar', initial: 'R', color: '#ff9d00', level: 'Pro', action: 'completed', detail: 'Deadlift Day — 140kg PR! 🔥', time: '2 hrs ago', likes: 24, type: 'workout' },
    { user: 'Arjun Reddy', initial: 'A', color: '#00d4ff', level: 'Intermediate', action: 'hit a streak', detail: '15-day streak milestone reached! 💪', time: '4 hrs ago', likes: 18, type: 'streak' },
    { user: 'Priya Sharma', initial: 'P', color: '#9d4edd', level: 'Amateur', action: 'logged', detail: 'Chest & Shoulders — 8 exercises done', time: '5 hrs ago', likes: 12, type: 'workout' },
    { user: 'Karthik V', initial: 'K', color: '#4ade80', level: 'Rookie', action: 'unlocked', detail: 'Silver Badge — 7-day streak! 🥈', time: 'Yesterday', likes: 31, type: 'badge' },
]

const typeIcon: Record<string, React.ReactNode> = {
    workout: <Dumbbell className="w-3.5 h-3.5" />,
    streak: <Flame className="w-3.5 h-3.5" />,
    badge: <Trophy className="w-3.5 h-3.5" />,
}

export default function CommunityPage() {
    const [query, setQuery] = useState('')
    const [following, setFollowing] = useState<Record<number, boolean>>(
        Object.fromEntries(friendSuggestions.map(f => [f.id, f.following]))
    )
    const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({})

    const filtered = friendSuggestions.filter(f =>
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.username.toLowerCase().includes(query.toLowerCase())
    )

    const toggleFollow = (id: number) => setFollowing(prev => ({ ...prev, [id]: !prev[id] }))
    const toggleLike = (i: number) => setLikedPosts(prev => ({ ...prev, [i]: !prev[i] }))

    return (
        <div className="space-y-6 animate-fade-up">
            <header>
                <div className="text-[0.6rem] font-mono tracking-[3px] text-apex-accent uppercase mb-1">SOCIAL HUB</div>
                <h1 className="font-display text-[2rem] font-black tracking-tight uppercase">COMMUNITY</h1>
                <p className="text-apex-muted text-[0.82rem] mt-1">Train together. Push each other.</p>
            </header>

            {/* Stories strip */}
            <div className="bg-card border border-border-main p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    <span className="text-[0.62rem] font-mono tracking-[2px] text-apex-muted uppercase">ACTIVE TODAY</span>
                </div>
                <div className="flex gap-5 overflow-x-auto pb-1">
                    {friendSuggestions.filter(f => following[f.id]).map((f) => (
                        <button key={f.id} className="flex flex-col items-center gap-1.5 shrink-0 group">
                            <div
                                className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-bg text-lg ring-[3px] ring-offset-2 ring-offset-card transition-all group-hover:scale-105"
                                style={{ background: f.color, boxShadow: `0 0 16px ${f.color}44` }}
                            >
                                {f.name[0]}
                            </div>
                            <span className="text-[0.62rem] font-mono text-apex-muted group-hover:text-apex-text transition-colors">{f.name.split(' ')[0]}</span>
                        </button>
                    ))}
                    {friendSuggestions.filter(f => following[f.id]).length === 0 && (
                        <div className="text-[0.75rem] text-apex-dim font-mono py-3">Follow athletes to see their stories</div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Activity Feed */}
                <div className="lg:col-span-2 space-y-3">
                    <div className="text-[0.62rem] font-mono tracking-[2px] text-apex-muted uppercase mb-1">FEED</div>
                    {activityFeed.map((post, i) => (
                        <div key={i} className="bg-card border border-border-main p-5 hover:border-border-sub transition-colors">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-bg" style={{ background: post.color }}>
                                    {post.initial}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-semibold text-[0.85rem]">{post.user}</span>
                                        <span className="text-[0.58rem] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ background: `${post.color}22`, color: post.color }}>
                                            {post.level}
                                        </span>
                                        <span className="text-apex-muted text-[0.72rem]">{post.action}</span>
                                    </div>
                                    <div className="mt-2 p-3 bg-surface-2 border border-border-main text-[0.82rem] text-apex-text">
                                        <div className="flex items-center gap-2">
                                            <span style={{ color: post.color }}>{typeIcon[post.type]}</span>
                                            {post.detail}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-3">
                                        <button
                                            onClick={() => toggleLike(i)}
                                            className="flex items-center gap-1.5 text-[0.72rem] font-mono transition-colors"
                                            style={{ color: likedPosts[i] ? '#ff4545' : 'var(--color-apex-dim)' }}
                                        >
                                            <Heart className={`w-3.5 h-3.5 ${likedPosts[i] ? 'fill-current' : ''}`} />
                                            {post.likes + (likedPosts[i] ? 1 : 0)}
                                        </button>
                                        <button className="flex items-center gap-1.5 text-[0.72rem] font-mono text-apex-dim hover:text-apex-muted transition-colors">
                                            <MessageCircle className="w-3.5 h-3.5" />
                                            Reply
                                        </button>
                                        <span className="text-[0.65rem] text-apex-dim ml-auto">{post.time}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Find Friends */}
                <div className="space-y-4">
                    <div className="text-[0.62rem] font-mono tracking-[2px] text-apex-muted uppercase">FIND ATHLETES</div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apex-dim" />
                        <input
                            type="text"
                            placeholder="Search by name or @username"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="w-full bg-card border border-border-main px-4 py-3 pl-10 text-[0.82rem] text-apex-text placeholder-apex-dim focus:outline-none focus:border-apex-accent transition-colors"
                        />
                    </div>

                    <div className="space-y-2">
                        {filtered.map((f) => (
                            <div key={f.id} className="bg-card border border-border-main p-4 flex items-center gap-3 hover:border-border-sub transition-colors">
                                <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-bg" style={{ background: f.color, boxShadow: `0 0 8px ${f.color}33` }}>
                                    {f.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[0.82rem] font-semibold truncate">{f.name}</div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[0.65rem] text-apex-muted">@{f.username}</span>
                                        <span className="text-[0.55rem] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider" style={{ background: `${f.color}22`, color: f.color }}>
                                            {f.level}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleFollow(f.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 text-[0.7rem] font-mono uppercase tracking-wider transition-all border ${following[f.id]
                                        ? 'border-border-sub text-apex-muted hover:text-apex-danger hover:border-apex-danger/30'
                                        : 'border-apex-accent/40 text-apex-accent hover:bg-apex-accent/10'
                                        }`}
                                >
                                    {following[f.id] ? <><Check className="w-3 h-3" /> Following</> : <><UserPlus className="w-3 h-3" /> Follow</>}
                                </button>
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <div className="text-center py-8 text-apex-muted text-[0.78rem] font-mono uppercase">No athletes found</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
