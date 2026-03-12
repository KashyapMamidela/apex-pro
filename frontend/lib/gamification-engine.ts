import { DailyScore, Streak } from '../types/fitness';

export const SCORE_WEIGHTS = {
    WORKOUT: 40,
    DIET: 30,
    WATER: 10,
    STEPS: 10,
    STRETCHING: 10
};

export const MAX_DAILY_SCORE = 100;

export function calculateDailyScore(activities: {
    workout_completed: boolean;
    diet_followed: boolean;
    water_goal: boolean;
    steps_goal: boolean;
    stretching_completed: boolean;
}): number {
    let score = 0;
    if (activities.workout_completed) score += SCORE_WEIGHTS.WORKOUT;
    if (activities.diet_followed) score += SCORE_WEIGHTS.DIET;
    if (activities.water_goal) score += SCORE_WEIGHTS.WATER;
    if (activities.steps_goal) score += SCORE_WEIGHTS.STEPS;
    if (activities.stretching_completed) score += SCORE_WEIGHTS.STRETCHING;

    return Math.min(score, MAX_DAILY_SCORE);
}

export function evaluateStreak(currentStreak: Streak, todayScore: number): Streak {
    const today = new Date().toISOString().split('T')[0];

    // Simple logic: If they got at least 50 points, it counts as an active day.
    const isActiveDay = todayScore >= 50;

    let newCurrentStreak = currentStreak.current_streak;
    let newLongestStreak = currentStreak.longest_streak;

    if (currentStreak.last_active_date === today) {
        // Already updated today
        return currentStreak;
    }

    const lastActive = new Date(currentStreak.last_active_date || "2000-01-01");
    const diffTime = Math.abs(new Date(today).getTime() - lastActive.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (isActiveDay) {
        if (diffDays <= 1) {
            newCurrentStreak += 1;
        } else {
            // Streak broken, skipped more than 1 day
            newCurrentStreak = 1;
        }
    } else if (diffDays > 1) {
        // Did not hit minimum score and missed a day
        newCurrentStreak = 0;
    }

    if (newCurrentStreak > newLongestStreak) {
        newLongestStreak = newCurrentStreak;
    }

    return {
        user_id: currentStreak.user_id,
        current_streak: newCurrentStreak,
        longest_streak: newLongestStreak,
        last_active_date: isActiveDay ? today : currentStreak.last_active_date,
        updated_at: new Date().toISOString()
    };
}
