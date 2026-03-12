export type Goal = 'muscle_gain' | 'fat_loss' | 'strength' | 'endurance';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type Equipment = 'full_gym' | 'dumbbells_only' | 'home_workout';
export type FocusArea = 'chest' | 'back' | 'legs' | 'full_body';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    goal: Goal;
    experience_level: ExperienceLevel;
    equipment: Equipment;
    focus_area: FocusArea;
    created_at: string;
}

export interface WorkoutHistory {
    id: string;
    user_id: string;
    workout_id: string;
    exercise_name: string;
    sets: number;
    reps: number;
    weight: number | null;
    completed: boolean;
    date: string;
    created_at: string;
}

export interface Progress {
    id: string;
    user_id: string;
    date: string;
    weight: number | null;
    chest: number | null;
    waist: number | null;
    arms: number | null;
    thighs: number | null;
    progress_photo: string | null;
    created_at: string;
}

export interface Streak {
    user_id: string;
    current_streak: number;
    longest_streak: number;
    last_active_date: string;
    updated_at: string;
}

export interface DailyScore {
    id: string;
    user_id: string;
    date: string;
    score: number;
    workout_completed: boolean;
    diet_followed: boolean;
    water_goal: boolean;
    steps_goal: boolean;
    stretching_completed: boolean;
    created_at: string;
}

// Workout Generator specific types

export interface Exercise {
    name: string;
    sets: number;
    reps: string; // e.g., "8-10" or "5"
    rest: string; // e.g., "90s", "2m"
    recommended_weight_progression?: string;
    alternatives: string[];
}

export interface WorkoutSession {
    id: string;
    name: string; // e.g., "Chest & Triceps Hypertrophy"
    type: 'hypertrophy' | 'strength' | 'endurance' | 'recovery';
    warmup: string[]; // list of warm-up exercises
    exercises: Exercise[];
}

export interface WorkoutProgram {
    week: number;
    sessions: WorkoutSession[];
}
