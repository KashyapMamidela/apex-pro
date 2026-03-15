'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Cpu, CircleDot, User, Sparkles, Download, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Message = {
    role: 'user' | 'model'
    content: string
}

export default function ForgePage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', content: "Welcome to the **Elite Forge**. I'm your AI Coach. Tell me your goals, available equipment, and time constraints. Let's build a protocol." }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
    const [savedIndex, setSavedIndex] = useState<number | null>(null)
    const endOfMessagesRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMsg: Message = { role: 'user', content: input.trim() }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsLoading(true)

        // Placeholder for AI response
        setMessages(prev => [...prev, { role: 'model', content: '' }])

        try {
            const res = await fetch('/api/forge', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMsg] })
            })

            if (!res.ok) throw new Error('Failed to fetch response')

            const reader = res.body?.getReader()
            const decoder = new TextDecoder()
            let done = false

            while (reader && !done) {
                const { value, done: doneReading } = await reader.read()
                done = doneReading
                if (value) {
                    const chunk = decoder.decode(value, { stream: true })
                    setMessages(prev => {
                        const newMessages = [...prev]
                        const lastMsg = newMessages[newMessages.length - 1]
                        lastMsg.content += chunk
                        return newMessages
                    })
                }
            }
        } catch (error) {
            console.error(error)
            setMessages(prev => {
                const newMessages = [...prev]
                newMessages[newMessages.length - 1].content = "Connection to Elite Forge lost. Retrying... or check your connection."
                return newMessages
            })
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    const savePlan = async (text: string, index: number) => {
        try {
            const { createClient } = await import('@/utils/supabase/client')
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            
            if (!user) return

            // Minimal parsing, just saving the raw markdown
            const planDoc = {
                session_name: "Forge Protocol",
                duration_minutes: 45,
                estimated_calories: 300,
                xp_reward: 250,
                raw_markdown: text,
                exercises: []
            }

            await supabase.from('ai_plans').insert({
                user_id: user.id,
                plan_json: planDoc
            })
            
            setSavedIndex(index)
            setTimeout(() => setSavedIndex(null), 3000)
        } catch (e) {
            console.error('Failed to save plan:', e)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-6rem)] md:h-[calc(100vh-2rem)] py-4 px-4 sm:px-6 flex flex-col">
            
            {/* Header */}
            <div className="card-glass p-6 mb-4 flex justify-between items-center border-b border-apex-accent/20 border-t-0 border-x-0 rounded-b-none bg-[#050505]/80">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-apex-accent/10 border border-apex-accent/20 flex items-center justify-center relative shadow-[0_0_15px_rgba(255,212,0,0.1)]">
                        <Cpu className="w-6 h-6 text-apex-accent" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-apex-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-apex-accent"></span>
                        </span>
                    </div>
                    <div>
                        <h1 className="font-display text-2xl tracking-wide uppercase text-white shadow-text">Elite Forge</h1>
                        <p className="font-mono text-[10px] text-apex-accent tracking-[2px] uppercase">Neural Coach Online</p>
                    </div>
                </div>
                <div className="hidden sm:flex text-xs font-inter text-apex-muted items-center gap-2">
                    <CircleDot className="w-4 h-4 text-green-500 animate-pulse" /> Live Uplink
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-6 pr-2 custom-scrollbar pb-6 pl-1">
                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.role === 'model' && (
                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                                    <Sparkles className="w-4 h-4 text-apex-accent" />
                                </div>
                            )}

                            <div className={`relative max-w-[85%] md:max-w-[75%] p-5 rounded-2xl group ${
                                msg.role === 'user' 
                                    ? 'glass-panel bg-white/5 border border-white/10 text白 rounded-tr-sm ml-auto' 
                                    : 'card-glass border border-apex-accent/10 rounded-tl-sm text-apex-text/90 shadow-[0_0_20px_rgba(255,212,0,0.02)]'
                            }`}>
                                {msg.role === 'model' && msg.content && (
                                    <div className="absolute -right-3 -top-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <button 
                                            onClick={() => savePlan(msg.content, idx)}
                                            title="Save to Protocols"
                                            className="p-2 bg-[#111] border border-white/10 rounded-lg text-apex-muted hover:text-apex-accent transition-colors"
                                        >
                                            {savedIndex === idx ? <Check className="w-4 h-4 text-apex-accent" /> : <Download className="w-4 h-4" />}
                                        </button>
                                        <button 
                                            onClick={() => copyToClipboard(msg.content, idx)}
                                            title="Copy Text"
                                            className="p-2 bg-[#111] border border-white/10 rounded-lg text-apex-muted hover:text-white transition-colors"
                                        >
                                            {copiedIndex === idx ? <Check className="w-4 h-4 text-green-500" /> : <User className="w-4 h-4" />}
                                        </button>
                                    </div>
                                )}
                                
                                {msg.role === 'user' ? (
                                    <p className="font-inter text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                ) : (
                                    <div className="prose prose-invert prose-sm max-w-none prose-headings:font-display prose-headings:text-apex-accent prose-headings:tracking-widest prose-a:text-apex-info prose-strong:text-white">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {msg.content || '...'}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>

                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-lg bg-apex-accent/20 border border-apex-accent/30 flex items-center justify-center flex-shrink-0 mt-1">
                                    <User className="w-4 h-4 text-apex-accent" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 items-center pl-12 text-apex-muted text-sm font-inter">
                            <Sparkles className="w-4 h-4 animate-pulse text-apex-accent" /> Forging response...
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={endOfMessagesRef} />
            </div>

            {/* Input Area */}
            <div className="p-2 sm:p-4 card-glass shrink-0 mb-4 sm:mb-0 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-apex-accent/5 to-transparent rounded-2xl pointer-events-none" />
                <div className="relative flex gap-3 items-end">
                    <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Request a custom split, nutrition advice, or form critique..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 sm:py-4 font-inter text-sm text-white placeholder-apex-dim resize-none outline-none focus:border-apex-accent/50 transition-colors min-h-[50px] max-h-[120px]"
                        rows={1}
                        style={{ height: input.split('\n').length > 1 ? 'auto' : '50px' }}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="h-[50px] w-[50px] rounded-xl btn-primary flex items-center justify-center flex-shrink-0 disabled:opacity-50 transition-all hover:scale-105 active:scale-95 text-black"
                    >
                        <Send className="w-5 h-5 ml-1" />
                    </button>
                </div>
                <div className="text-center mt-2 text-[10px] font-mono uppercase tracking-[1px] text-apex-dim">
                    AI generated protocols should be reviewed before execution. Avoid injury.
                </div>
            </div>

        </div>
    )
}
