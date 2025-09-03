
// This is for client to get user
import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
    // auth() is triggred here
    // and JWT and session callback triggers
    const session = useSession()
    return session?.data?.user
}

