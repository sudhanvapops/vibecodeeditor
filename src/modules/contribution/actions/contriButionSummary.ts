"use server";

import { db } from "@/lib/db";
import { UserCardProps } from "../types";

export async function getContributionSummary() {
    const [sumResult, countResult, top10] = await db.$transaction([

        db.payment.aggregate({
            where: { status: "SUCCESS" },
            _sum: { amount: true },
        }),

        db.payment.count({
            where: { status: "SUCCESS" },
        }),

        db.payment.findMany({
            where: { status: "SUCCESS" },
            orderBy: { amount: "desc" },
            take: 10,
            select: {
                name: true,
                amount: true,
                currency: true,
                status: true,
                email: true,
                phone: true,
                note: true,
                createdAt: true,
            },
        }),
    ]);

    return {
        totalAmount: sumResult._sum.amount ?? 0,
        totalContributors: countResult,
        // @ts-ignore
        topContributors: top10 as UserCardProps[],
    };
}
