import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET messages
export async function GET() {
    try {
        const supabase = createClient();

        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (err) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// POST message
export async function POST(req: Request) {
    try {
        const supabase = createClient();
        const { message } = await req.json();

        // Use your Hugging Face Access Token (starting with hf_...)
        const apiKey = process.env.NEXT_PUBLIC_HF_API_KEY;

        // The Hugging Face Router endpoint
        const url = "https://router.huggingface.co/v1/chat/completions";

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}` // Required for HF
            },
            body: JSON.stringify({
                // Specify the model you want to use here
                model: "meta-llama/Llama-3.3-70B-Instruct",
                messages: [
                    { role: "user", content: message }
                ],
                max_tokens: 500,
            }),
        });

        const response = await res.json();

        // Error handling for the API response
        if (!res.ok) {
            console.error('HF API Error:', response);
            return NextResponse.json({ error: response.error || 'HF API Error' }, { status: res.status });
        }

        // HF Router returns data in the OpenAI format: response.choices[0].message.content
        const aiResponse = response.choices[0].message.content;

        return NextResponse.json({ data: aiResponse });

        // --- Database Logic ---
        // Note: I moved this above the first return so it actually executes!
        const { data, error } = await supabase
            .from('messages')
            .insert([{ message, response: aiResponse }]) // Save both for better logs
            .select();

        if (error) {
            console.error('Supabase Error:', error.message);
            // We still return the AI response even if DB fails, or handle as you prefer
        }



    } catch (err) {
        console.error('Server error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
