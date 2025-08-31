import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./lib/db"
import authConfig from "./auth.config"
import { getUserById } from "./modules/auth/actions"

export const { handlers, signIn, signOut, auth } = NextAuth({
    // Functions that run when signIn trigger
    callbacks: {
        // user and account are JavaScript objects representing the current login attempt.
        async signIn({ user, account }) {

            // To check if user exist or its account
            if (!user || !account) return false

            // if already exist 
            const exisitingUser = await db.user.findUnique({
                where: { email: user.email! }
            })

            // prisma related queries
            if (!exisitingUser) {
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

                if (!newUser) return false
            } else {

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
                }

            }

            return true
        },


        async jwt({token}) {
            // sub means subject 
            // starting there is only sub

            if(!token.sub) return token

            const exisitingUser = await getUserById(token.sub)
            if (!exisitingUser) return token

            token.name = exisitingUser.name
            token.email = exisitingUser.email
            token.role = exisitingUser.role

            return token
            
        },


        async session({session,token}){

            if(token.sub && session.user){
                session.user.id = token.sub
            }

            if(token.sub && session.user){
                session.user.role = token.role
            }

            return session
        }
        
    },
    secret: process.env.AUTH_SECRET,
    adapter: PrismaAdapter(db),
    ...authConfig
})