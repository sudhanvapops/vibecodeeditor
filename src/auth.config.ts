// File for configuration for authentication

import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"

// This is just the Type
import { NextAuthConfig } from "next-auth"

export default{
    providers:[
        GitHub({
            clientId:process.env.AUTH_GITHUB_ID,
            clientSecret:process.env.AUTH_GITHUB_SECRET
        }),
        Google({
            clientId:process.env.AUTH_GOOGLE_ID,
            clientSecret:process.env.AUTH_GOOGLE_SECRET
        })
    ]
} satisfies NextAuthConfig