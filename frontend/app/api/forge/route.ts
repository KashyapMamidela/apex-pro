import { NextRequest } from 'next/server'
import { groqStream } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const formattedMessages = messages.map((m: any) => ({
      role: m.role === 'model' ? 'assistant' : m.role,
      content: m.content
    }))

    const systemInstruction = "You are the Elite Forge AI, an elite fitness and nutrition coach integrated into the ApexPro app. Your tone is intense, high-energy, motivational, and highly technical. You don't make excuses. Build custom workout and diet plans using structured Markdown, including tables where appropriate. Always encourage the athlete to push beyond their limits."

    const stream = await groqStream(formattedMessages, systemInstruction)

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || ''
            if (text) {
              controller.enqueue(new TextEncoder().encode(text))
            }
          }
          controller.close()
        } catch (e) {
          controller.error(e)
        }
      }
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache, no-transform',
      }
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}
