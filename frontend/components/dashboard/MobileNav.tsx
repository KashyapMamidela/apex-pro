'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Dumbbell,
    Utensils,
    User,
    Zap,
} from 'lucide-react'

// Mobile bottom nav — visible on md and below only
// Center item (Apex Tracker) is elevated like a FAB button

const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Dumbbell className="w-5 h-5" />, label: 'Workouts', href: '/dashboard/workouts' },
    // CENTER — Apex Tracker (elevated)
    null,
    { icon: <Utensils className="w-5 h-5" />, label: 'Diet', href: '/dashboard/nutrition' },
    { icon: <User className="w-5 h-5" />, label: 'Profile', href: '/dashboard/profile' },
]

export default function MobileNav() {
    const pathname = usePathname()
    const isProgressActive = pathname === '/dashboard/progress'
    const isForgeActive = pathname === '/dashboard/forge'

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-[150] glass-dark !rounded-t-2xl !rounded-b-none !border-x-0 !border-b-0 pb-safe">
            <div className="flex items-end relative h-16">

                {/* Left 2 items */}
                {navItems.slice(0, 2).map((item, i) => {
                    if (!item) return null
                    const active = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex-1 flex flex-col items-center justify-center h-full gap-0.5 transition-colors ${active ? 'text-apex-accent' : 'text-apex-dim hover:text-apex-muted'}`}
                        >
                            {item.icon}
                            <span className="text-[0.5rem] font-mono uppercase tracking-wider">{item.label}</span>
                            {active && <div className="absolute bottom-0 w-6 h-0.5 bg-apex-accent rounded-full" />}
                        </Link>
                    )
                })}

                {/* CENTER — Elevated Apex Tracker (Progress) */}
                <div className="flex-1 flex items-end justify-center pb-1">
                    <Link
                        href="/dashboard/progress"
                        className={`flex flex-col items-center justify-center w-[58px] h-[58px] rounded-full -translate-y-4 border-4 transition-all shadow-lg ${isProgressActive
                            ? 'bg-apex-accent border-bg text-bg shadow-apex-accent/40'
                            : 'bg-card border-border-glow text-apex-accent hover:bg-card-2'
                            }`}
                        style={isProgressActive ? { boxShadow: '0 0 20px rgba(200,255,0,0.4)' } : {}}
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                        </svg>
                        <span className="text-[0.42rem] font-mono uppercase tracking-tight mt-0.5 leading-none">APEX</span>
                    </Link>
                </div>

                {/* Right 2 items */}
                {navItems.slice(3).map((item, i) => {
                    if (!item) return null
                    const active = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex-1 flex flex-col items-center justify-center h-full gap-0.5 transition-colors ${active ? 'text-apex-accent' : 'text-apex-dim hover:text-apex-muted'}`}
                        >
                            {item.icon}
                            <span className="text-[0.5rem] font-mono uppercase tracking-wider">{item.label}</span>
                            {active && <div className="absolute bottom-0 w-6 h-0.5 bg-apex-accent rounded-full" />}
                        </Link>
                    )
                })}

                {/* Elite Forge icon — top-right (Instagram-style) */}
                <Link
                    href="/dashboard/forge"
                    className={`absolute top-2 right-3 p-2 rounded-full transition-all ${isForgeActive
                        ? 'bg-apex-accent/20 text-apex-accent'
                        : 'text-apex-dim hover:text-apex-accent'
                        }`}
                    title="Elite Forge"
                >
                    <Zap className="w-4.5 h-4.5" />
                </Link>
            </div>
        </div>
    )
}
