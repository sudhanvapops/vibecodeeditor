import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
    try {

        const { orderId } = await req.json();

        if (!orderId) {
            console.error("No Order id is provided")
            return NextResponse.json({ success: false }, { status: 400 });
        }

        await db.payment.updateMany({
            where: {
                razorpayOrderId: orderId
            },
            data: { status: "CANCELLED" }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.log("Error In Cancling order", error)
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        )
    }
}
