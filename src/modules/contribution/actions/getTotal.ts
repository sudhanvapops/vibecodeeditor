"use server"

import { db } from "@/lib/db"

export async function getTotalAmount():Promise<number> {
    
    const result = await db.payment.aggregate({
        where:{
            status: "SUCCESS"
        },
        _sum:{
            amount:true
        }
    })

    return result._sum.amount ?? 0
}