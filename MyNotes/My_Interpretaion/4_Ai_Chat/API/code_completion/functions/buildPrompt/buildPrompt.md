### buildPrompt

Purpose
Compose a clear, context-rich prompt for the AI model to generate a suggestion.

Behavior
Produces a string containing:
Role/instruction: You are an expert code completion assistant...
Language and Framework
The code Context: beforeContext, the currentLine with |CURSOR| insertion, afterContext
Analysis: bullet points for isInFunction, isInClass, isAfterComment, incompletePatterns
Instructions: 1) Provide only code ... 4) follow language best practices

Ends with Generate suggestion