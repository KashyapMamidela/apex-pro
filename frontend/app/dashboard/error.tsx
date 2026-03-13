'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Dashboard Error:', error)
    }, [error])

    return (
        <div className="flex h-[80vh] w-full flex-col items-center justify-center p-8 bg-bg text-center">
            <div className="card-glass p-8 max-w-md w-full border-apex-danger/30 flex flex-col items-center shadow-[0_0_30px_rgba(255,69,69,0.1)]">
                <div className="w-16 h-16 rounded-full bg-apex-danger/10 flex items-center justify-center mb-6">
                    <AlertTriangle className="w-8 h-8 text-apex-danger" />
                </div>
                
                <h2 className="font-display text-2xl mb-2 text-apex-text">System Error Detected</h2>
                <p className="font-inter text-apex-dim text-sm mb-6">
                    We encountered an anomaly while processing your request. The engine has logged the issue.
                </p>
                
                <button
                    onClick={() => reset()}
                    className="btn-primary w-full py-3 rounded-xl flex items-center justify-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" /> Reboot Subsystem
                </button>
            </div>
        </div>
    )
}
