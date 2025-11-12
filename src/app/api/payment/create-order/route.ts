import { NextResponse, NextRequest } from "next/server";
import Razorpay from "razorpay"


export async function POST(req: NextRequest) {

    try {
        const { amount, fullName, email, phone, note } = await req.json()

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        })

        const options = {
            "amount": Number(amount) * 100,
            "currency": "INR",
            "name": "Vibe Code Editor",
            "description": "Test Transaction",
            "order_id": "order_" + Math.floor(Math.random() * 1000000),
            "callback_url": `${process.env.URL}/contribution/payment`,
            "prefill": {
                "name": fullName,
                "email": email,
                "contact": phone
            },
            "notes": {
                note
            },
            "theme": {
                "color": "#3399cc"
            }
        };

        const order = await razorpay.orders.create(options)
        return NextResponse.json(order)

    } catch (error) {
        console.error("Error in create-order: ",error)
        return NextResponse.json({ error }, { status: 400 })
    }

}