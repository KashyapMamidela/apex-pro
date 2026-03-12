'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const links = {
    Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
    Company: ['About', 'Blog', 'Careers'],
    Support: ['Help Center', 'Contact', 'Privacy', 'Terms'],
}

export default function Footer() {
    return (
        <footer className="border-t border-white/6 bg-surface/40 py-16 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="font-impact text-[1.8rem] text-apex-accent tracking-[4px] mb-3">APEX</div>
                        <p className="text-apex-dim text-[0.78rem] font-inter leading-relaxed max-w-[200px]">
                            Science-backed fitness for serious athletes. Train. Eat. Dominate.
                        </p>
                    </div>

                    {/* Link columns */}
                    {Object.entries(links).map(([section, items]) => (
                        <div key={section}>
                            <div className="text-[0.65rem] font-mono tracking-[2px] text-apex-muted uppercase mb-4">{section}</div>
                            <ul className="space-y-2.5">
                                {items.map(item => (
                                    <li key={item}>
                                        <a href="#" className="text-apex-dim text-[0.82rem] font-inter hover:text-apex-text transition-colors">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4">
                    <p className="text-apex-dim text-[0.72rem] font-inter">
                        © 2025 Apex Pro. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-apex-accent animate-pulse" />
                        <span className="text-apex-dim text-[0.72rem] font-mono">All systems operational</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
