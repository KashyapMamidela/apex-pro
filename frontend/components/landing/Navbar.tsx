'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Community', href: '#community' },
    { label: 'Pricing', href: '#pricing' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', handler, { passive: true })
        return () => window.removeEventListener('scroll', handler)
    }, [])

    return (
        <>
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'glass-dark border-b border-white/5 py-3' : 'py-5'
                    }`}
            >
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="font-impact text-[1.5rem] tracking-[4px] text-apex-accent">
                        APEX
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map(({ label, href }) => (
                            <a
                                key={href}
                                href={href}
                                className="text-apex-muted text-[0.85rem] font-inter font-medium hover:text-apex-text transition-colors"
                            >
                                {label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop CTAs */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/login" className="text-apex-muted text-[0.85rem] font-inter font-medium hover:text-apex-text transition-colors px-4 py-2">
                            Login
                        </Link>
                        <Link href="/signup" className="btn-primary px-5 py-2.5 text-[0.85rem] rounded-xl">
                            Start Training
                        </Link>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(o => !o)}
                        className="md:hidden p-2 glass rounded-xl text-apex-accent"
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.25 }}
                        className="fixed top-[64px] left-4 right-4 z-[99] glass-dark rounded-2xl p-5 space-y-3"
                    >
                        {navLinks.map(({ label, href }) => (
                            <a
                                key={href}
                                href={href}
                                onClick={() => setMobileOpen(false)}
                                className="block text-apex-muted font-inter font-medium py-2.5 border-b border-white/5 hover:text-apex-text transition-colors"
                            >
                                {label}
                            </a>
                        ))}
                        <div className="flex gap-3 pt-2">
                            <Link href="/login" onClick={() => setMobileOpen(false)} className="btn-ghost flex-1 py-3 text-center text-sm rounded-xl">Login</Link>
                            <Link href="/signup" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 py-3 text-center text-sm rounded-xl">Start Training</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
