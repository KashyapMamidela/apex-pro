'use client'

import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="border-t border-border-main pt-16 pb-8 px-6 md:px-16 lg:px-24">
            <div className="max-w-[1400px] mx-auto">
                {/* Top row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    <div className="md:col-span-2">
                        <div className="font-impact text-[2rem] tracking-[5px] text-apex-accent mb-4">APEX</div>
                        <p className="text-apex-muted text-[0.8rem] leading-[1.8] max-w-xs">
                            The most advanced AI fitness system for South Indian athletes. Train smarter, eat precisely, and rise through the ranks.
                        </p>
                        <div className="flex items-center gap-3 mt-5">
                            {[
                                { label: '₿', href: '#' },
                                { label: 'IG', href: '#' },
                                { label: 'X', href: '#' },
                            ].map((s, i) => (
                                <a
                                    key={i} href={s.href}
                                    className="w-8 h-8 border border-border-sub flex items-center justify-center text-[0.65rem] font-mono text-apex-dim hover:border-apex-accent hover:text-apex-accent transition-all"
                                >
                                    {s.label}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="text-[0.6rem] font-mono tracking-[2px] text-apex-muted uppercase mb-4">Product</div>
                        <ul className="space-y-2.5">
                            {['Features', 'Pricing', 'How It Works', 'Changelog'].map(l => (
                                <li key={l}>
                                    <Link href="#" className="text-[0.8rem] text-apex-dim hover:text-apex-text transition-colors">{l}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <div className="text-[0.6rem] font-mono tracking-[2px] text-apex-muted uppercase mb-4">Company</div>
                        <ul className="space-y-2.5">
                            {['About', 'Blog', 'Privacy', 'Terms', 'Support'].map(l => (
                                <li key={l}>
                                    <Link href="#" className="text-[0.8rem] text-apex-dim hover:text-apex-text transition-colors">{l}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom row */}
                <div className="border-t border-border-main pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
                    <p className="text-[0.68rem] font-mono text-apex-dim uppercase tracking-wider">
                        © {new Date().getFullYear()} Apex Performance Systems. All rights reserved.
                    </p>
                    <div className="text-[0.65rem] font-mono text-apex-dim">
                        Built for India's elite athletes 🇮🇳
                    </div>
                </div>
            </div>
        </footer>
    )
}
