import axios from "axios";
import React from "react";

const StartChat = () => {
  const getData = async () => {
      console.log("button clicked")
    try {
        console.log("Fetching")
      const res = await axios.get("http://127.0.0.1:8000/conversations");
      console.log(res.data);
      console.log("completed")
    } catch (err) {
        console.log("error block")
      console.log(err);
    }
  };

  return (
    <div className="border border-[#adadad] w-[70vw] mx-auto h-24 px-5 py-5">
      <input
        type="text"
        placeholder="Start new chat"
        className="outline-none border-none"
      />

      <button onClick={getData}>Send</button>
    </div>
  );
};

export default StartChat;
