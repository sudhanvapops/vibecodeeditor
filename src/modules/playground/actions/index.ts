"use server"

import { db } from "@/lib/db"
import { TemplateFolder } from "../lib/pathToJson-util"
import { currentUser } from "@/modules/auth/actions"

export const getPlaygroundById = async (id: string) => {
    try {
        const playground = await db.playground.findUnique({
            where: {
                id
            },
            select: {
                title: true,
                templateFiles: {
                    select: {
                        content: true
                    }
                }
            }
        })

        return playground
    } catch (error) {
        console.error(`Error in getPlaygroundById: ${error}`)
    }
}

export const saveUpdatedCode = async (playgroundId: string, data: TemplateFolder) => {
    try {

        const user = await currentUser()
        if (!user) return null

        const playground = await db.playground.findUnique({
            where: {
                id: playgroundId
            },
            select: {
                userId: true
            }

        })

        if (!playground || playground.userId !== user.id) {
            throw new Error("Playground doesnt belongs to user")
        }

        const updatedPlayground = await db.templateFile.upsert({
            where: {
                playgroundId
            },
            update: {
                content: JSON.stringify(data)
            },
            create: {
                playgroundId,
                content: JSON.stringify(data)
            }
        })

        return updatedPlayground
    } catch (error) {
        console.error(`saveUpdatedCode Error: ${error}`)
        return null
    }

}