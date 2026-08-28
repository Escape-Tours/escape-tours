import { NextResponse } from "next/server";
import { Resend } from "resend";
import BookingEmail from '../../emails/hotel-booking'; // relative path to the email component

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const apiKey = process.env.RESEND_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ success: true, message: "Email skipped" });
        }

        const resend = new Resend(apiKey);

        await resend.emails.send({
            from: 'Escape Tours <onboarding@resend.dev>',
            to: 'escapetourstz@gmail.com',
            subject: `New Booking Request: ${body.routeName}`,
            react: <BookingEmail {...body} /> // This calls the component in the other file
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}