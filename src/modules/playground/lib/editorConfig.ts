import type { Monaco } from "@monaco-editor/react";
import { shikiToMonaco } from '@shikijs/monaco'
import { highlighter } from "./shikiTheme";

export const getEditorLanguage = (fileExtension: string): string => {

  const extension = fileExtension.toLowerCase();
  const languageMap: Record<string, string> = {

    // JavaScript/TypeScript
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    mjs: "javascript",
    cjs: "javascript",
    
    // Web languages
    json: "json",
    html: "html",
    htm: "html",
    css: "css",
    scss: "scss",
    sass: "scss",
    less: "less",
    
    // Markup/Documentation
    md: "markdown",
    markdown: "markdown",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    
    // Programming languages
    py: "python",
    python: "python",
    java: "java",
    c: "c",
    cpp: "cpp",
    cs: "csharp",
    php: "php",
    rb: "ruby",
    go: "go",
    rs: "rust",
    sh: "shell",
    bash: "shell",
    sql: "sql",
    
    // Config files
    toml: "ini",
    ini: "ini",
    conf: "ini",
    dockerfile: "dockerfile",
  };
  
  return languageMap[extension] || "plaintext";
};


export const configureMonaco = (monaco: Monaco) => {

  
  monaco.languages.register({id:"typescript"})
  monaco.languages.register({id:"javascript"})

  // Register the themes from Shiki, and provide syntax highlighting for Monaco.
  shikiToMonaco(highlighter,monaco)

  // Configure additional editor settings
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });
  
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  // Set compiler options for better IntelliSense
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: "React",
    allowJs: true,
    typeRoots: ["node_modules/@types"],
  });

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: "React",
    allowJs: true,
    typeRoots: ["node_modules/@types"],
  });
};


export const defaultEditorOptions = {
  // Font settings
  fontSize: 14,
  fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, 'Liberation Mono', Menlo, Courier, monospace",
  fontLigatures: true,
  fontWeight: "400",
  
  // Layout
  minimap: { 
    enabled: false,
    size: "proportional",
    showSlider: "mouseover"
  },

  scrollBeyondLastLine: false,
  automaticLayout: true,
  padding: { top: 16, bottom: 16 },
  
  // Line settings
  lineNumbers: "on",
  lineHeight: 20,
  renderLineHighlight: "all",
  renderWhitespace: "selection",
  
  // Indentation
  tabSize: 4,
  insertSpaces: true,
  detectIndentation: true,
  
  // Word wrapping
  wordWrap: "on",
  wordWrapColumn: 120,
  wrappingIndent: "indent",
  
  // Code folding
  folding: true,
  foldingHighlight: true,
  foldingStrategy: "indentation",
  showFoldingControls: "mouseover",
  
  // Scrolling
  smoothScrolling: true,
  mouseWheelZoom: true,
  fastScrollSensitivity: 5,
  
  // Selection
  multiCursorModifier: "ctrlCmd",
  selectionHighlight: true,
  occurrencesHighlight: true,
  
  // Suggestions
  suggestOnTriggerCharacters: true,
  acceptSuggestionOnEnter: "on",
  tabCompletion: "on",
  wordBasedSuggestions: true,
  quickSuggestions: {
    other: true,
    comments: false,
    strings: false
  },
  
  // Formatting
  formatOnPaste: true,
  formatOnType: true,
  
  // Bracket matching
  matchBrackets: "always",
  bracketPairColorization: {
    enabled: true
  },
  
  // Guides
  renderIndentGuides: true,
  highlightActiveIndentGuide: true,
  rulers: [80, 120],
  
  // Performance
  disableLayerHinting: false,
  disableMonospaceOptimizations: false,
  
  // Accessibility
  accessibilitySupport: "auto",
  
  // Cursor
  cursorBlinking: "smooth",
  cursorSmoothCaretAnimation: true,
  cursorStyle: "line",
  cursorWidth: 2,
  
  // Find
  find: {
    addExtraSpaceOnTop: false,
    autoFindInSelection: "never",
    seedSearchStringFromSelection: "always"
  },
  
  // Hover
  hover: {
    enabled: true,
    delay: 300,
    sticky: true
  },
  
  // Semantic highlighting
  "semanticHighlighting.enabled": true,
  
  // Sticky scroll
  stickyScroll: {
    enabled: true
  }
};