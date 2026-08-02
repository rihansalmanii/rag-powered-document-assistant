import React, { useState } from 'react'
import NewChat from './pages/NewChat'
import SideBar from './components/common/SideBar'
import { Route, Routes } from 'react-router-dom'
import ChatPage from './pages/ChatPage'
import Login from './pages/Login'
import { useAuth } from './contexts/AuthContext'

const App = () => {

  const { user, loading } = useAuth()

  if(loading) {
    return <div className='text-lg font-semibold h-screen w-full mt-1/2 ml-1/2'>Loading..</div>
  }
  if(!user) {
    return <Login />
  }

  return (
    <div className='flex bg-[#1d1d1d] h-screen w-full'>


      {/* sidebar */}
      <div className='min-w-1/6'>
      
        <SideBar />
      </div>

      {/* divider */}
      <div className='h-screen w-[0.5px] bg-[#505050]'></div>

      {/* main content */}
      <div className='w-5/6'>
        <Routes>
          {/* default (new chat) */}
          <Route path="/" element={<NewChat />} />

          {/* specific conversation */}
          <Route path="/chat/:id" element={<ChatPage />} />
        </Routes>
      </div>

    </div>
  )
}

export default App