'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, Save, Edit2, Star, Zap, Shield, Trophy, Crown, Flame } from 'lucide-react'
import { SpinnerSmall } from '@/components/ui/LoadingBarbell'

// Level system — same thresholds as dashboard
const LEVELS = [
    { label: 'BEGINNER', min: 0, max: 500, color: '#4ade80', icon: <Star className="w-5 h-5" />, desc: 'Every champion starts here.' },
    { label: 'ROOKIE', min: 500, max: 1500, color: '#00d4ff', icon: <Shield className="w-5 h-5" />, desc: 'Getting into the rhythm.' },
    { label: 'AMATEUR', min: 1500, max: 3500, color: '#ffd700', icon: <Zap className="w-5 h-5" />, desc: 'Discipline is shaping you.' },
    { label: 'INTERMEDIATE', min: 3500, max: 7000, color: '#ff9d00', icon: <Flame className="w-5 h-5" />, desc: 'You outwork most people.' },
    { label: 'PRO', min: 7000, max: 15000, color: '#ff4545', icon: <Trophy className="w-5 h-5" />, desc: 'Elite mindset unlocked.' },
    { label: 'ELITE', min: 15000, max: 20000, color: '#c8ff00', icon: <Crown className="w-5 h-5" />, desc: 'You are the apex predator.' },
]

function getLevelInfo(xp: number) {
    return LEVELS.find(l => xp >= l.min && xp < l.max) || LEVELS[LEVELS.length - 1]
}

type ProfileForm = {
    name: string
    age: string
    height: string
    weight: string
    goal: string
    level: string
    equipment: string
    activity: string
    dietType: string
}

const defaultForm: ProfileForm = {
    name: '', age: '', height: '', weight: '',
    goal: 'Muscle Gain', level: 'Intermediate',
    equipment: 'Full Gym', activity: 'Moderate', dietType: 'Non-Veg',
}

export default function ProfilePage() {
    const [form, setForm] = useState<ProfileForm>(defaultForm)
    const [photo, setPhoto] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [editing, setEditing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const xp = 850
    const level = getLevelInfo(xp)
    const xpPct = Math.min(100, Math.round(((xp - level.min) / (level.max - level.min)) * 100))

    useEffect(() => {
        const saved = localStorage.getItem('apex_athlete_profile')
        if (saved) {
            try { setForm(f => ({ ...f, ...JSON.parse(saved) })) } catch { }
        }
        const savedPhoto = localStorage.getItem('apex_profile_photo')
        if (savedPhoto) setPhoto(savedPhoto)
    }, [])

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = ev => {
            const src = ev.target?.result as string
            setPhoto(src)
            localStorage.setItem('apex_profile_photo', src)
        }
        reader.readAsDataURL(file)
    }

    const handleSave = async () => {
        setSaving(true)
        await new Promise(r => setTimeout(r, 900))
        localStorage.setItem('apex_athlete_profile', JSON.stringify(form))
        setSaving(false)
        setSaved(true)
        setEditing(false)
        setTimeout(() => setSaved(false), 2500)
    }

    const bmi = form.height && form.weight
        ? (Number(form.weight) / Math.pow(Number(form.height) / 100, 2)).toFixed(1)
        : null

    const bodyType = bmi
        ? Number(bmi) < 18.5 ? 'Skinny' : Number(bmi) < 25 ? 'Athletic' : Number(bmi) < 30 ? 'Overweight' : 'Obese'
        : null

    return (
        <div className="space-y-6 animate-fade-up">
            {/* Header */}
            <div className="text-[0.6rem] font-mono tracking-[3px] text-apex-accent uppercase mb-1">MY PROFILE</div>

            {/* === LEVEL BANNER === */}
            <div
                className="relative overflow-hidden border p-6"
                style={{
                    background: `linear-gradient(135deg, ${level.color}12 0%, var(--color-card) 60%)`,
                    borderColor: `${level.color}44`,
                }}
            >
                {/* Animated glow pulse ring behind level icon */}
                <div
                    className="absolute top-4 right-6 w-24 h-24 rounded-full opacity-10 blur-xl"
                    style={{ background: level.color, animation: 'glow-pulse 2.5s ease-in-out infinite' }}
                />

                <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Big level icon */}
                    <div
                        className="w-16 h-16 rounded-sm flex items-center justify-center shrink-0"
                        style={{
                            background: `${level.color}20`,
                            color: level.color,
                            border: `2px solid ${level.color}44`,
                            boxShadow: `0 0 20px ${level.color}33`,
                        }}
                    >
                        <span style={{ transform: 'scale(1.5)' }}>{level.icon}</span>
                    </div>

                    <div className="flex-1">
                        <div className="text-[0.58rem] font-mono tracking-[3px] text-apex-muted uppercase mb-1">FITNESS LEVEL</div>
                        <div
                            className="font-impact text-[2.2rem] leading-none tracking-wide"
                            style={{ color: level.color, textShadow: `0 0 30px ${level.color}55` }}
                        >
                            {level.label}
                        </div>
                        <div className="text-[0.78rem] text-apex-muted mt-1">{level.desc}</div>

                        {/* XP bar */}
                        <div className="mt-3">
                            <div className="flex justify-between mb-1">
                                <span className="text-[0.6rem] font-mono text-apex-dim">{xp} XP</span>
                                <span className="text-[0.6rem] font-mono text-apex-dim">{level.max} XP to next tier</span>
                            </div>
                            <div className="h-2 bg-surface-2 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${xpPct}%`,
                                        background: `linear-gradient(90deg, ${level.color}66, ${level.color})`,
                                        boxShadow: `0 0 8px ${level.color}66`,
                                        transition: 'width 1s cubic-bezier(0.22,1,0.36,1)',
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Level rank grid */}
                    <div className="hidden lg:flex flex-col gap-1">
                        {LEVELS.map((l) => (
                            <div
                                key={l.label}
                                className="flex items-center gap-2 text-[0.6rem] font-mono"
                                style={{ color: l.label === level.label ? l.color : 'var(--color-apex-dim)' }}
                            >
                                <div
                                    className="w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{ background: l.label === level.label ? l.color : 'var(--color-border-sub)' }}
                                />
                                {l.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Profile Photo + Quick Stats */}
                <div className="space-y-4">

                    {/* Photo upload */}
                    <div className="bg-card border border-border-main p-6 flex flex-col items-center">
                        <div className="relative mb-4">
                            <div
                                className="w-28 h-28 rounded-full overflow-hidden border-4 flex items-center justify-center font-impact text-3xl text-bg"
                                style={{
                                    borderColor: `${level.color}66`,
                                    background: photo ? 'transparent' : level.color,
                                    boxShadow: `0 0 24px ${level.color}33`,
                                }}
                            >
                                {photo
                                    ? <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                                    : (form.name?.[0] || 'A').toUpperCase()
                                }
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-apex-accent flex items-center justify-center text-bg hover:bg-apex-accent2 transition-colors border-2 border-bg"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoChange}
                            />
                        </div>
                        <div className="font-display text-lg font-bold">{form.name || 'Your Name'}</div>
                        <div className="text-[0.68rem] font-mono mt-0.5" style={{ color: level.color }}>
                            {level.label}
                        </div>
                        <div className="text-[0.7rem] text-apex-muted mt-1">{xp} XP total</div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="mt-4 text-[0.7rem] font-mono text-apex-accent uppercase tracking-wider hover:underline"
                        >
                            Change Photo
                        </button>
                    </div>

                    {/* BMI card */}
                    {bmi && (
                        <div className="bg-card border border-border-main p-5">
                            <div className="text-[0.6rem] font-mono text-apex-muted uppercase tracking-[2px] mb-3">BODY ANALYSIS</div>
                            <div className="font-impact text-[2.5rem] leading-none text-apex-accent">{bmi}</div>
                            <div className="text-apex-muted text-[0.72rem] mt-0.5">BMI · {bodyType}</div>
                            <div className="mt-3 text-[0.7rem] text-apex-dim leading-relaxed">
                                {Number(bmi) < 18.5 ? 'Goal: Muscle Gain — caloric surplus recommended' :
                                    Number(bmi) < 25 ? 'Goal: Maintenance — great shape!' :
                                        'Goal: Fat Loss — caloric deficit recommended'}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Form */}
                <div className="lg:col-span-2 bg-card border border-border-main">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border-main">
                        <h2 className="font-display text-[1rem] font-bold uppercase tracking-wide">ATHLETE INFO</h2>
                        <button
                            onClick={() => setEditing(e => !e)}
                            className="flex items-center gap-1.5 text-[0.72rem] font-mono text-apex-muted hover:text-apex-accent transition-colors uppercase tracking-wider"
                        >
                            <Edit2 className="w-3.5 h-3.5" /> {editing ? 'Cancel' : 'Edit'}
                        </button>
                    </div>

                    <div className="p-6 space-y-5">
                        {/* Text fields */}
                        {[
                            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
                            { key: 'age', label: 'Age', type: 'number', placeholder: '25' },
                            { key: 'height', label: 'Height (cm)', type: 'number', placeholder: '175' },
                            { key: 'weight', label: 'Weight (kg)', type: 'number', placeholder: '75' },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="block text-[0.6rem] font-mono text-apex-muted uppercase tracking-[2px] mb-1.5">
                                    {f.label}
                                </label>
                                <input
                                    type={f.type}
                                    value={form[f.key as keyof ProfileForm]}
                                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                    disabled={!editing}
                                    placeholder={f.placeholder}
                                    className={`w-full bg-surface border px-4 py-3 text-[0.88rem] font-medium text-apex-text placeholder-apex-dim focus:outline-none transition-colors ${editing
                                        ? 'border-border-sub focus:border-apex-accent'
                                        : 'border-transparent cursor-default opacity-80'
                                        }`}
                                />
                            </div>
                        ))}

                        {/* Select fields */}
                        {[
                            { key: 'goal', label: 'Fitness Goal', opts: ['Muscle Gain', 'Fat Loss', 'Maintain'] },
                            { key: 'level', label: 'Exp. Level', opts: ['Beginner', 'Intermediate', 'Advanced'] },
                            { key: 'equipment', label: 'Equipment', opts: ['Full Gym', 'Dumbbells', 'Home'] },
                            { key: 'activity', label: 'Activity Level', opts: ['Low', 'Moderate', 'High'] },
                            { key: 'dietType', label: 'Diet Type', opts: ['Veg', 'Non-Veg'] },
                        ].map(f => (
                            <div key={f.key}>
                                <label className="block text-[0.6rem] font-mono text-apex-muted uppercase tracking-[2px] mb-1.5">
                                    {f.label}
                                </label>
                                <select
                                    value={form[f.key as keyof ProfileForm]}
                                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                    disabled={!editing}
                                    className={`w-full bg-surface border px-4 py-3 text-[0.88rem] font-medium text-apex-text focus:outline-none transition-colors ${editing
                                        ? 'border-border-sub focus:border-apex-accent cursor-pointer'
                                        : 'border-transparent cursor-default opacity-80'
                                        }`}
                                >
                                    {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                            </div>
                        ))}

                        {editing && (
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-apex-accent text-bg font-display font-bold text-[0.88rem] tracking-[2px] uppercase hover:bg-apex-accent2 transition-colors disabled:opacity-60"
                            >
                                {saving ? <SpinnerSmall /> : <Save className="w-4 h-4" />}
                                {saving ? 'SAVING...' : saved ? 'SAVED ✓' : 'SAVE PROFILE'}
                            </button>
                        )}

                        {saved && !editing && (
                            <div className="text-center text-[0.75rem] font-mono text-green-400 animate-fade-in">
                                ✓ Profile saved successfully
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
