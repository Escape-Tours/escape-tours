import { NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize Resend safely
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!resend) {
            console.warn("Resend not initialized: Missing API Key.");
            return NextResponse.json({ success: true, warning: "Email service disabled" });
        }

        // Professional HTML Template: Dynamically maps your form body to a clean table
        const htmlContent = `
            <div style="font-family: sans-serif; max-width: 600px; color: #334155;">
                <h2 style="color: #0f172a;">New Booking Request 🏔️</h2>
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    ${Object.entries(body).map(([key, val]) => `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; text-transform: capitalize;">
                                ${key.replace(/([A-Z])/g, ' $1')}
                            </td>
                            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${val}</td>
                        </tr>
                    `).join('')}
                </table>
                <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
                    This is an automated notification from your Escape Tours production system.
                </p>
            </div>
        `;

        await resend.emails.send({
            from: 'Escape Tours <notifications@escapetourstz.com>',
            to: 'escapetourstz@gmail.com',
            subject: `New Booking: ${body.fullName || 'Client'}`,
            html: htmlContent
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Email API Error:", error);
        return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
    }
}