import { db } from "@/lib/db";
import { templatePaths } from "@/lib/template";
import { readTemplateStructureFromJson,saveTemplateStructureToJson } from "@/modules/playground/lib/pathToJson-util";
import path from "path";
import fs from "fs/promises"
import { NextRequest,NextResponse } from "next/server";


const validateJsonStructure = (data: unknown): boolean => {
    try {
        JSON.parse(JSON.stringify(data)) // ensures its serialzable
        return true
    } catch (error) {
        console.error("Invalid JSON structure: ",error)
        return false
    }
}

export async function GET(req: NextRequest,{params}:{params:Promise<{id:string}>}){

    const {id} = await params

    if(!id){
        return NextResponse.json({error:"Missing playground ID"},{status: 400})
    }


    const playground = await db.playground.findUnique({
      where:{
        id
      }  
    })

    if(!playground) {
        return NextResponse.json({error: "Playground not found"},{status:404})
    }

    // ?
    const templateKey = playground.template as keyof typeof templatePaths
    const templatePath = templatePaths[templateKey]

    // ! changed
    // if(!templatePath) return NextResponse.json({error:"Invalid template"},{status: 404})    
    
    try {
        const inputPath = path.join(process.cwd(),templatePath)
        const outputFile = path.join(process.cwd(), `output/${templateKey}.json`)

        await saveTemplateStructureToJson(inputPath,outputFile)
        const result = await readTemplateStructureFromJson(outputFile)

        if(!validateJsonStructure(result.items)) return NextResponse.json({error:"Invalid JSON Structure"},{status: 500})    

        // ! Uncomment it after 
        // Store the json and call it from db next time 
        await fs.unlink(outputFile)

        return NextResponse.json({
            success: true,
            templateJson: result
        },{
            status: 200
        })


    } catch (error) {
        console.error(`Error generating template JSON api: ${error}`)
        return NextResponse.json({
            error: "Failed to generate template"
        },{
            status: 500
        })
    }

}