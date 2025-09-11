"use client"

import { useRef, useEffect, useCallback } from "react"
import Editor, { type Monaco } from "@monaco-editor/react"
import { TemplateFile } from "../lib/pathToJson-util"
import { configureMonaco, defaultEditorOptions, getEditorLanguage } from "../lib/editorConfig"


interface PlaygroundEditorProps {

    activeFile: TemplateFile | undefined
    content: string
    onContentChange: (value: string) => void

    suggestion: string | null
    suggestionLoading: boolean
    suggestionPosition: { line: number; column: number } | null
    onAcceptSuggestion: (editor: any, monaco: any) => void
    onRejectSuggestion: (editor: any) => void
    onTriggerSuggestion: (type: string, editor: any) => void

}


const PlaygroundEditor = ({ activeFile,
    content,
    onContentChange,
    suggestion,
    suggestionLoading,
    suggestionPosition,
    onAcceptSuggestion,
    onRejectSuggestion,
    onTriggerSuggestion,
}: PlaygroundEditorProps) => {

    const editorRef = useRef<any>(null)
    const monacoRef = useRef<Monaco | null>(null)

    const updateEditorLanguage = () => {
        if (!activeFile || !monacoRef.current || !editorRef.current) return

        const model = editorRef.current.getModel()
        if (!model) return

        const language = getEditorLanguage(activeFile.fileExtension || "")

        try {
            monacoRef.current.editor.setModelLanguage(model, language)
        } catch (error) {
            console.warn("Failed to set editor language:", error)
        }
    }

    const handleEditorMount = (editor: any, monaco: Monaco) => {
        editorRef.current = editor
        monacoRef.current = monaco
        console.log("Editor instance Mounted: ", !!editorRef.current);

        editor.updateOptions({
            ...defaultEditorOptions
        })

        configureMonaco(monaco)

        updateEditorLanguage()
    }


    useEffect(()=>{
        updateEditorLanguage()
    },[])


    return (
        <div className="h-full relative">
            <Editor
                height={"100%"}
                value={content}
                onChange={(value) => onContentChange(value || "")}
                onMount={handleEditorMount}
                language={activeFile ? getEditorLanguage(activeFile.fileExtension || "") : "plaintext"}
                // @ts-ignore
                options={defaultEditorOptions}
            />
        </div>
    )
}

export default PlaygroundEditor
