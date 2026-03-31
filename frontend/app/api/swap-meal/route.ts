import { NextResponse } from 'next/server'
import { geminiPro } from '@/lib/gemini'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { originalMeal, userRequest, userProfile } = await req.json()

    const prompt = `You are a sports nutritionist. A user wants to swap their ${originalMeal.type} meal.

ORIGINAL MEAL:
Name: ${originalMeal.name}
Calories: ${originalMeal.calories}
Protein: ${originalMeal.macros.protein}g
Carbs: ${originalMeal.macros.carbs}g
Fat: ${originalMeal.macros.fat}g

USER REQUEST: ${userRequest}
USER GOAL: ${userProfile?.goal || 'general fitness'}
USER DIET: ${userProfile?.diet || 'flex'}

Create a replacement meal that:
1. Matches the user's request
2. Hits similar macros (within 10% calories)
3. Fits their diet preference

Return ONLY valid JSON, no markdown:
{
  "type": "${originalMeal.type}",
  "name": "string",
  "calories": number,
  "macros": { "protein": number, "carbs": number, "fat": number },
  "ingredients": ["string"],
  "preparation_time": "string",
  "recipe_tip": "string"
}`

    const result = await geminiPro.generateContent(prompt)
    let text = result.response.text().trim()
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }
    const meal = JSON.parse(text)
    return NextResponse.json({ meal })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to swap meal' }, { status: 500 })
  }
}
