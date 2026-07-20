import axios from "axios";

// 
const api = axios.create({
  baseURL: "http://127.0.0.1:8000"
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

// upload pdf
export const uploadPDF = async (file) => {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  } catch (err) {
    console.error(err)
    throw err
  }
}
