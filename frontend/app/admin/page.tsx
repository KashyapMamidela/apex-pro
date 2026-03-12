'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LogOut, Users, Dumbbell, Utensils, Zap, Trash2 } from 'lucide-react'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalWorkouts: 0,
        totalMeals: 0,
        activeHabits: 0
    })
    interface AdminUserProfile {
        id: string;
        first_name: string;
        last_name: string;
        email: string;
        goal: string;
        current_plan: string;
        created_at: string;
    }

    const [users, setUsers] = useState<AdminUserProfile[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const fetchData = useCallback(async () => {
        setLoading(true)
        // In a real app, these would be separate queries or a view
        // For now, we fetch from the tables
        const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
        const { count: workoutsCount } = await supabase.from('workout_logs').select('*', { count: 'exact', head: true })
        const { count: mealsCount } = await supabase.from('meal_logs').select('*', { count: 'exact', head: true })
        const { count: habitsCount } = await supabase.from('habits').select('*', { count: 'exact', head: true })

        setStats({
            totalUsers: usersCount || 0,
            totalWorkouts: workoutsCount || 0,
            totalMeals: mealsCount || 0,
            activeHabits: habitsCount || 0
        })

        const { data: userData } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })

        if (userData) {
            setUsers(userData)
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const deleteUser = useCallback(async (id: string, email: string) => {
        if (email === 'admin@apex.com') {
            alert("Cannot delete admin.")
            return
        }

        if (!confirm(`Are you sure you want to delete ${email}?`)) return

        const { error } = await supabase.auth.admin.deleteUser(id)
        if (error) {
            alert(error.message)
        } else {
            fetchData()
        }
    }, [fetchData])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    return (
        <div className="min-h-screen bg-bg text-apex-text flex flex-col">
            <header className="bg-surface p-5 border-b border-border-main flex justify-between items-center px-8">
                <div className="font-display text-2xl tracking-[2px]">
                    APEX <span className="text-apex-accent">ADMIN</span>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-apex-muted hover:text-apex-text transition-colors text-sm font-medium">
                    <LogOut className="w-4 h-4" /> LOGOUT
                </button>
            </header>

            <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                        { label: 'Registered Users', val: stats.totalUsers, icon: <Users className="w-6 h-6 text-apex-accent" /> },
                        { label: 'Workouts Logged', val: stats.totalWorkouts, icon: <Dumbbell className="w-6 h-6 text-apex-accent" /> },
                        { label: 'Meals Logged', val: stats.totalMeals, icon: <Utensils className="w-6 h-6 text-apex-accent" /> },
                        { label: 'Active Habits', val: stats.activeHabits, icon: <Zap className="w-6 h-6 text-apex-accent" /> },
                    ].map((stat, i) => (
                        <div key={i} className="bg-surface border border-border-main p-6 text-center group hover:border-border-sub transition-all">
                            <div className="flex justify-center mb-4">{stat.icon}</div>
                            <div className="font-display text-[3rem] text-apex-accent leading-none mb-1.5">{stat.val}</div>
                            <div className="text-[0.9rem] text-apex-muted uppercase tracking-[1px]">{stat.label}</div>
                        </div>
                    ))}
                </div>

                <section>
                    <h3 className="font-display text-[1.8rem] mb-4 border-b border-border-main pb-2.5 uppercase">User Database</h3>

                    <div className="bg-surface border border-border-main overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/2">
                                    <th className="p-4 text-[0.85rem] text-apex-muted uppercase tracking-wider font-medium">Name</th>
                                    <th className="p-4 text-[0.85rem] text-apex-muted uppercase tracking-wider font-medium">Goal</th>
                                    <th className="p-4 text-[0.85rem] text-apex-muted uppercase tracking-wider font-medium">Plan</th>
                                    <th className="p-4 text-[0.85rem] text-apex-muted uppercase tracking-wider font-medium">Joined</th>
                                    <th className="p-4 text-[0.85rem] text-apex-muted uppercase tracking-wider font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u.id} className="border-b border-border-main hover:bg-white/2 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-apex-text">{u.first_name} {u.last_name}</div>
                                            <div className="text-xs text-apex-muted">{u.email}</div>
                                        </td>
                                        <td className="p-4 capitalize">{u.goal || 'N/A'}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-[4px] text-[0.75rem] font-bold ${u.current_plan === 'pro' ? 'bg-apex-accent/10 text-apex-accent' : 'bg-border-sub/50 text-apex-muted'
                                                }`}>
                                                {u.current_plan?.toUpperCase() || 'FREE'}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono text-xs text-apex-muted">
                                            {new Date(u.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => deleteUser(u.id, u.email)}
                                                className="p-2 text-apex-danger hover:bg-apex-danger/10 transition-colors rounded-[4px]"
                                                title="Terminate Athlete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-apex-muted">No athletes found in the system.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    )
}
