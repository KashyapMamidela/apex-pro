'use client'

import { useEffect, useRef } from 'react'

// SVG squat animation — stick figure doing 3 squats then deadlift
export default function SquatLoader({ message = 'Loading...' }: { message?: string }) {
    const squatRef = useRef<SVGGElement>(null)

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center glass-dark">
            {/* Animated squatting figure */}
            <div className="relative mb-8">
                <style>{`
                    @keyframes squat-body {
                        0%,100% { transform: translateY(0px); }
                        40%,60% { transform: translateY(18px); }
                    }
                    @keyframes squat-leg-l {
                        0%,100% { transform-origin: 50px 110px; transform: rotate(0deg); }
                        40%,60% { transform-origin: 50px 110px; transform: rotate(30deg); }
                    }
                    @keyframes squat-leg-r {
                        0%,100% { transform-origin: 70px 110px; transform: rotate(0deg); }
                        40%,60% { transform-origin: 70px 110px; transform: rotate(-30deg); }
                    }
                    @keyframes squat-arm-l {
                        0%,100% { transform-origin: 45px 90px; transform: rotate(0deg); }
                        40%,60% { transform-origin: 45px 90px; transform: rotate(-20deg); }
                    }
                    @keyframes squat-arm-r {
                        0%,100% { transform-origin: 75px 90px; transform: rotate(0deg); }
                        40%,60% { transform-origin: 75px 90px; transform: rotate(20deg); }
                    }
                    @keyframes barbell-glow {
                        0%,100% { filter: drop-shadow(0 0 4px rgba(200,255,0,0.4)); }
                        40%,60% { filter: drop-shadow(0 0 12px rgba(200,255,0,0.9)); }
                    }
                    @keyframes shadow-squat {
                        0%,100% { transform: scaleX(1); opacity: 0.3; }
                        40%,60% { transform: scaleX(0.7); opacity: 0.5; }
                    }
                    .apex-squat-body { animation: squat-body 1.4s cubic-bezier(0.4,0,0.6,1) infinite; }
                    .apex-squat-leg-l { animation: squat-leg-l 1.4s cubic-bezier(0.4,0,0.6,1) infinite; }
                    .apex-squat-leg-r { animation: squat-leg-r 1.4s cubic-bezier(0.4,0,0.6,1) infinite; }
                    .apex-squat-arm-l { animation: squat-arm-l 1.4s cubic-bezier(0.4,0,0.6,1) infinite; }
                    .apex-squat-arm-r { animation: squat-arm-r 1.4s cubic-bezier(0.4,0,0.6,1) infinite; }
                    .apex-barbell-glow { animation: barbell-glow 1.4s ease-in-out infinite; }
                    .apex-shadow-squat { animation: shadow-squat 1.4s cubic-bezier(0.4,0,0.6,1) infinite; }
                `}</style>

                <svg width="120" height="180" viewBox="0 0 120 180" fill="none" className="apex-barbell-glow">
                    {/* Barbell — fixed on shoulders */}
                    <g className="apex-squat-body">
                        {/* Barbell bar */}
                        <rect x="8" y="72" width="104" height="5" rx="2.5" fill="#c8ff00" opacity="0.9" />
                        {/* Left plates */}
                        <rect x="8" y="64" width="10" height="21" rx="3" fill="#c8ff00" />
                        <rect x="20" y="67" width="7" height="15" rx="2" fill="#a8d900" />
                        {/* Right plates */}
                        <rect x="102" y="64" width="10" height="21" rx="3" fill="#c8ff00" />
                        <rect x="93" y="67" width="7" height="15" rx="2" fill="#a8d900" />

                        {/* Head */}
                        <circle cx="60" cy="55" r="12" fill="#eeeef2" />

                        {/* Torso */}
                        <rect x="48" y="74" width="24" height="36" rx="6" fill="#eeeef2" opacity="0.9" />
                    </g>

                    {/* Left arm */}
                    <g className="apex-squat-arm-l">
                        <rect x="38" y="74" width="10" height="28" rx="5" fill="#eeeef2" opacity="0.85" />
                    </g>
                    {/* Right arm */}
                    <g className="apex-squat-arm-r">
                        <rect x="72" y="74" width="10" height="28" rx="5" fill="#eeeef2" opacity="0.85" />
                    </g>

                    {/* Left leg */}
                    <g className="apex-squat-leg-l">
                        <rect x="49" y="108" width="11" height="36" rx="5" fill="#eeeef2" opacity="0.9" />
                        <rect x="46" y="140" width="13" height="11" rx="4" fill="#c8ff00" opacity="0.8" />
                    </g>
                    {/* Right leg */}
                    <g className="apex-squat-leg-r">
                        <rect x="60" y="108" width="11" height="36" rx="5" fill="#eeeef2" opacity="0.9" />
                        <rect x="61" y="140" width="13" height="11" rx="4" fill="#c8ff00" opacity="0.8" />
                    </g>

                    {/* Ground shadow */}
                    <ellipse cx="60" cy="163" rx="28" ry="5" fill="#c8ff00" className="apex-shadow-squat" />
                </svg>
            </div>

            {/* Loading text */}
            <div className="text-center">
                <div className="font-syne text-[1.1rem] font-bold text-apex-text tracking-wider mb-2">{message}</div>
                <div className="flex items-center gap-2 justify-center">
                    {[0, 1, 2].map(i => (
                        <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-apex-accent"
                            style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
