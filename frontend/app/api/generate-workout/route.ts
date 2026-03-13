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

        // Construct the prompt
        const prompt = `You are an elite personal trainer and exercise scientist. Generate a detailed, science-backed workout plan.

USER PROFILE:
- Name: ${userProfile.name || 'Athlete'}
- Age: ${userProfile.age || 25}, Gender: ${userProfile.gender || 'unspecified'}
- Goal: ${userProfile.goal || 'fitness'}
- Experience: ${userProfile.experience_level || 'intermediate'}
- Body Type: ${userProfile.body_type || 'unspecified'}
- Equipment: ${userProfile.equipment || 'standard gym'}
- Workout Type: ${workoutType || 'gym'}
- Week: ${weekNumber || 1}

PREVIOUS WORKOUT CONTEXT:
${previousWorkouts && previousWorkouts.length > 0 ? JSON.stringify(previousWorkouts) : 'None provided'}

Generate a ${workoutType} workout for TODAY. Apply progressive overload principles.

Return ONLY a valid JSON object in this exact format, no markdown, no explanation:
{
  "session_name": "string",
  "focus": "string",
  "duration_minutes": number,
  "warmup": [{ "name": "string", "duration": "string", "instruction": "string" }],
  "exercises": [
    {
      "id": "string",
      "name": "string",
      "sets": number,
      "reps": "string",
      "rest_seconds": number,
      "weight_suggestion": "string",
      "muscle_group": "string",
      "secondary_muscles": ["string"],
      "form_cue": "string",
      "body_position": "string",
      "equipment_needed": "string"
    }
  ],
  "cooldown": [{ "name": "string", "duration": "string" }],
  "estimated_calories": number,
  "xp_reward": number
}`

        const result = await geminiPro.generateContent(prompt)
        const text = result.response.text()
        
        // Clean markdown parsing artifacts if any
        let cleanJson = text.trim()
        if (cleanJson.startsWith('\`\`\`json')) {
            cleanJson = cleanJson.replace(/^\`\`\`json\s*/, '').replace(/\s*\`\`\`$/, '')
        }
        
        const planJson = JSON.parse(cleanJson)

        // Cache the plan in Supabase
        const { data: planData, error: planError } = await supabase
            .from('ai_plans')
            .insert({
                user_id: user.id,
                plan_type: 'workout',
                workout_type: workoutType,
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
