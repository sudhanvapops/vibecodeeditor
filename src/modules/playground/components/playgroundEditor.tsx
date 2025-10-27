"use client"

import { useRef, useEffect } from "react"
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

const PlaygroundEditor = ({ 
    activeFile,
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
    const providerRef = useRef<any>(null)
    const suggestionAcceptedRef = useRef(false)

    const handleEditorDidMount = (editor: any, monaco: Monaco) => {
        editorRef.current = editor
        monacoRef.current = monaco

        // CRITICAL: Configure inline suggestions properly
        editor.updateOptions({
            ...defaultEditorOptions,
            inlineSuggest: {
                enabled: true,
                mode: "subwordSmart", // Changed from "prefix"
                showToolbar: "always",
                suppressSuggestions: false,
            },
            quickSuggestions: false,
            suggest: {
                preview: false,
                showInlineDetails: false,
            },
            acceptSuggestionOnCommitCharacter: false,
            acceptSuggestionOnEnter: "off",
        })

        configureMonaco(monaco)

        // Keyboard shortcuts
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space, () => {
            onTriggerSuggestion("completion", editor)
        })

        editor.addCommand(monaco.KeyCode.Escape, () => {
            if (suggestion) {
                onRejectSuggestion(editor)
            }
        })

        // Auto-trigger on typing patterns
        let typingTimeout: NodeJS.Timeout
        editor.onDidChangeModelContent((e: any) => {
            if (e.changes.length > 0 && !suggestionAcceptedRef.current) {
                const change = e.changes[0]
                
                // Check if this is our AI suggestion being inserted
                if (suggestion && change.text === suggestion.replace(/\r/g, "")) {
                    suggestionAcceptedRef.current = true
                    onAcceptSuggestion(editor, monaco)
                    setTimeout(() => {
                        suggestionAcceptedRef.current = false
                    }, 1000)
                    return
                }
                
                const triggerChars = ["\n", "{", ".", "=", "(", ",", ":", ";"]
                if (triggerChars.includes(change.text)) {
                    clearTimeout(typingTimeout)
                    typingTimeout = setTimeout(() => {
                        if (!suggestionLoading) {
                            onTriggerSuggestion("completion", editor)
                        }
                    }, 300)
                }
            }
        })
    }

    // Register inline completions provider dynamically
    useEffect(() => {
        if (!monacoRef.current || !activeFile) return

        // Dispose previous provider
        if (providerRef.current) {
            providerRef.current.dispose()
            providerRef.current = null
        }

        const monaco = monacoRef.current
        const language = getEditorLanguage(activeFile.fileExtension || "")

        console.log("Registering inline completions provider for language:", language)

        // Register provider for the current language
        providerRef.current = monaco.languages.registerInlineCompletionsProvider(language, {
            provideInlineCompletions: async (model, position, context, token) => {
                console.log("provideInlineCompletions called", {
                    hasSuggestion: !!suggestion,
                    hasPosition: !!suggestionPosition,
                    currentPos: `${position.lineNumber}:${position.column}`,
                    suggestionPos: suggestionPosition ? `${suggestionPosition.line}:${suggestionPosition.column}` : null,
                })

                // No suggestion available
                if (!suggestion || !suggestionPosition) {
                    return { items: [] }
                }

                // Check if we're at the right position (exact match)
                if (position.lineNumber !== suggestionPosition.line || 
                    position.column !== suggestionPosition.column) {
                    console.log("Position mismatch, not showing suggestion")
                    return { items: [] }
                }

                const cleanSuggestion = suggestion.replace(/\r/g, "")
                
                console.log("Returning inline completion:", cleanSuggestion.substring(0, 50))

                return {
                    items: [{
                        insertText: cleanSuggestion,
                        range: new monaco.Range(
                            suggestionPosition.line,
                            suggestionPosition.column,
                            suggestionPosition.line,
                            suggestionPosition.column
                        ),
                        filterText: cleanSuggestion,
                    }]
                }
            },
            freeInlineCompletions: () => {
                console.log("freeInlineCompletions called")
            }
        })

        return () => {
            if (providerRef.current) {
                providerRef.current.dispose()
                providerRef.current = null
            }
        }
    }, [activeFile, suggestion, suggestionPosition])

    // Trigger inline suggestion when suggestion changes
    useEffect(() => {
        if (!editorRef.current || !suggestion || !suggestionPosition) return

        const editor = editorRef.current
        const currentPosition = editor.getPosition()
        
        console.log("New suggestion available", {
            currentPos: `${currentPosition.lineNumber}:${currentPosition.column}`,
            suggestionPos: `${suggestionPosition.line}:${suggestionPosition.column}`,
            atCorrectPosition: currentPosition.lineNumber === suggestionPosition.line && 
                              currentPosition.column === suggestionPosition.column
        })
        
        // Check if cursor is already at the suggestion position
        const isAtPosition = currentPosition.lineNumber === suggestionPosition.line && 
                            currentPosition.column === suggestionPosition.column
        
        if (isAtPosition) {
            // We're at the right position, show the suggestion
            console.log("Already at position, showing suggestion")
            setTimeout(() => {
                editor.trigger("ai-suggestion", "editor.action.inlineSuggest.trigger", null)
            }, 50)
        } else {
            console.log("Not at position yet, waiting for user to navigate there")
            // The suggestion will show automatically when user moves cursor to that position
        }
        
    }, [suggestion, suggestionPosition])

    // Update language when file changes
    useEffect(() => {
        if (!activeFile || !monacoRef.current || !editorRef.current) return
        const model = editorRef.current.getModel()
        if (!model) return

        const language = getEditorLanguage(activeFile.fileExtension || "")
        console.log("Setting editor language to:", language)
        
        try {
            monacoRef.current.editor.setModelLanguage(model, language)
        } catch (error) {
            console.warn("Failed to set editor language:", error)
        }
    }, [activeFile])

    return (
        <div className="h-full relative">
            <Editor
                height="100%"
                value={content}
                onChange={(value) => onContentChange(value || "")}
                onMount={handleEditorDidMount}
                language={activeFile ? getEditorLanguage(activeFile.fileExtension || "") : "plaintext"}
                options={defaultEditorOptions}
            />
        </div>
    )
}

export default PlaygroundEditor