import React from 'react'
import ChatList from '../sidebar/ChatList'
import Header from '../sidebar/Header'
import { useNavigate } from 'react-router-dom'
import Footer from '../sidebar/Footer'


const SideBar = () => {

  const navigate = useNavigate()

  const openChat = (id) => {
    navigate(`/chat/${id}`)
  }

  return (
    <div className='text-white'>
      <div>
        {/* header */}
        <Header />
      </div>
      <div>
        <ChatList />
      </div>
      <div>
        <Footer />
      </div>
    </div>
  )
}

export default SideBar
