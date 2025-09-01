// This is for client to get user

import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
    const session = useSession()
    return session?.data?.user
}