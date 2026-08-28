import { NextResponse } from "next/server";
import { Resend } from "resend";

// Initialize outside the handler if the key is guaranteed to be available in env,
// but keep the check inside for safety.
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!resend) {
            console.warn("Resend not initialized: Missing API Key.");
            return NextResponse.json({ success: true, warning: "Email service disabled" });
        }

        // Professional HTML Template
        const htmlContent = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
                <h1 style="color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">New Booking: ${body.routeName}</h1>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    ${Object.entries(body).map(([key, val]) => `
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9; font-weight: bold; text-transform: capitalize;">
                                ${key.replace(/([A-Z])/g, ' $1')}
                            </td>
                            <td style="padding: 10px; border-bottom: 1px solid #f1f5f9;">${val}</td>
                        </tr>
                    `).join('')}
                </table>
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; font-size: 14px;">
                    <p><strong>Status:</strong> New Lead | <strong>System:</strong> EscapeTours Production</p>
                </div>
            </div>
        `;

        await resend.emails.send({
            from: 'Escape Tours <notifications@escapetourstz.com>', // Use your domain
            to: 'escapetourstz@gmail.com',
            subject: `New Booking: ${body.fullName} - ${body.routeName}`,
            html: htmlContent
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Email API Error:", error);
        return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
    }
}