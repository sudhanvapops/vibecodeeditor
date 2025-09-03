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

    console.log("🛡️ Middleware triggered for:", nextUrl.pathname)
    console.log("🔐 Is logged in:", isLoggedIn)
    console.log("👤 User ID:", req.auth?.user?.id)


    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    console.log("📍 Route checks:", {
        isApiAuthRoute,
        isPublicRoute,
        isAuthRoute
    })

    // Main Intnetion of the function / logic 

    // /api/auth -> its for auth.js auth routes
    if (isApiAuthRoute) {
        console.log("✅ Allowing API auth route")
        return NextResponse.next()
    }

    // if goes to signIn page
    // /auth/signIn -> for signIn page
    if (isAuthRoute) { // or you can isAuthRoute && isLoggedIn
        // And if Logged In
        if (isLoggedIn) {
            console.log("🔄 Redirecting logged-in user from auth route to home")
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)) // "/"
        }
        console.log("✅ Allowing access to auth route")
        return NextResponse.next();
    }

    
    if (!isLoggedIn && !isPublicRoute) {
        console.log("🚫 Redirecting unauthenticated user to sign-in")
        return NextResponse.redirect(new URL("/auth/signIn", nextUrl))
    }

    console.log("✅ Allowing request to continue")
    return NextResponse.next()

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