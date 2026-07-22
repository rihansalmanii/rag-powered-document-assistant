import React from 'react'
import { IoMdAdd } from "react-icons/io";
import { Link } from 'react-router-dom';
import { getNewConversationId } from '../../api/chatApi';
import { useNavigate } from "react-router-dom";



const Header = () => {

  const navigate = useNavigate();

  const handleNewChat = async () => {
    try {
      const newConversationId = await getNewConversationId();
      console.log("New Conversation ID:", newConversationId);
      navigate(`/chat/${newConversationId}`);
      // You can now use this newConversationId to navigate or perform other actions
    } catch (error) {
      console.error("Error fetching new conversation ID:", error);  
    }
    
  }

  return (
    <div>

        {/* logo */}
        <div>
             <h1 className='text-2xl font-semibold text-center py-5 text-[#ffffff]'>Doc<span className='text-[#0588df]'>Lens</span>.ai</h1>
        </div>

        {/* start new chat */}
        <div className='flex items-center gap-2 cursor-pointer font-semibold rounded-lg w-65 mx-auto bg-[#0588df] text-white px-3 py-2'
        onClick={handleNewChat}>
            <span>
                <IoMdAdd />
            </span>
            <Link to="/">
                <button className='cursor-pointer'
                >New Chat</button>
            </Link>
        </div>
    </div>
  )
}

export default Header