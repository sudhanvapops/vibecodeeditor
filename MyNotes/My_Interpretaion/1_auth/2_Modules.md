### Auth Modules 

- when u use useSession() it calls jwt and session in nextAuth


### Index.ts

- all the ensential server side functions are defined here
- getUserById()
- getAccontByUserId()
- currentUser()

- when auth() is called it is returned a session oject
is designed for server-side usage. This ensures that sensitive session information is handled securely on the server and not exposed directly to the client.

---

### signInform.tsx

- you can use "use server" inside the function to run it in server

forms use action = {function name } to send data to that


### Logout Button.tsx

