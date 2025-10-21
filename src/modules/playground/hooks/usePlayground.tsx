import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import type { TemplateFolder, TemplateItem } from "../lib/pathToJson-util";
import { getPlaygroundById, saveUpdatedCode } from "../actions";
import { sortFileExplorer } from "../lib/sortJson";

interface PlaygroundData {
    id: string,
    title?: string,
    [key: string]: any
}

interface UsePlaygroundReturn {
    playgroundData: PlaygroundData | null,
    templateData: TemplateItem | null,
    isLoading: boolean,
    error: string | null,
    loadPlayground: () => Promise<void>
    saveTemplateData: (data: TemplateFolder) => Promise<void>
}


export const usePlayground = (id: string): UsePlaygroundReturn => {

    const [playgroundData, setPlaygroundData] = useState<PlaygroundData | null>(null)
    const [templateData, setTemplateData] = useState<TemplateItem | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)


    const loadPlayground = useCallback(async () => {

        if (!id) return

        try {

            setIsLoading(true)
            setError(null)

            // db call
            const data = await getPlaygroundById(id)

            // @ts-ignore
            setPlaygroundData(data)
            const rawContent = data?.templateFiles?.[0]?.content

            if (typeof rawContent === "string") {
                const parsedContent = JSON.parse(rawContent)
                console.log(parsedContent)

                setTemplateData(()=>sortFileExplorer(parsedContent))
                toast.success("Playground loaded successfully")
                return
            }

            // For First Time Loading 
            const res = await fetch(`/api/template/${id}`)
            if (!res.ok) throw new Error(`Failed to load template: ${res.status}`)

            const templateRes = await res.json()

            // ? Dont know What is this 
            if (templateRes.templateJson && Array.isArray(templateRes.templateJson)) {
                setTemplateData({
                    folderName: "Root",
                    items: templateRes.templateJson
                })
            } else {
                setTemplateData(templateRes.templateJson || {
                    folderName: "Root",
                    items: []
                })
            }

            toast.success("Template Loaded Successfully")


        } catch (error) {
            console.error("Error loading playground loadPlayground: ", error)
            setError("Failed to load playground data")
            toast.error("Failed to load playground data")
        } finally {
            setIsLoading(false)
        }

    }, [id])

    const saveTemplateData = useCallback(async (data: TemplateFolder) => {
        try {
            const result = await saveUpdatedCode(id, data)
            if (result == null){
                throw new Error("Failed to save changes: unauthorized or not found")
            }
            setTemplateData(data)
            toast.success("Changed saved successfully")
        } catch (error) {
            console.error("Failed to save changes",error)
            toast.error("Failed to save changes")
            throw error
        }
    }, [id])

    useEffect(() => {
        loadPlayground()
    }, [loadPlayground])


    return {
        playgroundData,
        templateData,
        isLoading,
        error,
        loadPlayground,
        saveTemplateData
    }

}