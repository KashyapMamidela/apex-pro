'use client'

import { motion } from 'framer-motion'

export default function DeadliftLoader({ message = 'Loading...' }: { message?: string }) {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center glass-dark">

            {/* Animated deadlift SVG silhouette */}
            <div className="relative mb-10">
                {/* Body groups that animate */}
                <svg width="140" height="180" viewBox="0 0 140 180" fill="none">

                    {/* BARBELL — stays roughly at hip level */}
                    <motion.g
                        animate={{ y: [0, 26, 26, 0, -4, 0] }}
                        transition={{ duration: 1.9, ease: [0.4, 0, 0.6, 1], repeat: Infinity, repeatDelay: 0.2 }}
                    >
                        {/* Bar */}
                        <rect x="10" y="92" width="120" height="6" rx="3" fill="#FFD400" opacity="0.95" />
                        {/* Left plates */}
                        <rect x="10" y="81" width="14" height="28" rx="4" fill="#FFD400" />
                        <rect x="24" y="85" width="9" height="20" rx="3" fill="#e6bf00" />
                        {/* Right plates */}
                        <rect x="116" y="81" width="14" height="28" rx="4" fill="#FFD400" />
                        <rect x="107" y="85" width="9" height="20" rx="3" fill="#e6bf00" />
                    </motion.g>

                    {/* BODY (hips down, then standing) */}
                    <motion.g
                        animate={{
                            y: [0, 10, 10, 0, -3, 0],
                            scaleY: [1, 0.95, 0.95, 1, 1.02, 1],
                        }}
                        style={{ transformOrigin: '70px 150px' }}
                        transition={{ duration: 1.9, ease: [0.4, 0, 0.6, 1], repeat: Infinity, repeatDelay: 0.2 }}
                    >
                        {/* Head */}
                        <circle cx="70" cy="28" r="16" fill="#eeeeee" />

                        {/* Torso */}
                        <motion.rect
                            x="52" y="44" width="36" height="52" rx="8"
                            fill="#dddddd" opacity="0.92"
                            animate={{ skewX: [0, 4, 4, 0, 0, 0] }}
                            transition={{ duration: 1.9, ease: [0.4, 0, 0.6, 1], repeat: Infinity, repeatDelay: 0.2 }}
                        />

                        {/* Left arm */}
                        <motion.rect
                            x="34" y="50" width="18" height="36" rx="8" fill="#dddddd" opacity="0.85"
                            animate={{ rotate: [0, 18, 18, 0, 0, 0] }}
                            style={{ transformOrigin: '43px 50px' }}
                            transition={{ duration: 1.9, ease: [0.4, 0, 0.6, 1], repeat: Infinity, repeatDelay: 0.2 }}
                        />
                        {/* Right arm */}
                        <motion.rect
                            x="88" y="50" width="18" height="36" rx="8" fill="#dddddd" opacity="0.85"
                            animate={{ rotate: [0, -18, -18, 0, 0, 0] }}
                            style={{ transformOrigin: '97px 50px' }}
                            transition={{ duration: 1.9, ease: [0.4, 0, 0.6, 1], repeat: Infinity, repeatDelay: 0.2 }}
                        />

                        {/* Left leg */}
                        <motion.rect
                            x="53" y="94" width="16" height="44" rx="7" fill="#dddddd"
                            animate={{ rotate: [0, -12, -12, 0, 0, 0] }}
                            style={{ transformOrigin: '61px 94px' }}
                            transition={{ duration: 1.9, ease: [0.4, 0, 0.6, 1], repeat: Infinity, repeatDelay: 0.2 }}
                        />
                        {/* Left shoe */}
                        <motion.rect
                            x="50" y="136" width="20" height="10" rx="4" fill="#FFD400" opacity="0.85"
                            animate={{ rotate: [0, -8, -8, 0, 0, 0] }}
                            style={{ transformOrigin: '60px 136px' }}
                            transition={{ duration: 1.9, ease: [0.4, 0, 0.6, 1], repeat: Infinity, repeatDelay: 0.2 }}
                        />
                        {/* Right leg */}
                        <motion.rect
                            x="71" y="94" width="16" height="44" rx="7" fill="#dddddd"
                            animate={{ rotate: [0, 12, 12, 0, 0, 0] }}
                            style={{ transformOrigin: '79px 94px' }}
                            transition={{ duration: 1.9, ease: [0.4, 0, 0.6, 1], repeat: Infinity, repeatDelay: 0.2 }}
                        />
                        {/* Right shoe */}
                        <motion.rect
                            x="70" y="136" width="20" height="10" rx="4" fill="#FFD400" opacity="0.85"
                            animate={{ rotate: [0, 8, 8, 0, 0, 0] }}
                            style={{ transformOrigin: '80px 136px' }}
                            transition={{ duration: 1.9, ease: [0.4, 0, 0.6, 1], repeat: Infinity, repeatDelay: 0.2 }}
                        />
                    </motion.g>

                    {/* Ground shadow */}
                    <motion.ellipse
                        cx="70" cy="168" rx="32" ry="6"
                        fill="#FFD400" opacity="0.15"
                        animate={{ scaleX: [1, 0.75, 0.75, 1, 1.05, 1], opacity: [0.15, 0.3, 0.3, 0.15, 0.1, 0.15] }}
                        transition={{ duration: 1.9, ease: [0.4, 0, 0.6, 1], repeat: Infinity, repeatDelay: 0.2 }}
                    />
                </svg>

                {/* Yellow glow under figure */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-8 rounded-full blur-xl opacity-30"
                    style={{ background: '#FFD400' }} />
            </div>

            {/* Message + dots */}
            <div className="text-center">
                <p className="font-display text-[1.05rem] font-semibold text-apex-text tracking-wide mb-3">{message}</p>
                <div className="flex items-center justify-center gap-2">
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-apex-accent"
                            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 0.9, delay: i * 0.2, repeat: Infinity }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
