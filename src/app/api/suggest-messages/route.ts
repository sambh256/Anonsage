import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try{
        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a college and teenagers. Ask personal or sensitive topics, focusing instead on relationship and stuf. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a playful and college level conversational environment."


        const result = streamText({
            model: openai('gpt-4o'),
            prompt,
        });

        return result.toDataStreamResponse();
    }catch(error){
       
        console.error("An unexpected error occured",error)
        throw error    
        

    }
}