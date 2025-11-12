import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import Razorpay from "razorpay"


export async function POST(req: NextRequest) {

    try {
        const { amount, note, fullName, email, phone } = await req.json()

        if (!amount || !fullName || !email || !phone) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }


        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_TEST_API_KEY!,
            key_secret: process.env.RAZORPAY_TEST_SECRET_KEY!,
        });
        const options = {
            "amount": Number.parseInt(amount) * 100,
            "currency": "INR",
            "receipt": "receipt_" + Math.floor(Math.random() * 10000),
            "notes": {
                note
            },
        };

        const order = await razorpay.orders.create(options)


        await db.payment.create({
            data: {
                razorpayOrderId: order.id,
                amount: Number(amount),
                name: fullName,
                email,
                phone,
                note,
                status: "PENDING",
            }
        })

        return NextResponse.json(order)

    } catch (error) {
        console.error("Error in create-order: ", error)
        return NextResponse.json({ error }, { status: 400 })
    }

}