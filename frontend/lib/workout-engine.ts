import { Goal, ExperienceLevel, Equipment, FocusArea, Exercise, WorkoutSession, WorkoutProgram } from '../types/fitness';

// --- 1. Exercise Library & Alternatives ---

type ExerciseCategory = 'chest' | 'back' | 'legs' | 'shoulders' | 'biceps' | 'triceps' | 'core' | 'full_body';

interface ExerciseDef {
    id: string;
    name: string;
    category: ExerciseCategory;
    equipment: Equipment[];
    alternatives: string[]; // ids of alternatives
}

const EXERCISE_LIBRARY: Record<string, ExerciseDef> = {
    'bench_press': { id: 'bench_press', name: 'Barbell Bench Press', category: 'chest', equipment: ['full_gym'], alternatives: ['db_bench_press', 'machine_chest_press', 'pushups'] },
    'db_bench_press': { id: 'db_bench_press', name: 'Dumbbell Bench Press', category: 'chest', equipment: ['full_gym', 'dumbbells_only'], alternatives: ['bench_press', 'pushups'] },
    'machine_chest_press': { id: 'machine_chest_press', name: 'Machine Chest Press', category: 'chest', equipment: ['full_gym'], alternatives: ['db_bench_press', 'bench_press'] },
    'pushups': { id: 'pushups', name: 'Push Ups', category: 'chest', equipment: ['full_gym', 'dumbbells_only', 'home_workout'], alternatives: ['knee_pushups'] },
    'knee_pushups': { id: 'knee_pushups', name: 'Knee Push Ups', category: 'chest', equipment: ['full_gym', 'dumbbells_only', 'home_workout'], alternatives: [] },

    'squat': { id: 'squat', name: 'Barbell Squat', category: 'legs', equipment: ['full_gym'], alternatives: ['db_goblet_squat', 'leg_press', 'bodyweight_squat'] },
    'db_goblet_squat': { id: 'db_goblet_squat', name: 'Dumbbell Goblet Squat', category: 'legs', equipment: ['full_gym', 'dumbbells_only'], alternatives: ['squat', 'bodyweight_squat'] },
    'leg_press': { id: 'leg_press', name: 'Machine Leg Press', category: 'legs', equipment: ['full_gym'], alternatives: ['squat', 'db_goblet_squat'] },
    'bodyweight_squat': { id: 'bodyweight_squat', name: 'Bodyweight Squat', category: 'legs', equipment: ['full_gym', 'dumbbells_only', 'home_workout'], alternatives: ['lunges'] },

    'deadlift': { id: 'deadlift', name: 'Barbell Deadlift', category: 'back', equipment: ['full_gym'], alternatives: ['db_rdl', 'back_extension'] },
    'db_rdl': { id: 'db_rdl', name: 'Dumbbell RDL', category: 'legs', equipment: ['full_gym', 'dumbbells_only'], alternatives: ['deadlift', 'glute_bridges'] },

    'pullups': { id: 'pullups', name: 'Pull Ups', category: 'back', equipment: ['full_gym', 'home_workout'], alternatives: ['lat_pulldown', 'db_rows'] },
    'lat_pulldown': { id: 'lat_pulldown', name: 'Lat Pulldown', category: 'back', equipment: ['full_gym'], alternatives: ['pullups', 'db_rows'] },
    'db_rows': { id: 'db_rows', name: 'Dumbbell Rows', category: 'back', equipment: ['full_gym', 'dumbbells_only'], alternatives: ['lat_pulldown', 'pullups'] },

    'overhead_press': { id: 'overhead_press', name: 'Overhead Press', category: 'shoulders', equipment: ['full_gym'], alternatives: ['db_shoulder_press', 'pike_pushups'] },
    'db_shoulder_press': { id: 'db_shoulder_press', name: 'Dumbbell Shoulder Press', category: 'shoulders', equipment: ['full_gym', 'dumbbells_only'], alternatives: ['overhead_press'] },
    'pike_pushups': { id: 'pike_pushups', name: 'Pike Push Ups', category: 'shoulders', equipment: ['full_gym', 'dumbbells_only', 'home_workout'], alternatives: ['db_shoulder_press'] },

    'lateral_raises': { id: 'lateral_raises', name: 'Dumbbell Lateral Raises', category: 'shoulders', equipment: ['full_gym', 'dumbbells_only'], alternatives: ['cable_lateral_raises'] },
    'cable_lateral_raises': { id: 'cable_lateral_raises', name: 'Cable Lateral Raises', category: 'shoulders', equipment: ['full_gym'], alternatives: ['lateral_raises'] },

    'bicep_curls': { id: 'bicep_curls', name: 'Dumbbell Bicep Curls', category: 'biceps', equipment: ['full_gym', 'dumbbells_only'], alternatives: ['barbell_curls', 'cable_curls'] },
    'barbell_curls': { id: 'barbell_curls', name: 'Barbell Curls', category: 'biceps', equipment: ['full_gym'], alternatives: ['bicep_curls'] },
    'cable_curls': { id: 'cable_curls', name: 'Cable Curls', category: 'biceps', equipment: ['full_gym'], alternatives: ['bicep_curls'] },

    'tricep_extensions': { id: 'tricep_extensions', name: 'Overhead Tricep Extensions', category: 'triceps', equipment: ['full_gym', 'dumbbells_only'], alternatives: ['tricep_pushdowns', 'dips'] },
    'tricep_pushdowns': { id: 'tricep_pushdowns', name: 'Tricep Pushdowns', category: 'triceps', equipment: ['full_gym'], alternatives: ['tricep_extensions', 'dips'] },
    'dips': { id: 'dips', name: 'Dips', category: 'triceps', equipment: ['full_gym', 'home_workout'], alternatives: ['tricep_pushdowns'] },

    'glute_bridges': { id: 'glute_bridges', name: 'Glute Bridges', category: 'legs', equipment: ['full_gym', 'dumbbells_only', 'home_workout'], alternatives: ['lunges'] },
    'lunges': { id: 'lunges', name: 'Walking Lunges', category: 'legs', equipment: ['full_gym', 'dumbbells_only', 'home_workout'], alternatives: ['bodyweight_squat'] },
    'back_extension': { id: 'back_extension', name: 'Back Extension', category: 'back', equipment: ['full_gym'], alternatives: ['deadlift'] },
};

// --- 2. Warm-up System ---

const WARMUP_LIBRARY = [
    'Jumping Jacks (60s)',
    'Arm Circles (30s forward, 30s backward)',
    'Bodyweight Squats (15 reps)',
    'Hip Openers (10 each leg)',
    'Light Pushups (10 reps)',
    'High Knees (45s)',
    'Walking Lunges (20 steps)',
    'Plank to Downward Dog (10 reps)'
];

export function generateWarmupRoutine(count = 4): string[] {
    const shuffled = [...WARMUP_LIBRARY].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// --- 3. Rest Day Recovery System ---

const STRETCH_LIBRARY = [
    'Hamstring Stretch (60s each)',
    'Quad Stretch (60s each)',
    'Cobra Stretch (60s)',
    'Spinal Twist (60s each)',
    'Childs Pose (2 mins)',
    'Pigeon Pose (60s each)',
    'Calf Stretch (45s each)',
    'Butterfly Stretch (60s)'
];

export function generateRecoveryRoutine(count = 5): WorkoutSession {
    const shuffled = [...STRETCH_LIBRARY].sort(() => 0.5 - Math.random());
    return {
        id: `recovery-${Date.now()}`,
        name: 'Active Recovery & Mobility',
        type: 'recovery',
        warmup: [],
        exercises: shuffled.map(s => ({
            name: s,
            sets: 1,
            reps: 'time based',
            rest: '0s',
            alternatives: []
        }))
    };
}


// --- 4. Main Workout Engine ---

const REP_SCHEMES = {
    hypertrophy: { sets: 3, reps: '8-12', rest: '90s' },
    strength: { sets: 5, reps: '3-5', rest: '3-4m' },
    endurance: { sets: 3, reps: '15-20', rest: '60s' },
    fat_loss: { sets: 4, reps: '10-15', rest: '60s' },
};

export function generateWorkoutSession(
    goal: Goal,
    experience_level: ExperienceLevel,
    equipment: Equipment,
    focus: FocusArea | ExerciseCategory,
    isStrengthPhase: boolean = false
): WorkoutSession {

    // Select exercises that match equipment and focus
    const availableExercises = Object.values(EXERCISE_LIBRARY).filter(ex =>
        ex.equipment.includes(equipment) &&
        (focus === 'full_body' ? true : ex.category === focus)
    );

    // Pick 4-6 exercises depending on experience
    const numExercises = experience_level === 'beginner' ? 4 : experience_level === 'intermediate' ? 5 : 6;
    const selectedExercises = availableExercises.sort(() => 0.5 - Math.random()).slice(0, numExercises);

    // Determine standard rep scheme based on goal & phase
    let scheme = REP_SCHEMES[goal === 'muscle_gain' ? 'hypertrophy' : goal];
    if (isStrengthPhase) scheme = REP_SCHEMES.strength;

    const sessionExercises: Exercise[] = selectedExercises.map(ex => {
        // Resolve alternative names with safety guards
        const alts = ex.alternatives
            .filter(altId => EXERCISE_LIBRARY[altId] && EXERCISE_LIBRARY[altId].equipment.includes(equipment))
            .map(altId => EXERCISE_LIBRARY[altId].name);

        return {
            name: ex.name,
            sets: scheme.sets,
            reps: scheme.reps,
            rest: scheme.rest,
            alternatives: alts,
            recommended_weight_progression: isStrengthPhase ? '+2.5kg' : '+1kg or 1 extra rep'
        };
    });

    return {
        id: `workout-${Date.now()}`,
        name: `${focus.replace('_', ' ').toUpperCase()} ${goal === 'muscle_gain' ? 'Hypertrophy' : 'Workout'}`,
        type: isStrengthPhase ? 'strength' : 'hypertrophy',
        warmup: generateWarmupRoutine(),
        exercises: sessionExercises
    };
}

// --- Monthly Workout Rotation Engine ---
// Generates a week of workouts. Weekly rotation handles picking slightly different exercises.

export function generateWeeklyProgram(
    profile: { goal: Goal, experience_level: ExperienceLevel, equipment: Equipment, focus_area: FocusArea },
    weekNumber: number
): WorkoutProgram {

    let daysPerWeek = 3;
    if (profile.experience_level === 'intermediate') daysPerWeek = 5;
    if (profile.experience_level === 'advanced') daysPerWeek = 6;

    // Is it a strength phase? Every 6 weeks
    const isStrengthPhase = (weekNumber % 6 === 0);

    const sessions: WorkoutSession[] = [];

    // Let's create a basic split based on focus area / days.
    // For simplicity, if focus is full_body, we just do full body every day.
    // Otherwise we split. This is a rudimentary split engine.

    for (let i = 0; i < daysPerWeek; i++) {
        let dailyFocus: ExerciseCategory = 'full_body';

        if (profile.focus_area !== 'full_body') {
            // Very simple Push/Pull/Legs rotation style
            const splitRot = ['chest', 'back', 'legs', 'shoulders', 'arms'];
            dailyFocus = splitRot[i % splitRot.length] as ExerciseCategory;
        }

        sessions.push(generateWorkoutSession(
            profile.goal,
            profile.experience_level,
            profile.equipment,
            dailyFocus,
            isStrengthPhase
        ));
    }

    return {
        week: weekNumber,
        sessions
    };
}
