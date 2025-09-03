### How Auth Works Here

📌 High-level Flow

When a user signs in with Google/GitHub/etc:
User clicks "Sign in" → redirected to provider (Google, GitHub).
Provider redirects back with user profile + OAuth tokens.
NextAuth runs your callbacks in order (signIn → jwt → session).
A session is created and sent back to the client (browser).
Every API call/page request with auth() or getServerSession() → NextAuth re-runs jwt + session callbacks to hydrate data.


## signIn callback 

`async signIn({ user, account }) { ... }`

When it runs:
👉 Immediately after the provider (Google/GitHub) sends back user + tokens, but before a session is created.

Logs user & account info for debugging.
Checks if a User already exists in your DB (findUnique by email).
    If not → creates a new User + linked Account row.
    If yes → checks if this provider account already exists:
        If not → creates a new Account row linked to the user.
        If yes → skips (already linked).

If you return false, login is blocked.
If you return true, NextAuth continues to JWT creation.

<!-- ! You are re Implementing what prisma Adapter does here  -->
Sometimes you do need to extend/override the adapter behavior.
For example:

Enforcing business logic (e.g., only allow sign-in for users with a company email).
Setting a custom role for first-time users.
Syncing additional metadata (like GitHub bio, repo count, etc.) into your User model.


## 🎫 jwt callback
When it runs:

Right after signIn succeeds (to create the first JWT).
On every subsequent request, NextAuth decodes the JWT, runs this callback, and re-signs it.
What it does in your code:
token.sub = the userId (string).
Fetches your user from the DB with getUserById.
If found → adds name, email, role into the JWT payload.


## 🧑‍💻 session callback
When it runs:
    👉 Every time you call auth() (server) or useSession() (client).

What it does in your code:
Copies values from JWT (token.sub, token.role) into session.user.
This ensures your React components / API routes have user.id and user.role available.
✅ Without this, session.user would only contain name, email, image. 


## 3. When does the ID get created?

Here’s the flow when you log in with GitHub (new user):

GitHub sends profile → NextAuth signIn callback.
You see user info like name, email, image, id (GitHub’s id).

NextAuth checks your DB (via adapter):
Does this GitHub account exist already?
If no → Create a new User row in your DB.
Prisma generates id = cuid().
Saves name, email, image, etc.
Then creates a new Account row that links:
userId (your cuid) <-> providerAccountId (GitHub’s id)

At this moment, the user ID exists (cuid from your DB).
That’s why when you log things early, you already see user.id.