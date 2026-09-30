import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// GET: Fetch all messages for a specific ride
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rideId = params.id;

    const { data: messages, error } = await supabase
      .from('ride_messages')
      .select('*')
      .eq('ride_id', rideId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, messages });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Send a new message within the ride chat
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rideId = params.id;
    const body = await request.json();
    const { senderId, senderRole, message } = body;

    if (!senderId || !senderRole || !message) {
      return NextResponse.json({ error: 'Missing required chat parameters' }, { status: 400 });
    }

    const { data: newMessage, error } = await supabase
      .from('ride_messages')
      .insert({
        ride_id: rideId,
        sender_id: senderId,
        sender_role: senderRole,
        message: message.trim()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, message: newMessage });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}