'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronLeft, Shield } from 'lucide-react'
import { login } from '../actions'
import DeadliftLoader from '@/components/ui/DeadliftLoader'

// Floating icons for left panel (same SVGs as Hero)
const FloatingIcon = ({ style, children }: { style?: React.CSSProperties; children: React.ReactNode }) => (
    <motion.div
        className="absolute text-apex-accent pointer-events-none opacity-15"
        style={style}
        animate={{ y: [0, -12, 0], rotate: [0, 5, -3, 0] }}
        transition={{ duration: 6 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut' }}
    >
        {children}
    </motion.div>
)

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const [pending, setPending] = useState(false)

    const handleGoogle = () => {
        alert('Google login coming soon')
    }

    // Handle form action directly for native FormData support
    const handleLoginAction = async (formData: FormData) => {
        setPending(true)
        setError(null)
        try {
            await login(formData)
        } catch (e: any) {
            setError(e.message || 'Login failed')
            setPending(false)
        }
    }

    if (pending) return <DeadliftLoader message="Entering the Forge..." />

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-bg text-apex-text">

            {/* LEFT — animated gym panel */}
            <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-surface border-r border-white/5">
                {/* Glow orb */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(255,212,0,0.07) 0%, transparent 70%)' }} />

                {/* Floating icons */}
                {[
                    { top: '12%', left: '10%' }, { top: '25%', right: '8%' },
                    { top: '55%', left: '6%' }, { bottom: '20%', right: '12%' },
                    { bottom: '8%', left: '35%' },
                ].map((pos, i) => (
                    <FloatingIcon key={i} style={{ ...pos, position: 'absolute' }}>
                        <svg width={40 + i * 8} height={40 + i * 8} viewBox="0 0 50 50" fill="currentColor" opacity="0.8">
                            <rect x="0" y="14" width="14" height="22" rx="4" />
                            <rect x="14" y="18" width="10" height="14" rx="3" opacity="0.65" />
                            <rect x="24" y="21" width="26" height="8" rx="3" />
                        </svg>
                    </FloatingIcon>
                ))}

                {/* Brand */}
                <div className="relative z-10 font-impact text-2xl text-apex-accent tracking-[5px]">APEX</div>

                <div className="relative z-10">
                    <div className="text-[0.6rem] font-mono tracking-[4px] text-apex-accent uppercase mb-4">Welcome Back</div>
                    <h1 className="font-display text-[3.5rem] font-black leading-[0.9] mb-5">
                        Back to<br /><span className="text-apex-accent">The Forge</span>
                    </h1>
                    <p className="text-apex-muted text-[0.88rem] font-inter max-w-xs leading-relaxed">
                        Your streak is waiting. Log in and keep the momentum going.
                    </p>
                </div>

                <div className="relative z-10 flex gap-10">
                    {[['5.0★', 'App Rating'], ['100%', 'Secure'], ['24/7', 'Support']].map(([v, l]) => (
                        <div key={v}>
                            <div className="font-display text-[1.8rem] font-black text-apex-accent">{v}</div>
                            <div className="text-[0.58rem] tracking-[2px] text-apex-muted uppercase font-mono mt-0.5">{l}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT — auth card */}
            <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center p-8 lg:p-14"
            >
                <div className="w-full max-w-[400px]">
                    <Link href="/" className="flex items-center gap-2 text-apex-muted text-[0.78rem] mb-10 hover:text-apex-text transition-colors font-inter">
                        <ChevronLeft className="w-4 h-4" /> Back to Home
                    </Link>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-4 h-4 text-apex-accent" />
                            <span className="text-[0.6rem] font-mono tracking-[3px] text-apex-accent uppercase">Secure Login</span>
                        </div>
                        <h2 className="font-display text-[2.4rem] font-black leading-[0.9] mb-2">
                            System <span className="text-apex-accent">Access</span>
                        </h2>
                        <p className="text-apex-muted text-[0.82rem] font-inter">Enter your credentials to enter the Forge.</p>
                    </div>

                    {/* Google */}
                    <button onClick={handleGoogle} className="btn-ghost w-full flex items-center justify-center gap-3 py-3.5 mb-5 text-[0.85rem] font-inter rounded-xl">
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 h-px bg-white/8" />
                        <span className="text-[0.6rem] font-mono text-apex-dim uppercase tracking-wider">or email</span>
                        <div className="flex-1 h-px bg-white/8" />
                    </div>

                    <form action={handleLoginAction} className="space-y-4">
                        {[
                            { label: 'Email', name: 'email', type: 'email', placeholder: 'athlete@apex.com', value: email, set: setEmail },
                            { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••', value: password, set: setPassword },
                        ].map(({ label, name, type, placeholder, value, set }) => (
                            <div key={label} className="flex flex-col gap-1.5">
                                <label className="text-[0.58rem] font-mono text-apex-muted uppercase tracking-[2px]">{label}</label>
                                <input name={name} type={type} placeholder={placeholder} value={value}
                                    onChange={e => set(e.target.value)} required
                                    className="input-glass w-full px-4 py-3.5 text-[0.88rem] font-inter"
                                />
                            </div>
                        ))}

                        {error && <p className="text-apex-danger text-[0.78rem] font-inter bg-red-500/10 px-3 py-2 rounded-xl border border-red-500/20">{error}</p>}

                        <button type="submit" className="btn-primary w-full py-4 text-[0.9rem] rounded-xl mt-2">
                            Login to Forge →
                        </button>
                    </form>

                    <p className="text-center mt-6 text-[0.78rem] text-apex-muted font-inter">
                        New athlete? <Link href="/signup" className="text-apex-accent hover:underline font-semibold">Sign Up Free</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
