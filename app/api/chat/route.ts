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
        const apiKey = process.env.GEMINI_API_KEY;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }],
            }),
        });

        const response = await res.json();
        const aiResponse = response.candidates[0].content.parts[0].text;
        console.log('response:', aiResponse);

        return NextResponse.json({ text: aiResponse });

        const { data, error } = await supabase
            .from('messages')
            .insert([{ message, user_id }])
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (err) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
