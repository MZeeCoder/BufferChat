import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';


// GET messages
export async function GET() {
    try {
        const supabase = await createClient();

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
        const supabase = await createClient();
        const { message, sessionId } = await req.json();
        const apiKey = process.env.NEXT_PUBLIC_HF_API_KEY;

        // 1. STORE USER MESSAGE
        const { error: userError } = await supabase
            .from('messages')
            .insert([{ session_id: sessionId, role: 'user', content: message }]);

        if (userError) return NextResponse.json({ error: userError.message }, { status: 500 });

        // 2. FETCH CONTEXT (Previous 3 messages + Summary)
        // Get the summary from the session
        const { data: sessionData } = await supabase
            .from('chat_sessions')
            .select('summary')
            .eq('id', sessionId)
            .single();

        // Get last 3 messages for history
        const { data: history } = await supabase
            .from('messages')
            .select('role, content')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: false })
            .limit(4); // limit 4 because we just added the new message

        // 3. PREPARE THE PROMPT FOR HUGGING FACE
        // We reverse the history so it's in chronological order for the AI
        const formattedHistory = history?.reverse().map(m => ({ role: m.role, content: m.content })) || [];

        // Add the summary as a 'system' message so the AI knows the past
        const systemMessage = {
            role: "system",
            content: `Previous chat summary: ${sessionData?.summary || "No previous history."}`
        };

        // 4. CALL HUGGING FACE
        const res = await fetch("https://router.huggingface.co/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "meta-llama/Llama-3.3-70B-Instruct",
                messages: [systemMessage, ...formattedHistory], // Summary + History + Current Message
                max_tokens: 500,
            }),
        });

        const response = await res.json();
        if (!res.ok) return NextResponse.json({ error: 'HF API Error' }, { status: res.status });

        const aiResponse = response.choices[0].message.content;

        // 5. STORE ASSISTANT RESPONSE
        const { error: assistantError } = await supabase
            .from('messages')
            .insert([{ session_id: sessionId, role: 'assistant', content: aiResponse }]);

        if (assistantError) return NextResponse.json({ error: assistantError.message }, { status: 500 });

        // 6. TRIGGER SUMMARY CHECK (Optional but recommended)
        // You could check message count here and update the summary if it hits 10

        return NextResponse.json({ data: aiResponse });

    } catch (err) {
        console.error('Server error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}