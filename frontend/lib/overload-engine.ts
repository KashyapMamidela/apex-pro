import { WorkoutHistory } from '../types/fitness';

export interface OverloadSuggestion {
    exercise_name: string;
    suggested_weight: number | null;
    suggested_reps: string;
    reason: string;
}

/**
 * Evaluates the user's previous performance on an exercise and suggests the next target.
 */
export function calculateProgressiveOverload(
    previousSession: WorkoutHistory[],
    targetRepsArray: number[] // e.g., the standard reps for the current plan, like [10, 10, 10]
): OverloadSuggestion | null {
    if (!previousSession || previousSession.length === 0) return null;

    const exercise_name = previousSession[0].exercise_name;
    const currentWeight = previousSession[0].weight || 0;

    // Check if they completed all sets and hit the max reps easily
    // Standard rule: If user completes max reps across all sets, increase weight by 2.5kg.

    let totalRepsCompleted = 0;
    let targetTotalReps = targetRepsArray.reduce((a, b) => a + b, 0);

    previousSession.forEach(set => {
        totalRepsCompleted += set.reps;
    });

    if (totalRepsCompleted >= targetTotalReps) {
        return {
            exercise_name,
            suggested_weight: currentWeight + 2.5,
            suggested_reps: `${targetRepsArray[0]}`,
            reason: `You smashed ${targetTotalReps} reps last time! Time to level up.`
        };
    } else {
        // If they failed reps, keep the same weight but suggest trying to hit the target reps
        return {
            exercise_name,
            suggested_weight: currentWeight,
            suggested_reps: `${targetRepsArray[0]}`,
            reason: `Keep pushing at ${currentWeight}kg until you hit all reps.`
        };
    }
}
