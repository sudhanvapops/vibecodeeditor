import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";

export async function POST(req: NextRequest) {

    try {

        const { to, subject, message } = await req.json();
        const transporter = await sendMail();

        if (!process.env.SMTP_USER || !process.env.SMTP_MAIL_PASSWORD || !transporter) {
            console.error("SMTP not configured; skipping email send in dev.");
            return NextResponse.json({ success: false, message: "SEND MAIL Error" },{status:400});
        }

        if (!to || !subject || !message) {
            return NextResponse.json({ success: false, message: "MAIL TO, FROM MESSAGE Not There" });
        }

        const info = await transporter.sendMail({
            from: `"Vibe Code Editor" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html: message,
        });

        return NextResponse.json({ success: true, message: "Email sent successfully!", info }, { status: 200 });

    } catch (error: any) {
        console.error("Email error:", error);
        return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
    }
}