📌 High-level Flow

When a user signs in with Google/GitHub/etc:
User clicks "Sign in" → redirected to provider (Google, GitHub).
Provider redirects back with user profile + OAuth tokens.
NextAuth runs your callbacks in order (signIn → jwt → session).
A session is created and sent back to the client (browser).
Every API call/page request with auth() or getServerSession() → NextAuth re-runs jwt + session callbacks to hydrate data.

