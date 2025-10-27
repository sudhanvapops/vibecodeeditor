Using Monaco's Built-in Inline Completions API
Instead of manually managing all the suggestion state and refs, you can use Monaco's

Key Improvements:

Simplified State Management: Removed most refs (currentSuggestionRef, isAcceptingSuggestionRef, suggestionAcceptedRef, etc.). Monaco handles the inline suggestion state internally.

No Manual Tab Override: Monaco's inline suggestions automatically respond to Tab - you don't need to manually intercept it with complex logic.

Cleaner Provider: The provideInlineCompletions function is much simpler - just check position and return the suggestion.

Automatic Acceptance Detection: Listen for onDidChangeModelContent and check if the inserted text matches your suggestion to detect when it's accepted.

Built-in UI: Monaco shows the ghost text automatically when inlineSuggest.enabled is true.

The key fixes:

Proper inlineSuggest configuration - The mode is set to "prefix" to show ghost text when the text to replace is a prefix of the suggestion GitHub
Dynamic provider registration - The provider is registered per language and re-registered when the file changes
Exact position matching - The ghost text only shows when cursor is at exact position
Manual trigger - When suggestion changes, it moves cursor to position and triggers editor.action.inlineSuggest.trigger

Try this and check your browser console - it should show logs when the provider is called. If you still don't see ghost text:

Make sure suggestion and suggestionPosition props are being passed correctly
Check that the position line/column numbers are 1-based (Monaco uses 1-based indexing)
Verify the language returned by getEditorLanguage() matches your file type
Check browser console for any errors