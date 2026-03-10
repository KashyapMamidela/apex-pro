'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SquatLoader from '@/components/ui/SquatLoader'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setTimeout(() => {
            if (email && password && fullName) {
                localStorage.setItem('apex_athlete_name', fullName)
                router.push('/onboarding')
            } else {
                setError('Please fill out all required fields')
                setLoading(false)
            }
        }, 1200)
    }

    const handleGoogleSignup = async () => {
        setGoogleLoading(true)
        setError(null)
        setTimeout(() => { router.push('/onboarding') }, 1200)
    }

    if (loading || googleLoading) {
        return <SquatLoader message={googleLoading ? 'Connecting Google...' : 'Creating your account...'} />
    }

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 page-glass-bg text-apex-text overflow-hidden">

            {/* Brand Panel */}
            <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden border-r border-white/5">
                {/* Animated background glow blobs */}
                <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full blur-[120px] opacity-10 pointer-events-none" style={{ background: '#c8ff00' }} />
                <div className="absolute bottom-1/4 right-1/4 w-56 h-56 rounded-full blur-[80px] opacity-06 pointer-events-none" style={{ background: '#00d4ff' }} />

                {/* Deadlift watermark */}
                <div className="absolute bottom-0 right-0 opacity-[0.05] pointer-events-none">
                    <svg width="340" height="420" viewBox="0 0 320 400" fill="white">
                        <ellipse cx="160" cy="60" rx="35" ry="35" />
                        <path d="M160 95 L140 200 L115 300 L145 300 L158 240 L162 240 L175 300 L205 300 L180 200 Z" />
                        <rect x="20" y="170" width="280" height="20" rx="10" />
                        <rect x="0" y="155" width="55" height="50" rx="8" />
                        <rect x="265" y="155" width="55" height="50" rx="8" />
                    </svg>
                </div>

                {/* Logo */}
                <div className="relative z-10">
                    <span className="font-impact text-2xl text-apex-accent tracking-[5px]">APEX</span>
                </div>

                {/* Main copy */}
                <div className="relative z-10">
                    <div className="text-[0.6rem] font-mono tracking-[4px] text-apex-accent uppercase mb-4">Elite Performance System</div>
                    <h1 className="font-impact text-[64px] leading-[0.88] uppercase mb-5">
                        FORGE YOUR<br /><em className="text-apex-accent not-italic">APEX</em>
                    </h1>
                    <p className="text-apex-muted text-[0.88rem] max-w-xs leading-relaxed">
                        Join 50K+ athletes building elite bodies with AI-powered science and precision South Indian nutrition.
                    </p>
                </div>

                {/* Stats */}
                <div className="relative z-10 flex gap-10">
                    {[['24/7', 'Elite Support'], ['AI', 'Precision'], ['50K+', 'Athletes']].map(([num, label]) => (
                        <div key={num}>
                            <div className="font-impact text-[2rem] text-apex-accent">{num}</div>
                            <div className="text-[0.58rem] tracking-[2px] text-apex-muted uppercase font-mono">{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Panel */}
            <div className="flex flex-col items-center justify-center p-8 lg:p-14 overflow-y-auto">
                <div className="w-full max-w-[420px]">
                    <Link href="/" className="flex items-center gap-2 text-apex-muted text-[0.78rem] mb-10 hover:text-apex-text transition-colors font-grotesk">
                        <ChevronLeft className="w-4 h-4" /> Back to Home
                    </Link>

                    {/* Title */}
                    <div className="mb-8">
                        <h2 className="font-satoshi text-[2.8rem] font-bold leading-[0.9] mb-2">
                            Join the<br /><span className="text-apex-accent">Forge</span>
                        </h2>
                        <p className="text-apex-muted text-[0.82rem] font-dm-sans leading-relaxed">
                            Quick sign up — we'll customize your plan right after.
                        </p>
                    </div>

                    {/* Google Sign Up */}
                    <button
                        onClick={handleGoogleSignup}
                        disabled={googleLoading}
                        className="btn-glass-outline w-full flex items-center justify-center gap-3 py-3.5 mb-5 text-[0.85rem] font-grotesk font-medium"
                    >
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 h-px bg-border-main" />
                        <span className="text-[0.6rem] font-mono text-apex-dim uppercase tracking-wider">or email</span>
                        <div className="flex-1 h-px bg-border-main" />
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        {[
                            { label: 'Athlete Name', type: 'text', placeholder: 'Full Name', value: fullName, setter: setFullName },
                            { label: 'Email', type: 'email', placeholder: 'athlete@apex.com', value: email, setter: setEmail },
                            { label: 'Password', type: 'password', placeholder: '••••••••', value: password, setter: setPassword },
                        ].map(({ label, type, placeholder, value, setter }) => (
                            <div key={label} className="flex flex-col gap-1.5">
                                <label className="text-[0.58rem] font-mono text-apex-muted uppercase tracking-[2px]">{label}</label>
                                <input
                                    type={type}
                                    placeholder={placeholder}
                                    value={value}
                                    onChange={e => setter(e.target.value)}
                                    required
                                    className="input-glass w-full px-4 py-3.5 text-[0.88rem]"
                                />
                            </div>
                        ))}

                        {error && <p className="text-apex-danger text-[0.8rem] font-grotesk bg-red-500/10 px-3 py-2 rounded-xl border border-red-500/20">{error}</p>}

                        <button type="submit" disabled={loading} className="btn-glass w-full py-4 text-[0.88rem] mt-2">
                            Create Account →
                        </button>
                    </form>

                    <p className="text-center mt-6 text-[0.78rem] text-apex-muted font-grotesk">
                        Already an athlete?{' '}
                        <Link href="/login" className="text-apex-accent hover:underline font-medium">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
