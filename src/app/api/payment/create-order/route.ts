import { NextResponse, NextRequest } from "next/server";
import Razorpay from "razorpay"


export async function POST(req: NextRequest) {

    try {
        const { amount, note } = await req.json()

        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_TEST_API_KEY!,
            key_secret: process.env.RAZORPAY_TEST_SECRET_KEY!,
        })

        const options = {
            "amount": Number(amount) * 100,
            "currency": "INR",
            "name": "Vibe Code Editor",
            "receipt": "receipt_" + Math.floor(Math.random() * 10000),
            "notes": {
                note
            },
        };

        const order = await razorpay.orders.create(options)
        return NextResponse.json(order)

    } catch (error) {
        console.error("Error in create-order: ",error)
        return NextResponse.json({ error }, { status: 400 })
    }

}