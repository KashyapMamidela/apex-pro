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

        const prompt = `You are an elite sports nutritionist. Generate a personalized daily meal plan based on the user's profile and questionnaire answers.

USER PROFILE:
Goal: ${userProfile.goal || 'fitness'}
Age: ${userProfile.age || 25}
Weight: ${userProfile.weight || 75}kg
Height: ${userProfile.height || 175}cm
Gender: ${userProfile.gender || 'unspecified'}

QUESTIONNAIRE:
${JSON.stringify(answers)}

Calculate estimated required daily calories and macros. Generate 3 meals and 1-2 snacks.

Return ONLY a valid JSON object in this exact format, no markdown or text:
{
  "total_calories": number,
  "protein_g": number,
  "carbs_g": number,
  "fat_g": number,
  "water_oz": number,
  "meals": [
    {
      "type": "Breakfast",
      "name": "string",
      "calories": number,
      "macros": { "protein": number, "carbs": number, "fat": number },
      "ingredients": ["string", "string"],
      "recipe_tip": "string"
    }
  ]
}`

        const result = await geminiPro.generateContent(prompt)
        let text = result.response.text().trim()
        if (text.startsWith('\`\`\`json')) text = text.replace(/^\`\`\`json\s*/, '').replace(/\s*\`\`\`$/, '')
        
        const planJson = JSON.parse(text)

        // Save plan to Supabase
        const { data: planData, error } = await supabase
            .from('ai_plans')
            .insert({
                user_id: user.id,
                plan_type: 'diet',
                plan_json: planJson
            })
            .select()
            .single()

        if (error) console.error('Failed to save diet plan:', error)

        return NextResponse.json({ plan: planJson, plan_id: planData?.id })
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Error generating nutrition plan' }, { status: 500 })
    }
}
