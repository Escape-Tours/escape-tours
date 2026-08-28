import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Access the API key INSIDE the function to protect the build
        const apiKey = process.env.RESEND_API_KEY;

        // 2. Fail gracefully if the key is missing instead of crashing the build
        if (!apiKey) {
            console.warn("RESEND_API_KEY is missing, skipping email.");
            return NextResponse.json({ success: true, message: "Booking saved (email skipped)" });
        }

        // 3. Initialize ONLY here, where it is safe
        const resend = new Resend(apiKey);

        await resend.emails.send({
            from: 'Escape Tours <onboarding@resend.dev>',
            to: 'escapetourstz@gmail.com',
            subject: 'New Booking Request',
            html: `<p>New booking request details: ${JSON.stringify(body)}</p>`
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}