'use client'

import { useEffect, useState } from 'react'
import {
    User,
    Bell,
    Shield,
    Smartphone,
    CreditCard,
    Save
} from 'lucide-react'

export default function SettingsPage() {
    const [name, setName] = useState('ATHLETE')
    const [email, setEmail] = useState('athlete@apex.com')
    const [level, setLevel] = useState('Intermediate')
    const [equipment, setEquipment] = useState('Full Gym')
    const [goal, setGoal] = useState('Muscle Gain')
    const [age, setAge] = useState('25')
    const [height, setHeight] = useState('175')
    const [weight, setWeight] = useState('70')
    const [activityLevel, setActivityLevel] = useState('Moderate')
    const [dietType, setDietType] = useState('Non-Veg')
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem('apex_athlete_profile')
        if (saved) {
            try {
                const data = JSON.parse(saved)
                setName(data.name || 'ATHLETE')
                setLevel(data.level || 'Intermediate')
                setEquipment(data.equipment || 'Full Gym')
                setGoal(data.goal || 'Muscle Gain')
                setAge(data.age || '25')
                setHeight(data.height || '175')
                setWeight(data.weight || '70')
                setActivityLevel(data.activityLevel || 'Moderate')
                setDietType(data.dietType || 'Non-Veg')
            } catch (e) {
                console.error("Failed to parse profile", e)
            }
        }
    }, [])

    const handleSave = () => {
        setIsSaving(true)
        const profile = {
            name, level, equipment, goal,
            age, height, weight, activityLevel, dietType
        }
        localStorage.setItem('apex_athlete_profile', JSON.stringify(profile))

        // Brief delay for UX
        setTimeout(() => {
            setIsSaving(false)
            alert('SYSTEM CONFIGURATION UPDATED')
        }, 600)
    }

    return (
        <div className="space-y-8 animate-fade-up max-w-4xl">
            <header>
                <div className="text-[0.65rem] font-mono tracking-[3px] text-apex-accent uppercase mb-1.5">
                    SYSTEM CONFIGURATION
                </div>
                <h1 className="font-display text-[2.6rem] tracking-[1px] uppercase">
                    ACCOUNT <em className="text-apex-accent not-italic">SETTINGS</em>
                </h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8">
                {/* Settings Nav */}
                <div className="space-y-1">
                    {[
                        { name: 'Profile', icon: <User className="w-4 h-4" />, active: true },
                        { name: 'Notifications', icon: <Bell className="w-4 h-4" />, active: false },
                        { name: 'Security', icon: <Shield className="w-4 h-4" />, active: false },
                        { name: 'Integrations', icon: <Smartphone className="w-4 h-4" />, active: false },
                        { name: 'Billing', icon: <CreditCard className="w-4 h-4" />, active: false },
                    ].map((item) => (
                        <button
                            key={item.name}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-[0.85rem] font-medium transition-all ${item.active
                                ? 'bg-apex-accent text-bg'
                                : 'text-apex-muted hover:text-apex-text hover:bg-white/5'
                                }`}
                        >
                            {item.icon}
                            {item.name}
                        </button>
                    ))}
                </div>

                {/* Settings Form */}
                <div className="bg-card border border-border-main p-8 space-y-8">
                    <section className="space-y-6">
                        <h3 className="font-display text-xl tracking-[1px] uppercase border-b border-border-main pb-4">PERSONAL IDENTIFIERS</h3>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-[0.65rem] font-mono text-apex-muted uppercase tracking-[2px]">FULL NAME</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-surface border border-border-main p-3 text-[0.9rem] text-apex-text outline-none focus:border-apex-accent transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[0.65rem] font-mono text-apex-muted uppercase tracking-[2px]">EMAIL ADDRESS</label>
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full bg-surface/50 border border-border-main p-3 text-[0.9rem] text-apex-muted outline-none cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h3 className="font-display text-xl tracking-[1px] uppercase border-b border-border-main pb-4">PHYSICAL METRICS</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[0.65rem] font-mono text-apex-muted uppercase tracking-[2px]">GOAL</label>
                                <select
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                    className="w-full bg-surface border border-border-main p-3 text-[0.9rem] text-apex-text outline-none focus:border-apex-accent appearance-none"
                                >
                                    <option>Muscle Gain</option>
                                    <option>Fat Loss</option>
                                    <option>Strength</option>
                                    <option>Endurance</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[0.65rem] font-mono text-apex-muted uppercase tracking-[2px]">LEVEL</label>
                                <select
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                    className="w-full bg-surface border border-border-main p-3 text-[0.9rem] text-apex-text outline-none focus:border-apex-accent appearance-none"
                                >
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                </select>
                            </div>
                            <div className="space-y-2 lg:col-span-2">
                                <label className="text-[0.65rem] font-mono text-apex-muted uppercase tracking-[2px]">EQUIPMENT</label>
                                <select
                                    value={equipment}
                                    onChange={(e) => setEquipment(e.target.value)}
                                    className="w-full bg-surface border border-border-main p-3 text-[0.9rem] text-apex-text outline-none focus:border-apex-accent appearance-none"
                                >
                                    <option>Full Gym</option>
                                    <option>Dumbbells Only</option>
                                    <option>Home Workout</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <h3 className="font-display text-xl tracking-[1px] uppercase border-b border-border-main pb-4">BIO-METRIC DATA</h3>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[0.65rem] font-mono text-apex-muted uppercase tracking-[2px]">AGE</label>
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    className="w-full bg-surface border border-border-main p-3 text-[0.9rem] text-apex-text outline-none focus:border-apex-accent transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[0.65rem] font-mono text-apex-muted uppercase tracking-[2px]">HEIGHT (CM)</label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    className="w-full bg-surface border border-border-main p-3 text-[0.9rem] text-apex-text outline-none focus:border-apex-accent transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[0.65rem] font-mono text-apex-muted uppercase tracking-[2px]">WEIGHT (KG)</label>
                                <input
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    className="w-full bg-surface border border-border-main p-3 text-[0.9rem] text-apex-text outline-none focus:border-apex-accent transition-colors"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[0.65rem] font-mono text-apex-muted uppercase tracking-[2px]">ACTIVITY LEVEL</label>
                                <select
                                    value={activityLevel}
                                    onChange={(e) => setActivityLevel(e.target.value)}
                                    className="w-full bg-surface border border-border-main p-3 text-[0.9rem] text-apex-text outline-none focus:border-apex-accent appearance-none"
                                >
                                    <option>Low</option>
                                    <option>Moderate</option>
                                    <option>High</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[0.65rem] font-mono text-apex-muted uppercase tracking-[2px]">DIET TYPE</label>
                                <select
                                    value={dietType}
                                    onChange={(e) => setDietType(e.target.value)}
                                    className="w-full bg-surface border border-border-main p-3 text-[0.9rem] text-apex-text outline-none focus:border-apex-accent appearance-none"
                                >
                                    <option>Veg</option>
                                    <option>Non-Veg</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <div className="pt-6 border-t border-border-main flex justify-between items-center">
                        <p className="text-[0.7rem] text-apex-muted italic">* Ensure your bio-metrics are accurate for better AI generation.</p>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-apex-accent text-bg px-8 py-3 text-xs font-bold tracking-[2px] uppercase flex items-center gap-2 hover:bg-[#e0ff33] transition-all disabled:opacity-50"
                        >
                            {isSaving ? <span className="animate-pulse">SAVING...</span> : <><Save className="w-4 h-4" /> SAVE CONFIG</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

