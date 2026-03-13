'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Heart, MessageCircle } from 'lucide-react'

// Mock Stories Data
const MOCK_STORIES = [
    { id: 'me', name: 'Your Story', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You', hasUnviewed: false, isUser: true, image: '' },
    { id: '1', name: 'David G.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', hasUnviewed: true, isUser: false, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80' },
    { id: '2', name: 'Elena R.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', hasUnviewed: true, isUser: false, image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80' },
    { id: '3', name: 'James T.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', hasUnviewed: false, isUser: false, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80' },
    { id: '4', name: 'Sarah C.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', hasUnviewed: true, isUser: false, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80' },
]

export default function StoriesStrip() {
    const [activeStory, setActiveStory] = useState<any>(null)
    const [progress, setProgress] = useState(0)

    // Simplified Story Viewer Flow Simulation
    const handleOpenStory = (story: any) => {
        if (story.isUser) {
            // Handle Add Story action
            alert("Open Camera / Add Photo UI")
            return
        }
        
        setActiveStory(story)
        setProgress(0)
        
        // Simulating the 5 second auto-advance
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval)
                    setActiveStory(null) // Close or go to next in reality
                    return 100
                }
                return p + 2
            })
        }, 100) // 2% every 100ms = 5 seconds

        return () => clearInterval(interval)
    }

    return (
        <div className="mb-8">
            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-2 px-2 snap-x scrollbar-hide">
                {MOCK_STORIES.map((story) => (
                    <div 
                        key={story.id} 
                        className="flex flex-col items-center gap-2 cursor-pointer snap-start"
                        onClick={() => handleOpenStory(story)}
                    >
                        <div className={`w-16 h-16 rounded-full relative bg-black/40 ${!story.isUser && story.hasUnviewed ? 'p-[2px] bg-gradient-to-tr from-apex-warn via-apex-accent to-apex-info' : 'border border-white/10'}`}>
                            <div className="w-full h-full rounded-full border-2 border-bg overflow-hidden relative">
                                <img src={story.avatar} alt={story.name} className="w-full h-full object-cover" />
                                {story.isUser && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Plus className="w-6 h-6 text-white" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <span className="text-[0.65rem] font-inter text-apex-muted truncate w-16 text-center">
                            {story.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* Basic Instagram-style Fullscreen Viewer */}
            <AnimatePresence>
                {activeStory && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 bg-black flex flex-col justify-center items-center"
                    >
                        {/* Background blur layer */}
                        <div 
                            className="absolute inset-0 opacity-20 blur-3xl scale-110" 
                            style={{ backgroundImage: `url(${activeStory.image})`, backgroundSize: 'cover' }}
                        />

                        {/* Top Controls */}
                        <div className="absolute top-0 left-0 w-full z-20 p-4 pt-8 bg-gradient-to-b from-black/80 to-transparent">
                            {/* Progress bar */}
                            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-4 max-w-lg mx-auto">
                                <motion.div 
                                    className="h-full bg-white" 
                                    style={{ width: `${progress}%` }} 
                                    transition={{ duration: 0.1 }}
                                />
                            </div>
                            
                            <div className="flex justify-between items-center max-w-lg mx-auto">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden">
                                        <img src={activeStory.avatar} alt="" />
                                    </div>
                                    <span className="font-semibold text-sm">{activeStory.name}</span>
                                    <span className="text-apex-muted text-xs">2h</span>
                                </div>
                                <button onClick={() => setActiveStory(null)} className="p-2 bg-black/40 backdrop-blur rounded-full hover:bg-white/10 transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Image Content */}
                        <div className="relative z-10 w-full max-w-lg aspect-[9/16] bg-black rounded-lg overflow-hidden border border-white/10">
                            <img src={activeStory.image} alt="Story" className="w-full h-full object-cover" />
                        </div>

                        {/* Bottom Interaction */}
                        <div className="absolute bottom-0 left-0 w-full z-20 p-6 bg-gradient-to-t from-black via-black/80 to-transparent pb-10">
                            <div className="max-w-lg mx-auto flex gap-4">
                                <div className="flex-1">
                                    <input 
                                        type="text" 
                                        placeholder={`Reply to ${activeStory.name}...`} 
                                        className="w-full bg-transparent border border-white/20 rounded-full px-5 py-3 text-sm focus:border-white focus:outline-none placeholder:text-white/40"
                                    />
                                </div>
                                <button className="p-3 text-white hover:text-apex-warn transition-colors"><Heart className="w-6 h-6" /></button>
                                <button className="p-3 text-white hover:text-apex-info transition-colors"><MessageCircle className="w-6 h-6" /></button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
