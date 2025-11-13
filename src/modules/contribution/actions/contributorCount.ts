"use server";

import { db } from "@/lib/db";

export async function contributorCount(): Promise<number> {
    const result = await db.payment.count({
        where: {
            status: "SUCCESS",
        },
    });

    return result; 
}

