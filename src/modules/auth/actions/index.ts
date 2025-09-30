"use server"

import {auth} from "@/auth"
import { db } from "@/lib/db"


export const getUserById = async (id:string) => {
    try {
        const user = await db.user.findUnique({
            where: {id},
            // this populates account 
            include:{
                accounts:true
            }
        })
        return user
    } catch (error) {
        console.log(`Error in getUserById: ${error}`)        
        return null
    }
}


export const getAccountByUserId = async (userId:string) => {
    try {
        const account = await db.account.findFirst({
            where:{
                userId
            }
        })

        return account
        
    } catch (error) {
        console.log(`Error in getAccountByUserId: ${error}`)        
        return null
    }
} 


export const currentUser = async () => {
    // Returns a Session Object
    const session = await auth()
    return session?.user
}