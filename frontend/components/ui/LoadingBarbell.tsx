// Animated barbell loader — used as a full-page loading overlay
export default function LoadingBarbell({ message = 'LOADING...' }: { message?: string }) {
    return (
        <div className="fixed inset-0 bg-bg/90 backdrop-blur-sm flex flex-col items-center justify-center z-[9999]">
            {/* Barbell SVG */}
            <div style={{ animation: 'barbell-lift 1.6s cubic-bezier(0.4,0,0.6,1) infinite' }}>
                <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Left weight plate outer */}
                    <rect x="0" y="6" width="12" height="28" rx="3" fill="#c8ff00" opacity="0.9" />
                    {/* Left weight plate inner */}
                    <rect x="12" y="10" width="8" height="20" rx="2" fill="#a8d900" />
                    {/* Bar */}
                    <rect x="20" y="17" width="80" height="6" rx="3" fill="#c8ff00" />
                    {/* Right weight plate inner */}
                    <rect x="100" y="10" width="8" height="20" rx="2" fill="#a8d900" />
                    {/* Right weight plate outer */}
                    <rect x="108" y="6" width="12" height="28" rx="3" fill="#c8ff00" opacity="0.9" />
                    {/* Center knurling marks */}
                    {[40, 48, 56, 64, 72, 80].map((x) => (
                        <rect key={x} x={x} y="16" width="1.5" height="8" rx="0.5" fill="#060608" opacity="0.5" />
                    ))}
                </svg>
            </div>

            {/* Shadow that shrinks as barbell goes up */}
            <div
                className="mt-1 rounded-full bg-apex-accent/20"
                style={{
                    width: '80px',
                    height: '6px',
                    animation: 'barbell-shadow 1.6s cubic-bezier(0.4,0,0.6,1) infinite',
                    filter: 'blur(4px)',
                }}
            />

            <style>{`
                @keyframes barbell-shadow {
                    0%,100% { transform: scaleX(1); opacity: 0.3; }
                    40%     { transform: scaleX(0.5); opacity: 0.1; }
                    60%     { transform: scaleX(0.5); opacity: 0.1; }
                }
            `}</style>

            <p className="mt-8 font-mono text-apex-accent text-[0.7rem] tracking-[4px] animate-pulse">
                {message}
            </p>
        </div>
    )
}

// Inline mini spinner for buttons / small loading states
export function SpinnerSmall({ className = '' }: { className?: string }) {
    return (
        <svg
            className={`animate-spin h-4 w-4 text-apex-accent ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    )
}
