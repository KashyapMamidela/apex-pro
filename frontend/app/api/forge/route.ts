import { NextRequest } from 'next/server'
import { geminiPro } from '@/lib/gemini'

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json()
        
        // Convert standard chat format to Gemini history format
        const history = messages.slice(0, -1).map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }))
        const latestMessage = messages[messages.length - 1].content

        const chat = geminiPro.startChat({
            history,
            systemInstruction: "You are the Elite Forge AI, an elite fitness and nutrition coach integrated into the ApexPro app. Your tone is intense, high-energy, motivational, and highly technical. You don't make excuses. Build custom workout and diet plans using structured Markdown, including tables where appropriate. Always encourage the athlete to push beyond their limits."
        })

        const result = await chat.sendMessageStream(latestMessage)

        // Convert AsyncGenerator to standard ReadableStream for the browser
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        if (chunkText) {
                            controller.enqueue(new TextEncoder().encode(chunkText));
                        }
                    }
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
                'Cache-Control': 'no-cache, no-transform'
            }
        })

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
}
