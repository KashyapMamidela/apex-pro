'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SquatLoader from '@/components/ui/SquatLoader'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setTimeout(() => {
            if (email && password) {
                window.location.href = '/dashboard'
            } else {
                setError('Please enter valid credentials')
                setLoading(false)
            }
        }, 1200)
    }

    if (loading) return <SquatLoader message="Initializing system..." />

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 page-glass-bg text-apex-text overflow-hidden">
            {/* Brand Panel */}
            <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden border-r border-white/5">
                <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full blur-[120px] opacity-10 pointer-events-none" style={{ background: '#c8ff00' }} />
                <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-[80px] opacity-05 pointer-events-none" style={{ background: '#9d4edd' }} />

                <div className="absolute bottom-0 right-0 opacity-[0.04] pointer-events-none">
                    <svg width="340" height="420" viewBox="0 0 320 400" fill="white">
                        <ellipse cx="160" cy="60" rx="35" ry="35" />
                        <path d="M160 95 L140 200 L115 300 L145 300 L158 240 L162 240 L175 300 L205 300 L180 200 Z" />
                        <rect x="20" y="170" width="280" height="20" rx="10" />
                        <rect x="0" y="155" width="55" height="50" rx="8" />
                        <rect x="265" y="155" width="55" height="50" rx="8" />
                    </svg>
                </div>

                <span className="relative z-10 font-impact text-2xl text-apex-accent tracking-[5px]">APEX</span>
                <div className="relative z-10">
                    <div className="text-[0.6rem] font-mono tracking-[4px] text-apex-accent uppercase mb-4">Welcome back, athlete</div>
                    <h1 className="font-impact text-[64px] leading-[0.88] uppercase mb-5">
                        BACK TO<br /><em className="text-apex-accent not-italic">THE FORGE</em>
                    </h1>
                    <p className="text-apex-muted text-[0.88rem] max-w-xs leading-relaxed">
                        Your streak is waiting. Log back in and keep the momentum going.
                    </p>
                </div>
                <div className="relative z-10 flex gap-10">
                    {[['5.0', 'System Rating'], ['100%', 'Secure Tunnel'], ['24/7', 'Support']].map(([num, label]) => (
                        <div key={num}>
                            <div className="font-impact text-[2rem] text-apex-accent">{num}</div>
                            <div className="text-[0.58rem] tracking-[2px] text-apex-muted uppercase font-mono">{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Panel */}
            <div className="flex flex-col items-center justify-center p-8 lg:p-14 overflow-y-auto">
                <div className="w-full max-w-[400px]">
                    <Link href="/" className="flex items-center gap-2 text-apex-muted text-[0.78rem] mb-10 hover:text-apex-text transition-colors font-grotesk">
                        <ChevronLeft className="w-4 h-4" /> Back to Home
                    </Link>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-4 h-4 text-apex-accent" />
                            <span className="text-[0.6rem] font-mono tracking-[3px] text-apex-accent uppercase">Secure Login</span>
                        </div>
                        <h2 className="font-satoshi text-[2.8rem] font-bold leading-[0.9] mb-2">
                            System<br /><span className="text-apex-accent">Access</span>
                        </h2>
                        <p className="text-apex-muted text-[0.82rem] font-grotesk leading-relaxed">
                            Enter your credentials to enter the Forge.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {[
                            { label: 'Email Identifier', type: 'email', placeholder: 'athlete@apex.com', value: email, setter: setEmail },
                            { label: 'Security Key', type: 'password', placeholder: '••••••••', value: password, setter: setPassword },
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
                            Login to Forge →
                        </button>
                    </form>

                    <p className="text-center mt-6 text-[0.78rem] text-apex-muted font-grotesk">
                        New athlete?{' '}
                        <Link href="/signup" className="text-apex-accent hover:underline font-medium">Sign Up Free</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
