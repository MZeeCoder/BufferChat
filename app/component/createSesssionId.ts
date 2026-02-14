import { createClient } from "@/utils/supabase/client"; // Path to your supabase config

export async function generateNextSessionId() {
    const supabase = createClient(); // Initialize the client

    // 1. Check how many sessions exist
    const { count, error } = await supabase
        .from('chat_sessions')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error("Error fetching count:", error);
        return "bufferchat_error";
    }

    // 2. Calculate and format
    const nextNumber = (count || 0) + 1;
    const formattedNumber = String(nextNumber).padStart(3, '0');

    return `bufferchat${formattedNumber}`;
}