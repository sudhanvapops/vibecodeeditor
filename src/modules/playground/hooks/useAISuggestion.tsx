"use client"

import { useState, useCallback } from "react";

interface AISuggestionsState {
    suggestion: string | null;
    isLoading: boolean;
    position: { line: number; column: number } | null;
    decoration: string[];
    isEnabled: boolean;
}

interface UseAISuggestionsReturn extends AISuggestionsState {
    toggleEnabled: () => void;
    fetchSuggestion: (type: string, editor: any) => Promise<void>;
    acceptSuggestion: (editor: any, monaco: any) => void;
    rejectSuggestion: (editor: any) => void;
    clearSuggestion: (editor: any) => void;
}

export const useAISuggestions = (): UseAISuggestionsReturn => {

    const [state, setState] = useState<AISuggestionsState>({
        suggestion: null,
        isLoading: false,
        position: null,
        decoration: [],
        isEnabled: true,
    });


    const toggleEnabled = useCallback(() => {
        setState((prev) => ({ ...prev, isEnabled: !prev.isEnabled }))
    }, [])


    const fetchSuggestion = useCallback(async (type: string, editor: any) => {

        setState((currentState) => {

            if (!currentState.isEnabled) return currentState

            if (!editor) return currentState

            const model = editor.getModel()
            const cursorPosition = editor.getPosition()

            if (!model || !cursorPosition) return currentState
            const newState = { ...currentState, isLoading: true };

            // ? Might be better approch
            (async () => {
                try {

                    const payload = {
                        fileContent: model.getValue(),
                        cursorLine: cursorPosition.lineNumber - 1,
                        cursorColumn: cursorPosition.column - 1,
                        suggestionType: type
                    }

                    const res = await fetch("/api/code-suggestions", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload)
                    })

                    if (!res.ok) {
                        throw new Error(`API Response failed fetchSuggestion ${res.status}`)
                    }

                    const data = await res.json()

                    if (data.suggestion) {
                        const suggestionText = data.suggestion.trim()
                        setState((prev) => ({
                            ...prev,
                            suggestion: suggestionText,
                            position: {
                                line: cursorPosition.lineNumber,
                                column: cursorPosition.column
                            },
                            isLoading: false
                        }))
                    } else {
                        console.warn("No suggestion recived from API")
                        setState((prev) => ({
                            ...prev,
                            isLoading: false
                        }))
                    }

                } catch (error) {
                    console.error(`Error in fetchSuggestion ${error}`)
                    setState((prev) => ({
                        ...prev,
                        isLoading: false
                    }))
                }
            })();

            return newState
        })

    }, [])


    const acceptSuggestion = useCallback(() => {
        (editor: any, monaco: any) => {
            setState((currentState) => {
                if (!currentState.suggestion || !currentState.position || !editor || !monaco) {
                    return currentState;
                }

                const { line, column } = currentState.position;
                // making onaco comapatable
                const sanitizedSuggestion = currentState.suggestion.replace(/^\d+:\s*/gm, "");

                // automatically write the edits
                editor.executeEdits("", [
                    {
                        range: new monaco.Range(line, column, line, column),
                        text: sanitizedSuggestion,
                        forceMoveMarkers: true,
                    }
                ]);


                if (editor && currentState.decoration.length > 0) {
                    editor.deltaDecorations(currentState.decoration, [])
                }

                return {
                    ...currentState,
                    suggestion: null,
                    position: null,
                    decoration: []
                }
            })
        }
    }, [])


    const rejectSuggestion = useCallback((editor: any) => {
        setState((currentState) => {
            if (editor && currentState.decoration.length > 0) {
                editor.deltaDecorations(currentState.decoration, [])
            }

            return {
                ...currentState,
                suggestion: null,
                position: null,
                decoration: []
            }
        })
    }, []);


    const clearSuggestion = useCallback((editor: any) => {
        setState((currentState) => {
            if (editor && currentState.decoration.length > 0) {
                editor.deltaDecorations(currentState.decoration, []);
            }
            return {
                ...currentState,
                suggestion: null,
                position: null,
                decoration: [],
            };
        });
    }, []);

}