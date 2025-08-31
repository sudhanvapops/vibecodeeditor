import NextAuth from 'next-auth'
import authConfig from './auth.config'
import { NextResponse, NextRequest } from 'next/server'


import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    publicRoutes,
    authRoutes,
} from "@/routes"


// Auth is a middleware wrapper provided by auth.js
const { auth } = NextAuth(authConfig)

// Go to Notes to know more
export default auth((req: NextRequest & { auth: any }) => {

    const { nextUrl } = req
    const isLoggedIn = !!req.auth //req.auth is null or undefined → !!req.auth becomes false.

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)


    if (isApiAuthRoute) return null;

    // if goes to signIn page
    if (isAuthRoute) { // or you can isAuthRoute && isLoggedIn
        // And if Logged In
        if (isLoggedIn) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
        return null;
    }

    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL("/auth/signIn", nextUrl))
    }

    // If nothing mathced 
    return null

})



// matcher
export const config = {
    // Coppied from clerk
    matcher: [
        "/((?!.+\\.[\\w]+$|_next).*)", // ✅ all routes except static files & _next
        "/",                           // ✅ homepage only
        "/(api|trpc)(.*)"              // ✅ all /api/... and /trpc/... routes
    ]
}