import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize the Google Generative AI SDK with the API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// We define two models based on latency vs reasoning needs
// 1.5 Pro for complex plan generation (workouts, diets)
export const geminiPro = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

// 1.5 Flash for quick responses (question generation, brief analysis)
export const geminiFlash = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
