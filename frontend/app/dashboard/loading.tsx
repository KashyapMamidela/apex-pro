export default function Loading() {
    return (
        <div className="flex h-full w-full items-center justify-center p-8 bg-bg">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-apex-accent/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-apex-accent rounded-full border-t-transparent animate-spin"></div>
                </div>
                <div className="font-mono text-apex-accent text-sm tracking-widest uppercase animate-pulse">
                    Loading System
                </div>
            </div>
        </div>
    )
}
