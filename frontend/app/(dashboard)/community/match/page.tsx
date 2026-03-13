'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Dumbbell, Shield, ChevronRight } from 'lucide-react'

const mockAthletes = [
    { id: '1', name: 'David G.', rank: 'ELITE', distance: '1.2mi', goal: 'Strength', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
    { id: '2', name: 'Elena R.', rank: 'VETERAN', distance: '3.4mi', goal: 'Hypertrophy', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
    { id: '3', name: 'James T.', rank: 'CHALLENGER', distance: '5.0mi', goal: 'Endurance', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
]

export default function Matchmaking() {
    const [searching, setSearching] = useState(false)
    const [results, setResults] = useState<any[]>([])

    const handleSearch = () => {
        setSearching(true)
        setResults([])
        // "Radar" sweep effect
        setTimeout(() => {
            setResults(mockAthletes)
            setSearching(false)
        }, 2000)
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            <header className="mb-10 text-center">
                <h1 className="font-display text-4xl mb-3 flex justify-center items-center gap-3">
                    <Shield className="w-8 h-8 text-apex-accent" />
                    Find a <span className="text-apex-accent">Partner</span>
                </h1>
                <p className="text-apex-muted font-inter">Sync up with athletes nearby hitting similar protocols.</p>
            </header>

            <div className="card-glass p-8 text-center relative overflow-hidden mb-12">
                <div className="relative z-10 max-w-sm mx-auto">
                    <div className="w-24 h-24 rounded-full bg-apex-accent/10 flex items-center justify-center mx-auto mb-6 relative">
                        <MapPin className="w-10 h-10 text-apex-accent" />
                        {searching && (
                            <motion.div 
                                className="absolute inset-0 rounded-full border-2 border-apex-accent/60"
                                animate={{ scale: [1, 2.5], opacity: [1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                            />
                        )}
                        {searching && (
                            <motion.div 
                                className="absolute inset-0 rounded-full border-2 border-apex-accent/30"
                                animate={{ scale: [1, 3.5], opacity: [1, 0] }}
                                transition={{ duration: 1.5, delay: 0.4, repeat: Infinity, ease: "easeOut" }}
                            />
                        )}
                    </div>
                    
                    <button 
                        onClick={handleSearch}
                        disabled={searching}
                        className="btn-primary w-full py-4 rounded-xl text-lg group"
                    >
                        {searching ? (
                            <span className="animate-pulse">Scanning area...</span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <Search className="w-5 h-5" /> Start Radar Scan
                            </span>
                        )}
                    </button>
                    <p className="text-xs text-apex-dim font-mono mt-4 uppercase tracking-widest">Radius: 10 miles • Match: strict</p>
                </div>
            </div>

            <AnimatePresence>
                {results.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <h3 className="font-mono text-xs uppercase tracking-[3px] text-apex-muted mb-6">Nearby Matches ({results.length})</h3>
                        
                        {results.map((athlete, i) => (
                            <motion.div 
                                key={athlete.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="card-glass p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 hover:border-apex-accent/30 transition-colors group cursor-pointer"
                            >
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-white/5 border-2 border-transparent group-hover:border-apex-accent transition-colors flex-shrink-0">
                                    <img src={athlete.avatar} alt={athlete.name} className="w-full h-full object-cover" />
                                </div>
                                
                                <div className="flex-1 text-center sm:text-left">
                                    <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
                                        <h4 className="font-display text-2xl">{athlete.name}</h4>
                                        <span className="bg-apex-accent/20 text-apex-accent text-[0.6rem] px-2 py-0.5 rounded font-mono uppercase tracking-widest">{athlete.rank}</span>
                                    </div>
                                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 text-sm font-inter text-apex-muted">
                                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {athlete.distance}</span>
                                        <span className="flex items-center gap-1.5"><Dumbbell className="w-4 h-4" /> {athlete.goal}</span>
                                    </div>
                                </div>
                                
                                <button className="btn-ghost px-6 py-3 rounded-xl whitespace-nowrap group-hover:bg-apex-accent/10 group-hover:text-apex-accent transition-colors">
                                    Send Request
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
