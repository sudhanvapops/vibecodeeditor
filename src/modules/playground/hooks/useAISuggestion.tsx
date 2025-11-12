"use client"

import { useState, useCallback } from "react";
import { useModelStore } from "../store/modelStore";

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



    // Toggeling suggestion
    const toggleEnabled = useCallback(() => {
        setState((prev) => ({ ...prev, isEnabled: !prev.isEnabled }))
    }, [])


    // Fetching Suggestions from API call
    const fetchSuggestion = useCallback(async (type: string, editor: any) => {

        setState((currentState) => {

            // If suggestions are disabled → do nothing.
            if (!currentState.isEnabled) return currentState

            // If editor doesn’t exist → do nothing.
            if (!editor) return currentState

            // Getting code + cursor
            const model = editor.getModel() // gives the entire code as text.
            const cursorPosition = editor.getPosition() // give cursor location.

            if (!model || !cursorPosition) return currentState
            const newState = { ...currentState, isLoading: true };

            // ? Might be better approch
            (async () => {
                try {

                    // Building the request Payload
                    const payload = {
                        fileContent: model.getValue(),
                        cursorLine: cursorPosition.lineNumber - 1,
                        cursorColumn: cursorPosition.column - 1,
                        suggestionType: type,
                        model: useModelStore.getState().modelSelected?.value
                    }

                    // Sends POST request to your backend
                    const res = await fetch("/api/code-completion", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload)
                    })

                    // Handeling the response
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


    // inserts the accepted suggestion into the Monaco editor once the user confirms it (e.g., presses Tab or Enter).
    const acceptSuggestion = useCallback(

        (editor: any, monaco: any) => {

            // Setting the current state 
            setState((currentState) => {

                // If any required info is missing, it just returns without changing anything.
                if (!currentState.suggestion || !currentState.position || !editor || !monaco) {
                    return currentState;
                }

                const { line, column } = currentState.position;
                // making Monaco comapatable
                // Removes things like “1: ” or “2: ” that may appear if the model formatted its output as numbered lines.
                const sanitizedSuggestion = currentState.suggestion.replace(/^\d+:\s*/gm, "");


                // inserts the text directly into the editor.
                editor.executeEdits("", [
                    {
                        range: new monaco.Range(line, column, line, column), // defines where in the document the text should be inserted
                        text: sanitizedSuggestion,
                        forceMoveMarkers: true, // makes Monaco update cursor positions and markers properly.
                    }
                ]);


                // Removing decorations (UI highlights)
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

        }, [])


    // To reject the ai suggestion
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

    return {
        ...state,
        toggleEnabled,
        fetchSuggestion,
        acceptSuggestion,
        rejectSuggestion,
        clearSuggestion,
    }
}