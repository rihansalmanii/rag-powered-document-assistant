import React from 'react'
import { useAuth } from '../contexts/AuthContext'

const Setting = () => {

    const { user } = useAuth()

  return (
    <div className='my-6 mx-6'>
        <h1 className='text-white text-4xl font-semibold'>General Settings</h1>
        <div className='h-0.5 bg-[#828282] my-2'></div>

        <div className='py-4'>
            <div className='flex items-center justify-between px-2'>
                <div className='flex flex-col text-sm'>
                    <h3 className='text-white text-xl'>Delete all the Chats</h3>
                    <p className='text-[#b0b0b0]'>this will delete all you chats or conversations</p>
                </div>
                <button className='bg-[#212830] text-[#fa5e55] px-5 py-2 rounded-lg font-semibold tracking-wide border border-[#6b6b6b]'>Delete</button>
            </div>
        </div>
    </div>
  )
}

export default Setting