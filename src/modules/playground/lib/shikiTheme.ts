/**
 * Shiki's createHighlighter uses WebAssembly, which is client-heavy (downloads ~1–2 MB of WASM and JSON files). For Next.js, the best practice is to generate the highlighted HTML on the server (Node.js) and pass it to the client, so your pages load fast without shipping Shiki’s heavy assets to the browser.
 */

import {createHighlighter } from "shiki"

export const highlighter = await createHighlighter({
    themes: ["dark-plus"],
    langs:[
        "javascript",
        "typescript",
        "html",
        "html-derivative",
        "tsx",
        "jsx",
        "json"
    ]
})
