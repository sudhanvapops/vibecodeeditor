
import React from 'react'
import { LogoutButtonProps } from '../types'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

// This is an HIger Order Component 
// YOu can pass anything inside this compnent like <>Any Other</>
// When you click it it logouts
const LogoutButton = () => {
  const router = useRouter();

  const onLogout = async () => {
    await signOut()
    router.refresh()
  }

  return (
    <span className='flex gap-2 justify-center items-center cursor-pointer' onClick={onLogout}>
      <LogOut />
      Logout
    </span>
  )
}

export default LogoutButton
