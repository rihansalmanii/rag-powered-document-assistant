import React from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { FaUser } from "react-icons/fa6";



const Footer = () => {

    const { user, logout } = useAuth()


  return (
    <div className='border-t w-full'>
        <div className='w-[90%] mx-auto '>
        <div className='bg-[#2c2c2c] text-lg my-2 rounded-md py-2 px-3 flex items-center gap-2'>
            <FaUser size={15}/>
            <h1>{user?.username}</h1>
        </div>
        <div className='bg-[#621616] py-2 rounded-md text-center cursor-pointer'
        onClick={logout}>
            <button className='cursor-pointer'>Logout</button>
        </div>
        </div>
    </div>
  )
}

export default Footer