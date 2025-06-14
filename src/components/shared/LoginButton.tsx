'use client'
import { useRouter } from 'next/navigation';
import React from 'react'

const LoginButton = () => {
    const router = useRouter();
  return (
        <button
             onClick={() => router.push("/login")}
            className="border border-teal-500 text-teal-500 px-5 py-2 rounded-full hover:bg-teal-500 hover:text-black transition duration-200"
          >
            Login
          </button>
  )
}

export default LoginButton
