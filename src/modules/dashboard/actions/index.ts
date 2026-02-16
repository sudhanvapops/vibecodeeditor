"use server"

import { db } from "@/lib/db"
import { currentUser } from "@/modules/auth/actions"
import { revalidatePath } from "next/cache"

import { Data } from "../types" 


export const toggleStarMarked = async (playgroundId: string, isChecked: boolean) => {
    
    const user = await currentUser()
    const userId = user?.id

    if (!userId) {
        throw new Error("User Id is required")
    }

    try {

        if (isChecked) {
            await db.starMark.create({
                data: {
                    userId: userId,
                    playgroundId,
                    isMarked: isChecked
                }
            })
        } else {
            await db.starMark.delete({
                where: {
                    userId_playgroundId: {
                        userId,
                        playgroundId
                    }
                }
            })
        }

        revalidatePath('/dashboard', 'layout')
        revalidatePath('/dashboard', 'page')
        
        return {
            success: true,
            isMarked: isChecked
        }

    } catch (error) {
        console.error(`Error in toggleStarMarked: ${error}`)
        return {
            success: true,
            isMarked: isChecked,
            error
        }
    }
}

// all the playGround data of currently loged in user
export const getAllPlaygroundForUser = async () => {

    const user = await currentUser()

    try {
        const playground = await db.playground.findMany({
            where: {
                userId: user?.id
            },
            include: {
                user: true,
                starMark: {
                    where: {
                        userId: user?.id
                    },
                    select: {
                        isMarked: true
                    }
                }
            }
        })

        // console.log("All Play Ground",playground)
        return playground
    } catch (error) {
        console.log(`Error In getAllPlaygroundForUser: ${error}`)
    }
}

export const createPlayground = async (data: Data) => {
    
    const user = await currentUser()
    // Comes from Selecting Modal 
    const { template, title, description } = data

    try {
        const playground = await db.playground.create({
            data: {
                title,
                description,
                template,
                userId: user?.id!
            }
        })
        console.log(`Playground Created: ${playground.title} ${playground.template}`);

        return playground
    } catch (error) {
        console.log(`Error in createPlayground: ${error}`)
    }

}

export const editProjectById = async (id: string, data: {
    title: string,
    description?: string
}) => {
    try {
        const res = await db.playground.update({
            where: {
                id,
            },
            data
        })

        revalidatePath("/dashboard","layout")
        revalidatePath('/dashboard', 'page')
        console.log(`Project Updated: ${res.title}`);

    } catch (error) {
        console.log(`Error in editProjectById: ${error}`)
    }
}

export const duplicateProjectById = async (id: string) => {
    try {

        const originalPlaygroundData = await db.playground.findUnique({
            where: {
                id
            }
        })

        console.log(`originalPlaygroundData: ${originalPlaygroundData}`)

        if (!originalPlaygroundData) {
            throw new Error("Original playground not found")
        }

        const duplicatedPlayground = await db.playground.create({
            data: {
                title: `${originalPlaygroundData.title} (copy)`,
                description: originalPlaygroundData.description,
                template: originalPlaygroundData.template,
                userId: originalPlaygroundData.userId
            }
        })

        console.log(`PlayGround Duplicated: ${duplicatedPlayground.title}`)
        revalidatePath("/dashboard","layout")
        revalidatePath('/dashboard', 'page')

        return duplicatedPlayground

    } catch (error) {
        console.log(`Error in duplicateProjectById: ${error}`)
    }
}

export const deleteProjectById = async (id: string) => {
    try {
        const res = await db.playground.delete({
            where: { id }
        })

        // It’s a Next.js server utility that lets you manually invalidate cached data and trigger a re-fetch/re-render for a specific path
        // Server-only
        console.log(`\nProject deleted ${res.title}\n`)
        revalidatePath("/dashboard","layout")
        revalidatePath('/dashboard', 'page')
    } catch (error) {
        console.log(`Error in deleteProjectById: ${error}`)
    }
}