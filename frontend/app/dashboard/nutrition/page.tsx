'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Apple, Utensils, Droplets, Flame, BrainCircuit, CheckCircle2, ChevronRight } from 'lucide-react'
import DeadliftLoader from '@/components/ui/DeadliftLoader'

export default function NutritionDashboard() {
    const [plan, setPlan] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [water, setWater] = useState(0)
    const [swappingMeal, setSwappingMeal] = useState<number | null>(null)
    const [swapInput, setSwapInput] = useState('')
    const [swapping, setSwapping] = useState(false)

    const [profile, setProfile] = useState<any>(null)

    useEffect(() => {
        init()
    }, [])

    const swapMeal = async (mealIndex: number) => {
        if (!swapInput.trim() || !plan) return
        setSwapping(true)
        try {
            const res = await fetch('/api/swap-meal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    originalMeal: plan.meals[mealIndex],
                    userRequest: swapInput,
                    userProfile: profile
                })
            })
            const data = await res.json()
            if (data.meal) {
                const updatedMeals = [...plan.meals]
                updatedMeals[mealIndex] = data.meal
                setPlan({ ...plan, meals: updatedMeals })
                setSwappingMeal(null)
                setSwapInput('')
            }
        } catch (e) {
            console.error(e)
        }
        setSwapping(false)
    }

    const init = async () => {
        setLoading(true)
        try {
            const { createClient } = await import('@/utils/supabase/client')
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { setLoading(false); return }

            // Get profile from Supabase
            const { data: profileData } = await supabase
                .from('profiles')
                .select('name, goal, weight, height, age, gender, body_type')
                .eq('id', user.id)
                .single()

            // Merge with localStorage for session-specific fields
            const local = JSON.parse(localStorage.getItem('apex_athlete_profile') || '{}')
            const merged = {
                name: profileData?.name || user.user_metadata?.name || local.name || 'Athlete',
                goal: profileData?.goal || local.goal || 'general_fitness',
                weight: profileData?.weight || local.weight || 70,
                height: profileData?.height || local.height || 170,
                age: profileData?.age || local.age || 25,
                gender: profileData?.gender || local.gender || 'unspecified',
                activity_level: profileData?.body_type || local.activity || 'lightly_active',
                diet: local.diet || 'flex',
                workout_days: local.days || 3,
            }
            setProfile(merged)

            // Get latest active diet plan
            const { data } = await supabase
                .from('ai_plans')
                .select('plan_json')
                .eq('user_id', user.id)
                .eq('plan_type', 'diet')
                .order('generated_at', { ascending: false })
                .limit(1)
                .maybeSingle()

            if (data?.plan_json) {
                setPlan(data.plan_json)
            }
        } catch (e) {
            console.error('Init error:', e)
        } finally {
            setLoading(false)
        }
    }

    const generateNewPlan = async () => {
        if (!profile) return
        setGenerating(true)
        try {
            const res = await fetch('/api/generate-nutrition', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userProfile: profile,
                    answers: { preference: profile.diet || 'flexible' }
                })
            })
            const data = await res.json()
            if (data.plan) {
                setPlan(data.plan)
            } else if (data.error) {
                console.error('Generation error:', data.error)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setGenerating(false)
        }
    }

    if (loading) return <DeadliftLoader message="Loading Nutrition Data..." />

    if (generating) return <DeadliftLoader message="Calculating Macros & Designing Menu..." />

    if (!plan) {
        return (
            <div className="max-w-3xl mx-auto py-20 px-6 text-center">
                <BrainCircuit className="w-16 h-16 text-apex-accent mx-auto mb-6" />
                <h1 className="font-display text-5xl mb-4">Apex <span className="text-apex-accent">Nutrition</span></h1>
                <p className="text-apex-muted font-inter mb-10 max-w-md mx-auto">
                    No active diet plan found. Let the AI analyze your metrics and forge a precision meal protocol.
                </p>
                <button onClick={generateNewPlan} className="btn-primary py-4 px-8 text-lg rounded-xl inline-flex items-center gap-2">
                    <Flame className="w-5 h-5" /> Generate Diet Protocol
                </button>
            </div>
        )
    }

    const totalWaterCalc = plan.water_oz || 100
    const waterPerc = Math.min(100, Math.round((water / totalWaterCalc) * 100))

    return (
        <div className="max-w-5xl mx-auto py-8 px-6">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="font-display text-4xl mb-2 flex items-center gap-3">
                        <Apple className="text-apex-accent w-8 h-8" />
                        Daily <span className="text-apex-accent">Fuel</span>
                    </h1>
                    <p className="text-apex-muted text-sm font-inter">Personalized for {profile?.name || 'you'} · {(profile?.goal || 'your fitness goals').replace('_', ' ')}</p>
                </div>
                <button onClick={generateNewPlan} className="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-widest text-apex-dim transition-colors transition-colors">
                    Regenerate Plan
                </button>
            </header>

            {/* Macros Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="card-glass p-5 text-center border-t-2 border-t-apex-warn">
                    <Flame className="w-5 h-5 text-apex-warn mx-auto mb-2" />
                    <div className="font-display text-3xl">{plan.total_calories}</div>
                    <div className="text-[0.65rem] font-mono text-apex-dim uppercase tracking-widest mt-1">Calories</div>
                </div>
                <div className="card-glass p-5 text-center border-t-2 border-t-apex-info">
                    <div className="text-apex-info font-bold mb-2 text-sm">PRO</div>
                    <div className="font-display text-3xl">{plan.protein_g}g</div>
                    <div className="text-[0.65rem] font-mono text-apex-dim uppercase tracking-widest mt-1">Protein</div>
                </div>
                <div className="card-glass p-5 text-center border-t-2 border-t-apex-accent">
                    <div className="text-apex-accent font-bold mb-2 text-sm">CARB</div>
                    <div className="font-display text-3xl">{plan.carbs_g}g</div>
                    <div className="text-[0.65rem] font-mono text-apex-dim uppercase tracking-widest mt-1">Carbs</div>
                </div>
                <div className="card-glass p-5 text-center border-t-2 border-t-white/20">
                    <div className="text-white/60 font-bold mb-2 text-sm">FAT</div>
                    <div className="font-display text-3xl">{plan.fat_g}g</div>
                    <div className="text-[0.65rem] font-mono text-apex-dim uppercase tracking-widest mt-1">Fat</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Meal Plan */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="font-mono text-xs text-apex-dim uppercase tracking-[3px] mb-4">Today's Protocol</h2>
                    
                    {plan.meals?.map((meal: any, i: number) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="card-glass p-6 group hover:border-apex-accent/40 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-[0.65rem] font-mono text-apex-accent uppercase tracking-widest mb-1">{meal.type}</div>
                                    <h3 className="font-display text-2xl">{meal.name}</h3>
                                </div>
                                <div className="text-right flex items-start gap-2">
                                    <div>
                                        <div className="font-mono font-bold text-lg text-apex-warn">{meal.calories}</div>
                                        <div className="text-[0.6rem] text-apex-dim uppercase">kcal</div>
                                    </div>
                                    <button
                                        onClick={() => setSwappingMeal(swappingMeal === i ? null : i)}
                                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-apex-accent/20 hover:border-apex-accent/50 transition-all flex items-center justify-center text-apex-muted hover:text-apex-accent text-lg leading-none ml-2"
                                        title="Swap this meal"
                                    >+</button>
                                </div>
                            </div>
                            
                            <div className="flex gap-4 mb-4 text-xs font-mono text-apex-muted bg-black/40 p-3 rounded-lg w-max">
                                <span>P: <strong className="text-white">{meal.macros.protein}g</strong></span>
                                <span>C: <strong className="text-white">{meal.macros.carbs}g</strong></span>
                                <span>F: <strong className="text-white">{meal.macros.fat}g</strong></span>
                            </div>

                            <ul className="space-y-1 mb-4">
                                {meal.ingredients.map((ing: string, idx: number) => (
                                    <li key={idx} className="text-sm font-inter text-apex-text/80 flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-apex-accent/60" /> {ing}
                                    </li>
                                ))}
                            </ul>

                            {meal.recipe_tip && (
                                <div className="text-xs font-inter text-apex-info/80 bg-apex-info/10 p-3 rounded-lg border border-apex-info/20">
                                    <strong>Chef AI:</strong> {meal.recipe_tip}
                                </div>
                            )}

                            {swappingMeal === i && (
                                <div className="mt-4 p-4 bg-black/40 rounded-xl border border-apex-accent/20">
                                    <div className="text-[0.65rem] font-mono text-apex-accent uppercase tracking-wider mb-2">Replace with something else</div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={swapInput}
                                            onChange={e => setSwapInput(e.target.value)}
                                            placeholder="e.g. I want something with eggs..."
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-inter focus:border-apex-accent focus:outline-none"
                                            onKeyDown={e => { if (e.key === 'Enter') swapMeal(i) }}
                                        />
                                        <button
                                            onClick={() => swapMeal(i)}
                                            disabled={swapping || !swapInput.trim()}
                                            className="btn-primary px-4 py-2 text-xs rounded-lg disabled:opacity-40"
                                        >{swapping ? '...' : 'Swap'}</button>
                                    </div>
                                </div>
                            )}
                            
                            <button className="mt-4 w-full py-2 border border-white/10 rounded-lg text-xs font-inter hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-apex-dim group-hover:text-apex-accent transition-colors" /> Mark Eaten
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Right: Water & Utils */}
                <div className="space-y-6">
                    <div className="card-glass p-6 text-center">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-mono text-xs text-apex-info uppercase tracking-widest flex items-center gap-2">
                                <Droplets className="w-4 h-4" /> Hydration
                            </h3>
                            <span className="text-xs text-apex-muted">{water} / {totalWaterCalc} oz</span>
                        </div>
                        
                        <div className="relative w-32 h-32 mx-auto mb-6">
                            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                                <motion.circle 
                                    cx="50" cy="50" r="45" fill="none" stroke="#00d4ff" strokeWidth="6"
                                    strokeDasharray="283"
                                    strokeDashoffset={283 - (283 * (Math.min(100, Math.round((water / totalWaterCalc) * 100)))) / 100}
                                    strokeLinecap="round"
                                    initial={{ strokeDashoffset: 283 }}
                                    animate={{ strokeDashoffset: 283 - (283 * (Math.min(100, Math.round((water / totalWaterCalc) * 100)))) / 100 }}
                                    transition={{ duration: 1 }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="font-display text-3xl">{Math.min(100, Math.round((water / totalWaterCalc) * 100))}%</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setWater(w => Math.max(0, w - 8))} className="btn-ghost py-2 text-xs rounded-lg">- 8 oz</button>
                            <button onClick={() => setWater(w => Math.min(totalWaterCalc, w + 8))} className="bg-apex-info/20 hover:bg-apex-info/30 text-apex-info py-2 text-xs rounded-lg transition-colors">+ 8 oz</button>
                        </div>
                    </div>

                    <div className="card-glass p-6">
                        <h3 className="font-mono text-xs text-apex-dim uppercase tracking-widest flex items-center gap-2 mb-4">
                            <Utensils className="w-4 h-4" /> Quick Log
                        </h3>
                        <input 
                            type="text" 
                            placeholder="e.g. 1 apple, 2 eggs..." 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-inter mb-3 focus:border-apex-accent focus:outline-none transition-colors"
                        />
                        <button className="btn-primary w-full py-2.5 text-sm rounded-xl">Analyze & Log</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
