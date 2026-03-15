'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Image as ImageIcon, Flame } from 'lucide-react'

export default function CreatePostModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [content, setContent] = useState('')
    const [posting, setPosting] = useState(false)

    const handlePost = async () => {
        if (!content.trim()) return
        
        setPosting(true)
        try {
            const { createClient } = await import('@/utils/supabase/client')
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (user) {
                await supabase.from('community_posts').insert({
                    user_id: user.id,
                    content: content,
                    post_type: 'general'
                })
            }
            setContent('')
            onClose()
        } catch (e) {
            console.error(e)
        } finally {
            setPosting(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 md:p-4"
                >
                    <motion.div 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        className="w-full max-w-lg bg-[#111] border border-white/10 rounded-t-3xl sm:rounded-2xl p-6 sm:p-8"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-display text-2xl flex items-center gap-2">
                                New <span className="text-apex-accent">Transmission</span>
                            </h2>
                            <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" alt="User" />
                            </div>
                            <div className="flex-1 w-full relative">
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Forge an update... PRs, thoughts, tips..."
                                    className="w-full bg-transparent border-none outline-none font-inter text-sm h-32 resize-none placeholder:text-apex-dim/80"
                                    autoFocus
                                />
                                
                                <div className="flex justify-between items-center pt-4 mt-2 border-t border-white/5">
                                    <div className="flex gap-4">
                                        <button className="text-apex-muted hover:text-apex-info transition-colors p-2 -ml-2 rounded-lg hover:bg-apex-info/10">
                                            <ImageIcon className="w-5 h-5" />
                                        </button>
                                        <button className="text-apex-muted hover:text-apex-warn transition-colors p-2 rounded-lg hover:bg-apex-warn/10">
                                            <Flame className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <button 
                                        onClick={handlePost} 
                                        disabled={posting || !content.trim()} 
                                        className="btn-primary px-6 py-2 text-sm rounded-xl disabled:opacity-50"
                                    >
                                        {posting ? 'Sending...' : 'Transmit'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
