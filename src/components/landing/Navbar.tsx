'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 30)
        window.addEventListener('scroll', fn)
        return () => window.removeEventListener('scroll', fn)
    }, [])

    const links = [
        { href: '#features', label: 'System' },
        { href: '#stats', label: 'Results' },
        { href: '#how', label: 'How It Works' },
        { href: '#pricing', label: 'Plans' },
    ]

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-500 ${scrolled
            ? 'glass-dark shadow-xl shadow-black/50'
            : 'bg-transparent'
            }`}>
            <div className="flex items-center justify-between px-6 py-4 md:px-16 md:py-5">
                {/* Logo */}
                <div className="relative group cursor-pointer">
                    <span className="font-impact text-2xl tracking-[5px] text-apex-accent relative z-10">APEX</span>
                    <span
                        className="absolute -bottom-1 left-0 h-[2px] bg-apex-accent w-0 group-hover:w-full transition-all duration-300"
                    />
                </div>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map(l => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="relative text-apex-muted text-[0.78rem] font-medium tracking-[1.5px] uppercase transition-colors hover:text-apex-text group"
                        >
                            {l.label}
                            <span className="absolute -bottom-0.5 left-0 h-px bg-apex-accent w-0 group-hover:w-full transition-all duration-300" />
                        </Link>
                    ))}
                </div>

                {/* Auth buttons */}
                <div className="hidden md:flex gap-3 items-center">
                    <Link
                        href="/login"
                        className="px-5 py-2.5 text-[0.78rem] font-medium tracking-[1px] uppercase text-apex-muted border border-border-sub hover:border-apex-accent/50 hover:text-apex-text transition-all duration-200 rounded-lg"
                    >
                        Login
                    </Link>
                    <Link
                        href="/signup"
                        className="relative px-5 py-2.5 text-[0.78rem] font-bold tracking-[1px] uppercase bg-apex-accent text-bg overflow-hidden group rounded-lg"
                    >
                        <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5">Join Apex →</span>
                        <span className="absolute inset-0 bg-[#e6ff33] translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-lg" />
                    </Link>
                </div>


                {/* Mobile hamburger */}
                <button
                    className="md:hidden flex flex-col gap-[5px] p-2"
                    onClick={() => setMenuOpen(m => !m)}
                    aria-label="Toggle menu"
                >
                    <span className={`block w-6 h-[2px] bg-apex-text transition-all ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
                    <span className={`block w-6 h-[2px] bg-apex-text transition-all ${menuOpen ? 'opacity-0' : ''}`} />
                    <span className={`block w-6 h-[2px] bg-apex-text transition-all ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
                </button>
            </div>

            {/* Mobile drawer */}
            <div className={`md:hidden bg-bg/98 border-b border-border-main transition-all duration-300 overflow-hidden ${menuOpen ? 'max-h-80 py-4' : 'max-h-0'}`}>
                <div className="flex flex-col px-6 gap-5">
                    {links.map(l => (
                        <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                            className="text-apex-muted text-[0.85rem] uppercase tracking-[2px] hover:text-apex-accent transition-colors">
                            {l.label}
                        </Link>
                    ))}
                    <div className="flex gap-3 mt-2">
                        <Link href="/login" className="flex-1 text-center py-2.5 border border-border-sub text-[0.8rem] uppercase tracking-wider text-apex-muted">Login</Link>
                        <Link href="/signup" className="flex-1 text-center py-2.5 bg-apex-accent text-bg text-[0.8rem] uppercase font-bold tracking-wider">Join</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
