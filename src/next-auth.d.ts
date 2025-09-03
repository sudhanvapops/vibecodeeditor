// The next-auth.d.ts file is used to customize and extend the TypeScript types provided by the NextAuth.js library.

/* This code extends NextAuth's TypeScript types to include a custom user role from Prisma.
/* 
/* It defines an ExtendedUser type by adding a role (of type UserRole from Prisma) to NextAuth's default user type.
/* 
/* It updates the Session interface so the session's user has this extended type, meaning session.user.role is now recognized.
/* 
/* It also extends the JWT interface to include the role property, ensuring the user's role is stored in and retrieved from the token.
/* 
/* In short, this code adds a typed role property to the user in both session and JWT, enabling type-safe role handling in authentication workflows. */

import { UserRole } from "@prisma/client";
import NextAuth,{ type DefaultSession } from "next-auth";

import { JWT } from "next-auth/jwt"


export type ExtendedUser = DefaultSession["user"] & {
    role:UserRole
}

declare module "next-auth" {
    interface Session {
        user:ExtendedUser
    }
}


declare module "next-auth/jwt"{
    interface JWT {
        role: UserRole
    }
}