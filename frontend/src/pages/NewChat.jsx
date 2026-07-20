import React from 'react'
import StartChat from '../components/NewChat/StartChat'

const NewChat = () => {
  return (
    <div className='h-screen w-full text-white flex flex-col justify-between pb-20'>
        <h1 className='text-2xl font-semibold text-center py-5'>DocLens.ai</h1>
          <h1 className="text-3xl font-semibold text-white">Start Chatting...</h1>

        <div className='w-full mx-auto'>
            <StartChat />
        </div>
    </div>
  )
}

export default NewChat

