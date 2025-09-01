
import React from 'react'
import { LogoutButtonProps } from '../types'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react';

// This is an HIger Order Component 
// YOu can pass anything inside this compnent like <>Any Other</>
// When you click it it logouts
const LogoutButton = ({children}:LogoutButtonProps) => {
    const router = useRouter();
    const onLogout = async()=>{
        await signOut()
        router.refresh()
    }
  return (
    <span className='cursor-pointer' onClick={onLogout}>
        {children}
    </span>
  )
}

export default LogoutButton
