### analyzeCodeContext

Extracts a compact CodeContext from the full file and cursor position: language, framework, surrounding lines, flags (in function/class/after comment), and incomplete patterns.


1. Input

content: full file text
line: 0-based line index of the cursor
column: 0-based column index in that line
fileName optional: used for extension-based language detection

2. Output
{
  language: string;
  framework: string;
  beforeContext: string;
  currentLine: string;
  afterContext: string;
  cursorPosition: { line, column };
  isInFunction: boolean;
  isInClass: boolean;
  isAfterComment: boolean;
  incompletePatterns: string[];
}


3. What it does (step-by-step)

const lines = content.split("\n").
currentLine = lines[line] (or "" if out-of-range).

Picks contextRadius = 10 and slices beforeContext (10 lines before) and afterContext (10 lines after).

Detects language using detectLanguage(content, fileName).
Detects framework with detectFramework(content).

Uses helper detectors:
detectInFunction(lines, line)
detectInClass(lines, line)
detectAfterComment(currentLine, column)
detectIncompletePatterns(currentLine, column)
Returns the CodeContext.