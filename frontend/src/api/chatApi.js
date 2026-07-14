import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

// send query
export const sendQuery = async (query, conversation_id = null) => {
  try {
    const res = await api.post("/query", {
      query,
      conversation_id,
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// get all conversations
export const getAllConversations = async () => {
  try {
    const res = await api.get("/conversations");
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// get messages of conversation
export const getConversationMessages = async (conversation_id) => {
  try {
    const res = await api.get(`/conversations/${conversation_id}`);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
