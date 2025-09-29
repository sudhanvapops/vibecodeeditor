### auth start 

- when ever user tries to login these functions run 

- NextAuth
    - signIn
    - signOut
    - jwt
    - Session


### SignIn

- runs after provider login but before the session is created

SignIn -> for signIn 
    - use oauth
    - storing to db
    - creating accessToken 

    - check if gmail exist 
        - yes then check account exits
            - yes then login 
            - No create Account
        - No Then add gamil and account 
    

### jwt 

- here we run this to enrich token 
- like adding user ->  account, id, name, email, role 
- The jwt callback is not only for enriching token during sign-in — it also runs every time NextAuth needs to verify or refresh the token.

- it is called when
    - First sign In 
    - on api routes ->  /api/auth/session, /api/auth/
    - using getSession() // server-side not useSession()
    - when token is expired
    - create, update, or verify the JWT token
    - protect via Next.js middleware.


### Session

- here we run this to enrich session
- also it is called when useSession()
- it is for frontend

- be aware what to expose to fronted 

