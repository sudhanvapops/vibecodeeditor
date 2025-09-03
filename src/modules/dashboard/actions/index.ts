"use server"

import { db } from "@/lib/db"
import { currentUser } from "@/modules/auth/actions"

// all the playGround data of currentl loged in user
export const getAllPlaygroundForUser = async ()=>{

    const user = await currentUser()

    try {
        const playground = await db.playground.findMany({
            where:{
                userId: user?.id
            },
            include:{
                user:true
            }
        })

        console.log("All Play Ground",playground)
        return playground
    } catch (error) {
        console.log(`Error In getAllPlaygroundForUser: ${error}`)
    }
}