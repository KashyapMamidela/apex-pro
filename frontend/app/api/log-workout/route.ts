import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// Simple XP scaling curve: Base XP per level * Level multiplier
const getLevelRequirements = (level: number) => {
    return Math.floor(1000 * Math.pow(1.5, level - 1))
}

const getLevelLabel = (level: number) => {
    if (level < 5) return 'BEGINNER'
    if (level < 15) return 'CHALLENGER'
    if (level < 25) return 'VETERAN'
    if (level < 40) return 'ELITE'
    return 'APEX PREDATOR'
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await req.json()
        const { planId, exercisesCompleted, durationMinutes, xpEarned } = body

        // 1. Insert Workout Log
        const { error: logError } = await supabase
            .from('workout_logs')
            .insert({
                user_id: user.id,
                plan_id: planId,
                exercises_completed: exercisesCompleted,
                duration_minutes: durationMinutes,
                xp_earned: xpEarned,
                completed: true
            })

        if (logError) throw logError

        // 2. Fetch current user stats
        const { data: currentStats } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .single()

        let newXp = (currentStats?.xp || 0) + xpEarned
        let currentLevel = currentStats?.level || 1
        let levelUp = false

        // 3. Process Level Ups
        let reqXp = getLevelRequirements(currentLevel)
        while (newXp >= reqXp) {
            newXp -= reqXp
            currentLevel++
            levelUp = true
            reqXp = getLevelRequirements(currentLevel)
        }

        const newLabel = getLevelLabel(currentLevel)

        // 4. Update Stats
        const newStats = {
            user_id: user.id,
            xp: newXp,
            level: currentLevel,
            level_label: newLabel,
            total_workouts: (currentStats?.total_workouts || 0) + 1,
            updated_at: new Date().toISOString()
        }

        const { error: upsertError } = await supabase
            .from('user_stats')
            .upsert(newStats)

        if (upsertError) throw upsertError

        return NextResponse.json({ 
            success: true, 
            xpAwarded: xpEarned, 
            levelUp, 
            newLevel: currentLevel,
            newLabel
        })

    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Error saving workout log' }, { status: 500 })
    }
}
