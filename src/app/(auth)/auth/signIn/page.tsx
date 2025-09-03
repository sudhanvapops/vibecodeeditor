import SignInFormClient from '@/modules/auth/components/SignInFormClient';
import Image from 'next/image'
import React from 'react'

const SignInPage = () => {
  return (
    <>
      <Image src={"/login2.svg"} alt='Login-Image' height={300} width={300} className='m-6 object-cover'/>
      <SignInFormClient/>
    </>
  )
}

export default SignInPage;
