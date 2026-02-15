import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto"

export async function POST(req: NextRequest) {

    try {
        const body = await req.json()
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_TEST_SECRET_KEY!)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex")

        if (generated_signature === razorpay_signature) {
            await db.payment.updateMany({
                where: { 
                    razorpayOrderId: razorpay_order_id
                },
                data: {
                    status: "SUCCESS",
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature,
                },
            });
            return NextResponse.json({ success: true })
        } else {
            await db.payment.updateMany({
                where: { razorpayOrderId: razorpay_order_id },
                data: { status: "FAILED" },
            });
            return NextResponse.json({ success: false }, { status: 400 })
        }
    } catch (error) {
        console.error("Error in Veifying payment: ", error)
        return NextResponse.json({ success: false, error }, { status: 400 })
    }

}