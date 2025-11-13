"use server"

import { db } from "@/lib/db";
import { UserCardProps } from "../types";


export async function topTen(): Promise<UserCardProps[]> {

    const top10ByAmount = await db.payment.findMany({
        where: {
            status: "SUCCESS"
        },
        orderBy: {
            amount: "desc"
        },
        take: 10,
        select: {
            name: true,
            amount: true,
            currency: true,
            status: true,
            email: true,
            phone: true,
            note: true,
            createdAt: true
        }
    })

    // @ts-ignore
    return top10ByAmount
}