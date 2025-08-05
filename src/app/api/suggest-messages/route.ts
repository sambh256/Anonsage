// /app/api/suggest-messages/route.ts - Groq API (Best Free Alternative)

import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

interface CacheEntry {
    data: string;
    timestamp: number;
}

// Simple in-memory cache
const cache = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        // Check cache first
        const cachedResponse = getCachedResponse();
        if (cachedResponse) {
            console.log('Returning cached response');
            return new NextResponse(cachedResponse, {
                headers: { 
                    'Content-Type': 'text/plain',
                    'X-Source': 'cache'
                }
            });
        }

        // Try Groq API if key is available
        if (process.env.GROQ_API_KEY) {
            try {
                console.log('Trying Groq API...');
                const result = await tryGroqAPI();
                
                if (result && validateQuestionFormat(result)) {
                    console.log('✅ Groq API succeeded:', result);
                    setCachedResponse(result);
                    return new NextResponse(result, {
                        headers: { 
                            'Content-Type': 'text/plain',
                            'X-Source': 'groq'
                        }
                    });
                }
            } catch (error) {
                console.error('Groq API failed:', error);
            }
        } else {
            console.log('No GROQ_API_KEY found in environment variables');
        }

        // Try other free APIs
        const otherResult = await tryOtherFreeAPIs();
        if (otherResult && validateQuestionFormat(otherResult)) {
            console.log('✅ Alternative API succeeded:', otherResult);
            setCachedResponse(otherResult);
            return new NextResponse(otherResult, {
                headers: { 
                    'Content-Type': 'text/plain',
                    'X-Source': 'alternative-api'
                }
            });
        }

        // Fallback to curated questions
        console.log('All APIs failed, using fallback');
        const fallbackQuestions = getFallbackQuestions();
        
        return new NextResponse(fallbackQuestions, {
            headers: { 
                'Content-Type': 'text/plain',
                'X-Source': 'fallback'
            }
        });

    } catch (error) {
        console.error("Critical error:", error);
        const fallbackQuestions = getFallbackQuestions();
        return new NextResponse(fallbackQuestions, {
            headers: { 
                'Content-Type': 'text/plain',
                'X-Source': 'fallback-error'
            }
        });
    }
}

async function tryGroqAPI(): Promise<string | null> {
    const prompt = `Generate exactly 3 engaging questions for an anonymous social messaging platform. Format your response as a single line with each question separated by '||'. 

Example: "What's your favorite hobby?||What makes you smile?||If you could travel anywhere, where would you go?"

Requirements:
- Universal themes suitable for all ages
- Avoid personal/sensitive topics  
- Each question should be thought-provoking but light
- Format: question1||question2||question3

Generate 3 new questions now:`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "llama3-8b-8192", // Free model on Groq
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 200,
            temperature: 0.8
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();
    
    if (content) {
        // Extract the line with || if the AI generated extra text
        const lines = content.split('\n');
        for (const line of lines) {
            if (line.includes('||')) {
                return line.trim();
            }
        }
        return content;
    }
    
    return null;
}

async function tryOtherFreeAPIs(): Promise<string | null> {
    // Try together.ai if available
    if (process.env.TOGETHER_API_KEY) {
        try {
            console.log('Trying Together AI...');
            const response = await fetch("https://api.together.xyz/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.TOGETHER_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "meta-llama/Llama-2-7b-chat-hf",
                    messages: [
                        {
                            role: "user",
                            content: "Generate 3 questions separated by ||: What's your favorite hobby?||What makes you smile?||"
                        }
                    ],
                    max_tokens: 150,
                    temperature: 0.8,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const content = data.choices[0]?.message?.content?.trim();
                if (content && content.includes('||')) {
                    return content;
                }
            }
        } catch (error) {
            console.error('Together AI failed:', error);
        }
    }

    // Try OpenRouter free tier if available
    if (process.env.OPENROUTER_API_KEY) {
        try {
            console.log('Trying OpenRouter...');
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000", // Required by OpenRouter
                },
                body: JSON.stringify({
                    model: "meta-llama/llama-3.2-3b-instruct:free", // Free model
                    messages: [
                        {
                            role: "user",
                            content: "Generate 3 questions separated by ||: What's your favorite hobby?||What makes you smile?||What's your dream destination?"
                        }
                    ],
                    max_tokens: 150,
                    temperature: 0.8,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const content = data.choices[0]?.message?.content?.trim();
                if (content && content.includes('||')) {
                    return content;
                }
            }
        } catch (error) {
            console.error('OpenRouter failed:', error);
        }
    }

    return null;
}

function validateQuestionFormat(text: string): boolean {
    if (!text || typeof text !== 'string') return false;
    if (!text.includes('||')) return false;
    
    const questions = text.split('||').map(q => q.trim()).filter(q => q.length > 0);
    return questions.length >= 2 && questions.length <= 4 && 
           questions.every(q => q.length >= 5 && q.length <= 300);
}

function getCachedResponse(): string | null {
    const cached = cache.get('questions');
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
}

function setCachedResponse(data: string): void {
    cache.set('questions', {
        data,
        timestamp: Date.now()
    });
}

function getFallbackQuestions(): string {
    const questionSets: string[] = [
        "What's a skill you'd love to learn this year?||If you could live in any fictional world, which would you choose?||What's the best advice you've ever received?",
        "What's your go-to comfort food?||If you could master any instrument overnight, what would it be?||What's a small act of kindness that made your day?",
        "What's the most interesting documentary you've watched?||If you could have any superpower for a day, what would it be?||What's a tradition you'd like to start?",
        "What's a hobby that brings you peace?||If you could time travel to any era, when would you visit?||What's something that never fails to make you smile?",
        "What's the best book you've read recently?||If you could learn any language fluently, which would it be?||What's a simple pleasure you enjoy daily?",
        "What's your favorite way to spend a rainy day?||If you could have dinner with any fictional character, who would it be?||What's a goal you're working towards?",
        "What's a place you'd love to visit someday?||If you could instantly become an expert at something, what would it be?||What's a memory that always makes you happy?",
        "What's your favorite season and why?||If you could solve one world problem, what would it be?||What's something new you tried recently?",
        "What's a movie that you can watch over and over?||If you could have any job for a week, what would it be?||What's something you're grateful for today?",
        "What's your ideal way to spend a weekend?||If you could create a new holiday, what would it celebrate?||What's a compliment you'll never forget?",
        "What's something that always makes you laugh?||If you could have any animal as a pet, what would it be?||What's your favorite way to relax?",
        "What's a place that holds special memories for you?||If you could learn any skill instantly, what would it be?||What's something you're looking forward to?"
    ];
    
    const randomIndex = Math.floor(Math.random() * questionSets.length);
    return questionSets[randomIndex];
}