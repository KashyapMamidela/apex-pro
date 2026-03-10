// Shimmer skeleton components for loading states
export function SkeletonCard({ className = '' }: { className?: string }) {
    return (
        <div className={`skeleton h-[120px] w-full rounded-sm ${className}`} />
    )
}

export function SkeletonMetricCard() {
    return (
        <div className="bg-card border border-border-main p-6 space-y-3">
            <div className="skeleton h-3 w-24" />
            <div className="skeleton h-10 w-20" />
            <div className="skeleton h-3 w-32" />
        </div>
    )
}

export function SkeletonWorkoutRow() {
    return (
        <div className="flex items-center gap-4 p-[13px_15px] bg-surface border border-border-main">
            <div className="skeleton w-5 h-5 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="skeleton h-3.5 w-36" />
                <div className="skeleton h-3 w-24" />
            </div>
            <div className="flex gap-1">
                {[0, 1, 2, 3].map(i => (
                    <div key={i} className="skeleton w-2.5 h-2.5 rounded-full" />
                ))}
            </div>
        </div>
    )
}

export function SkeletonDashboard() {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header skeleton */}
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <div className="skeleton h-3 w-32" />
                    <div className="skeleton h-10 w-64" />
                </div>
                <div className="space-y-2 text-right">
                    <div className="skeleton h-3 w-20 ml-auto" />
                    <div className="skeleton h-4 w-44 ml-auto" />
                </div>
            </div>
            {/* Metric cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {[0, 1, 2, 3].map(i => <SkeletonMetricCard key={i} />)}
            </div>
            {/* Content area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-2 bg-card border border-border-main p-7">
                    <div className="skeleton h-5 w-40 mb-5" />
                    {[0, 1, 2, 3, 4].map(i => <SkeletonWorkoutRow key={i} />)}
                </div>
                <div className="space-y-6">
                    <div className="bg-card border border-border-main p-7 h-64">
                        <div className="skeleton h-5 w-32 mb-4" />
                        <div className="skeleton rounded-full w-32 h-32 mx-auto" />
                    </div>
                    <div className="bg-card border border-border-main p-7 h-40">
                        <div className="skeleton h-5 w-28 mb-4" />
                        <div className="skeleton h-14 w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}
