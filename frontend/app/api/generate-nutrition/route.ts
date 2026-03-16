import { NextResponse } from 'next/server'
import { geminiPro } from '@/lib/gemini'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await req.json()
        const { userProfile, answers } = body

        const bmi = userProfile.weight && userProfile.height
            ? (userProfile.weight / ((userProfile.height / 100) ** 2)).toFixed(1)
            : 'unknown'

        const prompt = `You are an expert sports nutritionist and dietitian. Generate a personalized daily meal plan.

USER PROFILE:
- Name: ${userProfile.name || 'Athlete'}
- Age: ${userProfile.age || 25} | Gender: ${userProfile.gender || 'unspecified'}
- Height: ${userProfile.height || 170}cm | Weight: ${userProfile.weight || 70}kg | BMI: ${bmi}
- Primary Goal: ${userProfile.goal || 'general_fitness'}
- Activity Level: ${userProfile.activity_level || 'lightly_active'}
- Diet Preference: ${userProfile.diet || answers?.preference || 'flexible'}
- Workout Days Per Week: ${userProfile.workout_days || 3}

CALCULATION INSTRUCTIONS:
1. Calculate BMR using Mifflin-St Jeor formula:
   - Male: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
   - Female: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
   - Other: use male formula as default
2. Multiply BMR by activity multiplier: sedentary=1.2, lightly_active=1.375, moderately_active=1.55, very_active=1.725
3. For fat_loss: subtract 400 calories. For muscle_gain or weight_gain: add 400 calories. Others: maintain TDEE.
4. Protein: 1.6-2.2g per kg bodyweight for muscle_gain/strength/weight_gain, 1.2-1.6g for fat_loss, 1.0-1.2g for general
5. Fat: 25-35% of total calories. Carbs: remaining calories.

DIET RULES:
- If diet is 'veg': NO meat, fish, or eggs. Use paneer, tofu, lentils, chickpeas, dairy, nuts as protein sources.
- If diet is 'non_veg': Include chicken, fish, eggs, and dairy freely.
- If diet is 'flex': Mix of both — primarily plant-based with eggs and occasionally chicken/fish.
- Include BOTH Indian and international food options. Don't limit to only South Indian food.
- For breakfast: Include options from both Indian (poha, upma, idli, eggs, parathas) and global (oats, Greek yogurt, smoothies)
- Portions must match the calculated calorie target exactly.

Generate 3 main meals and 1-2 snacks for TODAY.

Return ONLY a valid JSON object, no markdown:
{
  "daily_calories": number,
  "protein_g": number,
  "carbs_g": number,
  "fat_g": number,
  "water_ml": number,
  "meals": [
    {
      "type": "Breakfast|Lunch|Dinner|Morning Snack|Evening Snack",
      "name": "string",
      "calories": number,
      "macros": { "protein": number, "carbs": number, "fat": number },
      "ingredients": ["string with quantity, e.g. '2 eggs'", "string"],
      "preparation_time": "string (e.g. '10 mins')",
      "recipe_tip": "string (brief cooking instruction)"
    }
  ],
  "nutrition_tip": "string (a personalized tip for this user based on their goal and profile)"
}`

        const result = await geminiPro.generateContent(prompt)
        let text = result.response.text().trim()
        if (text.startsWith('```json')) text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '')
        else if (text.startsWith('```')) text = text.replace(/^```\s*/, '').replace(/\s*```$/, '')

        const planJson = JSON.parse(text)

        // Save plan to Supabase — normalize field names for backward compat
        const normalized = {
            ...planJson,
            total_calories: planJson.total_calories || planJson.daily_calories,
            water_oz: planJson.water_oz || Math.round((planJson.water_ml || 2500) / 29.57),
        }

        const { data: planData, error } = await supabase
            .from('ai_plans')
            .insert({
                user_id: user.id,
                plan_type: 'diet',
                plan_json: normalized
            })
            .select()
            .single()

        if (error) console.error('Failed to save diet plan:', error)

        return NextResponse.json({ plan: normalized, plan_id: planData?.id })
    } catch (e: any) {
        console.error('Nutrition generation error:', e)
        return NextResponse.json({ error: e.message || 'Error generating nutrition plan' }, { status: 500 })
    }
}
