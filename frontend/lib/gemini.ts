import OpenAI from 'openai'

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
})

const callGroq = async (prompt: string) => {
  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 4096,
  })
  return {
    response: {
      text: () => res.choices[0]?.message?.content || ''
    }
  }
}

const callGroqStream = async (messages: { role: string, content: string }[], systemInstruction?: string) => {
  const formattedMessages: any[] = []
  if (systemInstruction) {
    formattedMessages.push({ role: 'system', content: systemInstruction })
  }
  formattedMessages.push(...messages.map(m => ({
    role: m.role === 'model' ? 'assistant' : m.role,
    content: m.content
  })))

  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: formattedMessages,
    temperature: 0.7,
    max_tokens: 4096,
    stream: true,
  })
  return stream
}

export const geminiPro = { generateContent: callGroq }
export const geminiFlash = { generateContent: callGroq }
export const groqStream = callGroqStream
