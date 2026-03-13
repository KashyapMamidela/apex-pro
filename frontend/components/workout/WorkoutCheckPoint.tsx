'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'
import { Trophy, TrendingUp, Zap } from 'lucide-react'

// Basic XP gain modal wrapper. In real use, this wraps the completion screen.
export default function WorkoutCheckPoint({ 
    planId,
    duration,
    xpEst,
    onComplete
}: { 
    planId: string, 
    duration: number, 
    xpEst: number,
    onComplete: () => void 
}) {
    const router = useRouter()
    const [finishing, setFinishing] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleFinish = async () => {
        setFinishing(true)
        
        try {
            // Log it
            const res = await fetch('/api/log-workout', {
                method: 'POST',
                body: JSON.stringify({
                    planId,
                    exercisesCompleted: [], // simplified for demo
                    durationMinutes: duration,
                    xpEarned: xpEst
                })
            })
            const data = await res.json()
            
            if (data.success) {
                // Fire confetti!
                const end = Date.now() + (3 * 1000)
                const colors = ['#FFD400', '#ffffff', '#00d4ff']

                ;(function frame() {
                    confetti({
                        particleCount: 5,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: colors
                    })
                    confetti({
                        particleCount: 5,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: colors
                    })

                    if (Date.now() < end) {
                        requestAnimationFrame(frame)
                    }
                }())

                setResult(data)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setFinishing(false)
        }
    }

    if (result) {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <div className="card-glass max-w-md w-full p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-apex-accent to-apex-info" />
                    
                    <Trophy className="w-20 h-20 text-apex-accent mx-auto mb-6" />
                    <h2 className="font-display text-4xl mb-2">Workout Complete</h2>
                    <p className="text-apex-muted font-inter mb-8">Forge strengthened. Data logged.</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <Zap className="w-6 h-6 text-apex-warn mx-auto mb-2" />
                            <div className="text-2xl font-mono font-bold">+{result.xpAwarded}</div>
                            <div className="text-[0.6rem] text-apex-dim uppercase tracking-widest mt-1">XP Earned</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <TrendingUp className="w-6 h-6 text-apex-info mx-auto mb-2" />
                            <div className="text-2xl font-mono font-bold">Lvl {result.newLevel}</div>
                            <div className="text-[0.6rem] text-apex-dim uppercase tracking-widest mt-1">Current Rank</div>
                        </div>
                    </div>

                    {result.levelUp && (
                        <div className="mb-8 p-3 bg-apex-accent/20 border border-apex-accent/40 rounded-xl text-apex-accent font-inter animate-pulse">
                            Level Up! You are now ranked <strong>{result.newLabel}</strong>.
                        </div>
                    )}

                    <button 
                        onClick={() => {
                            onComplete()
                            router.push('/dashboard/profile')
                        }} 
                        className="btn-primary w-full py-4 text-lg rounded-xl"
                    >
                        Return to Profile
                    </button>
                </div>
            </motion.div>
        )
    }

    return (
        <button 
            onClick={handleFinish}
            disabled={finishing}
            className="btn-primary w-full py-4 text-lg rounded-2xl relative overflow-hidden group disabled:opacity-50"
        >
            <span className="relative z-10 flex items-center justify-center gap-2">
                {finishing ? (
                    <>Logging Data...</>
                ) : (
                    <><Trophy className="w-5 h-5" /> Finish & Claim XP</>
                )}
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
        </button>
    )
}
