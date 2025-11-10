### Prompt Technique

Prompting techniques are strategies used to get better, more controlled responses from LLMs (like GPT, Perplexity, Llama, etc.).

system-level Role-based prompting — you’re defining the role and tone of the AI.
That’s called a system–user–assistant prompt structure, and it’s the foundation of OpenAI’s and Perplexity’s “Chat Completions” format.


### The System–User–Assistant Prompt Format Explained

Role
System

Description
Sets the behavior, style, and context of the model (the "persona")

Example
you are a helpful AI coding assistant. Always give clean and structured code examples.


Role
User

Description
Represents what the human says (the question or task)

Example
Write a function in Python that reverses a string


Role
Assistant

Description
Represents the model’s responses — it’s how the AI continues the conversation

Example
Here’s a simple implementation using slicing…”

### Why this format is Used

Context Control:
You can permanently set the AI’s tone and boundaries through the system prompt.
Example — a coding tutor, a security advisor, or a UX designer persona.

Conversation Memory:
The user + assistant messages together provide context history.
That’s why you maintain history in your backend — to preserve continuity.

Alternating Roles = Coherence:
Alternation between user and assistant helps the model understand who’s talking to whom.
That’s why your backend cleans messages so there aren’t two consecutive user or assistant roles.