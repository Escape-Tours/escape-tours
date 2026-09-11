import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 1. Save to Database
        const { error: dbError } = await supabase.from('leads').insert([
            {
                full_name: body.fullName,
                email: body.email,
                phone: body.phone,
                country: body.country,
                trip_type: body.tripType,
                travel_date: body.travel || null,
                return_date: body.returnDate || null,
                message: body.message,
            },
        ]);

        if (dbError) throw dbError;

        // 2. Send Email Notification
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'escapetourstz@gmail.com',
            subject: `New Inquiry from ${body.fullName}`,
            text: `Name: ${body.fullName}\nEmail: ${body.email}\nPhone: ${body.phone}\nMessage: ${body.message}`,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: "Failed to process" }, { status: 500 });
    }
}