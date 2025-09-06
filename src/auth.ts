import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"
import authConfig from "./auth.config"
import { getUserById } from "./modules/auth/actions"

export const { handlers, signIn, signOut, auth } = NextAuth({
    // Functions that run when signIn trigger
    callbacks: {
        // user and account are JavaScript objects representing the current login attempt.
        // They are pre given by NextAuth user and account
        // When Ever SignIn Happens This function is called
        // Callback signIn (inside [...nextauth].ts)
        // Runs after provider login but before session is created.
        async signIn({ user, account }) {

            console.log("🔍 SignIn callback triggered")
            console.log("👤 User:", user)
            console.log("🔗 Account:", account)

            // To check if user exist or its account
            if (!user || !account) {
                console.log("❌ No user or account provided")
                return false
            }

           try {
            
            const exisitingUser = await db.user.findUnique({
                where: { email: user.email! }
            })
            console.log("🔍 Existing user:", exisitingUser ? "Found" : "Not found")

            // prisma related queries
            if (!exisitingUser) {
                console.log("➕ Creating new user...")
                const newUser = await db.user.create({
                    data: {
                        // userid is auto generated
                        email: user.email!,
                        name: user.name,
                        image: user.image!,

                        accounts: {
                            // @ts-ignore
                            create: {
                                type: account.type,
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                refreshToken: account.refresh_token,
                                accessToken: account.access_token,
                                expiresAt: account.expires_at, // these e_a these are maped version in prisma 
                                tokenType: account.token_type,
                                scope: account.scope,
                                idToken: account.id_token,
                                sessionState: account.session_state
                            }
                        }
                    }
                })
                
                if (!newUser){ 
                    console.log("❌ Failed to create new user")
                    return false
                }

                console.log("✅ New user created:", newUser.id)

            } else {
                console.log("🔍 Checking existing account...")
                const exisitingAccount = await db.account.findUnique({
                    where: {
                        // Prisma “compound unique” things query -> comes from @@unique
                        provider_providerAccountId: {
                            provider: account.provider,
                            providerAccountId: account.providerAccountId
                        }
                    }
                })

                if (!exisitingAccount) {
                    console.log("➕ Creating new account for existing user...")
                    await db.account.create({
                        data: {
                            userId: exisitingUser.id,
                            type: account.type,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            refreshToken: account.refresh_token,
                            accessToken: account.access_token,
                            expiresAt: account.expires_at,
                            tokenType: account.token_type,
                            scope: account.scope,
                            idToken: account.id_token,
                            // @ts-ignore
                            sessionState: account.session_state
                        }
                    })
                    console.log("✅ New account created for existing user")
                }else {
                        console.log("✅ Account already exists")
                }

            }
            console.log("✅ SignIn callback completed successfully")
            return true

           } catch (error) {
                console.error("❌ Error in signIn callback:", error)
                return false
           }
        },

                // ↓ next this triggers
                // jwt and session independently and simultaniosly triggers wen auth() is called


        // ! JWT is created → jwt callback runs (can enrich token).
        async jwt({ token }) {
            // sub means subject 
            // its like id 
            // NextAuth automatically sets this to the user’s id from your database (after sign-in).

            console.log("🔍 JWT callback triggered")
            console.log("🎫 Token sub:", token.sub)

            if (!token.sub) return token

            try {
                const existingUser = await getUserById(token.sub)
                if (!existingUser) {
                    console.log("❌ User not found in JWT callback")
                    return token
                }

                token.name = existingUser.name
                token.email = existingUser.email
                token.role = existingUser.role

                

                console.log("✅ JWT token updated with user data")
                return token
            } catch (error) {
                console.error("❌ Error in JWT callback:", error)
                return token
            }

        },

        // Session is called after jwt 
        // This is to expose things to the client side or frontend side

        // ! Session is returned → session callback runs (can enrich session)
        // for now
        // @ts-ignore
        async session({ session, token, user }) {

            console.log("🔍 Session callback triggered")
            
            // forcing logout if no user was found
            const dbUser = await db.user.findUnique({
                where:{
                    id: token.sub
                }
            })

            // You can’t directly return null in session callback.
            // You can extend types 
            if (!dbUser) return null // forces signOut
            
            // Adding role and id to session
            if (token.sub && session.user) {
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                session.user.role = token.role
            }

            console.log("✅ Session updated:", session.user.id)
            return session
        }

    },
    secret: process.env.AUTH_SECRET,
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig
})