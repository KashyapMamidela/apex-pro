'use client'

import { motion } from 'framer-motion'
import { Brain, Zap, Target, BarChart3, Users, ShieldCheck } from 'lucide-react'

const features = [
    {
        icon: <Brain className="w-6 h-6" />,
        title: 'AI Workout Engine',
        desc: 'Personalized plans built from your body data, goal, and equipment. Adapts weekly based on progress.',
        accent: '#FFD400',
    },
    {
        icon: <Target className="w-6 h-6" />,
        title: 'Precision Nutrition',
        desc: 'Calorie and macro targets calculated to the gram. South Indian meal plans included.',
        accent: '#00d4ff',
    },
    {
        icon: <BarChart3 className="w-6 h-6" />,
        title: 'Progress Tracking',
        desc: 'Log every set, track PRs, visualize strength curves over time. Built-in body metrics.',
        accent: '#22c55e',
    },
    {
        icon: <Zap className="w-6 h-6" />,
        title: 'XP & Leveling',
        desc: 'Complete workouts to earn XP. Level up from Rookie to Elite. Stay motivated every session.',
        accent: '#ff9d00',
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: 'Community Feed',
        desc: "Share PRs, post progress photos, react to your crew's achievements. Real accountability.",
        accent: '#9d4edd',
    },
    {
        icon: <ShieldCheck className="w-6 h-6" />,
        title: 'Science-Backed',
        desc: 'Every program is grounded in exercise science. Progressive overload. Proper rest periods.',
        accent: '#ff4545',
    },
]

const card = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0 },
}

export default function Features() {
    return (
        <section id="features" className="relative py-28 px-6 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-surface/30" />

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
                        Everything you need
                    </div>
                    <h2 className="font-display text-[2.8rem] md:text-[3.5rem] font-black text-apex-text leading-tight mb-4">
                        Built for{' '}
                        <span className="text-apex-accent">Serious Athletes</span>
                    </h2>
                    <p className="text-apex-muted text-[1rem] font-inter max-w-lg mx-auto leading-relaxed">
                        Not another generic fitness app. Apex adapts to you — your body, your schedule, your food.
                    </p>
                </motion.div>

                {/* Cards grid */}
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ staggerChildren: 0.09 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    {features.map(({ icon, title, desc, accent }) => (
                        <motion.div
                            key={title}
                            variants={card}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={{ y: -5, scale: 1.01 }}
                            className="relative glass p-6 rounded-2xl group cursor-default overflow-hidden"
                        >
                            {/* Hover glow */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                                style={{ background: `radial-gradient(circle at 30% 30%, ${accent}12 0%, transparent 70%)` }}
                            />

                            {/* Icon */}
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                                style={{ background: `${accent}18`, color: accent }}
                            >
                                {icon}
                            </div>

                            <h3 className="font-display text-[1.05rem] font-bold text-apex-text mb-2">
                                {title}
                            </h3>
                            <p className="text-apex-muted text-[0.82rem] font-inter leading-relaxed">
                                {desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
