'use client'

import {
    ShieldAlert,
    Lock,
    Cpu,
    Zap,
    Activity,
    Trophy,
    Target,
    ChevronRight,
    Search
} from 'lucide-react'

export default function ForgePage() {
    return (
        <div className="space-y-8 animate-fade-up">
            <header className="flex justify-between items-center bg-apex-accent/10 border-l-4 border-apex-accent p-8">
                <div>
                    <div className="text-[0.65rem] font-mono tracking-[3px] text-apex-accent uppercase mb-1.5">
                        EXPERIMENTAL LABORATORY
                    </div>
                    <h1 className="font-display text-[2.6rem] tracking-[1px] uppercase">
                        ELITE <em className="text-apex-accent not-italic">FORGE</em>
                    </h1>
                    <p className="text-apex-muted text-sm mt-2 max-w-xl">
                        Access high-performance AI tools and experimental training metrics before they hit the main system.
                    </p>
                </div>
                <ShieldAlert className="w-16 h-16 text-apex-accent opacity-20" />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* AI Form Analysis */}
                <div className="bg-card border border-border-main p-7 group hover:border-apex-accent/50 transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <Lock className="w-4 h-4 text-apex-dim" />
                    </div>
                    <div className="w-12 h-12 bg-apex-accent/5 rounded-sm flex items-center justify-center mb-6 border border-apex-accent/10 text-apex-accent">
                        <Search className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-xl tracking-[1px] mb-2 uppercase">AI FORM SCANNER</h3>
                    <p className="text-[0.8rem] text-apex-muted leading-relaxed mb-6">
                        Upload a video of your Squat or Deadlift for real-time biomechanical analysis and correction hints.
                    </p>
                    <div className="flex items-center gap-2 text-[0.65rem] font-mono text-apex-accent group-hover:gap-3 transition-all uppercase tracking-[2px]">
                        INITIALIZE SCAN <ChevronRight className="w-3 h-3" />
                    </div>
                </div>

                {/* Metabolic Rate Estimator */}
                <div className="bg-card border border-border-main p-7 group hover:border-apex-accent/50 transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <Lock className="w-4 h-4 text-apex-dim" />
                    </div>
                    <div className="w-12 h-12 bg-apex-accent/5 rounded-sm flex items-center justify-center mb-6 border border-apex-accent/10 text-apex-accent">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="font-display text-xl tracking-[1px] mb-2 uppercase">METABOLIC SYNC</h3>
                    <p className="text-[0.8rem] text-apex-muted leading-relaxed mb-6">
                        Connect your wearable device to synchronize calorie burn data with your AI Diet plan for daily macro adjustments.
                    </p>
                    <div className="flex items-center gap-2 text-[0.65rem] font-mono text-apex-accent group-hover:gap-3 transition-all uppercase tracking-[2px]">
                        ESTABLISH LINK <ChevronRight className="w-3 h-3" />
                    </div>
                </div>

                {/* Supplement Optimizer */}
                <div className="bg-card border border-border-main p-7 group hover:border-apex-accent/50 transition-all cursor-pointer relative overflow-hidden">
                    <div className="w-12 h-12 bg-apex-accent text-bg rounded-sm flex items-center justify-center mb-6 border border-apex-accent/10">
                        <Cpu className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-display text-xl tracking-[1px] uppercase">STACK OPTIMIZER</h3>
                        <span className="bg-apex-accent/20 text-apex-accent text-[0.55rem] font-mono px-1.5 py-0.5 rounded border border-apex-accent/20">BETA</span>
                    </div>
                    <p className="text-[0.8rem] text-apex-muted leading-relaxed mb-6 text-apex-dim">
                        Identify performance gaps and get evidence-based supplement recommendations tailored to your goals.
                    </p>
                    <div className="flex items-center gap-2 text-[0.65rem] font-mono text-apex-accent group-hover:gap-3 transition-all uppercase tracking-[2px]">
                        RUN DIAGNOSTICS <ChevronRight className="w-3 h-3" />
                    </div>
                </div>
            </div>

            {/* Achievement / System Status section */}
            <div className="bg-surface border border-border-main p-8 flex flex-col items-center text-center">
                <Trophy className="w-12 h-12 text-apex-accent mb-4 opacity-30" />
                <h3 className="font-display text-2xl tracking-[1px] uppercase mb-2">ATHLETE LEVEL: ELITE I</h3>
                <p className="text-apex-muted text-[0.85rem] max-w-md">
                    You are in the top 5% of APEX athletes. Maintain your 12-day streak to unlock the <span className="text-apex-text font-bold">TITAN FORGE</span> tier.
                </p>
                <div className="w-full max-w-xl bg-bg border border-border-main h-1.5 mt-8 rounded-full overflow-hidden">
                    <div className="bg-apex-accent w-4/5 h-full relative">
                        <div className="absolute top-0 right-0 w-8 h-full bg-white/40 animate-pulse" />
                    </div>
                </div>
                <div className="flex justify-between w-full max-w-xl mt-3 text-[0.65rem] font-mono text-apex-muted uppercase">
                    <span>Current: 8,400 XP</span>
                    <span>Next Tier: 10,000 XP</span>
                </div>
            </div>
        </div>
    )
}
