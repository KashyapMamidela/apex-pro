import { NextResponse } from 'next/server'
import { geminiFlash } from '@/lib/gemini'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await req.json()
        const { userProfile, workoutType } = body

        const prompt = `You are a fitness AI. Based on this athlete's profile, generate 2 quick check-in questions before their ${workoutType} workout today.

USER PROFILE:
Goal: ${userProfile.goal || 'fitness'}
Experience: ${userProfile.experience_level || 'intermediate'}
Age: ${userProfile.age || 25}

Return ONLY a JSON array of 2 question objects:
[
  { "question": "string (the question)", "options": ["Option 1", "Option 2", "Option 3"] }
]

Keep questions very short and conversational. Example: "How are your energy levels today?" or "Any muscle soreness?"`

        const result = await geminiFlash.generateContent(prompt)
        let text = result.response.text().trim()
        if (text.startsWith('\`\`\`json')) text = text.replace(/^\`\`\`json\s*/, '').replace(/\s*\`\`\`$/, '')
        
        const questions = JSON.parse(text)
        return NextResponse.json({ questions })
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Error generating questions' }, { status: 500 })
    }
}
