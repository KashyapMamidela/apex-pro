'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Dumbbell,
    Utensils,
    TrendingUp,
    ShieldAlert,
    Settings,
    LogOut,
    User,
    Users,
    X,
    Menu,
    Zap,
    Activity,
} from 'lucide-react'

const navItems = [
    { name: 'OVERVIEW', icon: <LayoutDashboard className="w-4 h-4" />, href: '/dashboard' },
    { name: 'WORKOUTS', icon: <Dumbbell className="w-4 h-4" />, href: '/dashboard/workouts' },
    { name: 'NUTRITION', icon: <Utensils className="w-4 h-4" />, href: '/dashboard/nutrition' },
    { name: 'PROGRESS', icon: <TrendingUp className="w-4 h-4" />, href: '/dashboard/progress' },
    { name: 'TRACKER', icon: <Activity className="w-4 h-4" />, href: '/dashboard/tracker' },
    { name: 'COMMUNITY', icon: <Users className="w-4 h-4" />, href: '/dashboard/community' },
    { name: 'PROFILE', icon: <User className="w-4 h-4" />, href: '/dashboard/profile' },
    { name: 'SETTINGS', icon: <Settings className="w-4 h-4" />, href: '/dashboard/settings' },
]

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [xpLevel, setXpLevel] = useState({ label: 'Rookie', xp: 850, max: 1500, color: '#00d4ff' })

    useEffect(() => {
        const supabase = createClient()
        supabase.auth.getUser().then(({ data }: any) => {
            if (data?.user) setUser(data.user)
        })
    }, [])

    // Close mobile drawer on route change
    useEffect(() => { setMobileOpen(false) }, [pathname])

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/')
    }

    const initials = user?.user_metadata?.full_name
        ?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'A'
    const fullName = user?.user_metadata?.full_name || 'ATHLETE'

    const xpPct = Math.min(100, Math.round((xpLevel.xp / xpLevel.max) * 100))

    const SidebarContent = () => (
        <aside className="flex flex-col h-full w-60 glass-dark border-r border-white/5">
            {/* Logo + Forge icon */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <span className="font-impact text-2xl text-apex-accent tracking-[4px]">APEX</span>
                <Link
                    href="/dashboard/forge"
                    title="Elite Forge"
                    className={`p-1.5 rounded-lg transition-all ${pathname === '/dashboard/forge'
                        ? 'bg-apex-accent/20 text-apex-accent'
                        : 'text-apex-dim hover:text-apex-accent hover:bg-apex-accent/10'
                        }`}
                >
                    <Zap className="w-4 h-4" />
                </Link>
            </div>

            {/* User card */}
            <div className="px-5 py-4 border-b border-white/5 bg-white/2">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div
                            className="w-10 h-10 rounded-full bg-apex-accent flex items-center justify-center font-display text-base text-bg font-bold shrink-0 ring-2 ring-apex-accent/30"
                            style={{ boxShadow: '0 0 12px rgba(200,255,0,0.25)' }}
                        >
                            {initials}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-surface" />
                    </div>
                    <div className="overflow-hidden flex-1">
                        <div className="text-[0.82rem] font-semibold truncate text-apex-text">{fullName}</div>
                        <div
                            className="text-[0.65rem] font-mono mt-0.5 uppercase tracking-wider"
                            style={{ color: xpLevel.color }}
                        >
                            {xpLevel.label}
                        </div>
                    </div>
                </div>

                {/* XP bar */}
                <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[0.6rem] font-mono text-apex-dim uppercase tracking-wider">XP</span>
                        <span className="text-[0.6rem] font-mono text-apex-muted">{xpLevel.xp}/{xpLevel.max}</span>
                    </div>
                    <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${xpPct}%`, background: xpLevel.color }}
                        />
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 text-[0.78rem] font-grotesk font-medium tracking-[0.5px] transition-all rounded-xl ${isActive
                                ? 'text-apex-accent bg-apex-accent/10 shadow-sm'
                                : 'text-apex-muted hover:text-apex-text hover:bg-white/5'
                                }`}
                        >
                            <span className={isActive ? 'text-apex-accent' : ''}>{item.icon}</span>
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-apex-dim text-[0.78rem] font-medium transition-colors hover:text-apex-danger w-full group"
                >
                    <LogOut className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    LOGOUT SYSTEM
                </button>
            </div>
        </aside>
    )

    return (
        <>
            {/* Desktop sidebar — fixed */}
            <div className="hidden md:flex fixed top-0 left-0 bottom-0 z-[100]">
                <SidebarContent />
            </div>

            {/* Mobile hamburger button */}
            <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-[200] p-2 glass border border-white/10 rounded-xl text-apex-accent"
                aria-label="Open menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile drawer overlay */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Mobile drawer */}
            <div
                className={`md:hidden fixed top-0 left-0 bottom-0 z-[160] transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <SidebarContent />
                <button
                    onClick={() => setMobileOpen(false)}
                    className="absolute top-4 right-[-44px] p-2 bg-surface border border-border-main rounded-sm text-apex-muted"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </>
    )
}
