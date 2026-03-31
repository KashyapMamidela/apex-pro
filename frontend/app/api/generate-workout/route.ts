import { NextResponse } from 'next/server'
import { geminiPro } from '@/lib/gemini'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { userProfile, workoutType, weekNumber, previousWorkouts } = body

        const bmi = userProfile.weight && userProfile.height
            ? (userProfile.weight / ((userProfile.height / 100) ** 2)).toFixed(1)
            : 'unknown'

        const prompt = `You are an expert personal trainer and exercise scientist. Generate a highly personalized workout plan.

USER PROFILE:
- Name: ${userProfile.name || 'Athlete'}
- Age: ${userProfile.age || 25} years old
- Gender: ${userProfile.gender || 'unspecified'}
- Height: ${userProfile.height || 170}cm | Weight: ${userProfile.weight || 70}kg | BMI: ${bmi}
- Primary Goal: ${userProfile.goal || 'general_fitness'}
- Experience Level: ${userProfile.experience_level || 'beginner'}
- Activity Level Outside Gym: ${userProfile.body_type || 'lightly_active'}
- Available Equipment: ${userProfile.equipment || 'full_gym'}
- Preferred Session Duration: ${userProfile.session_duration || '45-60'} minutes
- Workout Days Per Week: ${userProfile.workout_days || 3}
- Sport / Athletic Focus: ${userProfile.sport_type || 'recreational'}
- Diet Preference: ${userProfile.diet_preference || 'flexible'}

IMPORTANT PERSONALIZATION RULES:
- If age is 50+, prioritize joint-friendly exercises, reduce high-impact movements, add more mobility work
- If age is under 18, avoid heavy compound movements with maximal loads, focus on form and bodyweight
- If goal is 'mobility', ONLY include stretching, yoga-style movements, and mobility drills — NO heavy lifting
- If goal is 'general_fitness', mix cardio, strength, and flexibility equally
- If goal is 'fat_loss', prioritize compound movements and keep rest periods short (30-60s)
- If goal is 'muscle_gain', use hypertrophy rep ranges (8-12 reps), longer rest (60-90s)
- If goal is 'strength', use heavy compound lifts (3-6 reps), long rest (2-4 min)
- If goal is 'weight_gain', use moderate-heavy compound lifts with high calorie expenditure in mind
- If equipment is 'home_workout' or 'resistance_bands', ONLY use bodyweight or band exercises
- If activity level is 'sedentary', start with lower volume and more rest
- If gender is 'female', include exercises targeting glutes and core more prominently
- Session duration must match the requested duration range
- Workout days affects weekly split — if 3 days: push/pull/legs or full body, if 5+ days: split muscle groups
- If sport is 'cricket_football': include explosive power exercises (box jumps, lateral shuffles, sprint drills), agility and change of direction work alongside strength training
- If sport is 'running_cycling': include more leg endurance, hip flexor work, and avoid excessive leg volume that causes fatigue for their sport
- If sport is 'martial_arts': include core rotation, striking power movements, grappling endurance circuits
- If sport is 'competitive_gym': periodize for powerlifting or bodybuilding depending on goal

PREVIOUS WORKOUT CONTEXT:
${previousWorkouts && previousWorkouts.length > 0 ? JSON.stringify(previousWorkouts) : 'First workout — start with baseline assessment weights'}

Generate exactly ONE workout session for TODAY that fits within ${userProfile.session_duration || '45-60'} minutes.

Return ONLY a valid JSON object, no markdown, no explanation:
{
  "session_name": "string (specific and motivating, e.g. 'Upper Body Power — Week 1')",
  "focus": "string (e.g. 'Chest, Shoulders, Triceps')",
  "duration_minutes": number,
  "difficulty": "beginner|intermediate|advanced",
  "warmup": [{ "name": "string", "duration": "string", "instruction": "string" }],
  "exercises": [
    {
      "id": "string",
      "name": "string",
      "sets": number,
      "reps": "string (e.g. '8-10' or '30 seconds')",
      "rest_seconds": number,
      "weight_suggestion": "string (e.g. 'Start with 60% of 1RM' or 'Bodyweight' or '10-15kg')",
      "muscle_group": "string",
      "secondary_muscles": ["string"],
      "form_cue": "string (the single most important coaching cue for this exercise)",
      "equipment_needed": "string"
    }
  ],
  "cooldown": [{ "name": "string", "duration": "string" }],
  "estimated_calories": number,
  "xp_reward": number,
  "coach_note": "string (a short personalized motivational note from the AI coach, using the user's name)"
}`

        const result = await geminiPro.generateContent(prompt)
        const text = result.response.text()

        // Clean markdown parsing artifacts if any
        let cleanJson = text.trim()
        if (cleanJson.startsWith('```json')) {
            cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        } else if (cleanJson.startsWith('```')) {
            cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '')
        }

        const planJson = JSON.parse(cleanJson)

        // Cache the plan in Supabase
        const { data: planData, error: planError } = await supabase
            .from('ai_plans')
            .insert({
                user_id: user.id,
                plan_type: 'workout',
                workout_type: workoutType || 'gym',
                plan_json: planJson
            })
            .select()
            .single()

        if (planError) {
            console.error('Failed to cache plan', planError)
        }

        return NextResponse.json({ plan: planJson, plan_id: planData?.id })

    } catch (error: any) {
        console.error('Error generating workout:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
