import axios from "axios";
import React, { useEffect, useState } from "react";
import { getAllConversations } from "../../api/chatApi";

const ChatList = () => {

  const [conversations, setConversations] = useState([])

  useEffect(() => {
    const fetchConversations = async () => {
    const data = await getAllConversations();
    setConversations(data.conversations)
    console.log(data.conversations);
  };

  fetchConversations()

  }, [])

  return (
    <div className="mt-18">
      <h1 className="px-3 font-medium text-lg text-[#c5c5c5] my-2">Recent</h1> 
      <div className="flex flex-col gap-3">
        {conversations.map((conv, idx) => (
           <div className="cursor-pointer w-68 py-2 px-2 rounded-lg mx-auto bg-[#383838]">
            <p>{conv.title}</p>
          </div>
        ))}
      </div>
    </div>
    

  )
};

export default ChatList;
