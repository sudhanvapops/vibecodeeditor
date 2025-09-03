// Here all the routes are defined for middleware

export const publicRoutes: string[] = []

export const protectedRoutes: string[] = [
    "/",
]


/**
 * An Array of routes that are accessible to the public 
 * Routes that starts with this (/api/auth) prefix do not require authentication
 * @type {string}
 */

export const authRoutes: string[] = [
    "/auth/signIn",
]


/**
 * An Array of routes that are accessible to the public
 * Routes that start with this (/api/auth) prefix do not require authentication
 */
export const apiAuthPrefix: string = "/api/auth"

export const DEFAULT_LOGIN_REDIRECT: string = "/" // Changed to redirect to home page after login
