import React from 'react'
import NewChat from './pages/NewChat'
import SideBar from './components/common/SideBar'
import { Route, Routes } from 'react-router-dom'
import ChatPage from './pages/ChatPage'

const App = () => {
  return (
    <div className='flex bg-[#1d1d1d] h-screen w-full'>

      {/* sidebar */}
      <div className='w-1/6'>
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