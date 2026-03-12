'use client'

import { motion } from 'framer-motion'
import { Heart, MessageCircle, Trophy } from 'lucide-react'

const posts = [
    {
        name: 'Ravi K.',
        tag: '@ravifits',
        init: 'R',
        color: '#FFD400',
        time: '2h ago',
        text: 'Hit a 120kg deadlift PR today after 8 weeks on the Apex program 🔥 The progressive overload is 100% real.',
        likes: 48,
        comments: 12,
        badge: 'Intermediate',
        badgeCls: 'badge-intermediate',
    },
    {
        name: 'Priya S.',
        tag: '@priyaactive',
        init: 'P',
        color: '#9d4edd',
        time: '5h ago',
        text: 'Week 4 transformation check! Down 4kg, up in strength. The South Indian meal plan is 🔑 — actually tastes good!',
        likes: 91,
        comments: 24,
        badge: 'Rookie',
        badgeCls: 'badge-rookie',
    },
    {
        name: 'Arjun M.',
        tag: '@arjunelite',
        init: 'A',
        color: '#00d4ff',
        time: '1d ago',
        text: 'Reached Advanced rank today! 3500 XP grind. Apex tracking helped me stay consistent for 3 months straight.',
        likes: 134,
        comments: 37,
        badge: 'Advanced',
        badgeCls: 'badge-advanced',
    },
]

export default function Community() {
    return (
        <section id="community" className="py-28 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-surface/20" />

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                    className="text-center mb-16"
                >
                    <div className="text-[0.65rem] font-mono tracking-[3px] text-apex-accent uppercase mb-3">
                        Real athletes, real results
                    </div>
                    <h2 className="font-display text-[2.8rem] md:text-[3.5rem] font-black text-apex-text leading-tight mb-4">
                        The <span className="text-apex-accent">Apex Community</span>
                    </h2>
                    <p className="text-apex-muted text-[1rem] font-inter max-w-lg mx-auto">
                        50,000+ athletes sharing PRs, progress photos, and holding each other accountable.
                    </p>
                </motion.div>

                {/* Post cards */}
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    transition={{ staggerChildren: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12"
                >
                    {posts.map(({ name, tag, init, color, time, text, likes, comments, badge, badgeCls }) => (
                        <motion.div
                            key={name}
                            variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={{ y: -4 }}
                            className="glass p-5 rounded-2xl"
                        >
                            {/* Avatar row */}
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-black text-[0.85rem] shrink-0"
                                    style={{ background: color }}
                                >
                                    {init}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[0.85rem] font-display font-semibold text-apex-text">{name}</div>
                                    <div className="text-apex-dim text-[0.7rem] font-mono">{tag}</div>
                                </div>
                                <span className={`text-[0.6rem] font-mono px-2 py-0.5 rounded-full ${badgeCls}`}>{badge}</span>
                            </div>

                            {/* Post text */}
                            <p className="text-apex-muted text-[0.82rem] font-inter leading-relaxed mb-4">{text}</p>

                            {/* Footer */}
                            <div className="flex items-center gap-5 text-apex-dim text-[0.72rem] font-inter">
                                <button className="flex items-center gap-1.5 hover:text-apex-accent transition-colors">
                                    <Heart className="w-3.5 h-3.5" /> {likes}
                                </button>
                                <button className="flex items-center gap-1.5 hover:text-apex-info transition-colors">
                                    <MessageCircle className="w-3.5 h-3.5" /> {comments}
                                </button>
                                <span className="ml-auto">{time}</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-2 text-apex-muted text-[0.85rem] font-inter mb-6">
                        <Trophy className="w-4 h-4 text-apex-accent" />
                        Join 50,000+ athletes already in the forge
                    </div>
                    <div className="block">
                        <a href="/signup" className="btn-primary px-10 py-4 text-[1rem] rounded-2xl inline-block">
                            Join the Community
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
